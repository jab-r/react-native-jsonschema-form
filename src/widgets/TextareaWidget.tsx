import React from 'react';
import TextInputWidget from './TextInputWidget';
import { UISchema } from '../types';
import { OnChangeProps } from '../types/utils';
import { ViewStyle } from 'react-native';

interface TextareaWidgetProps extends OnChangeProps {
  uiSchema: UISchema & {
    'ui:options'?: {
      rows?: number;
    };
  };
  update: string | Record<string, any>;
  renderId: number;
  hasError: boolean;
  value?: any;
  readonly?: boolean;
  disabled?: boolean;
  placeholder?: string;
  auto?: boolean;
  style?: ViewStyle;
}

const TextareaWidget: React.FC<TextareaWidgetProps> = (props) => {
  const { uiSchema } = props;
  const numberOfLines = (uiSchema['ui:options'] && uiSchema['ui:options'].rows) || 2;
  return <TextInputWidget {...props} multiline numberOfLines={numberOfLines} />;
};

export default TextareaWidget;
