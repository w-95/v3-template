import { ElForm } from 'element-plus/lib/components/form';

export declare type ElFormRef = {
  validate: (callback?: (valid: boolean) => void) => void;
  validateField: (props?: string | string[], callback?: (valid: boolean) => void) => void;
  resetFields: () => void;
  clearValidate: (props?: string | string[]) => void;
} & Omit<ElForm, keyof HTMLElement> & {
  form: any;
};