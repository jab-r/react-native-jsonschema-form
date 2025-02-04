import React from 'react';
import { TextInput, View, Text, StyleSheet } from 'react-native';
import { WidgetProps as RJSFWidgetProps } from '@rjsf/utils';

const TextWidget = ({
  id,
  placeholder,
  required,
  readonly,
  disabled,
  value,
  onChange,
  onBlur,
  onFocus,
  autofocus,
  options,
  schema,
  rawErrors = [],
}: RJSFWidgetProps) => {
  const _onChange = (value: string) => {
    return onChange(value === "" ? options.emptyValue : value);
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

  const getPlaceholder = () => {
    if (placeholder) return placeholder;
    if (Array.isArray(schema.examples) && schema.examples.length > 0) {
      const example = schema.examples[0];
      return example && typeof example !== 'object' ? String(example) : undefined;
    }
    if (schema.default && typeof schema.default !== 'object') {
      return String(schema.default);
    }
    return undefined;
  };

  return (
    <View style={styles.container}>
      <TextInput
        testID={id}
        style={[
          styles.input,
          disabled && styles.disabled,
          readonly && styles.readonly,
          rawErrors.length > 0 && styles.error
        ]}
        onChangeText={_onChange}
        onBlur={_onBlur}
        onFocus={_onFocus}
        value={value || value === 0 ? String(value) : ""}
        placeholder={getPlaceholder()}
        editable={!disabled && !readonly}
        autoFocus={autofocus}
        secureTextEntry={schema.format === "password"}
        keyboardType={schema.type === "number" ? "numeric" : "default"}
      />
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
  input: {
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 4,
    padding: 8,
    fontSize: 16,
  },
  disabled: {
    backgroundColor: '#f5f5f5',
    color: '#666666',
  },
  readonly: {
    backgroundColor: '#f5f5f5',
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

export default TextWidget;
