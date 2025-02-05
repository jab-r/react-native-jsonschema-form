# Product Context

## Purpose
This project exists to extend the react-jsonschema-form library to work seamlessly in React Native environments. It provides React Native-specific component implementations for form rendering.

## Problems Solved
- Bridges the gap between react-jsonschema-form and React Native
- Enables the use of JSON Schema forms in mobile applications
- Provides specialized native mobile UI components:
  * Input components (like `<TextInput>`) for user interaction
  * Display components (like `<Text>`) for read-only content
- Maintains compatibility with the core react-jsonschema-form functionality while adapting it for mobile use

## How It Works
- Acts as an extension/adapter layer for react-jsonschema-form
- Implements React Native versions of form components
- Preserves the JSON Schema form validation and structure
- Provides purpose-specific widgets:
  * Input widgets for editable fields (TextInput, Number, etc.)
  * Display widgets for constant/read-only values
- Replaces web-specific components with their React Native equivalents
