import { StyleSheet, View, Text, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import type { FC } from 'react';
import { useAutoFocus } from '../utils';

interface Styles {
  container: ViewStyle;
  checkbox: ViewStyle;
  checkboxChecked: ViewStyle;
  checkboxUnchecked: ViewStyle;
  checkmark: ViewStyle;
  text: TextStyle;
  textChecked: TextStyle;
  textUnchecked: TextStyle;
  defaults: ViewStyle;
  fullWidth: ViewStyle;
  auto: ViewStyle;
  alone: ViewStyle;
  adjustTitle: ViewStyle;
}

const styles = StyleSheet.create<Styles>({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  checkboxChecked: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  checkboxUnchecked: {
    backgroundColor: 'transparent',
    borderColor: '#C7C7CC',
  },
  checkmark: {
    width: 12,
    height: 6,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: 'white',
    transform: [{ rotate: '-45deg' }],
    marginTop: -2,
  },
  text: {
    fontSize: 16,
  },
  textChecked: {
    color: '#000000',
  },
  textUnchecked: {
    color: '#000000',
  },
  defaults: {
    minHeight: 40,
    borderWidth: 1,
    borderColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 2,
    marginBottom: 10,
  },
  fullWidth: {
    width: '100%',
  },
  auto: {
    marginBottom: 0,
  },
  alone: {
    minHeight: 23,
  },
  adjustTitle: {
    marginTop: 20,
  },
});

interface UseOnChangeParams {
  name: string;
  uncheckable?: boolean;
  onChange: (value: any, name: string) => void;
}

const useOnChange = ({ name, uncheckable, onChange }: UseOnChangeParams) => 
  (checked: boolean, value: any) => {
    if (!checked || uncheckable) {
      onChange(!checked ? value : undefined, name);
    }
  };

export interface CheckboxWidgetProps {
  uiSchema: {
    'ui:title'?: boolean | string;
    'ui:toggleable'?: boolean;
    [key: string]: any;
  };
  name: string;
  gridItemType: string;
  gridItemLength: number;
  value?: any;
  readonly?: boolean;
  disabled?: boolean;
  hasError?: boolean;
  auto?: boolean;
  style?: ViewStyle;
  styleChecked?: ViewStyle;
  styleUnchecked?: ViewStyle;
  styleCheckedText?: TextStyle;
  styleUncheckedText?: TextStyle;
  text?: string;
  checked?: boolean;
  adjustTitle?: boolean;
  uncheckable?: boolean;
  onChange: (value: any, name: string) => void;
}

interface CheckboxProps {
  disabled?: boolean;
  readonly?: boolean;
  hasError?: boolean;
  text?: string;
  checked?: boolean;
  value?: any;
  auto?: boolean;
  onPress: (checked: boolean, value: any) => void;
  style?: ViewStyle | ViewStyle[];
  styleChecked?: ViewStyle;
  styleUnchecked?: ViewStyle;
  styleCheckedText?: TextStyle;
  styleUncheckedText?: TextStyle;
}

const Checkbox: FC<CheckboxProps> = ({
  disabled,
  readonly,
  hasError,
  text,
  checked = false,
  value,
  onPress,
  style,
  styleChecked,
  styleUnchecked,
  styleCheckedText,
  styleUncheckedText,
}) => {
  const handlePress = () => {
    if (!disabled && !readonly) {
      onPress(!checked, value);
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[styles.container, style]}
      disabled={disabled || readonly}
    >
      <View
        style={[
          styles.checkbox,
          checked ? styles.checkboxChecked : styles.checkboxUnchecked,
          checked ? styleChecked : styleUnchecked,
          hasError && { borderColor: 'red' },
          disabled && { opacity: 0.5 },
        ]}
      >
        {checked && <View style={styles.checkmark} />}
      </View>
      {text && (
        <Text
          style={[
            styles.text,
            checked ? styles.textChecked : styles.textUnchecked,
            checked ? styleCheckedText : styleUncheckedText,
            disabled && { opacity: 0.5 },
          ]}
        >
          {text}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const CheckboxWidget: FC<CheckboxWidgetProps> = (props) => {
  const {
    uiSchema,
    value,
    readonly,
    disabled,
    hasError,
    auto,
    text,
    checked,
    gridItemType,
    gridItemLength,
    adjustTitle,
    style,
    styleChecked,
    styleUnchecked,
    styleCheckedText,
    styleUncheckedText,
  } = props;

  const autoFocusParams = useAutoFocus(props);
  const onChange = useOnChange(props);

  const css = [styles.defaults];
  if (gridItemType !== 'grid' || gridItemLength <= 1) {
    css.push(styles.alone);
  }
  if (
    adjustTitle
    && gridItemType === 'grid'
    && gridItemLength > 1
    && uiSchema['ui:title'] === false
    && !uiSchema['ui:toggleable']
  ) {
    css.push(styles.adjustTitle);
  }
  css.push(auto ? styles.auto : styles.fullWidth);
  if (style) {
    css.push(style);
  }

  return (
    <Checkbox
      {...autoFocusParams}
      disabled={disabled}
      readonly={readonly}
      hasError={hasError}
      text={text}
      checked={checked}
      value={value}
      onPress={onChange}
      style={css}
      styleChecked={styleChecked}
      styleUnchecked={styleUnchecked}
      styleCheckedText={styleCheckedText}
      styleUncheckedText={styleUncheckedText}
    />
  );
};

CheckboxWidget.defaultProps = {
  value: true,
  readonly: false,
  disabled: false,
  hasError: false,
  auto: false,
  style: undefined,
  styleChecked: undefined,
  styleUnchecked: undefined,
  styleCheckedText: undefined,
  styleUncheckedText: undefined,
  text: undefined,
  checked: false,
  adjustTitle: true,
  uncheckable: true,
};

export default CheckboxWidget;
