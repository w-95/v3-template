import * as protobufjs from 'protobufjs';

import { MessageDefinitionField, MessageDefinition } from '@foxglove/message-definition';

import { FileDescriptorSet } from 'protobufjs/ext/descriptor';

/** A map of schema name to the schema message definition */
export type MessageDefinitionMap = Map<string, MessageDefinition>;

type Channel = {
  messageEncoding: string;
  schema: { name: string; encoding: string; data: Uint8Array } | undefined;
};

export const parseChannel = (channel: Channel) => {
  const { messageEncoding, schema } = channel;

  if (messageEncoding === 'protobuf') {
    if (channel.schema?.encoding !== "protobuf") {
      throw new Error(
        `Message encoding ${channel.messageEncoding} with ${
          channel.schema == undefined
            ? "no encoding"
            : `schema encoding '${channel.schema.encoding}'`
        } is not supported (expected protobuf)`,
      );
    }
    return parseProtobufSchema(channel.schema.name, channel.schema.data);
  }
};

const parseProtobufSchema = ( schemaName: string, schemaData: Uint8Array ) => {
  const descriptorSet = FileDescriptorSet.decode(schemaData);
  
  const root = (protobufjs.Root as any).fromDescriptor(descriptorSet);
  root.resolveAll();
  const rootType = root.lookupType(schemaName);

  const fixTimeType = ( type: protobufjs.ReflectionObject | null ) => {
    if (!type || !(type instanceof protobufjs.Type)) {
      return;
    };

    type.setup(); // ensure the original optimized toObject has been created
    const prevToObject = type.toObject; // eslint-disable-line @typescript-eslint/unbound-method
    const newToObject: typeof prevToObject = (message, options) => {
      const result = prevToObject.call(type, message, options);
      const { seconds, nanos } = result as { seconds: bigint; nanos: number };
      if (typeof seconds !== "bigint" || typeof nanos !== "number") {
        return result;
      }
      if (seconds > BigInt(Number.MAX_SAFE_INTEGER)) {
        throw new Error(
          `Timestamps with seconds greater than 2^53-1 are not supported (found seconds=${seconds}, nanos=${nanos})`,
        );
      }
      return { sec: Number(seconds), nsec: nanos };
    };
    type.toObject = newToObject;
  };

  fixTimeType(root.lookup(".google.protobuf.Timestamp"));
  fixTimeType(root.lookup(".google.protobuf.Duration"));

  const deserialize = (data: ArrayBufferView) => {
    return rootType.toObject(
      rootType.decode(new Uint8Array(data.buffer, data.byteOffset, data.byteLength)),
      { defaults: true },
    );
  };

  const datatypes: MessageDefinitionMap = new Map();
  protobufDefinitionsToDatatypes(datatypes, rootType);

  if (!datatypes.has(schemaName)) {
    throw new Error(
      `Protobuf schema does not contain an entry for '${schemaName}'. The schema name should be fully-qualified, e.g. '${stripLeadingDot(
        rootType.fullName,
      )}'.`,
    );
  }

  return { deserialize, datatypes };
};

export function stripLeadingDot(typeName: string): string {
  return typeName.replace(/^\./, "");
}

export function protobufDefinitionsToDatatypes(
  datatypes: MessageDefinitionMap,
  type: protobufjs.Type,
): void {
  const definitions: MessageDefinitionField[] = [];
  // The empty list reference is added to the map so a `.has` lookup below can prevent infinite recursion on cyclical types
  datatypes.set(stripLeadingDot(type.fullName), { definitions });
  for (const field of type.fieldsArray) {
    if (field.resolvedType instanceof protobufjs.Enum) {
      for (const [name, value] of Object.entries(field.resolvedType.values)) {
        // Note: names from different enums might conflict. The player API will need to be updated
        // to associate fields with enums (similar to the __foxglove_enum annotation hack).
        // https://github.com/foxglove/studio/issues/2214
        definitions.push({ name, type: "int32", isConstant: true, value });
      }
      definitions.push({ type: "int32", name: field.name });
    } else if (field.resolvedType) {
      const fullName = stripLeadingDot(field.resolvedType.fullName);
      definitions.push({
        type: fullName,
        name: field.name,
        isComplex: true,
        isArray: field.repeated,
      });

      // If we've already processed this datatype we should skip it.
      // This avoid infinite recursion with datatypes that reference themselves.
      if (!datatypes.has(fullName)) {
        protobufDefinitionsToDatatypes(datatypes, field.resolvedType);
      }
    } else if (field.type === "bytes") {
      if (field.repeated) {
        throw new Error("Repeated bytes are not currently supported");
      }
      definitions.push({ type: "uint8", name: field.name, isArray: true });
    } else {
      definitions.push({
        type: protobufScalarToRosPrimitive(field.type),
        name: field.name,
        isArray: field.repeated,
      });
    }
  }
}

function protobufScalarToRosPrimitive(type: string): string {
  switch (type) {
    case "double":
      return "float64";
    case "float":
      return "float32";
    case "int32":
    case "sint32":
    case "sfixed32":
      return "int32";
    case "uint32":
    case "fixed32":
      return "uint32";
    case "int64":
    case "sint64":
    case "sfixed64":
      return "int64";
    case "uint64":
    case "fixed64":
      return "uint64";
    case "bool":
      return "bool";
    case "string":
      return "string";
  }
  throw new Error(`Expected protobuf scalar type, got ${type}`);
}