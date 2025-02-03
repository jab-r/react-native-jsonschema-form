import React from 'react';
import AbstractEnumerableField, { AbstractEnumerableFieldProps, EnumerableSchema } from './AbstractEnumerableField';
import { WidgetProps } from './AbstractField';

interface IntegerSchema extends EnumerableSchema {
  type: 'integer';
  minimum?: number;
  maximum?: number;
  multipleOf?: number;
}

interface IntegerFieldProps extends Omit<AbstractEnumerableFieldProps, 'schema' | 'widgets'> {
  schema: IntegerSchema;
  widgets: AbstractEnumerableFieldProps['widgets'] & {
    IntegerWidget: React.ComponentType<WidgetProps>;
  };
}

class IntegerField extends AbstractEnumerableField {
  declare props: IntegerFieldProps;

  protected getDefaultWidget(): React.ComponentType<WidgetProps> {
    const { widgets } = this.props;
    return widgets.IntegerWidget;
  }
}

export default IntegerField;
