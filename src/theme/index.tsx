import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FormContextType, RJSFSchema, StrictRJSFSchema, UISchemaSubmitButtonOptions, TemplatesType, RegistryWidgetsType } from '@rjsf/utils';

interface RNThemeType {
  templates: {
    ButtonTemplates: {
      SubmitButton: React.ComponentType<any>;
    };
    FieldTemplate: React.ComponentType<any>;
    ObjectFieldTemplate: React.ComponentType<any>;
    TitleField: React.ComponentType<any>;
    DescriptionField: React.ComponentType<any>;
    ErrorList: React.ComponentType<any>;
  };
  widgets: RegistryWidgetsType;
}
import widgets from '../widgets';
import { FieldTemplate, ObjectFieldTemplate } from '../templates';
import SubmitButton from '../components/SubmitButton';

const TitleField = ({ title, id }: { id: string; title: string }) => (
  <Text style={styles.title}>{title}</Text>
);

const DescriptionField = ({ description, id }: { id: string; description: string }) => (
  <Text style={styles.description}>{description}</Text>
);

const ErrorList = ({ errors }: { errors: { stack: string }[] }) => (
  <View style={styles.errorList}>
    {errors.map((error, i) => (
      <Text key={i} style={styles.error}>
        {error.stack}
      </Text>
    ))}
  </View>
);

const theme: RNThemeType = {
  templates: {
    ButtonTemplates: {
      SubmitButton,
    },
    FieldTemplate,
    ObjectFieldTemplate,
    TitleField,
    DescriptionField,
    ErrorList,
  },
  widgets,
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 16,
  },
  description: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 16,
  },
  errorList: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#FFF3F3',
    borderRadius: 8,
  },
  error: {
    color: '#FF0000',
    fontSize: 14,
    marginBottom: 4,
  },
});

export default theme;
