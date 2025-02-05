import TextInputWidget from './TextInputWidget';
import TextWidget from './TextWidget';
import NumberWidget from './NumberWidget';
import CheckboxWidget from './CheckboxWidget';
import RadioButtonWidget from './RadioButtonWidget';
import SelectWidget from './SelectWidget';
import ToggleWidget from './ToggleWidget';
import DateTimeWidget from './DateTimeWidget';

export default {
  TextWidget,
  TextInputWidget,
  TextareaWidget: TextInputWidget,
  EmailWidget: TextInputWidget,
  URLWidget: TextInputWidget,
  PasswordWidget: TextInputWidget,
  NumberWidget,
  IntegerWidget: NumberWidget,
  CheckboxWidget,
  RadioWidget: RadioButtonWidget,
  SelectWidget,
  ToggleWidget,
  DateWidget: DateTimeWidget,
  TimeWidget: DateTimeWidget,
  DateTimeWidget,
};
