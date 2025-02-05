import React from 'react';
import { View } from 'react-native';
import Form from '../src/components/Form';
import validator from '@rjsf/validator-ajv8';
import { RJSFSchema, UiSchema } from '@rjsf/utils';

const schema: RJSFSchema = {
  type: 'object',
  required: ['name', 'preferences', 'notification', 'theme', 'subscribe', 'startDate', 'startTime', 'meetingDateTime'],
  properties: {
    name: {
      type: 'string',
      title: 'Name',
    },
    startDate: {
      type: 'string',
      format: 'date',
      title: 'Start Date',
    },
    startTime: {
      type: 'string',
      format: 'time',
      title: 'Start Time',
    },
    meetingDateTime: {
      type: 'string',
      format: 'date-time',
      title: 'Meeting Date and Time',
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
    age: {
      type: 'integer',
      title: 'Age',
      minimum: 0,
      maximum: 120,
    },
    rating: {
      type: 'number',
      title: 'Rating',
      minimum: 0,
      maximum: 5,
    },
    quantity: {
      type: 'integer',
      title: 'Quantity',
    },
    phone: {
      type: 'string',
      title: 'Phone Number',
      pattern: '^\\d{3}-\\d{3}-\\d{4}$',
      description: 'Format: XXX-XXX-XXXX',
    },
    username: {
      type: 'string',
      title: 'Username',
      pattern: '^[a-zA-Z0-9_]{3,16}$',
      description: '3-16 characters, letters, numbers and underscore only',
    },
  },
};

const uiSchema: UiSchema = {
  name: {
    'ui:widget': 'text',
  },
  startDate: {
    'ui:widget': 'date',
  },
  startTime: {
    'ui:widget': 'time',
  },
  meetingDateTime: {
    'ui:widget': 'datetime',
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
  age: {
    'ui:widget': 'number',
  },
  rating: {
    'ui:widget': 'number',
  },
  quantity: {
    'ui:widget': 'number',
  },
  phone: {
    'ui:widget': 'text',
  },
  username: {
    'ui:widget': 'text',
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
