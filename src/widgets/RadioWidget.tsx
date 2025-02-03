import { StyleSheet, View, Text, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import type { FC } from 'react';
import { useAutoFocus } from '../utils';

interface Styles {
  container: ViewStyle;
  radio: ViewStyle;
  radioChecked: ViewStyle;
  radioUnchecked: ViewStyle;
  dot: ViewStyle;
  text: TextStyle;
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
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  radioChecked: {
    borderColor: '#007AFF',
  },
  radioUnchecked: {
    borderColor: '#C7C7CC',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#007AFF',
  },
  text: {
    fontSize: 16,
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
  onChange: (value: any, name: string) => void;
}

const useOnChange = ({ name, onChange }: UseOnChangeParams) => 
  (checked: boolean, value: any) => {
    onChange(checked ? value : undefined, name);
  };

export interface RadioWidgetProps {
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
  onChange: (value: any, name: string) => void;
}

const RadioWidget: FC<RadioWidgetProps> = (props) => {
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

  const handlePress = () => {
    if (!disabled && !readonly) {
      onChange(!checked, value);
    }
  };

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
    <TouchableOpacity
      {...autoFocusParams}
      onPress={handlePress}
      style={[styles.container, css]}
      disabled={disabled || readonly}
    >
      <View
        style={[
          styles.radio,
          checked ? styles.radioChecked : styles.radioUnchecked,
          checked ? styleChecked : styleUnchecked,
          hasError && { borderColor: 'red' },
          disabled && { opacity: 0.5 },
        ]}
      >
        {checked && <View style={styles.dot} />}
      </View>
      {text && (
        <Text
          style={[
            styles.text,
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

RadioWidget.defaultProps = {
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
};

export default RadioWidget;
