# React Native JSONSchema Form

[![NPM](https://img.shields.io/npm/v/react-native-jsonschema-form.svg)](https://www.npmjs.com/package/react-native-jsonschema-form)

Render customizable forms using [JSON schema](http://json-schema.org/) for React Native apps. This library was inspired by [react-jsonschema-form](https://github.com/mozilla-services/react-jsonschema-form) but was built specifically for [React Native](https://facebook.github.io/react-native/).

## Table of Contents

* [Documentation](#documentation)
* [Setup](#setup)
  * [Requirements](#requirements)
  * [Installation](#installation)
* [Examples](#examples)
  * [Basic Form](#basic-form)
  * [Event Handlers](#event-handlers)
  * [Custom Theme](#custom-theme)
  * [Form Validation](#form-validation)
  * [Array Fields](#array-fields)
* [Props](#props)
* [License](#license)

## Documentation

Coming soon!

## Setup

React Native JSONSchema Form was created to facilitate the development of mobile apps using JSON Schema for form generation and validation.

### Requirements

First you need to install react ^16.8.3 (this library uses react-hooks).

```sh
yarn add react
```

If you're using [Expo](https://expo.io/), they use a custom version of react-native and therefore you need to check what is the React Native repository for the Expo version you're using. For example:

```sh
yarn add react-native
```

This library is backed by React Native UI components. The form must be within `<UIProvider>` but doesn't need to be a direct child.

### Installation

Install the library using `yarn` or `npm`.

```sh
yarn add react-native-jsonschema-form
```

## Examples

### Basic Form

```javascript
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { UIProvider } from 'react-native-ui-components';
import Form from 'react-native-jsonschema-form';

const theme = {
  input: {
    focused: StyleSheet.create({
      border: {
        borderColor: 'yellow',
      },
    }),
  },
};

const schema = {
  type: 'object',
  properties: {
    username: { type: 'string' },
    password: { type: 'string' },
  },
};

const BasicForm = ({ formData, onChange }) => (
  <Form
    formData={formData}
    schema={schema}
    onChange={onChange}
  />
);

const ThemeWrapper = ({ children }) => (
  <UIProvider theme={theme}>
    {children}
  </UIProvider>
);

const App = () => {
  const [formData, setFormData] = useState({});
  
  const onChange = (event) => setFormData({
    ...formData,
    [event.params.name]: event.params.value,
  });

  return (
    <ThemeWrapper>
      <BasicForm
        formData={formData}
        onChange={onChange}
      />
    </ThemeWrapper>
  );
};
```

### Event Handlers

```javascript
import React from 'React';
import PropTypes from 'prop-types';
import { ActivityIndicator, Alert } from 'react-native';
import Form from 'react-native-jsonschema-form';

class MyForm extends React.Component {
  static propTypes = {
    controller: PropTypes.string.isRequired,
    action: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      schema: null,
      message: null,
      posting: null,
    };
  }

  onSubmit = async (event) => {
    const { action, controller } = this.props;
    const { values } = event.params;
    this.setState({ posting: true });
    return fetch(`/${controller}/${action}`, {
      method: 'POST',
      body: JSON.stringify(values),
    });
  };

  onSuccess = async (event) => {
    const { response } = event.params;
    this.setState({
      posting: false,
      message: response.message,
    });
  };

  onError = async (event) => {
    // These are errors for fields that are not included in the schema
    const { exceptions } = event.params;
    const warning = Object.keys(exceptions).map(k => exceptions[k].join('\n'));
    this.setState({
      posting: false,
      message: warning.length ? warning.join('\n') : null,
    });
  };

  render() {
    const { schema, posting, message } = this.state;
    if (!schema) {
      const self = this;
      fetch(`/get-schema/${controller}/${action}`)
        .then((schema) => self.setState({ schema });

      return <ActivityIndicator />;
    }

    return (
      <React.Fragment>
        {posting ? <ActivityIndicator /> : null}
        {message ? (
          <Alert>
            Message
          </Alert>
        ) : null}
        <Form
          schema={schema}
          onSubmit={this.onSubmit}
          onSuccess={this.onSuccess}
          onError={this.onError}
        />
      </React.Fragment>
    );
  }
}
```

### Custom Theme

There are 5 input states: `regular`, `focused`, `disabled`, `readonly` and `error`. On which one of them you can define styles for `background`, `border`, `text`, `placeholder`, `opacity`, `selected` and `unselected`. These properties will be used accordingly by the widgets provided in this library. For example, `selected` and `unselected` will be used checkboxes and radioboxes to represent checked and unchecked.

```javascript
const theme = {
  input: {
    focused: StyleSheet.create({
      border: {
        borderColor: 'yellow',
        borderWidth: 2,
        borderStyle: 'solid',
      },
      background: {
        backgroundColor: 'white',
      },
      text: {
        fontSize: 14,
        color: '#545454',
      },
      placeholder: {
        color: '#FAFAFA',
      },
      opacity: {
        opacity: 1,
      },
      selected: {
        color: 'blue',
      },
      unselected: {
        color: '#FAFAFA',
      },
    }),
    regular: {...},
    disabled: {...},
    readonly: {...},
    error: {...},
  },
};

const ThemeWrapper = ({ children }) => (
  <UIProvider theme={theme}>
    {children}
  </UIProvider>
);
```

## Props

The `Form` has the following props:

```javascript
import React from 'react';
import Form from 'react-native-jsonschema-form';

const Example = ({
  // Misc
  name, // String to be used as id, if empty a hash will be used instead.
  onRef, // Function to be called with the form instance. This is NOT a DOM/Native element.
  scroller, // If provided, this will be passed to the widgets to allow disabling ScrollView during a gesture.
  wigdets, // Object with a list of custom widgets.

  // Data
  formData, // Initial data to populate the form. If this attribute changes, the form will update the data.
  filterEmptyValues, // If true, all empty and non-required fields will be omitted from the submitted values.

  // Schema
  schema, // JSON schema
  uiSchema, // JSON schema modifying UI defaults for schema
  errorSchema, // JSON schema with errors
  
  // Events
  // * All events can be synchronous or asynchronous functions.
  // * All events receive one parameter `event` with `name`, `preventDefault()` and `params`.
  onFocus,
  onChange,
  onSubmit,
  onCancel,
  onSuccess,
  onError,

  // Layout
  buttonPosition, // left, right, center
  submitButton, // If false, it will not be rendered. If it is a string, it will be used as the default button text.
  cancelButton, // If false, it will not be rendered. If it is a string, it will be used as the default button text.
  SubmitButton, // Component to render the submit button
  CancelButton, // Component to render the cancel button
}) => (
  <Form {...}/>
)
```

## License

[MIT](https://moroshko.mit-license.org/)
