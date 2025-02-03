import React, { useRef, useMemo } from 'react';
import { ViewStyle } from 'react-native';
import { JSONSchema7, JSONSchema7TypeName } from 'json-schema';
import createGrid from './createGrid';

interface ObjectSchema extends Omit<JSONSchema7, 'type' | 'properties'> {
  type: JSONSchema7TypeName;
  properties: Record<string, any>;
}

interface ObjectWidgetProps {
  schema: ObjectSchema;
  uiSchema: {
    'ui:grid'?: Array<{
      type: 'column';
      xs: number;
      children: string[];
    }>;
    [key: string]: any;
  };
  clearCache: boolean;
  style?: ViewStyle | ViewStyle[];
  value?: any;
  meta?: any;
  errors?: any;
  name: string; // Required
  fields?: Record<string, React.ComponentType<any>>;
  widgets?: {
    LabelWidget: React.ComponentType<any>;
  };
}

type GridComponent = React.ComponentType<{ style?: ViewStyle | ViewStyle[] }>;

const ObjectWidget: React.FC<ObjectWidgetProps> = (props) => {
  const {
    schema,
    uiSchema,
    clearCache,
    name,
    fields,
    widgets,
    ...rest
  } = props;

  const gridRef = useRef<GridComponent | null>(null);

  const Grid = useMemo(() => {
    if (clearCache) {
      gridRef.current = null;
    }

    if (!gridRef.current) {
      const grid = uiSchema['ui:grid'] || [{
        type: 'column',
        xs: 12,
        children: Object.keys(schema.properties),
      }];
      gridRef.current = createGrid(grid, {
        name,
        schema: {
          type: schema.type,
          properties: schema.properties,
        },
        fields: fields || {},
        widgets: widgets || { LabelWidget: () => null },
      });
    }

    return gridRef.current;
  }, [clearCache, schema, uiSchema, name, fields, widgets]);

  if (!Grid) {
    return null;
  }

  return <Grid {...rest} />;
};

ObjectWidget.defaultProps = {
  style: undefined,
  value: undefined,
  meta: undefined,
  errors: undefined,
  fields: undefined,
  widgets: undefined,
};

export default ObjectWidget;
