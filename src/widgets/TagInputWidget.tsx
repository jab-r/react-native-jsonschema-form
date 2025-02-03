import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  ScrollView,
  ViewStyle,
  TextStyle,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { noop, isFunction } from 'lodash';
import { JSONSchema7 } from 'json-schema';
import { useOnChange, useAutoFocus } from '../utils';
import type { OnChangeProps } from '../types/utils';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

interface Styles {
  container: ViewStyle;
  inputContainer: ViewStyle;
  input: ViewStyle;
  tagsContainer: ViewStyle;
  tag: ViewStyle;
  tagText: TextStyle;
  removeTag: ViewStyle;
  removeTagText: TextStyle;
  error: ViewStyle;
}

const styles = StyleSheet.create<Styles>({
  container: {
    width: '100%',
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: '#C7C7CC',
    borderRadius: 4,
    minHeight: 40,
  },
  input: {
    height: 40,
    paddingHorizontal: 10,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 5,
  },
  tag: {
    backgroundColor: '#E5E5EA',
    borderRadius: 15,
    paddingVertical: 5,
    paddingLeft: 10,
    paddingRight: 25,
    margin: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagText: {
    fontSize: 14,
    color: '#000000',
  },
  removeTag: {
    position: 'absolute',
    right: 5,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#C7C7CC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeTagText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
    marginTop: -1,
  },
  error: {
    borderColor: 'red',
  },
});

const parseValue = (type: string, text: string): string | number => {
  if (type === 'number' || type === 'integer') {
    return parseFloat(text);
  }
  return text;
};

interface TagInputWidgetProps extends OnChangeProps {
  name: string;
  schema: JSONSchema7 & {
    type: 'array';
    items: {
      type: string;
      properties?: Record<string, { type: string }>;
    };
  };
  uiSchema: Record<string, any>;
  value?: any[];
  buildNew?: (text: string) => any;
  getItemValue?: (item: any) => string;
  placeholder?: string;
  style?: ViewStyle;
  auto?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  hasError?: boolean;
}

const TagInputWidget: React.FC<TagInputWidgetProps> = (props) => {
  const {
    name,
    schema,
    value = [],
    buildNew,
    getItemValue,
    placeholder,
    onChange,
    style,
    auto,
    disabled,
    readonly,
    hasError,
  } = props;

  const [inputValue, setInputValue] = useState('');
  const autoFocusParams = useAutoFocus(props);
  const onWrappedChange = useOnChange(props);

  if (schema.type !== 'array') {
    throw new Error('TagInputWidget can only be used with arrays.');
  }

  const buildNewValue = useCallback((text: string) => {
    if (isFunction(buildNew)) {
      return buildNew(text);
    }
    if (schema.items.type === 'object' && schema.items.properties) {
      const [attribute] = Object.keys(schema.items.properties);
      const { type } = schema.items.properties[attribute];
      return { [attribute]: parseValue(type, text) };
    }
    return parseValue(schema.items.type, text);
  }, [schema, buildNew]);

  const getDisplayValue = useCallback((item: any): string => {
    if (isFunction(getItemValue)) {
      return getItemValue(item);
    }
    if (schema.items.type === 'object' && schema.items.properties) {
      const [attribute] = Object.keys(schema.items.properties);
      return String(item[attribute]);
    }
    return String(item);
  }, [schema, getItemValue]);

  const handleSubmitEditing = () => {
    if (inputValue.trim()) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      const newValue = buildNewValue(inputValue.trim());
      onWrappedChange([...value, newValue]);
      setInputValue('');
    }
  };

  const handleRemoveTag = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const newValue = value.filter((_: any, i: number) => i !== index);
    onWrappedChange(newValue);
  };

  return (
    <View style={[styles.container, !auto && { marginBottom: 10 }, style]}>
      <View style={[styles.inputContainer, hasError && styles.error]}>
        <ScrollView
          horizontal={false}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.tagsContainer}>
            {value.map((item: any, index: number) => (
              <View key={`${index}-${getDisplayValue(item)}`} style={styles.tag}>
                <Text style={styles.tagText}>{getDisplayValue(item)}</Text>
                {!disabled && !readonly && (
                  <TouchableOpacity
                    style={styles.removeTag}
                    onPress={() => handleRemoveTag(index)}
                  >
                    <Text style={styles.removeTagText}>×</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
          {!disabled && !readonly && (
            <TextInput
              {...autoFocusParams}
              style={styles.input}
              value={inputValue}
              onChangeText={setInputValue}
              onSubmitEditing={handleSubmitEditing}
              placeholder={placeholder}
              placeholderTextColor="#999999"
              autoCapitalize="none"
              autoCorrect={false}
              blurOnSubmit={false}
            />
          )}
        </ScrollView>
      </View>
    </View>
  );
};

TagInputWidget.defaultProps = {
  value: [],
  buildNew: undefined,
  getItemValue: undefined,
  placeholder: '',
  style: undefined,
  auto: false,
  disabled: false,
  readonly: false,
  hasError: false,
};

export default TagInputWidget;
