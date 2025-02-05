# System Patterns

## Architecture
- Extension-based architecture that builds on react-jsonschema-form
- Component-based structure following React Native patterns
- Adapter pattern to convert web components to native equivalents
- Theme-based customization system

## Key Technical Decisions
1. TypeScript Implementation
   - Ensures type safety
   - Provides better developer experience
   - Enables better IDE support
   - Custom type definitions for RJSF integration

2. Component Structure
   - Base components extend from react-jsonschema-form
   - React Native specific implementations
   - Separation of concerns between form logic and UI
   - Modular widget system

3. Testing Strategy
   - Jest for unit testing
   - React Native Testing Library for component testing
   - Integration tests for form validation
   - Snapshot testing for UI components

## Design Patterns
1. Adapter Pattern
   - Converting web components to React Native equivalents
   - Maintaining consistent form behavior
   - Platform-specific style adaptations
   - Native input handling

2. Factory Pattern
   - Dynamic component creation based on schema
   - Flexible field type mapping
   - Custom widget registration
   - Theme-based component generation

3. Observer Pattern
   - Form state management
   - Field validation updates
   - Error handling and propagation
   - Form submission lifecycle

4. Theme Pattern
   - Centralized theme configuration
   - Component-specific styling
   - Platform-aware styling
   - Style composition system
   - UI Schema customization support
   - Props propagation through theme system

## Code Organization
```
src/
├── components/     # React Native form components
│   └── Form.tsx   # Main form component
├── widgets/       # Form input widgets
│   ├── TextInputWidget.tsx
│   └── index.ts
├── templates/     # Layout templates
│   ├── FieldTemplate.tsx
│   ├── ObjectFieldTemplate.tsx
│   └── index.ts
├── theme/         # Theme system
│   └── index.tsx
├── types/         # TypeScript definitions
│   └── index.ts
└── utils/         # Utility functions
```

## Implementation Patterns
1. Widget Implementation
   - Extend from base RJSF widget types (WidgetProps)
   - Handle platform-specific input behavior
   - Implement error display with consistent styling
   - Support theme customization
   - Loading state management
   - Mobile-first interaction patterns
   - Input validation patterns:
     * Schema-based constraints (min/max, pattern)
     * Real-time validation feedback
     * Input prevention for invalid values
     * Consistent error display
   - Common widget patterns:
     * Use Pressable for custom touch interactions (Checkbox, Radio)
     * Native components for platform-specific behavior (Switch, Picker)
     * Consistent error message display below widgets
     * Standardized disabled/readonly states
     * Proper accessibility implementation
     * Touch-friendly hit areas
     * Visual feedback on interaction

2. Template Implementation
   - Consistent layout structure
   - Error message handling
   - Help text display
   - Required field indication

3. Theme Implementation
   - Base styles for all components
   - Widget-specific styling
   - Platform-specific adjustments
   - Style composition utilities

4. Form Validation
   - Schema-based validation
   - Custom validation rules
   - Real-time validation
   - Error message formatting
   - Input-level validation:
     * Numeric constraints (min/max values)
     * Text pattern matching (regex)
     * Real-time input validation
     * Immediate user feedback
     * Constraint-based input prevention
   - Widget-specific validation:
     * NumberWidget: Range validation
     * TextInputWidget: Pattern matching for input fields
     * TextWidget: Display-only for constant text values
     * Common validation display patterns
