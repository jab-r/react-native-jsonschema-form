import React from 'react';
import AbstractEnumerableField, { AbstractEnumerableFieldProps, EnumerableSchema, EnumerableUISchema } from './AbstractEnumerableField';
import { WidgetProps } from './AbstractField';

const password = /password$/i;
const email = /(email|username)$/i;
const phone = /(phone|mobile|cellphone)$/i;
const message = /(message|text|notes)$/i;
const zip = /zip$/i;

interface StringSchema extends EnumerableSchema {
  format?: 'date-time' | string;
}

interface StringFieldProps extends Omit<AbstractEnumerableFieldProps, 'schema' | 'widgets' | 'uiSchema'> {
  schema: StringSchema;
  uiSchema: EnumerableUISchema;
  widgets: AbstractEnumerableFieldProps['widgets'] & {
    DateWidget: React.ComponentType<WidgetProps>;
    PasswordWidget: React.ComponentType<WidgetProps>;
    EmailWidget: React.ComponentType<WidgetProps>;
    PhoneWidget: React.ComponentType<WidgetProps>;
    TextareaWidget: React.ComponentType<WidgetProps>;
    ZipWidget: React.ComponentType<WidgetProps>;
    TextInputWidget: React.ComponentType<WidgetProps>;
  };
}

class StringField extends AbstractEnumerableField {
  declare props: StringFieldProps;

  protected getDefaultWidget(): React.ComponentType<WidgetProps> {
    const { name, widgets, schema } = this.props;
    let Widget: React.ComponentType<WidgetProps>;

    if (schema.format === 'date-time') {
      Widget = widgets.DateWidget;
    } else if (password.test(name)) {
      Widget = widgets.PasswordWidget;
    } else if (email.test(name)) {
      Widget = widgets.EmailWidget;
    } else if (phone.test(name)) {
      Widget = widgets.PhoneWidget;
    } else if (message.test(name)) {
      Widget = widgets.TextareaWidget;
    } else if (zip.test(name)) {
      Widget = widgets.ZipWidget;
    } else {
      Widget = widgets.TextInputWidget;
    }
    return Widget;
  }
}

export default StringField;
