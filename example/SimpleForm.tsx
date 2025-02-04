import React from 'react';
import { Form } from '../src';
import { RJSFSchema } from '@rjsf/utils';
import validator from '@rjsf/validator-ajv8';

const schema: RJSFSchema = {
  title: "Simple Form Example",
  type: "object",
  required: ["firstName", "lastName"],
  properties: {
    firstName: {
      type: "string",
      title: "First name",
      default: "Chuck"
    },
    lastName: {
      type: "string",
      title: "Last name"
    },
    age: {
      type: "number",
      title: "Age"
    },
    bio: {
      type: "string",
      title: "Bio",
    },
    password: {
      type: "string",
      title: "Password",
      minLength: 3
    },
    telephone: {
      type: "string",
      title: "Telephone",
      minLength: 10
    }
  }
};

const uiSchema = {
  firstName: {
    "ui:autofocus": true,
    "ui:emptyValue": ""
  },
  age: {
    "ui:widget": "updown",
    "ui:title": "Age of person",
    "ui:description": "(earthian year)"
  },
  bio: {
    "ui:widget": "textarea"
  },
  password: {
    "ui:widget": "password",
    "ui:help": "Hint: Make it strong!"
  },
  date: {
    "ui:widget": "alt-datetime"
  },
  telephone: {
    "ui:options": {
      inputType: "tel"
    }
  }
};

export default function SimpleForm() {
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async ({ formData }: any) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("Form submitted:", formData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      schema={schema}
      uiSchema={{
        ...uiSchema,
        'ui:submitButtonOptions': {
          submitText: 'Save Form',
          props: {
            loading,
            style: {
              backgroundColor: '#4CAF50',
              borderRadius: 25,
            },
            textStyle: {
              fontSize: 18,
            },
          },
        },
      }}
      validator={validator}
      onChange={console.log}
      onSubmit={handleSubmit}
      onError={console.log}
    />
  );
}
