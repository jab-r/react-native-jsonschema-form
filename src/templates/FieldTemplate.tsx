import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FieldTemplateProps as RJSFFieldTemplateProps } from '@rjsf/utils';

const FieldTemplate = ({
  id,
  label,
  required,
  children,
  errors,
  help,
  description,
  rawErrors = [],
  rawHelp,
  rawDescription,
}: RJSFFieldTemplateProps) => {
  return (
    <View style={styles.container}>
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}
      {children}
      {rawErrors.length > 0 && (
        <Text style={styles.error}>{rawErrors.join(", ")}</Text>
      )}
      {rawHelp && (
        <Text style={styles.help}>{rawHelp}</Text>
      )}
      {rawDescription && (
        <Text style={styles.description}>{rawDescription}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  required: {
    color: '#ff0000',
  },
  error: {
    color: '#ff0000',
    fontSize: 12,
    marginTop: 4,
  },
  help: {
    fontSize: 12,
    color: '#666666',
    marginTop: 4,
  },
  description: {
    fontSize: 12,
    color: '#666666',
    marginTop: 4,
  },
});

export default FieldTemplate;
