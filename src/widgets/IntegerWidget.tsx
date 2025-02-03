import React from 'react';
import { KeyboardTypeOptions } from 'react-native';
import { isNaN } from 'lodash';
import TextInputWidget from './TextInputWidget';
import { OnChangeProps } from '../types/utils';
import { UISchema } from '../types';

const textParser = (value: string): string => {
  const result = parseInt(value, 10);
  return !isNaN(result) ? result.toString() : '';
};

interface IntegerWidgetProps extends OnChangeProps {
  uiSchema: UISchema;
  update: string | Record<string, any>;
  renderId: number;
  hasError: boolean;
  value?: any;
  readonly?: boolean;
  disabled?: boolean;
  placeholder?: string;
  auto?: boolean;
}

const IntegerWidget: React.FC<IntegerWidgetProps> = (props) => (
  <TextInputWidget
    {...props}
    keyboardType={'number-pad' as KeyboardTypeOptions}
    mask="9999999999"
    textParser={textParser}
  />
);

export default IntegerWidget;
