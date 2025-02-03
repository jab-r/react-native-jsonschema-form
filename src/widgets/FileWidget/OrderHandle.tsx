import React from 'react';
import { StyleSheet, ViewStyle, TextStyle, GestureResponderHandlers } from 'react-native';
import View from 'react-native-web-ui-components/View';
import Text from 'react-native-web-ui-components/Text';
import Div from '../../Div';

interface Styles {
  order: ViewStyle & TextStyle;
}

const styles = StyleSheet.create<Styles>({
  order: {
    fontSize: 15,
    textAlign: 'center',
    paddingRight: 10,
    paddingTop: 11,
    lineHeight: 23,
  },
});

interface OrderHandleProps {
  handle: string;
  orderLabel: React.ReactNode;
  panHandlers?: GestureResponderHandlers;
  orderStyle?: ViewStyle | TextStyle;
}

const OrderHandle: React.FC<OrderHandleProps> = ({
  handle,
  panHandlers,
  orderLabel,
  orderStyle,
}) => (
  <View {...(panHandlers || {})}>
    <Div className={handle}>
      <Text
        className={handle}
        auto
        type="gray"
        style={[styles.order, orderStyle]}
      >
        {orderLabel}
      </Text>
    </Div>
  </View>
);

OrderHandle.defaultProps = {
  panHandlers: undefined,
  orderStyle: undefined,
};

export default OrderHandle;
