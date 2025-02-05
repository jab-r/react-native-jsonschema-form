import React from 'react';
import { View } from 'react-native';
import Form from '../src/components/Form';
import validator from '@rjsf/validator-ajv8';
import { RJSFSchema, UiSchema } from '@rjsf/utils';

const schema: RJSFSchema = {
  type: 'object',
  properties: {
    displayMessage: {
      type: 'string',
      title: 'Message',
      const: 'This is a read-only text displayed using TextWidget',
    },
    userInput: {
      type: 'string',
      title: 'User Input',
      description: 'This is an editable text field using TextInputWidget',
    },
    formattedPhone: {
      type: 'string',
      title: 'Phone Number',
      pattern: '^\\d{3}-\\d{3}-\\d{4}$',
      description: 'Format: XXX-XXX-XXXX',
    },
  },
};

const uiSchema: UiSchema = {
  displayMessage: {
    'ui:widget': 'text',
    'ui:readonly': true,
  },
  userInput: {
    'ui:widget': 'TextInputWidget',
  },
  formattedPhone: {
    'ui:widget': 'TextInputWidget',
  },
};

const TextWidgetsExample = () => {
  const onSubmit = ({ formData }: any) => {
    console.log('Form submitted:', formData);
  };

  return (
    <View style={{ padding: 16 }}>
      <Form
        schema={schema}
        uiSchema={uiSchema}
        validator={validator}
        onSubmit={onSubmit}
      />
    </View>
  );
};

export default TextWidgetsExample;
