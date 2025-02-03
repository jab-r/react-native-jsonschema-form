import React from 'react';
import {
  StyleSheet,
  Platform,
  TouchableOpacity,
  View,
  Text,
  ViewStyle,
  TextStyle,
} from 'react-native';

interface Styles {
  container: ViewStyle;
  checkbox: ViewStyle;
  checkmark: TextStyle;
}

const styles = StyleSheet.create<Styles>({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: Platform.select({
    ios: {
      width: 20,
      height: 20,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: '#007AFF',
      alignItems: 'center',
      justifyContent: 'center',
    },
    android: {
      width: 20,
      height: 20,
      borderRadius: 2,
      borderWidth: 2,
      borderColor: '#4CAF50',
      alignItems: 'center',
      justifyContent: 'center',
    },
    default: {
      width: 20,
      height: 20,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: '#007AFF',
      alignItems: 'center',
      justifyContent: 'center',
    },
  }),
  checkmark: Platform.select({
    ios: {
      color: '#007AFF',
      fontSize: 16,
      lineHeight: 20,
    },
    android: {
      color: '#4CAF50',
      fontSize: 16,
      lineHeight: 20,
    },
    default: {
      color: '#007AFF',
      fontSize: 16,
      lineHeight: 20,
    },
  }),
});

interface CheckBoxProps {
  value?: boolean;
  onValueChange?: (value: boolean) => void;
  style?: ViewStyle | ViewStyle[];
}

const CheckBox: React.FC<CheckBoxProps> = ({ 
  value = false,
  onValueChange = () => {},
  style,
}) => {
  const handlePress = () => {
    onValueChange(!value);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[styles.container, style]}
      activeOpacity={0.6}
    >
      <View style={styles.checkbox}>
        {value ? (
          <Text style={styles.checkmark}>✓</Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

export default CheckBox;
