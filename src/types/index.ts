import { FormProps as RJSFFormProps } from '@rjsf/core';
import {
  FormContextType,
  RJSFSchema,
  StrictRJSFSchema,
  FieldTemplateProps as RJSFFieldTemplateProps,
  ObjectFieldTemplateProps as RJSFObjectFieldTemplateProps,
  WidgetProps as RJSFWidgetProps,
} from '@rjsf/utils';
import { ViewStyle } from 'react-native';

export interface RNFormProps<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any
> extends Omit<RJSFFormProps<T, S>, 'className' | 'style'> {
  style?: ViewStyle;
}

export interface FieldTemplateProps extends Omit<RJSFFieldTemplateProps, 'classNames' | 'style'> {
  style?: ViewStyle;
}

export interface ObjectFieldTemplateProps extends Omit<RJSFObjectFieldTemplateProps, 'classNames' | 'style'> {
  style?: ViewStyle;
}

export interface WidgetProps extends Omit<RJSFWidgetProps, 'className' | 'style'> {
  style?: ViewStyle;
}

export interface TemplateProps {
  id: string;
  label?: string;
  required?: boolean;
  hasError?: boolean;
  errorMessage?: string;
  help?: string;
  children: React.ReactNode;
  style?: ViewStyle;
}

export type { RJSFSchema, StrictRJSFSchema, FormContextType };
