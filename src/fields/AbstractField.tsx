import React from 'react';
import { StyleSheet, View, Platform, ViewStyle } from 'react-native';
import { last, isArray, isString } from 'lodash';
import {
  getComponent,
  getTitle,
  getTitleFormat,
  toPath,
} from '../utils';
import ArrayWidget from '../widgets/ArrayWidget';
import { JSONSchema7 } from 'json-schema';

interface Styles {
  field: ViewStyle;
  fieldInline: ViewStyle;
  container: ViewStyle;
}

const styles = StyleSheet.create<Styles>({
  field: {
    flex: 1,
  },
  fieldInline: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 10,
  },
  container: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
});

export interface UISchema {
  'ui:widget'?: string;
  'ui:inline'?: boolean;
  'ui:toggleable'?: boolean;
  'ui:readonly'?: boolean;
  'ui:errorProps'?: Record<string, any>;
  'ui:titleProps'?: Record<string, any>;
  'ui:widgetProps'?: Record<string, any>;
  'ui:containerProps'?: {
    style?: ViewStyle;
    [key: string]: any;
  };
  'ui:placeholder'?: string;
  [key: string]: any;
}

interface ErrorsType extends Array<string> {
  hidden?: boolean;
  lastValue?: any;
}

export interface WidgetProps {
  id: string;
  name: string;
  schema: JSONSchema7;
  uiSchema: UISchema;
  value: any;
  hasError?: boolean;
  auto?: boolean;
  placeholder?: string;
  disabled?: boolean;
  readonly?: boolean;
  style?: ViewStyle | null;
  [key: string]: any;
}

type WidgetComponent = React.ComponentType<WidgetProps> & {
  hideable?: boolean;
  custom?: boolean;
};

export interface AbstractFieldProps {
  id: string;
  name: string;
  update: string | Record<string, any>;
  schema: JSONSchema7;
  uiSchema: UISchema;
  clearCache: boolean;
  widgets: {
    ErrorWidget: React.ComponentType<any>;
    LabelWidget: React.ComponentType<any>;
    [key: string]: React.ComponentType<any>;
  };
  required: Record<string, boolean>;
  noTitle?: boolean;
  titleOnly?: boolean;
  zIndex?: number;
  meta?: any;
  errors?: ErrorsType;
  value?: any;
}

interface AbstractFieldState {}

class AbstractField extends React.Component<AbstractFieldProps, AbstractFieldState> {
  static defaultProps = {
    noTitle: false,
    titleOnly: false,
    errors: [] as ErrorsType,
    value: undefined,
    zIndex: 0,
  };

  private cache: WidgetComponent | null = null;

  shouldComponentUpdate(nextProps: AbstractFieldProps): boolean {
    const { clearCache, update, name } = nextProps;
    return name === '' || clearCache || update === 'all' || (update as Record<string, any>)[name] || false;
  }

  protected getDefaultWidget(): WidgetComponent {
    throw new Error('Abstract field cannot be used.');
  }

  protected renderErrors(): React.ReactNode[] | null {
    let { errors } = this.props;
    const { widgets, uiSchema } = this.props;

    const { ErrorWidget } = widgets;

    if (!errors || !Array.isArray(errors)) return null;

    errors = errors.filter((error: unknown): error is string => isString(error));
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

  private renderTitle(hasError: boolean, params: { key: string | undefined; name: string; value: any }): React.ReactNode {
    const {
      id,
      name,
      widgets,
      schema,
      uiSchema,
      noTitle,
      required,
    } = this.props;

    const titleFormat = getTitleFormat(schema, uiSchema);

    const hasTitle = !(
      noTitle
      || titleFormat === false
      || this.cache === ArrayWidget
    );
    if (!uiSchema['ui:toggleable'] && !hasTitle) {
      return null;
    }
    const { LabelWidget } = widgets;
    let title = getTitle(titleFormat || '', params);
    if (required[toPath(name, '[]')]) {
      title += '*';
    }
    return (
      <LabelWidget
        {...this.props}
        testID={`${id}-title-${name.replace(/\./g, '-')}`}
        toggleable={!!uiSchema['ui:toggleable']}
        hasTitle={hasTitle}
        hasError={hasError}
        auto={uiSchema['ui:inline']}
        {...(uiSchema['ui:titleProps'] || {})}
      >
        {title}
      </LabelWidget>
    );
  }

  render(): React.ReactNode {
    const {
      id,
      name,
      meta,
      schema,
      uiSchema,
      widgets,
      errors = [],
      value,
      titleOnly,
      zIndex,
      clearCache,
    } = this.props;

    if (clearCache) {
      this.cache = null;
    }
    if (!this.cache) {
      if ((this as any).getWidget) {
        this.cache = (this as any).getWidget(this.props);
      }
      if (!this.cache) {
        this.cache = getComponent(uiSchema['ui:widget'] || '', 'Widget', widgets) as WidgetComponent;
      }
      if (!this.cache) {
        this.cache = this.getDefaultWidget();
      }
    }
    const Widget = this.cache;
    const hasError = (
      schema.type !== 'object'
      && (schema.type !== 'array' || Widget.hideable === false)
      && isArray(errors)
      && errors.length > 0
      && (!errors.hidden || Widget.hideable === false)
    );
    if (hasError && errors.lastValue === undefined) {
      errors.lastValue = value;
    }
    if (Widget.custom) {
      return <Widget {...this.props} value={value} hasError={hasError} />;
    }

    const containerProps = uiSchema['ui:containerProps'] || {};
    if (uiSchema['ui:widget'] === 'hidden') {
      if (!hasError) {
        return null;
      }
      // Show errors for hidden fields
      return (
        <View style={[styles.container, containerProps.style]}>
          {this.renderErrors()}
        </View>
      );
    }
    const key = last(name.split('.'));
    const params = {
      key,
      name,
      value,
    };
    const placeholder = getTitle(uiSchema['ui:placeholder'] || '', params);
    const testID = schema.type !== 'object' && Widget !== ArrayWidget
      ? `${id}-field-${name.replace(/\./g, '-')}`
      : undefined;

    return (
      <View
        {...containerProps}
        testID={testID}
        style={[
          styles.container,
          uiSchema['ui:inline'] ? styles.fieldInline : styles.field,
          containerProps.style || {},
          Platform.select({
            ios: { zIndex },
            android: {},
            default: { zIndex },
          }),
        ]}
      >
        {this.renderTitle(hasError, params)}
        {!titleOnly || schema.type === 'object' || schema.type === 'array' ? (
          <React.Fragment>
            <Widget
              {...this.props}
              value={value}
              style={null}
              auto={uiSchema['ui:inline']}
              hasError={hasError}
              placeholder={placeholder}
              disabled={!!(meta && meta['ui:disabled'])}
              readonly={!!uiSchema['ui:readonly']}
              {...(uiSchema['ui:widgetProps'] || {})}
            />
            {hasError ? this.renderErrors() : null}
          </React.Fragment>
        ) : null}
      </View>
    );
  }
}

export default AbstractField;
