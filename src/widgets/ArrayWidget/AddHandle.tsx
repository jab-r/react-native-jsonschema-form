import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';

interface Styles {
  button: ViewStyle;
  content: ViewStyle;
  icon: ViewStyle;
  text: TextStyle;
}

const styles = StyleSheet.create<Styles>({
  button: {
    marginVertical: 10,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  icon: {
    marginRight: 8,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
});

interface AddHandleProps {
  theme: {
    colors: {
      primary: string;
    };
  };
  onPress: () => void;
  addLabel: string;
}

const AddHandle: React.FC<AddHandleProps> = ({ theme, onPress, addLabel }) => (
  <TouchableOpacity 
    style={styles.button}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={[styles.content, { backgroundColor: theme.colors.primary }]}>
      <View style={styles.icon}>
        <Text style={styles.text}>+</Text>
      </View>
      <Text style={styles.text}>{addLabel}</Text>
    </View>
  </TouchableOpacity>
);

export default AddHandle;
