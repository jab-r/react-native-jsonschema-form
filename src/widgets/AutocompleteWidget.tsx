import React, { useRef, useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
  ViewStyle,
  TextStyle,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { pick, isFunction, debounce } from 'lodash';
import type { OnChangeProps } from '../types/utils';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

interface Styles {
  container: ViewStyle;
  input: ViewStyle;
  listContainer: ViewStyle;
  itemContainer: ViewStyle;
  itemText: TextStyle;
  emptyResult: ViewStyle;
  emptyResultText: TextStyle;
  spinner: ViewStyle;
}

const styles = StyleSheet.create<Styles>({
  container: {
    position: 'relative',
    zIndex: 1,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#C7C7CC',
    borderRadius: 4,
    paddingHorizontal: 10,
  },
  listContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    maxHeight: 200,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#C7C7CC',
    borderRadius: 4,
    marginTop: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  itemContainer: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  itemText: {
    fontSize: 16,
  },
  emptyResult: {
    padding: 12,
    alignItems: 'center',
  },
  emptyResultText: {
    fontSize: 16,
    color: '#8E8E93',
  },
  spinner: {
    padding: 12,
    alignItems: 'center',
  },
});

interface AutocompleteWidgetProps extends OnChangeProps {
  name: string;
  value?: string;
  placeholder?: string;
  items?: any[];
  getItemValue?: (item: any) => string;
  onSelect?: (value: string, item: any) => void;
  isMatch?: (item: any, value: string) => boolean;
  itemHeight?: number;
  throttleDelay?: number;
  debounceDelay?: number;
  throttleDebounceThreshold?: number;
  allowEmpty?: boolean;
  style?: ViewStyle;
  inputStyle?: ViewStyle;
  menuStyle?: ViewStyle;
  itemStyle?: ViewStyle;
  disabled?: boolean;
  readonly?: boolean;
  hasError?: boolean;
}

const AutocompleteWidget: React.FC<AutocompleteWidgetProps> = (props) => {
  const {
    name,
    value = '',
    placeholder,
    items = [],
    getItemValue = (item: any) => item.toString(),
    onSelect,
    isMatch = (item: any, searchValue: string) => 
      getItemValue(item).toLowerCase().includes(searchValue.toLowerCase()),
    onChange,
    itemHeight = 44,
    throttleDelay = 0,
    debounceDelay = 100,
    throttleDebounceThreshold = 0,
    allowEmpty = true,
    style,
    inputStyle,
    menuStyle,
    itemStyle,
    disabled,
    readonly,
    hasError,
  } = props;

  const [inputValue, setInputValue] = useState(value);
  const [showResults, setShowResults] = useState(false);
  const [filteredItems, setFilteredItems] = useState<any[]>([]);
  const inputRef = useRef<TextInput>(null);

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((searchValue: string) => {
      const filtered = items.filter(item => isMatch(item, searchValue));
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setFilteredItems(filtered);
    }, debounceDelay),
    [items, isMatch]
  );

  const handleChangeText = (text: string) => {
    setInputValue(text);
    setShowResults(true);
    if (text.length >= throttleDebounceThreshold) {
      debouncedSearch(text);
    } else {
      setFilteredItems([]);
    }
    onChange(text, name);
  };

  const handleSelectItem = (item: any) => {
    const itemValue = getItemValue(item);
    setInputValue(itemValue);
    setShowResults(false);
    if (isFunction(onSelect)) {
      onSelect(itemValue, item);
    }
    onChange(itemValue, name);
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[styles.itemContainer, itemStyle]}
      onPress={() => handleSelectItem(item)}
    >
      <Text style={styles.itemText}>{getItemValue(item)}</Text>
    </TouchableOpacity>
  );

  const renderEmptyResult = () => (
    <View style={styles.emptyResult}>
      <Text style={styles.emptyResultText}>No results found</Text>
    </View>
  );

  return (
    <View style={[styles.container, style]}>
      <TextInput
        ref={inputRef}
        value={inputValue}
        onChangeText={handleChangeText}
        placeholder={placeholder}
        style={[
          styles.input,
          hasError && { borderColor: 'red' },
          inputStyle,
        ]}
        editable={!disabled && !readonly}
        autoCapitalize="none"
        autoCorrect={false}
      />
      {showResults && (
        <View style={[styles.listContainer, menuStyle]}>
          <FlatList
            data={filteredItems}
            renderItem={renderItem}
            keyExtractor={(item, index) => `${getItemValue(item)}-${index}`}
            getItemLayout={(_, index) => ({
              length: itemHeight,
              offset: itemHeight * index,
              index,
            })}
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={renderEmptyResult}
          />
        </View>
      )}
    </View>
  );
};

AutocompleteWidget.defaultProps = {
  value: '',
  placeholder: '',
  items: [],
  getItemValue: undefined,
  onSelect: undefined,
  isMatch: undefined,
  itemHeight: undefined,
  throttleDelay: undefined,
  debounceDelay: undefined,
  throttleDebounceThreshold: undefined,
  allowEmpty: undefined,
  style: undefined,
  inputStyle: undefined,
  menuStyle: undefined,
  itemStyle: undefined,
  disabled: false,
  readonly: false,
  hasError: false,
};

export default AutocompleteWidget;
