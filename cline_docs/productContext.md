# Product Context

## Purpose
This project exists to extend the react-jsonschema-form library to work seamlessly in React Native environments. It provides React Native-specific component implementations for form rendering.

## Problems Solved
- Bridges the gap between react-jsonschema-form and React Native
- Enables the use of JSON Schema forms in mobile applications
- Provides native mobile UI components (like `<Text>`) instead of web components
- Maintains compatibility with the core react-jsonschema-form functionality while adapting it for mobile use

## How It Works
- Acts as an extension/adapter layer for react-jsonschema-form
- Implements React Native versions of form components
- Preserves the JSON Schema form validation and structure
- Replaces web-specific components with their React Native equivalents
