import { ElForm } from 'element-plus/lib/components/form';
import { VNode } from 'vue';

declare module 'element-plus/lib' {
  interface ElSubMenu {
    $slots: {
      title?: VNode[];
    };
  }
}

export declare type ElFormRef = {
  validate: (callback?: (valid: boolean) => void) => void;
  validateField: (props?: string | string[], callback?: (valid: boolean) => void) => void;
  resetFields: () => void;
  clearValidate: (props?: string | string[]) => void;
} & Omit<ElForm, keyof HTMLElement> & {
  form: any;
};