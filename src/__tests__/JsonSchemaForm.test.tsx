import React from 'react';
import { render } from '@testing-library/react-native';
import { JSONSchema7 } from 'json-schema';
import JsonSchemaForm from '../index';

describe('JsonSchemaForm', () => {
  const schema: JSONSchema7 = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    type: 'object',
    properties: {
      name: {
        type: 'string',
        title: 'Name',
      },
    },
    required: ['name'],
  };

  const defaultProps = {
    name: null,
    theme: {},
    formData: {},
    onChange: () => {},
    onSubmit: () => {},
  };

  it('renders without crashing', () => {
    render(
      <JsonSchemaForm
        {...defaultProps}
        schema={schema}
      />
    );
  });

  it('renders form fields based on schema', () => {
    const { getByText } = render(
      <JsonSchemaForm
        {...defaultProps}
        schema={schema}
      />
    );

    expect(getByText('Name')).toBeTruthy();
  });

  it('renders submit button by default', () => {
    const { getByText } = render(
      <JsonSchemaForm
        {...defaultProps}
        schema={schema}
      />
    );

    expect(getByText('Submit')).toBeTruthy();
  });
});
