import React from 'react';
import { StyleSheet, View, ViewStyle, Dimensions } from 'react-native';
import { PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { get, omit, isArray } from 'lodash';

interface Styles {
  container: ViewStyle;
}

const styles = StyleSheet.create<Styles>({
  container: {
    width: '100%',
    alignItems: 'flex-start',
  },
});

interface Position {
  width: number;
  height: number;
  x: number;
  y: number;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const findNewIndex = (
  currentIndex: number,
  yPosition: number,
  itemHeight: number,
  totalItems: number
): number => {
  const newIndex = Math.round(yPosition / itemHeight);
  return Math.max(0, Math.min(newIndex, totalItems - 1));
};

export interface DraggableItemProps {
  name: string;
  orderable?: boolean;
  removable?: boolean;
  titleOnly?: boolean;
  uiSchema: Record<string, any>;
  style?: ViewStyle | ViewStyle[];
  axis?: 'x' | 'y' | 'both';
  Item: React.ComponentType<any>;
  value: any[];
  index: number;
  zIndex: number;
  onChange: (value: any[], name: string, options: { nextMeta: any[] | false; nextErrors: any[] | false }) => void;
  onRemove: (index: number) => void;
  onItemRef: (ref: any, index: number) => void;
  reorder: () => void;
  setDragging: (index: number | null) => void;
  errors: any[];
  meta: any[];
  positions: Position[];
  refs: any[];
  PropertyField: React.ComponentType<any>;
  noTitle?: boolean;
  orderLabel?: React.ReactNode;
  removeLabel?: React.ReactNode;
  orderStyle?: ViewStyle;
  removeStyle?: ViewStyle;
  OrderComponent: React.ComponentType<any>;
  RemoveComponent: React.ComponentType<any>;
  theme: {
    colors: {
      primary: string;
      text: string;
    };
  };
}

const DraggableItem: React.FC<DraggableItemProps> = (props) => {
  const {
    name,
    orderable,
    titleOnly,
    uiSchema,
    style,
    Item,
    value,
    index,
    onChange,
    errors,
    meta,
    setDragging,
    reorder,
    zIndex,
  } = props;

  const translateY = useSharedValue(0);
  const itemHeight = useSharedValue(100); // Default height, will be updated on layout
  const isDragging = useSharedValue(false);

  const onLayout = (event: any) => {
    itemHeight.value = event.nativeEvent.layout.height;
  };

  const panGesture = useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
    onStart: () => {
      isDragging.value = true;
      runOnJS(setDragging)(index);
    },
    onActive: (event) => {
      translateY.value = event.translationY;
    },
    onEnd: () => {
      const finalPosition = translateY.value;
      const newIndex = findNewIndex(index, finalPosition, itemHeight.value, value.length);
      
      if (newIndex !== index) {
        let nextValue = [...value];
        let nextMeta = [...(isArray(meta) ? meta : [])];
        let nextErrors = [...(isArray(errors) ? errors : [])];

        // Move item to new position
        const [movedItem] = nextValue.splice(index, 1);
        nextValue.splice(newIndex, 0, movedItem);

        if (nextMeta.length) {
          const [movedMeta] = nextMeta.splice(index, 1);
          nextMeta.splice(newIndex, 0, movedMeta);
        }

        if (nextErrors.length) {
          const [movedError] = nextErrors.splice(index, 1);
          nextErrors.splice(newIndex, 0, movedError);
        }

        runOnJS(onChange)(nextValue, name, {
          nextMeta: nextMeta.length ? nextMeta : false,
          nextErrors: nextErrors.length ? nextErrors : false,
        });
        runOnJS(reorder)();
      }

      translateY.value = withSpring(0);
      isDragging.value = false;
      runOnJS(setDragging)(null);
    },
  });

  const rStyle = useAnimatedStyle(() => {
    const scale = isDragging.value ? 1.05 : 1;

    return {
      zIndex,
      transform: [
        { translateY: translateY.value },
        { scale },
      ],
    };
  });

  if (!orderable || titleOnly) {
    return (
      <View style={[styles.container, get(uiSchema, ['ui:widgetProps', 'style'], null)]}>
        <Item {...props} />
      </View>
    );
  }

  return (
    <PanGestureHandler enabled={orderable && !titleOnly} onGestureEvent={panGesture}>
      <Animated.View 
        style={[
          styles.container,
          get(uiSchema, ['ui:widgetProps', 'style'], null),
          rStyle,
        ]}
        onLayout={onLayout}
      >
        <Item {...props} />
      </Animated.View>
    </PanGestureHandler>
  );
};

export default DraggableItem;
