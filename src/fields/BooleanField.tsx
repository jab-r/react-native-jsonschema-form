import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { get } from 'lodash';
import AbstractField, { AbstractFieldProps, WidgetProps } from './AbstractField';
import { getComponent } from '../utils';

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

interface BooleanUISchema {
  'ui:widget'?: 'checkbox' | 'radio' | 'radiobox' | string;
  'ui:inline'?: boolean;
  'ui:title'?: boolean | string;
  'ui:options'?: {
    inline?: boolean;
    trueText?: string;
    trueValue?: any;
    falseText?: string;
    falseValue?: any;
    [key: string]: any;
  };
  [key: string]: any;
}

interface BooleanWidgetBaseProps extends Omit<WidgetProps, 'style'> {
  text?: string;
  checked?: boolean;
  auto?: boolean;
}

interface BooleanWidgetProps extends BooleanWidgetBaseProps {
  style?: ViewStyle | null;
}

interface BooleanWidgetArrayProps extends BooleanWidgetBaseProps {
  style?: ViewStyle[];
}

type BooleanWidgetComponent = React.ComponentType<BooleanWidgetProps | BooleanWidgetArrayProps> & {
  hideable?: boolean;
  custom?: boolean;
};

interface BooleanFieldProps extends Omit<AbstractFieldProps, 'uiSchema'> {
  uiSchema: BooleanUISchema;
  widgets: {
    ErrorWidget: React.ComponentType<any>;
    LabelWidget: React.ComponentType<any>;
    HiddenWidget: BooleanWidgetComponent;
    CheckboxWidget: BooleanWidgetComponent;
    RadioWidget: BooleanWidgetComponent;
    [key: string]: React.ComponentType<any>;
  };
}

class BooleanField extends AbstractField {
  declare props: BooleanFieldProps;

  protected getDefaultWidget(): React.ComponentType<WidgetProps> {
    const { widgets } = this.props;
    return widgets.HiddenWidget as React.ComponentType<WidgetProps>;
  }

  protected getWidget(): React.ComponentType<WidgetProps> {
    const { widgets, uiSchema } = this.props;
    const widgetName = uiSchema['ui:widget'];
    const trueText = get(uiSchema, ['ui:options', 'trueText'], 'Yes');
    const trueValue = get(uiSchema, ['ui:options', 'trueValue'], true);
    const falseText = get(uiSchema, ['ui:options', 'falseText'], 'No');
    const falseValue = get(uiSchema, ['ui:options', 'falseValue'], false);

    let Widget: BooleanWidgetComponent;
    if (!widgetName || widgetName === 'checkbox') {
      const { CheckboxWidget } = widgets;
      const CheckboxComponent: BooleanWidgetComponent = ({ value, ...props }) => (
        <CheckboxWidget {...props} value={trueValue} checked={value === trueValue} />
      );
      Widget = CheckboxComponent;
    } else if (widgetName === 'radio' || widgetName === 'radiobox') {
      const { RadioWidget } = widgets;
      const inlineOptions = uiSchema['ui:options'] && uiSchema['ui:options'].inline;
      const RadioComponent: BooleanWidgetComponent = ({ value, style, ...props }) => (
        <React.Fragment>
          <RadioWidget
            {...props}
            auto={uiSchema['ui:inline'] || inlineOptions}
            text={trueText}
            checked={value === trueValue}
            style={[
              uiSchema['ui:inline'] && uiSchema['ui:title'] !== false ? styles.padding : null,
              !uiSchema['ui:inline'] ? styles.margin : null,
              ...(Array.isArray(style) ? style : [style]),
            ].filter(Boolean) as ViewStyle[]}
            value={trueValue}
          />
          <RadioWidget
            {...props}
            auto={uiSchema['ui:inline'] || inlineOptions}
            text={falseText}
            checked={value === falseValue}
            style={[
              uiSchema['ui:inline'] || inlineOptions ? styles.padding : null,
              !uiSchema['ui:inline'] ? styles.margin : null,
              ...(Array.isArray(style) ? style : [style]),
            ].filter(Boolean) as ViewStyle[]}
            value={falseValue}
          />
        </React.Fragment>
      );
      Widget = RadioComponent;
    } else {
      Widget = getComponent(widgetName, 'Widget', widgets) as BooleanWidgetComponent;
      if (!Widget) {
        Widget = this.getDefaultWidget() as unknown as BooleanWidgetComponent;
      }
    }

    const ParsedWidget: React.ComponentType<WidgetProps> = (props) => {
      const { onChange } = props;
      const wrappedOnChange = (value: any, ...args: any[]) => {
        if (value !== trueValue) {
          return onChange(falseValue, ...args);
        }
        return onChange(trueValue, ...args);
      };

      return <Widget {...(props as BooleanWidgetProps)} onChange={wrappedOnChange} />;
    };
    return ParsedWidget;
  }
}

export default BooleanField;
