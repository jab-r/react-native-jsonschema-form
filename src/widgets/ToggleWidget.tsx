import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { WidgetProps } from '@rjsf/utils';

const ToggleWidget = ({
  id,
  value,
  disabled,
  readonly,
  onChange,
  label,
  rawErrors = [],
}: WidgetProps) => {
  const _onChange = (value: boolean) => {
    onChange(value);
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {label && (
          <Text style={[
            styles.label,
            disabled && styles.disabledText,
            readonly && styles.readonlyText
          ]}>
            {label}
          </Text>
        )}
        <Switch
          testID={id}
          value={value || false}
          onValueChange={_onChange}
          disabled={disabled || readonly}
          style={[
            styles.switch,
            rawErrors.length > 0 && styles.error
          ]}
          accessibilityRole="switch"
          accessibilityState={{ 
            checked: value || false,
            disabled: disabled || readonly
          }}
        />
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 40,
  },
  label: {
    flex: 1,
    fontSize: 16,
    marginRight: 10,
  },
  switch: {
    transform: [{ scale: 0.8 }],
  },
  disabledText: {
    color: '#666666',
  },
  readonlyText: {
    color: '#666666',
  },
  error: {
    // Switch component doesn't support border styling
    // Using opacity to indicate error state
    opacity: 0.8,
  },
  errorText: {
    color: '#ff0000',
    fontSize: 12,
    marginTop: 4,
  },
});

export default ToggleWidget;
