import React, { useState } from 'react';
import { StyleSheet, View, Dimensions, ViewStyle } from 'react-native';
import { JSONSchema7, JSONSchema7TypeName } from 'json-schema';
import {
  noop,
  each,
  last,
  times,
  isArray,
  isFunction,
} from 'lodash';
import { titleize } from 'underscore.string';
import {
  getTitle,
  getTitleFormat,
  getComponent,
} from '../../utils';
import AddHandle from './AddHandle';
import OrderHandle from './OrderHandle';
import RemoveHandle from './RemoveHandle';
import Item from './Item';
import DraggableItem, { DraggableItemProps } from './DraggableItem';

interface Styles {
  defaults: ViewStyle;
  fullWidth: ViewStyle;
  auto: ViewStyle;
  container: ViewStyle;
  label: ViewStyle;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isSmallScreen = SCREEN_WIDTH < 768; // xs breakpoint

const styles = StyleSheet.create<Styles>({
  defaults: {
    marginBottom: 10,
  },
  fullWidth: {
    width: '100%',
  },
  auto: {
    marginBottom: 0,
  },
  container: {
    width: '100%',
  },
  label: {
    paddingTop: 10,
    paddingBottom: 5,
  },
});

const uiTitleRegex = /\.ui_/;

interface SchemaType extends JSONSchema7 {
  type: JSONSchema7TypeName;
  items: {
    type: JSONSchema7TypeName;
  };
  title?: string;
}

const getItem = (schema: SchemaType): any => {
  if (schema.items.type === 'object') {
    return {};
  } else if (schema.items.type === 'array') {
    return [];
  }
  return '';
};

const formatTitle = (title: string) => titleize(title).replace(/ies$/, 'y').replace(/s$/, '');

const iterateUiSchema = (uiSchema: any, i: number) => {
  const widgetProps = uiSchema['ui:widgetProps'] || {};
  const titleProps = uiSchema['ui:titleProps'] || {};
  const errorProps = uiSchema['ui:errorProps'] || {};
  return {
    ...uiSchema,
    'ui:widgetProps': isArray(widgetProps) ? (widgetProps[i] || {}) : widgetProps,
    'ui:titleProps': isArray(titleProps) ? (titleProps[i] || {}) : titleProps,
    'ui:errorProps': isArray(errorProps) ? (errorProps[i] || {}) : errorProps,
  };
};

const adjustUiSchema = (possibleUiSchema: any, i: number, props: any) => {
  let uiSchema = possibleUiSchema;
  if (isFunction(possibleUiSchema['ui:iterate'])) {
    uiSchema = possibleUiSchema['ui:iterate'](i, props);
  }
  const adjustedUiSchema = iterateUiSchema(uiSchema, i);
  each(uiSchema, (uis, key) => {
    if (!/^ui:/.test(key)) {
      adjustedUiSchema[key] = iterateUiSchema(uis, i);
    }
  });
  return adjustedUiSchema;
};

interface ArrayWidgetProps {
  name: string;
  schema: SchemaType;
  fields: any;
  uiSchema: any;
  value?: any[];
  meta?: any[];
  errors?: any[];
  widgets: {
    LabelWidget: React.ComponentType<any>;
  };
  theme: {
    colors: {
      primary: string;
      text: string;
    };
  };
  onChange: (value: any[], name: string, options: { nextMeta: any[] | false; nextErrors: any[] | false }) => void;
  style?: ViewStyle;
}

interface ArrayWidgetState {
  refs: any[];
  positions: any[];
  review: number;
  dragging: number | null;
}

const ArrayWidget: React.FC<ArrayWidgetProps> = (props) => {
  const [state, setState] = useState<ArrayWidgetState>({
    refs: [],
    positions: [],
    review: 0,
    dragging: null,
  });

  const {
    name,
    schema,
    fields,
    uiSchema,
    value = [],
    meta,
    errors,
    widgets,
    onChange,
    style,
  } = props;

  const { LabelWidget } = widgets;
  const hasError = isArray(errors) && errors.length > 0 && (errors as any).hidden !== true;
  const hasTitle = uiSchema['ui:title'] !== false;
  const toggleable = !!uiSchema['ui:toggleable'];

  const titleFormat = getTitleFormat(schema, uiSchema);
  const title = titleFormat !== false ? getTitle(titleFormat, {
    name,
    value: value.toString(),
    key: last(name.split('.')),
  }) : '';

  const propertySchema = schema.items;
  const propertyUiSchema = uiSchema.items;
  const PropertyField = getComponent(propertySchema.type, 'Field', fields) as React.ComponentType<any>;
  const options = uiSchema['ui:options'] || {};

  const minimumNumberOfItems = (
    options.minimumNumberOfItems === undefined
    || options.minimumNumberOfItems === null
  ) ? 1 : options.minimumNumberOfItems;

  const addLabel = options.addLabel || `Add ${formatTitle(title)}`;
  const removeLabel = options.removeLabel || 'Delete';
  const orderLabel = options.orderLabel || '≡';
  const removeStyle = options.removeStyle;
  const orderStyle = options.orderStyle;
  const addable = options.addable !== false;
  const removable = options.removable !== false;
  const orderable = options.orderable !== false;

  const setDragging = (dragging: number | null) => {
    setState(current => ({ ...current, dragging }));
  };

  const reorder = () => setState({
    refs: [],
    positions: [],
    review: state.review + 1,
    dragging: null,
  });

  const onAdd = () => {
    let nextValue;
    let nextMeta = meta ? [...meta] : [];
    if (value.length < minimumNumberOfItems) {
      nextValue = value.concat(times(minimumNumberOfItems - value.length + 1, () => getItem(schema)));
      if (meta) {
        nextMeta = nextMeta.concat(times(minimumNumberOfItems - value.length + 1, () => ({})));
      }
    } else {
      nextValue = value.concat([getItem(schema)]);
      if (meta) {
        nextMeta = nextMeta.concat([{}]);
      }
    }
    onChange(nextValue, name, {
      nextMeta: nextMeta.length ? nextMeta : false,
      nextErrors: false,
    });
  };

  const onRemove = (index: number) => {
    const nextValue = (isArray(value) ? value : []).filter((v, i) => (i !== index));
    let nextMeta = (isArray(meta) ? meta : []);
    if (nextMeta) {
      nextMeta = nextMeta.filter((v, i) => (i !== index));
    }
    let nextErrors = (isArray(errors) ? errors : []);
    if (nextErrors) {
      nextErrors = nextErrors.filter((v, i) => (i !== index));
    }
    onChange(nextValue, name, {
      nextMeta: nextMeta.length ? nextMeta : false,
      nextErrors: nextErrors.length ? nextErrors : false,
    });
    setTimeout(reorder);
  };

  const onItemRef = (ref: any, index: number) => {
    state.refs[index] = ref;
  };

  const missingItems = Math.max(0, minimumNumberOfItems - value.length);

  const commonDraggableProps: Partial<DraggableItemProps> = {
    reorder,
    onRemove,
    onItemRef,
    orderable,
    removable,
    OrderComponent: OrderHandle,
    RemoveComponent: RemoveHandle,
    orderLabel,
    removeLabel,
    orderStyle,
    removeStyle,
    setDragging,
    PropertyField,
    ...state,
  };

  return (
    <View style={[styles.container, style]}>
      {(hasTitle || toggleable) && (
        <LabelWidget
          {...props}
          toggleable={toggleable}
          hasTitle={hasTitle}
          hasError={hasError}
          auto={uiSchema['ui:inline']}
          {...(uiSchema['ui:titleProps'] || {})}
        >
          {title}
        </LabelWidget>
      )}

      {propertySchema.type === 'object' && propertyUiSchema['ui:title'] !== false && !isSmallScreen && (
        <DraggableItem
          name={`${name}.ui_title`}
          value={[getItem(schema)]}
          errors={[] as any[]}
          meta={getItem(schema) || {}}
          uiSchema={adjustUiSchema(propertyUiSchema, -1, props)}
          index={-1}
          zIndex={1}
          Item={Item}
          titleOnly
          noTitle={false}
          orderable={orderable}
          removable={removable}
          onChange={onChange}
          onRemove={onRemove}
          onItemRef={onItemRef}
          reorder={reorder}
          setDragging={setDragging}
          PropertyField={PropertyField}
          OrderComponent={OrderHandle}
          RemoveComponent={RemoveHandle}
          orderLabel={orderLabel}
          removeLabel={removeLabel}
          orderStyle={orderStyle}
          removeStyle={removeStyle}
          theme={props.theme}
          positions={state.positions}
          refs={state.refs}
        />
      )}

      {times(value.length, (index) => {
        const itemUiSchema = adjustUiSchema(propertyUiSchema, index, props);
        return (
          <DraggableItem
            key={`${state.review}.${name}.${index}`}
            name={`${name}.${index}`}
            value={[value[index]]}
            meta={(meta && meta[index]) || getItem(schema) || {}}
            errors={errors && errors[index] ? [errors[index]] : []}
            uiSchema={itemUiSchema}
            index={index}
            zIndex={(state.dragging === index ? value.length : (value.length - index)) + 1}
            Item={Item}
            noTitle={!isSmallScreen && itemUiSchema['ui:noTitle'] !== false}
            orderable={orderable}
            removable={removable}
            onChange={onChange}
            onRemove={onRemove}
            onItemRef={onItemRef}
            reorder={reorder}
            setDragging={setDragging}
            PropertyField={PropertyField}
            OrderComponent={OrderHandle}
            RemoveComponent={RemoveHandle}
            orderLabel={orderLabel}
            removeLabel={removeLabel}
            orderStyle={orderStyle}
            removeStyle={removeStyle}
            theme={props.theme}
            positions={state.positions}
            refs={state.refs}
          />
        );
      })}

      {times(missingItems, (index) => {
        const itemUiSchema = adjustUiSchema(propertyUiSchema, value.length + index, props);
        return (
          <DraggableItem
            key={`${state.review}.${name}.${value.length + index}`}
            name={`${name}.${value.length + index}`}
            value={[getItem(schema)]}
            meta={getItem(schema) || {}}
            errors={errors && errors[index] ? [errors[index]] : []}
            uiSchema={itemUiSchema}
            index={index}
            zIndex={(state.dragging === index ? missingItems : (missingItems - index)) + 1}
            Item={Item}
            noTitle={!isSmallScreen && itemUiSchema['ui:noTitle'] !== false}
            orderable={orderable}
            removable={removable}
            onChange={onChange}
            onRemove={onRemove}
            onItemRef={onItemRef}
            reorder={reorder}
            setDragging={setDragging}
            PropertyField={PropertyField}
            OrderComponent={OrderHandle}
            RemoveComponent={RemoveHandle}
            orderLabel={orderLabel}
            removeLabel={removeLabel}
            orderStyle={orderStyle}
            removeStyle={removeStyle}
            theme={props.theme}
            positions={state.positions}
            refs={state.refs}
          />
        );
      })}

      {addable && !uiTitleRegex.test(name) && (
        <AddHandle
          theme={props.theme}
          onPress={onAdd}
          addLabel={addLabel}
        />
      )}
    </View>
  );
};

ArrayWidget.defaultProps = {
  value: [],
  meta: undefined,
  errors: undefined,
  style: undefined,
};

export default ArrayWidget;
