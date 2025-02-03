import { ComponentType } from 'react';
import { FieldProps } from '../types';

declare module '../fields' {
  interface Fields {
    ObjectField: ComponentType<FieldProps>;
    ArrayField: ComponentType<FieldProps>;
    StringField: ComponentType<FieldProps>;
    NumberField: ComponentType<FieldProps>;
    IntegerField: ComponentType<FieldProps>;
    BooleanField: ComponentType<FieldProps>;
    DateField: ComponentType<FieldProps>;
    NullField: ComponentType<FieldProps>;
  }

  const fields: Fields;
  export default fields;
}

declare module '../widgets' {
  import { ComponentType } from 'react';
  import { WidgetProps } from '../types';

  interface Widgets {
    TextWidget: ComponentType<WidgetProps>;
    TextareaWidget: ComponentType<WidgetProps>;
    SelectWidget: ComponentType<WidgetProps>;
    RadioWidget: ComponentType<WidgetProps>;
    CheckboxWidget: ComponentType<WidgetProps>;
    DateWidget: ComponentType<WidgetProps>;
    TimeWidget: ComponentType<WidgetProps>;
    DateTimeWidget: ComponentType<WidgetProps>;
    EmailWidget: ComponentType<WidgetProps>;
    PasswordWidget: ComponentType<WidgetProps>;
    FileWidget: ComponentType<WidgetProps>;
    HiddenWidget: ComponentType<WidgetProps>;
    ColorWidget: ComponentType<WidgetProps>;
    RangeWidget: ComponentType<WidgetProps>;
    PhoneWidget: ComponentType<WidgetProps>;
    URLWidget: ComponentType<WidgetProps>;
    TextInputWidget: ComponentType<WidgetProps>;
    NumberWidget: ComponentType<WidgetProps>;
    IntegerWidget: ComponentType<WidgetProps>;
    ArrayWidget: ComponentType<WidgetProps>;
    ObjectWidget: ComponentType<WidgetProps>;
    AutocompleteWidget: ComponentType<WidgetProps>;
    RatingWidget: ComponentType<WidgetProps>;
    TagInputWidget: ComponentType<WidgetProps>;
    TimeRangeWidget: ComponentType<WidgetProps>;
    ZipWidget: ComponentType<WidgetProps>;
    ErrorWidget: ComponentType<WidgetProps>;
    LabelWidget: ComponentType<WidgetProps>;
  }

  const widgets: Widgets;
  export default widgets;
}
