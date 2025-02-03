import React from 'react';
import { StyleSheet, View, Dimensions, Platform, ViewStyle, TextStyle } from 'react-native';
import { omit, isString, isArray } from 'lodash';
import { getComponent, withPrefix } from '../../utils';

interface Styles {
  labelTop: TextStyle;
  label: TextStyle;
  grid: ViewStyle;
  item: ViewStyle;
  row: ViewStyle;
  column: ViewStyle;
}

const styles = StyleSheet.create<Styles>({
  labelTop: {
    fontWeight: 'bold',
    paddingBottom: 5,
  },
  label: {
    fontWeight: 'bold',
    paddingTop: 10,
    paddingBottom: 5,
  },
  grid: {
    marginLeft: -10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  item: {
    paddingLeft: 10,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
  },
  column: {
    flexDirection: 'column',
  },
});

const attributes = ['type', 'children', 'style', 'columns'];

const isSmallScreen = (): boolean => {
  const { width } = Dimensions.get('window');
  return width < 576; // xs breakpoint
};

const getMeta = (schema: { type: string }): any[] | Record<string, any> => {
  if (schema.type === 'array') {
    return [];
  }
  return {};
};

interface GridItemType {
  type: 'grid' | 'column' | 'row' | 'label';
  children: (string | GridItemType)[];
  columns?: any[];
  style?: ViewStyle | ViewStyle[];
  onPress?: () => void;
}

interface PropertyParams {
  name: string;
  schema: {
    properties: Record<string, any>;
    type: string;
  };
  fields: Record<string, React.ComponentType<any>>;
  widgets: {
    LabelWidget: React.ComponentType<any>;
  };
}

interface PropertyProps {
  value: any;
  meta: any;
  errors: any;
  uiSchema: Record<string, any>;
  [key: string]: any;
}

type ComponentWithKey<P = any> = React.ComponentType<P> & { key?: string };

const createProperty = (
  property: string,
  gridItem: GridItemType,
  index: number,
  params: PropertyParams
): ComponentWithKey<PropertyProps> => {
  const {
    name,
    schema,
    fields,
  } = params;
  const propertySchema = schema.properties[property];
  const propertyName = withPrefix(property, name);

  if (!propertySchema) {
    const UnexistentProperty: ComponentWithKey = () => null;
    UnexistentProperty.key = propertyName;
    return UnexistentProperty;
  }

  const PropertyComponent = getComponent(propertySchema.type, 'Field', fields);
  if (!PropertyComponent) {
    const UnexistentPropertyComponent: ComponentWithKey = () => null;
    UnexistentPropertyComponent.key = propertyName;
    return UnexistentPropertyComponent;
  }

  let PropertyContainer: typeof View | typeof React.Fragment;
  let propertyContainerProps: Record<string, any>;
  if (gridItem.type === 'grid') {
    const columns = gridItem.columns || [];
    const column = (isArray(columns) ? columns[index] : columns) || {};
    PropertyContainer = View;
    propertyContainerProps = {
      ...column,
      style: [
        !isSmallScreen() ? styles.item : null,
        Platform.select({
          ios: { zIndex: gridItem.children.length - index },
          android: {},
          default: { zIndex: gridItem.children.length - index },
        }),
        column.style || null,
      ],
    };
  } else {
    PropertyContainer = React.Fragment;
    propertyContainerProps = {};
  }

  const Property: ComponentWithKey<PropertyProps> = ({
    value,
    meta,
    errors,
    uiSchema,
    ...props
  }) => (
    <PropertyContainer key={propertyName} {...propertyContainerProps}>
      <PropertyComponent
        {...props}
        value={value && value[property]}
        meta={(meta && meta[property]) || getMeta(propertySchema)}
        errors={errors && errors[property]}
        name={propertyName}
        schema={propertySchema}
        uiSchema={uiSchema[property]}
        gridItemType={gridItem.type}
        gridItemIndex={index}
        gridItemLength={gridItem.children.length}
        zIndex={gridItem.children.length - index}
      />
    </PropertyContainer>
  );
  Property.key = propertyName;
  return Property;
};

interface LabelComponentProps {
  key: string;
  first: boolean;
  params: PropertyParams;
  gridItem: GridItemType;
}

const getLabelComponent = ({
  key,
  first,
  params,
  gridItem,
}: LabelComponentProps): ComponentWithKey => {
  const { widgets } = params;
  const Widget = widgets.LabelWidget;
  const Label: ComponentWithKey = props => (
    <Widget
      {...props}
      {...omit(gridItem, attributes)}
      key={key}
      hasError={false}
      hasTitle
      toggleable={false}
      onPress={gridItem.onPress || undefined}
      style={[first ? styles.labelTop : styles.label, gridItem.style]}
    >
      {gridItem.children}
    </Widget>
  );
  Label.key = key;
  return Label;
};

interface GeneralComponentProps {
  gridItem: GridItemType;
  key: string;
  zIndex: number;
  params: PropertyParams;
  first?: boolean;
}

const getGeneralComponent = ({
  gridItem,
  key,
  zIndex,
  params,
}: GeneralComponentProps): ComponentWithKey => {
  const containerStyle = gridItem.type === 'column' ? styles.column : styles.row;
  const gridStyle = !isSmallScreen() && gridItem.type === 'grid' ? styles.grid : null;
  const items = gridItem.children.map((child, i) => {
    if (isString(child)) {
      return createProperty(child, gridItem, i, params);
    }
    return createGridItem({
      params,
      gridItem: child,
      key: `${key}-${i}`,
      zIndex: gridItem.children.length - i,
      first: i === 0,
    });
  });

  const GridItem: ComponentWithKey = props => (
    <View
      {...omit(gridItem, attributes)}
      style={[
        containerStyle,
        gridItem.style,
        Platform.select({
          ios: { zIndex },
          android: {},
          default: { zIndex },
        }),
        gridStyle,
      ]}
    >
      {items.map(Child => <Child key={Child.key} {...props} />)}
    </View>
  );
  GridItem.key = key;
  return GridItem;
};

const createGridItem = (props: GeneralComponentProps): ComponentWithKey => {
  const { gridItem } = props;
  if (gridItem.type === 'label') {
    return getLabelComponent(props as LabelComponentProps);
  }
  return getGeneralComponent(props);
};

const createGrid = (grid: GridItemType[], params: PropertyParams): React.ComponentType<{ style?: ViewStyle | ViewStyle[] }> => {
  const items = grid.map((gridItem, i) => createGridItem({
    params,
    gridItem,
    first: i === 0,
    zIndex: grid.length - i,
    key: `${params.name}-${i}`,
  }));

  return (props: { style?: ViewStyle | ViewStyle[] }) => {
    const currentStyle = props.style;
    return (
      <View style={[styles.row, currentStyle]}>
        {items.map(GridItem => <GridItem key={GridItem.key} {...props} />)}
      </View>
    );
  };
};

export default createGrid;
