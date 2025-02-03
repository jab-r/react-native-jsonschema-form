import { ViewStyle } from 'react-native';
import type { FC } from 'react';
import TextInputWidget from './TextInputWidget';
import type { OnChangeProps } from '../types/utils';
import type { UISchema } from '../types';

interface PasswordWidgetProps extends OnChangeProps {
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
}

const PasswordWidget: FC<PasswordWidgetProps> = (props) => (
  <TextInputWidget 
    {...props} 
    secureTextEntry
    inputProps={{
      autoCapitalize: 'none',
      autoCorrect: false,
      autoComplete: 'password',
      textContentType: 'password',
      spellCheck: false,
    }}
  />
);

PasswordWidget.defaultProps = {
  value: '',
  readonly: false,
  disabled: false,
  placeholder: '',
  auto: false,
  style: undefined,
};

export default PasswordWidget;
