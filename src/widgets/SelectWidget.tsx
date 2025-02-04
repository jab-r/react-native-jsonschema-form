import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { WidgetProps } from '@rjsf/utils';

const SelectWidget = ({
  id,
  options,
  value,
  disabled,
  readonly,
  onChange,
  onBlur,
  onFocus,
  placeholder,
  rawErrors = [],
}: WidgetProps) => {
  const { enumOptions, enumDisabled } = options;

  const _onChange = (value: any) => {
    onChange(value);
  };

  const _onBlur = () => {
    if (onBlur) {
      onBlur(id, value);
    }
  };

  const _onFocus = () => {
    if (onFocus) {
      onFocus(id, value);
    }
  };

  return (
    <View style={styles.container}>
      <View style={[
        styles.pickerContainer,
        disabled && styles.disabled,
        readonly && styles.readonly,
        rawErrors.length > 0 && styles.error
      ]}>
        <Picker
          testID={id}
          selectedValue={value}
          onValueChange={_onChange}
          enabled={!disabled && !readonly}
          onBlur={_onBlur}
          onFocus={_onFocus}
          style={styles.picker}
          accessibilityLabel={placeholder}
        >
          {placeholder && (
            <Picker.Item 
              label={placeholder}
              value=""
              enabled={false}
              color="#666666"
            />
          )}
          {enumOptions && enumOptions.map((option: any, index: number) => {
            const itemDisabled = enumDisabled && enumDisabled.indexOf(option.value) !== -1;
            return (
              <Picker.Item
                key={index}
                label={option.label}
                value={option.value}
                enabled={!itemDisabled}
                color={itemDisabled ? '#666666' : '#000000'}
              />
            );
          })}
        </Picker>
      </View>
      {rawErrors.length > 0 && (
        <Text style={styles.errorText}>{rawErrors.join(", ")}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 4,
    backgroundColor: '#ffffff',
  },
  picker: {
    height: 50,
  },
  disabled: {
    backgroundColor: '#f5f5f5',
    opacity: 0.5,
  },
  readonly: {
    backgroundColor: '#f5f5f5',
    opacity: 0.5,
  },
  error: {
    borderColor: '#ff0000',
  },
  errorText: {
    color: '#ff0000',
    fontSize: 12,
    marginTop: 4,
  },
});

export default SelectWidget;
