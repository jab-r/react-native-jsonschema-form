import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';

interface Styles {
  container: ViewStyle;
  remove: ViewStyle & TextStyle;
  hidden: ViewStyle;
  alignRight: ViewStyle;
  icon: ViewStyle;
  text: TextStyle;
}

const styles = StyleSheet.create<Styles>({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  remove: {
    paddingHorizontal: 10,
    paddingVertical: 11,
    flexDirection: 'row',
    alignItems: 'center',
  },
  hidden: {
    opacity: 0,
    height: 0,
  },
  alignRight: {
    width: '100%',
    alignItems: 'flex-end',
  },
  icon: {
    marginRight: 5,
  },
  text: {
    fontSize: 15,
  },
});

interface RemoveHandleProps {
  theme: {
    colors: {
      primary: string;
    };
  };
  onRemovePress: () => void;
  titleOnly: boolean;
  screenType: string;
  removeLabel: React.ReactNode;
  removeStyle?: ViewStyle | TextStyle;
}

const RemoveHandle: React.FC<RemoveHandleProps> = ({
  theme,
  onRemovePress,
  titleOnly,
  screenType,
  removeLabel,
  removeStyle,
}) => {
  if (titleOnly) {
    return <View style={styles.hidden} />;
  }

  const containerStyle = [
    styles.container,
    screenType === 'xs' && styles.alignRight,
  ];

  const buttonStyle = [
    styles.remove,
    removeStyle,
  ];

  return (
    <View style={containerStyle}>
      <TouchableOpacity
        onPress={onRemovePress}
        style={buttonStyle}
      >
        <View style={styles.icon}>
          <Text style={{ fontSize: 18, color: theme.colors.primary }}>✕</Text>
        </View>
        <Text style={[styles.text, { color: theme.colors.primary }]}>
          {removeLabel}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

RemoveHandle.defaultProps = {
  removeStyle: undefined,
};

export default RemoveHandle;
