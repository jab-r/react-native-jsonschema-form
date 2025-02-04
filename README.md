# React Native JSON Schema Form

A React Native implementation of [react-jsonschema-form](https://github.com/rjsf-team/react-jsonschema-form), enabling the creation of forms using JSON Schema in React Native applications.

## Installation

```bash
npm install react-native-jsonschema-form
```

## Dependencies

This package has the following peer dependencies:

```json
{
  "react": "^18.2.0",
  "react-native": "^0.72.0",
  "@rjsf/core": "^5.12.0"
}
```

## Usage

Here's a simple example of how to use the form:

```tsx
import React from 'react';
import { Form } from 'react-native-jsonschema-form';
import { RJSFSchema } from '@rjsf/utils';
import validator from '@rjsf/validator-ajv8';

const schema: RJSFSchema = {
  title: "Simple Form",
  type: "object",
  required: ["firstName", "lastName"],
  properties: {
    firstName: {
      type: "string",
      title: "First name"
    },
    lastName: {
      type: "string",
      title: "Last name"
    }
  }
};

const uiSchema = {
  firstName: {
    "ui:autofocus": true,
    "ui:emptyValue": ""
  }
};

export default function MyForm() {
  const handleSubmit = ({ formData }) => {
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
```

## Features

- Native React Native components
- JSON Schema validation
- Customizable widgets and templates
- Form state management
- Error handling
- Custom validation
- Conditional form fields
- Dynamic form updates

## Documentation

For more detailed documentation and examples, check out the [example](./example) directory.

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

MIT
