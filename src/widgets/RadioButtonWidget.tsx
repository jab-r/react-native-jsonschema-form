import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { WidgetProps } from '@rjsf/utils';

const RadioButtonWidget = ({
  id,
  options,
  value,
  disabled,
  readonly,
  onChange,
  onBlur,
  onFocus,
  rawErrors = [],
}: WidgetProps) => {
  const { enumOptions, enumDisabled } = options;

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
      {enumOptions && enumOptions.map((option: any, index: number) => {
        const itemDisabled = enumDisabled && enumDisabled.indexOf(option.value) !== -1;
        const isChecked = value === option.value;

        return (
          <Pressable
            key={index}
            testID={`${id}_${index}`}
            onPress={() => onChange(option.value)}
            onBlur={_onBlur}
            onFocus={_onFocus}
            disabled={disabled || readonly || itemDisabled}
            style={({ pressed }) => [
              styles.optionContainer,
              disabled && styles.disabledContainer,
              readonly && styles.readonlyContainer,
              pressed && styles.pressed
            ]}
            accessibilityRole="radio"
            accessibilityState={{ 
              checked: isChecked,
              disabled: disabled || readonly || itemDisabled 
            }}
          >
            <View style={[
              styles.radio,
              isChecked && styles.radioChecked,
              disabled && styles.disabled,
              readonly && styles.readonly,
              itemDisabled && styles.disabled,
              rawErrors.length > 0 && styles.error
            ]}>
              {isChecked && <View style={styles.innerDot} />}
            </View>
            <Text style={[
              styles.label,
              disabled && styles.disabledText,
              readonly && styles.readonlyText,
              itemDisabled && styles.disabledText
            ]}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
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
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
    paddingVertical: 2,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  radioChecked: {
    borderColor: '#000000',
  },
  innerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#000000',
  },
  label: {
    marginLeft: 8,
    fontSize: 16,
  },
  disabled: {
    borderColor: '#cccccc',
    backgroundColor: '#f5f5f5',
  },
  readonly: {
    borderColor: '#cccccc',
    backgroundColor: '#f5f5f5',
  },
  disabledText: {
    color: '#666666',
  },
  readonlyText: {
    color: '#666666',
  },
  pressed: {
    opacity: 0.7,
  },
  error: {
    borderColor: '#ff0000',
  },
  errorText: {
    color: '#ff0000',
    fontSize: 12,
    marginTop: 4,
  },
  disabledContainer: {
    opacity: 0.5,
  },
  readonlyContainer: {
    opacity: 0.5,
  },
});

export default RadioButtonWidget;
