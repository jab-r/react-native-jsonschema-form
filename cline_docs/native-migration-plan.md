# React Native Migration Plan

## Overview
Converting from react-native-web-jsonschema-form to react-native-jsonschema-form by replacing web-specific components with React Native built-ins.

## Component Mapping

### Core Components to Replace
1. react-native-web-ui-components/View -> React Native View
2. react-native-web-ui-components/Text -> React Native Text
3. react-native-web-ui-components/TextInput -> React Native TextInput
4. react-native-web-ui-components/TouchableOpacity -> React Native TouchableOpacity
5. react-native-web-ui-components/ScrollView -> React Native ScrollView
6. react-native-web-ui-components/Button -> React Native Pressable/TouchableOpacity
7. react-native-web-ui-components/Link -> React Native Pressable with Text
8. react-native-web-ui-components/Row -> React Native View with flexDirection: 'row'
9. react-native-web-ui-components/Column -> React Native View with flexDirection: 'column'
10. react-native-web-ui-components/Screen -> React Native SafeAreaView
11. react-native-web-ui-components/StylePropType -> Remove (use TypeScript types instead)

### Complex Components to Rebuild
1. Dropzone -> Custom implementation using React Native Image Picker
2. Checkbox -> Custom implementation using React Native TouchableOpacity + View/Image
3. RadioBox -> Custom implementation using React Native TouchableOpacity + View/Image
4. Select -> React Native Picker
5. DatePicker -> React Native DatePickerIOS/DatePickerAndroid
6. TimeRangePicker -> Custom implementation using React Native DatePicker
7. Rating -> Custom implementation using React Native TouchableOpacity + Image
8. TagInput -> Custom implementation using React Native TextInput + View
9. Autocomplete -> Custom implementation using React Native TextInput + FlatList

## Implementation Steps

1. Core Setup ✓
   - Remove web-specific dependencies ✓
   - Update package.json ✓
   - Add React Native specific dependencies ✓
   - Update tsconfig.json for React Native ✓

2. Basic Components ✓
   - Text Components ✓
     - TextWidget ✓
     - TextInputWidget ✓
     - Handle Components ✓
   - Selection Components ✓
     - CheckboxWidget (TouchableOpacity + custom styling) ✓
     - RadioWidget (TouchableOpacity + circular styling) ✓
     - SelectWidget (@react-native-picker/picker) ✓

3. Form Components ✓
   - DateWidget (using @react-native-community/datetimepicker) ✓
   - TimeRangeWidget (custom implementation with DateTimePicker) ✓
   - EmailWidget (extend TextInputWidget with email keyboard) ✓
   - PasswordWidget (extend TextInputWidget with secure entry) ✓
   - PhoneWidget (extend TextInputWidget with phone keyboard) ✓
   - ZipWidget (extend TextInputWidget with number keyboard) ✓

4. Complex Components (Final Phase)
   - FileWidget (REMOVED - mobile platforms handle file operations differently)
     * Image picking -> Use native image picker
     * Document picking -> Use native document picker
     * File downloads -> Use platform file system
     * File previews -> Use platform viewers
   - ArrayWidget ✓
     * Native drag-and-drop with react-native-gesture-handler ✓
     * Platform-specific animations with react-native-reanimated ✓
     * Responsive layout with Dimensions API ✓
     * Custom item rendering with native components ✓
   - ObjectWidget ✓
     * Responsive grid system with flexbox ✓
     * Mobile-first layout with Dimensions API ✓
     * Platform-specific z-index handling ✓
     * TypeScript conversion with proper types ✓
   - AutocompleteWidget ✓
     * Efficient list rendering with FlatList ✓
     * Debounced search for performance ✓
     * Mobile-friendly dropdown UI ✓
     * Platform-specific animations ✓
     * Keyboard-aware implementation ✓
   - TagInputWidget ✓
     * Native TextInput with keyboard handling ✓
     * Mobile-friendly chip/tag UI ✓
     * Smooth animations with LayoutAnimation ✓
     * Support for object and primitive values ✓
     * Scrollable container for many tags ✓
   - RatingWidget ✓
     * Interactive star rating with TouchableOpacity ✓
     * Smooth animations with LayoutAnimation ✓
     * Press feedback with hover states ✓
     * Clear button for resetting rating ✓
     * Customizable styling and colors ✓

## Lessons Learned from Initial Conversions

1. Component Patterns
   - Replace Link components with Pressable + Text
   - Use View with flexDirection for Row/Column components
   - Platform-specific style adjustments needed for proper layout
   - Handle web-specific features carefully (e.g., selection in TextInput)

2. Style Adjustments
   - Border styles need explicit values in React Native
   - Use padding/margin for spacing instead of CSS-specific properties
   - Platform-specific style overrides may be needed
   - Theme system needs to be mobile-first

3. Event Handling
   - Replace onClick with onPress
   - Handle touch events differently than mouse events
   - Consider platform-specific interaction patterns
   - Implement proper keyboard handling

4. Platform Considerations
   - iOS and Android have different default behaviors
   - Web-specific features need mobile alternatives
   - Consider accessibility on both platforms
   - Test on both iOS and Android simulators

5. Testing & Validation
   - Update test suite for React Native
   - Add React Native specific tests
   - Validate on iOS and Android

## File Changes Required

### Package Updates
- package.json: Remove web dependencies
- tsconfig.json: Update for React Native
- metro.config.js: Configure for React Native

### Component Updates
1. src/widgets/*
   - Update all widget components
   - Remove web-specific code
   - Add platform-specific implementations

2. src/fields/*
   - Update field components
   - Remove web-specific styling

3. src/utils/*
   - Update utility functions
   - Add React Native specific helpers

4. src/types/*
   - Update TypeScript definitions
   - Add React Native specific types

## Dependencies to Remove
- react-native-web
- react-native-web-ui-components
- react-dom
- web-specific testing libraries

## Dependencies to Add
- @types/react-native
- react-native testing libraries
- platform-specific utilities

## Testing Strategy
1. Update Jest configuration for React Native
2. Add React Native Testing Library
3. Create platform-specific test suites
4. Add visual regression testing

## Migration Order
1. Start with basic components (View, Text)
2. Move to form inputs (TextInput)
3. Implement complex components
4. Update styling system
5. Add platform-specific optimizations

## Potential Challenges
1. Platform-specific behavior differences
2. Touch handling vs click events
3. Layout differences between web and native
4. File upload handling
5. Form validation differences
6. Accessibility implementation

## Success Criteria
1. All components work on iOS and Android
2. No web-specific code remains
3. All tests pass on both platforms
4. Maintains existing form functionality
5. Improved native performance
