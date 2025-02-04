import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ObjectFieldTemplateProps as RJSFObjectFieldTemplateProps } from '@rjsf/utils';

const ObjectFieldTemplate = ({
  title,
  description,
  properties,
  required,
  uiSchema,
}: RJSFObjectFieldTemplateProps) => {
  return (
    <View style={styles.container}>
      {title && (
        <Text style={styles.title}>
          {title}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}
      {description && (
        <Text style={styles.description}>{description}</Text>
      )}
      <View style={styles.fieldsContainer}>
        {properties.map((element, index) => (
          <View key={element.name} style={styles.field}>
            {element.content}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 16,
  },
  required: {
    color: '#ff0000',
  },
  fieldsContainer: {
    marginLeft: 8,
  },
  field: {
    marginBottom: 8,
  },
});

export default ObjectFieldTemplate;
