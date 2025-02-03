import { StyleSheet, Pressable, Text, TextStyle, ViewStyle } from 'react-native';
import type { FC, ReactNode } from 'react';

interface Styles {
  handle: ViewStyle;
  text: TextStyle;
}

const styles = StyleSheet.create<Styles>({
  handle: {
    paddingLeft: 10,
    paddingTop: 11,
    justifyContent: 'center',
  },
  text: {
    fontSize: 14,
  },
});

interface HandleProps {
  theme: {
    colors: {
      primary: string;
    };
  };
  to?: string;
  onPress?: () => void;
  children?: ReactNode;
}

const Handle: FC<HandleProps> = ({ theme, onPress, children }) => (
  <Pressable
    onPress={onPress}
    style={styles.handle}
  >
    <Text style={[styles.text, { color: theme.colors.primary }]}>
      {children}
    </Text>
  </Pressable>
);

export default Handle;
