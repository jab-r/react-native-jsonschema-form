import React from 'react';
import AbstractField, { AbstractFieldProps, WidgetProps } from './AbstractField';
import { JSONSchema7 } from 'json-schema';

interface NullSchema extends JSONSchema7 {
  type: 'null';
}

interface NullFieldProps extends Omit<AbstractFieldProps, 'schema' | 'widgets'> {
  schema: NullSchema;
  widgets: AbstractFieldProps['widgets'] & {
    HiddenWidget: React.ComponentType<WidgetProps>;
  };
}

class NullField extends AbstractField {
  declare props: NullFieldProps;

  protected getDefaultWidget(): React.ComponentType<WidgetProps> {
    const { widgets } = this.props;
    return widgets.HiddenWidget;
  }
}

export default NullField;
