import React from 'react';
import { StyleSheet, View, Text, ViewStyle, TextStyle } from 'react-native';

interface Styles {
  container: ViewStyle;
  order: ViewStyle & TextStyle;
  hidden: ViewStyle;
  xs: ViewStyle;
  icon: ViewStyle;
  iconText: TextStyle;
}

const styles = StyleSheet.create<Styles>({
  container: {
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  order: {
    fontSize: 15,
    textAlign: 'center',
    paddingVertical: 11,
    lineHeight: 23,
  },
  hidden: {
    opacity: 0,
    height: 0,
  },
  xs: {
    paddingTop: 0,
  },
  icon: {
    padding: 5,
  },
  iconText: {
    fontSize: 24,
    color: '#666',
  },
});

interface OrderHandleProps {
  theme: {
    colors: {
      text: string;
    };
  };
  screenType: string;
  handle: string;
  titleOnly: boolean;
  panHandlers?: any;
  orderLabel?: React.ReactNode;
  orderStyle?: ViewStyle | TextStyle;
}

const OrderHandle: React.FC<OrderHandleProps> = ({
  theme,
  titleOnly,
  screenType,
  orderStyle,
  panHandlers,
}) => {
  if (titleOnly) {
    return <View style={styles.hidden} />;
  }

  return (
    <View
      style={[
        styles.container,
        screenType === 'xs' ? styles.xs : undefined,
        orderStyle,
      ]}
      {...panHandlers}
    >
      <View style={styles.icon}>
        <Text style={[styles.iconText, { color: theme.colors.text }]}>⋮⋮</Text>
      </View>
    </View>
  );
};

OrderHandle.defaultProps = {
  orderLabel: undefined,
  orderStyle: undefined,
  panHandlers: undefined,
};

export default OrderHandle;
