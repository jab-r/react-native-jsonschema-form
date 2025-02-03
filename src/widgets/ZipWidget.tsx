import { ViewStyle, KeyboardTypeOptions } from 'react-native';
import type { FC } from 'react';
import TextInputWidget from './TextInputWidget';
import type { OnChangeProps } from '../types/utils';
import type { UISchema } from '../types';

const defaultMaskParser = (value: any): string => {
  const text = (value === null || value === undefined) ? '' : `${value}`;
  return text.replace(/[^0-9]/g, '');
};

interface ZipWidgetProps extends OnChangeProps {
  uiSchema: UISchema;
  update: string | Record<string, any>;
  renderId: number;
  hasError: boolean;
  value?: string;
  readonly?: boolean;
  disabled?: boolean;
  placeholder?: string;
  auto?: boolean;
  style?: ViewStyle;
  mask?: string;
  keyboardType?: KeyboardTypeOptions;
  maskParser?: (value: any) => string;
}

const ZipWidget: FC<ZipWidgetProps> = (props) => (
  <TextInputWidget 
    {...props}
    inputProps={{
      autoCapitalize: 'none',
      autoCorrect: false,
      autoComplete: 'postal-code',
      textContentType: 'postalCode',
      maxLength: 5,
      returnKeyType: 'done',
    }}
  />
);

ZipWidget.defaultProps = {
  mask: '99999',
  keyboardType: 'number-pad' as KeyboardTypeOptions,
  maskParser: defaultMaskParser,
  value: '',
  readonly: false,
  disabled: false,
  placeholder: '',
  auto: false,
  style: undefined,
};

export default ZipWidget;
