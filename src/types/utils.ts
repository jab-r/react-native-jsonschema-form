import { JSONSchema7 } from 'json-schema';
import { UISchema } from '../types';

export interface GridChild {
  type: 'label' | 'grid';
  children: Array<string | GridChild>;
}

export interface Structure {
  schema: Record<string, JSONSchema7>;
  uiSchema: Record<string, UISchema>;
}

export interface AutoFocusProps {
  uiSchema: UISchema;
  onFocus?: (...args: any[]) => void;
  onBlur?: (...args: any[]) => void;
}

export interface AutoFocusResult {
  autoFocus: boolean;
  onFocus: (...args: any[]) => void;
  onBlur: (...args: any[]) => void;
}

export interface OnChangeProps {
  name: string;
  onChange: (value: any, name: string) => void;
  parser?: (props: OnChangeProps) => (value: any) => any;
}

export interface SchemaWithProperties extends JSONSchema7 {
  properties: Record<string, JSONSchema7>;
  required?: string[];
}

export interface SchemaWithItems extends JSONSchema7 {
  items: JSONSchema7;
}
