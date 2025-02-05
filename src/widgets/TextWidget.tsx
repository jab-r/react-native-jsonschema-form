import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { WidgetProps as RJSFWidgetProps } from '@rjsf/utils';

const TextWidget = ({
  id,
  value,
  readonly,
  disabled,
  schema,
  rawErrors = [],
}: RJSFWidgetProps) => {
  return (
    <View style={styles.container}>
      <Text
        testID={id}
        style={[
          styles.text,
          disabled && styles.disabled,
          readonly && styles.readonly,
          rawErrors.length > 0 && styles.error
        ]}
      >
        {value || value === 0 ? String(value) : ""}
      </Text>
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
  text: {
    fontSize: 16,
    color: '#000000',
  },
  disabled: {
    color: '#666666',
  },
  readonly: {
    color: '#333333',
  },
  error: {
    color: '#ff0000',
  },
  errorText: {
    color: '#ff0000',
    fontSize: 12,
    marginTop: 4,
  },
});

export default TextWidget;
