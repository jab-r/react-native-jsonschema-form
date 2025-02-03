import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { isArray, without } from 'lodash';
import AbstractField, { AbstractFieldProps, WidgetProps } from './AbstractField';
import { JSONSchema7 } from 'json-schema';

interface Styles {
  padding: ViewStyle;
  margin: ViewStyle;
}

const styles = StyleSheet.create<Styles>({
  padding: {
    paddingLeft: 10,
  },
  margin: {
    marginBottom: 10,
  },
});

export interface EnumerableSchema extends JSONSchema7 {
  enum?: any[];
  enumNames?: string[];
}

export interface EnumerableUISchema {
  'ui:widget'?: 'radioboxes' | 'checkboxes';
  'ui:enum'?: any[];
  'ui:enumExcludes'?: any[];
  'ui:enumNames'?: string[];
  'ui:options'?: {
    inline?: boolean;
    [key: string]: any;
  };
  'ui:inline'?: boolean;
  'ui:title'?: boolean | string;
  [key: string]: any;
}

type EnumerableWidgetProps = Omit<WidgetProps, 'style'> & {
  text?: string;
  checked?: boolean;
  auto?: boolean;
  style?: ViewStyle | ViewStyle[] | null;
};

export interface AbstractEnumerableFieldProps extends Omit<AbstractFieldProps, 'widgets' | 'schema' | 'uiSchema'> {
  schema: EnumerableSchema;
  uiSchema: EnumerableUISchema;
  widgets: {
    ErrorWidget: React.ComponentType<any>;
    LabelWidget: React.ComponentType<any>;
    RadioWidget: React.ComponentType<EnumerableWidgetProps>;
    CheckboxWidget: React.ComponentType<EnumerableWidgetProps>;
    [key: string]: React.ComponentType<any>;
  };
}

class AbstractEnumerableField extends AbstractField {
  declare props: AbstractEnumerableFieldProps;

  protected getWidget(): React.ComponentType<WidgetProps> | undefined {
    const { schema, widgets, uiSchema } = this.props;
    let Widget: React.ComponentType<EnumerableWidgetProps> | undefined;
    const widgetName = uiSchema['ui:widget'];

    if (widgetName === 'radioboxes' || widgetName === 'checkboxes') {
      let values = uiSchema['ui:enum'] || schema.enum || [];
      if (isArray(uiSchema['ui:enumExcludes'])) {
        values = without(values, ...uiSchema['ui:enumExcludes']);
      }
      const labels = uiSchema['ui:enumNames'] || schema.enumNames || values;
      const { RadioWidget, CheckboxWidget } = widgets;
      const BaseWidget = widgetName === 'radioboxes' ? RadioWidget : CheckboxWidget;
      const inlineOptions = uiSchema['ui:options'] && uiSchema['ui:options'].inline;

      Widget = ({ value, style, ...props }: EnumerableWidgetProps) => (
        <React.Fragment>
          {values.map((trueValue: any, i: number) => (
            <BaseWidget
              {...props}
              auto={uiSchema['ui:inline'] || inlineOptions}
              key={trueValue}
              text={labels[i]}
              checked={value === trueValue}
              style={[
                (
                  (uiSchema['ui:inline'] && uiSchema['ui:title'] !== false)
                  || (
                    i > 0
                    && (uiSchema['ui:inline'] || inlineOptions)
                  )
                ) ? styles.padding : null,
                !uiSchema['ui:inline'] ? styles.margin : null,
                ...(Array.isArray(style) ? style : [style]),
              ].filter(Boolean) as ViewStyle[]}
              value={trueValue}
            />
          ))}
        </React.Fragment>
      );
    }
    return Widget as React.ComponentType<WidgetProps>;
  }
}

export default AbstractEnumerableField;
