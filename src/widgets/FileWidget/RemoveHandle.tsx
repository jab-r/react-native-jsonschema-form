import React from 'react';
import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import Link from 'react-native-web-ui-components/Link';

interface Styles {
  handle: ViewStyle;
}

const styles = StyleSheet.create<Styles>({
  handle: {
    paddingLeft: 10,
    paddingTop: 11,
  },
});

interface RemoveHandleProps {
  theme: {
    colors: {
      primary: string;
    };
  };
  onRemovePress: () => void;
  removeLabel: React.ReactNode;
  removeStyle?: ViewStyle | TextStyle;
  [key: string]: any; // For other props that get spread
}

const RemoveHandle: React.FC<RemoveHandleProps> = ({
  theme,
  onRemovePress,
  removeLabel,
  removeStyle,
  ...props
}) => (
  <Link
    {...props}
    auto
    onPress={onRemovePress}
    style={[styles.handle, removeStyle]}
    type={theme.colors.primary}
  >
    {removeLabel}
  </Link>
);

RemoveHandle.defaultProps = {
  removeStyle: undefined,
};

export default RemoveHandle;
