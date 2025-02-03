# Technical Context

## Technology Stack

### Core Technologies
- React 18.2.0
- React Native Web 0.19.9
- TypeScript 5.3.3
- JSON Schema 7

### Development Dependencies
- Babel 7.x for transpilation
- ESLint 8.x for code linting
- Jest 29.x for testing
- Testing Library for React components

## Development Environment

### Build Tools
```json
{
  "build": "tsc",
  "lint": "eslint src --ext .ts,.tsx",
  "lint:fix": "eslint src --ext .ts,.tsx --fix",
  "test": "jest",
  "test:watch": "jest --watch",
  "test:coverage": "jest --coverage",
  "prepare": "npm run build"
}
```

### Configuration Files
- `.babelrc` - Babel configuration
- `.eslintrc` - ESLint rules
- `tsconfig.json` - TypeScript settings
- `jest.config.js` - Jest test configuration
- `jest.setup.js` - Jest environment setup

## Type System

### Key Type Definitions
- `JSONSchema7` - JSON Schema type definitions
- `FormProps` - Form component props
- `FieldProps` - Field component props
- `WidgetProps` - Widget component props
- `UISchema` - UI customization schema

### Type Extensions
- Custom type declarations for third-party libraries
- React Native Web type augmentations
- Testing Library type support

## Testing Infrastructure

### Test Setup
- Jest as test runner
- React Testing Library for components
- Jest DOM for DOM testing
- Coverage thresholds set to 80%

### Test Types
- Unit tests for utilities
- Component tests
- Integration tests
- Type testing

## Dependencies

### Production Dependencies
```json
{
  "json-schema": "^0.4.0",
  "lodash": "^4.17.21",
  "react": "^18.2.0",
  "react-native-web": "^0.19.9",
  "react-native-web-ui-components": "^1.0.0",
  "underscore.string": "^3.3.6"
}
```

### Development Dependencies
- TypeScript tooling
- Testing frameworks
- Build tools
- Code quality tools

## Browser Support
- Modern browsers (last 2 versions)
- Mobile browsers
- React Native Web compatibility

## Performance Considerations
- Bundle size optimization
- React performance best practices
- Mobile-first development
- Cross-platform compatibility
