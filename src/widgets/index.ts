import TextWidget from './TextWidget';
import CheckboxWidget from './CheckboxWidget';
import RadioButtonWidget from './RadioButtonWidget';
import SelectWidget from './SelectWidget';
import ToggleWidget from './ToggleWidget';

export default {
  TextWidget,
  TextareaWidget: TextWidget,
  EmailWidget: TextWidget,
  URLWidget: TextWidget,
  PasswordWidget: TextWidget,
  CheckboxWidget,
  RadioWidget: RadioButtonWidget,
  SelectWidget,
  ToggleWidget,
};
