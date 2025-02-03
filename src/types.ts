import { ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { JSONSchema7 } from 'json-schema';

export type PropertyPath = string | string[];

export interface UISchema {
  'ui:widget'?: string;
  'ui:options'?: Record<string, any>;
  'ui:order'?: string[];
  'ui:disabled'?: boolean;
  'ui:readonly'?: boolean;
  [key: string]: any;
}

export interface ThemeProps {
  theme: {
    input: {
      error: {
        border: {
          borderColor: string;
        };
      };
    };
    text: {
      color: string;
    };
  };
  themeTextStyle: {
    text: {
      color: string;
    };
  };
}

export interface FormProps {
  name?: string | null;
  formData?: Record<string, any>;
  schema: JSONSchema7;
  uiSchema?: UISchema;
  metaSchema?: Record<string, any>;
  errorSchema?: Record<string, any>;
  children?: React.ReactNode;
  onRef?: (form: any) => void;
  onChange?: (event: any) => void;
  onSubmit?: (event: any) => void;
  onCancel?: (event: any) => void;
  onSuccess?: (event: any) => void;
  onError?: (event: any) => void;
  buttonPosition?: 'left' | 'right' | 'center';
  cancelButton?: boolean | string;
  CancelButton?: React.ComponentType<any>;
  submitButton?: boolean | string;
  SubmitButton?: React.ComponentType<any>;
  scroller?: any;
  widgets?: Record<string, React.ComponentType<any>>;
  filterEmptyValues?: boolean;
  insideClickRegex?: RegExp;
  theme?: ThemeProps['theme'];
}

export type Style = ViewStyle | TextStyle | ImageStyle;
