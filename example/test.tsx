import React from 'react';
import { Form } from '../src';
import { RJSFSchema } from '@rjsf/utils';
import validator from '@rjsf/validator-ajv8';

const schema: RJSFSchema = {
  type: "object",
  required: ["name", "email"],
  properties: {
    name: {
      type: "string",
      title: "Name",
      minLength: 3
    },
    email: {
      type: "string",
      title: "Email",
      format: "email"
    },
    age: {
      type: "number",
      title: "Age",
      minimum: 0
    },
    bio: {
      type: "string",
      title: "Bio",
      description: "Tell us about yourself"
    },
    password: {
      type: "string",
      title: "Password",
      minLength: 8,
      format: "password"
    }
  }
};

const uiSchema = {
  bio: {
    "ui:widget": "textarea"
  },
  password: {
    "ui:widget": "password",
    "ui:help": "Must be at least 8 characters"
  }
};

export default function TestForm() {
  const handleSubmit = ({ formData }: any) => {
    console.log("Form submitted:", formData);
  };

  return (
    <Form
      schema={schema}
      uiSchema={uiSchema}
      validator={validator}
      onChange={console.log}
      onSubmit={handleSubmit}
      onError={console.log}
    />
  );
}
