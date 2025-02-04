import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { WidgetProps } from '@rjsf/utils';

const CheckboxWidget = ({
  id,
  value,
  disabled,
  readonly,
  onChange,
  onBlur,
  onFocus,
  label,
  rawErrors = [],
}: WidgetProps) => {
  const _onChange = () => {
    onChange(!value);
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
      <Pressable
        testID={id}
        onPress={_onChange}
        onBlur={_onBlur}
        onFocus={_onFocus}
        disabled={disabled || readonly}
        style={({ pressed }) => [
          styles.checkbox,
          value && styles.checked,
          disabled && styles.disabled,
          readonly && styles.readonly,
          pressed && styles.pressed,
          rawErrors.length > 0 && styles.error
        ]}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: value, disabled: disabled || readonly }}
      >
        {value && <Text style={styles.checkmark}>✓</Text>}
      </Pressable>
      {label && (
        <Text style={[
          styles.label,
          disabled && styles.disabledText,
          readonly && styles.readonlyText
        ]}>
          {label}
        </Text>
      )}
      {rawErrors.length > 0 && (
        <Text style={styles.errorText}>{rawErrors.join(", ")}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#000000',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  checked: {
    backgroundColor: '#000000',
  },
  checkmark: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabled: {
    borderColor: '#cccccc',
    backgroundColor: '#f5f5f5',
  },
  readonly: {
    borderColor: '#cccccc',
    backgroundColor: '#f5f5f5',
  },
  pressed: {
    opacity: 0.7,
  },
  error: {
    borderColor: '#ff0000',
  },
  label: {
    marginLeft: 8,
    fontSize: 16,
  },
  disabledText: {
    color: '#666666',
  },
  readonlyText: {
    color: '#666666',
  },
  errorText: {
    color: '#ff0000',
    fontSize: 12,
    marginLeft: 8,
  },
});

export default CheckboxWidget;
