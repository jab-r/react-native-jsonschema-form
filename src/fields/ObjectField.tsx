import React from 'react';
import AbstractField, { AbstractFieldProps, WidgetProps } from './AbstractField';
import { JSONSchema7 } from 'json-schema';

interface ObjectSchema extends JSONSchema7 {
  type: 'object';
  properties?: {
    [key: string]: JSONSchema7;
  };
  required?: string[];
  additionalProperties?: boolean | JSONSchema7;
}

interface ObjectFieldProps extends Omit<AbstractFieldProps, 'schema' | 'widgets'> {
  schema: ObjectSchema;
  widgets: AbstractFieldProps['widgets'] & {
    ObjectWidget: React.ComponentType<WidgetProps>;
  };
}

class ObjectField extends AbstractField {
  declare props: ObjectFieldProps;

  protected getDefaultWidget(): React.ComponentType<WidgetProps> {
    const { widgets } = this.props;
    return widgets.ObjectWidget;
  }
}

export default ObjectField;
