import React from 'react';
import { View } from 'react-native';
import Form from '../src/components/Form';
import validator from '@rjsf/validator-ajv8';
import { RJSFSchema, UiSchema } from '@rjsf/utils';

const schema: RJSFSchema = {
  type: 'object',
  required: ['name', 'preferences', 'notification', 'theme', 'subscribe'],
  properties: {
    name: {
      type: 'string',
      title: 'Name',
    },
    preferences: {
      type: 'string',
      title: 'Preferred Contact Method',
      enum: ['email', 'phone', 'sms'],
      oneOf: [
        { const: 'email', title: 'Email' },
        { const: 'phone', title: 'Phone' },
        { const: 'sms', title: 'SMS' }
      ],
    },
    notification: {
      type: 'string',
      title: 'Notification Type',
      enum: ['none', 'daily', 'weekly', 'monthly'],
      oneOf: [
        { const: 'none', title: 'None' },
        { const: 'daily', title: 'Daily' },
        { const: 'weekly', title: 'Weekly' },
        { const: 'monthly', title: 'Monthly' }
      ],
    },
    theme: {
      type: 'string',
      title: 'Theme',
      enum: ['light', 'dark', 'system'],
      oneOf: [
        { const: 'light', title: 'Light' },
        { const: 'dark', title: 'Dark' },
        { const: 'system', title: 'System' }
      ],
    },
    subscribe: {
      type: 'boolean',
      title: 'Subscribe to newsletter',
      default: false,
    },
    enableNotifications: {
      type: 'boolean',
      title: 'Enable push notifications',
      default: true,
    },
  },
};

const uiSchema: UiSchema = {
  name: {
    'ui:widget': 'text',
  },
  preferences: {
    'ui:widget': 'radio',
  },
  notification: {
    'ui:widget': 'select',
  },
  theme: {
    'ui:widget': 'select',
  },
  subscribe: {
    'ui:widget': 'checkbox',
  },
  enableNotifications: {
    'ui:widget': 'toggle',
  },
};

const WidgetsExample = () => {
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

export default WidgetsExample;
