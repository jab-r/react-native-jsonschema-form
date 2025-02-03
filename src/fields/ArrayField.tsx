import React from 'react';
import { isString } from 'lodash';
import AbstractField, { AbstractFieldProps, WidgetProps } from './AbstractField';
import { JSONSchema7 } from 'json-schema';

interface ArraySchema extends JSONSchema7 {
  type: 'array';
  items?: JSONSchema7;
  minItems?: number;
  maxItems?: number;
  uniqueItems?: boolean;
}

interface ArrayUISchema {
  'ui:widget'?: 'tagInput' | string;
  'ui:inline'?: boolean;
  'ui:errorProps'?: Record<string, any>;
  [key: string]: any;
}

interface ArrayErrors extends Array<string> {
  __originalValues?: string[];
}

interface ArrayFieldProps extends Omit<AbstractFieldProps, 'schema' | 'uiSchema' | 'errors'> {
  schema: ArraySchema;
  uiSchema: ArrayUISchema;
  errors: ArrayErrors;
  widgets: AbstractFieldProps['widgets'] & {
    ArrayWidget: React.ComponentType<WidgetProps>;
  };
}

class ArrayField extends AbstractField {
  declare props: ArrayFieldProps;

  protected getDefaultWidget(): React.ComponentType<WidgetProps> {
    const { widgets } = this.props;
    return widgets.ArrayWidget;
  }

  protected renderErrors(): React.ReactNode[] | null {
    let { errors } = this.props;
    const { widgets, uiSchema } = this.props;

    const { ErrorWidget } = widgets;

    if (uiSchema['ui:widget'] === 'tagInput') {
      errors = errors.__originalValues || [];
    }
    errors = errors.filter((error): error is string => isString(error));

    return errors.map((error: string, i: number) => (
      <ErrorWidget
        uiSchema={uiSchema}
        key={error}
        first={i === 0}
        last={i === errors.length - 1}
        auto={uiSchema['ui:inline']}
        {...(uiSchema['ui:errorProps'] || {})}
      >
        {error}
      </ErrorWidget>
    ));
  }
}

export default ArrayField;
