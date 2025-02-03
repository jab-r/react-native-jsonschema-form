import React from 'react';
import { StyleSheet, View, ViewStyle, Dimensions } from 'react-native';
import { noop, get } from 'lodash';
import RemoveHandle from './RemoveHandle';

interface Styles {
  main: ViewStyle;
  row: ViewStyle;
  container: ViewStyle;
  itemContainer: ViewStyle;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isSmallScreen = SCREEN_WIDTH < 768; // xs breakpoint

const styles = StyleSheet.create<Styles>({
  main: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  container: {
    width: '100%',
    alignItems: 'flex-start',
  },
  itemContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
});

interface ItemProps {
  onItemRef: (ref: any) => void;
  panHandlers?: Record<string, any>;
  style?: ViewStyle | ViewStyle[];
  zIndex: number;
  itemStyle?: ViewStyle | ViewStyle[];
  propertyName: string;
  propertyValue?: any;
  propertySchema: Record<string, any>;
  propertyMeta: any;
  propertyErrors?: any;
  PropertyField: React.ComponentType<any>;
  RemoveComponent: React.ComponentType<any>;
  OrderComponent: React.ComponentType<any>;
  value: any[];
  index: number;
  auto?: boolean;
  removable: boolean;
  orderable: boolean;
  screenType: string;
  propertyUiSchema: Record<string, any>;
  uiSchema?: Record<string, any>;
}

const Item: React.FC<ItemProps> = ({
  onItemRef,
  panHandlers,
  style,
  zIndex,
  itemStyle,
  propertyName,
  propertyValue,
  propertySchema,
  propertyMeta,
  propertyErrors,
  PropertyField,
  RemoveComponent,
  OrderComponent,
  ...props
}) => {
  const {
    value,
    index,
    auto,
    removable,
    orderable,
    screenType,
    propertyUiSchema,
  } = props;

  const containerStyle = [
    styles.container,
    get(propertyUiSchema, ['ui:widgetProps', 'style'], null),
    { zIndex },
    itemStyle,
    style,
  ];

  const renderMainContent = () => (
    <View ref={onItemRef} style={auto ? undefined : styles.main}>
      <PropertyField
        {...props}
        name={propertyName}
        schema={propertySchema}
        uiSchema={propertyUiSchema}
        errors={propertyErrors}
        value={propertyValue}
        meta={propertyMeta}
      />
    </View>
  );

  const renderRemoveButton = () => {
    if (!removable) return null;
    if (isSmallScreen && RemoveComponent === RemoveHandle) {
      return <RemoveComponent {...props} />;
    }
    return null;
  };

  return (
    <>
      <View style={containerStyle}>
        <View style={styles.itemContainer}>
          {orderable && <OrderComponent {...props} panHandlers={panHandlers} />}
          {renderMainContent()}
          {removable && (!isSmallScreen || RemoveComponent !== RemoveHandle) && (
            <RemoveComponent {...props} />
          )}
        </View>
      </View>
      {renderRemoveButton()}
    </>
  );
};

Item.defaultProps = {
  panHandlers: {},
  auto: false,
  style: {},
  itemStyle: {},
  propertyErrors: undefined,
  propertyValue: undefined,
  uiSchema: {},
};

export default Item;
