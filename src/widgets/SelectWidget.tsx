import { StyleSheet, View, Platform, ViewStyle } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import type { FC } from 'react';
import { isArray, isNaN, without } from 'lodash';
import { useOnChange, useAutoFocus } from '../utils';
import type { JSONSchema7 } from 'json-schema';
import type { OnChangeProps } from '../types/utils';

interface Styles {
  container: ViewStyle;
  picker: ViewStyle;
  pickerIOS: ViewStyle;
  pickerAndroid: ViewStyle;
  defaults: ViewStyle;
  fullWidth: ViewStyle;
  auto: ViewStyle;
  error: ViewStyle;
}

const styles = StyleSheet.create<Styles>({
  container: {
    borderWidth: 1,
    borderColor: '#C7C7CC',
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  picker: {
    height: 40,
  },
  pickerIOS: {
    marginHorizontal: -8, // Adjust for iOS picker padding
  },
  pickerAndroid: {
    marginHorizontal: 0,
  },
  defaults: {
    marginBottom: 10,
  },
  fullWidth: {
    width: '100%',
  },
  auto: {
    marginBottom: 0,
  },
  error: {
    borderColor: 'red',
  },
});

interface ExtendedJSONSchema7 extends JSONSchema7 {
  enumNames?: string[];
}

const parser = (props: OnChangeProps) => (value: string) => {
  const schema = (props as SelectWidgetProps).schema;
  let parsedValue: string | number | boolean | null = value;
  if (schema.type === 'number' || schema.type === 'integer') {
    parsedValue = parseFloat(value);
    if (isNaN(parsedValue)) {
      parsedValue = null;
    }
  } else if (schema.type === 'boolean') {
    parsedValue = value;
  }
  return parsedValue;
};

interface SelectWidgetProps extends Omit<OnChangeProps, 'parser'> {
  schema: ExtendedJSONSchema7;
  uiSchema: {
    'ui:enum'?: any[];
    'ui:enumExcludes'?: any[];
    'ui:enumNames'?: any[];
    [key: string]: any;
  };
  hasError: boolean;
  value?: any;
  readonly?: boolean;
  disabled?: boolean;
  placeholder?: string;
  auto?: boolean;
  style?: ViewStyle;
}

const SelectWidget: FC<SelectWidgetProps> = (props) => {
  const {
    schema,
    uiSchema,
    hasError,
    name,
    value,
    readonly,
    disabled,
    placeholder,
    auto,
    style,
  } = props;

  const autoFocusParams = useAutoFocus(props);
  const onChange = useOnChange({ ...props, parser });

  let values = uiSchema['ui:enum'] || schema.enum || [];
  if (isArray(uiSchema['ui:enumExcludes'])) {
    values = without(values, ...uiSchema['ui:enumExcludes']);
  }
  const labels = uiSchema['ui:enumNames'] || schema.enumNames || values;

  const containerStyles = [
    styles.container,
    styles.defaults,
    auto ? styles.auto : styles.fullWidth,
    hasError && styles.error,
    style,
  ].filter((s): s is ViewStyle => s !== undefined);

  const pickerStyles = [
    styles.picker,
    Platform.select({
      ios: styles.pickerIOS,
      android: styles.pickerAndroid,
    }),
  ];

  return (
    <View style={containerStyles}>
      <Picker
        {...autoFocusParams}
        enabled={!disabled && !readonly}
        selectedValue={value}
        onValueChange={(itemValue: string | number) => onChange(itemValue)}
        style={pickerStyles}
      >
        {placeholder && (
          <Picker.Item
            label={placeholder}
            value=""
            color={Platform.OS === 'ios' ? '#C7C7CC' : undefined}
          />
        )}
        {values.map((val: any, index: number) => (
          <Picker.Item
            key={val}
            label={String(labels[index])}
            value={val}
          />
        ))}
      </Picker>
    </View>
  );
};

SelectWidget.defaultProps = {
  value: '',
  placeholder: '',
  readonly: false,
  disabled: false,
  auto: false,
  style: undefined,
};

export default SelectWidget;
