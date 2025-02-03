import React from 'react';
import AbstractEnumerableField, { AbstractEnumerableFieldProps, EnumerableSchema } from './AbstractEnumerableField';
import { WidgetProps } from './AbstractField';

interface NumberSchema extends EnumerableSchema {
  type: 'number';
  minimum?: number;
  maximum?: number;
  multipleOf?: number;
}

interface NumberFieldProps extends Omit<AbstractEnumerableFieldProps, 'schema' | 'widgets'> {
  schema: NumberSchema;
  widgets: AbstractEnumerableFieldProps['widgets'] & {
    NumberWidget: React.ComponentType<WidgetProps>;
  };
}

class NumberField extends AbstractEnumerableField {
  declare props: NumberFieldProps;

  protected getDefaultWidget(): React.ComponentType<WidgetProps> {
    const { widgets } = this.props;
    return widgets.NumberWidget;
  }
}

export default NumberField;
