import React, { Component } from 'react';
import {
  StyleSheet,
  Platform,
  Keyboard,
  ViewStyle,
  View,
} from 'react-native';
import {
  set,
  get,
  each,
  noop,
  cloneDeep,
  isString,
  isArray,
  isError,
  isPlainObject,
} from 'lodash';
import { JSONSchema7 } from 'json-schema';
import { withTheme } from './Theme';
import { isField } from './utils';
import {
  toPath,
  expand,
  getMetas,
  getValues,
  getErrors,
  getRequired,
  getStructure,
  getExceptions,
  normalized,
} from './utils';
import fields from './fields';
import defaultWidgets from './widgets';
import FormEvent from './FormEvent';
import DefaultCancelButton from './CancelButton';
import DefaultSubmitButton from './SubmitButton';
import { FormProps, ThemeProps } from './types';
import { AbstractFieldProps } from './fields/AbstractField';

export {
  FIELD_KEY,
  FIELD_NAME,
  FIELD_VALUE,
  FIELD_TITLE,
} from './utils';

const emptyObject = {};

const emptySchema: JSONSchema7 = {
  type: 'object',
  properties: {},
};

interface Styles {
  form: ViewStyle;
  buttonContainer: ViewStyle;
  buttonContainerCenter: ViewStyle;
  buttonContainerLeft: ViewStyle;
  buttonContainerRight: ViewStyle;
}

const styles = StyleSheet.create<Styles>({
  form: Platform.select({
    web: { zIndex: 1 },
    default: {},
  }),
  buttonContainer: {
    paddingTop: 5,
  },
  buttonContainerCenter: {
    justifyContent: 'center',
  },
  buttonContainerLeft: {
    justifyContent: 'flex-start',
  },
  buttonContainerRight: {
    justifyContent: 'flex-end',
  },
});

const defaultReject = (err: Error): never => { throw err; };

const getButtonPosition = (position: 'left' | 'right' | 'center' = 'right'): ViewStyle[] => {
  const style = [styles.buttonContainer];
  if (position === 'center') {
    style.push(styles.buttonContainerCenter);
  } else if (position === 'left') {
    style.push(styles.buttonContainerLeft);
  } else {
    style.push(styles.buttonContainerRight);
  }
  return style;
};

// Create a proper array type that extends Array<string>
class FormErrorsArray extends Array<string> {
  hidden?: boolean;
  lastValue?: any;

  constructor() {
    super();
    this.hidden = false;
    this.lastValue = undefined;
  }
}

interface JsonSchemaFormState {
  values: Record<string, any>;
  errors: Record<string, FormErrorsArray>;
  metas: Record<string, any>;
  required: Record<string, boolean>;
  schema: JSONSchema7;
  uiSchema: any;
  formDataProp: Record<string, any>;
  schemaProp: JSONSchema7;
  uiSchemaProp: any;
  errorSchemaProp: any;
  metaSchemaProp: any;
  update: Record<string, boolean>;
  clearCache: boolean;
  event?: FormEvent;
}

class JsonSchemaForm extends Component<FormProps & ThemeProps, JsonSchemaFormState> {
  declare readonly state: JsonSchemaFormState;
  declare readonly props: FormProps & ThemeProps;

  public static defaultProps = {
    name: null,
    formData: emptyObject,
    schema: emptySchema,
    uiSchema: emptyObject,
    metaSchema: undefined,
    errorSchema: emptyObject,
    children: null,
    onRef: noop,
    onChange: noop,
    onSubmit: noop,
    onCancel: noop,
    onSuccess: noop,
    onError: noop,
    buttonPosition: 'right' as const,
    cancelButton: true,
    CancelButton: DefaultCancelButton,
    submitButton: true,
    SubmitButton: DefaultSubmitButton,
    scroller: null,
    widgets: emptyObject,
    filterEmptyValues: false,
    insideClickRegex: undefined,
    theme: {
      input: {
        error: {
          border: {
            borderColor: '#EE2D68',
          },
        },
      },
      text: {
        color: '#000000',
      },
    },
  };

  public static getDerivedStateFromProps(
    nextProps: FormProps & ThemeProps,
    prevState: JsonSchemaFormState,
  ): Partial<JsonSchemaFormState> | null {
    const state: Partial<JsonSchemaFormState> = {
      clearCache: false,
    };
    let clear = false;
    let {
      metas,
      values,
      errors,
      schema,
      uiSchema,
    } = prevState;

    // If the schema or uiSchema is different, we recalculate everything
    const { schemaProp, uiSchemaProp } = prevState;
    if (nextProps.schema !== schemaProp || nextProps.uiSchema !== uiSchemaProp) {
      clear = true;
      const structure = getStructure(nextProps.schema, nextProps.uiSchema || {}, '');
      schema = structure.schema;
      uiSchema = structure.uiSchema;
      state.schema = schema;
      state.uiSchema = uiSchema;
      state.update = {};
      state.clearCache = true;
      state.schemaProp = nextProps.schema;
      state.uiSchemaProp = nextProps.uiSchema;
      state.required = getRequired(schema);
    }

    // Check for formData updates
    if (clear || nextProps.formData !== prevState.formDataProp) {
      values = getValues(cloneDeep(nextProps.formData), schema);
      state.values = values;
      state.update = {};
      state.formDataProp = nextProps.formData;
    }

    // Check for errorSchema updates
    if (clear || nextProps.errorSchema !== prevState.errorSchemaProp) {
      errors = getErrors(cloneDeep(nextProps.errorSchema), schema);
      state.errors = errors;
      state.update = {};
      state.errorSchemaProp = nextProps.errorSchema;
    }

    // Check for metaSchema updates
    if (clear || nextProps.metaSchema !== prevState.metaSchemaProp) {
      metas = getMetas(cloneDeep(nextProps.metaSchema || values), schema, uiSchema);
      state.metas = metas;
      state.update = {};
      state.metaSchemaProp = nextProps.metaSchema;
    }

    return Object.keys(state).length > 1 ? state : null;
  }

  public setState!: <K extends keyof JsonSchemaFormState>(
    state: ((prevState: Readonly<JsonSchemaFormState>, props: Readonly<FormProps & ThemeProps>) => (Pick<JsonSchemaFormState, K> | JsonSchemaFormState | null)) | (Pick<JsonSchemaFormState, K> | JsonSchemaFormState | null),
    callback?: () => void,
  ) => void;

  private id: string;
  private fieldRegex: RegExp;
  private mountSteps: Array<() => void>;
  private widgets: {
    ErrorWidget: React.ComponentType<any>;
    LabelWidget: React.ComponentType<any>;
    [key: string]: React.ComponentType<any>;
  };
  private mounted: boolean;

  private handleClick = (e: MouseEvent): void => {
    const target = e.target as Element;
    if (!isField(target, this.fieldRegex)) {
      this.setState({ event: undefined });
    }
  };

  private clickListener = Platform.select({
    web: this.handleClick,
    default: undefined,
  });

  constructor(props: FormProps & ThemeProps) {
    super(props);

    const {
      name,
      onRef,
      widgets,
      formData,
      schema,
      uiSchema,
      metaSchema,
      errorSchema,
      insideClickRegex,
    } = props;

    this.id = `Form__${name || Math.random().toString(36).substr(2, 9)}`;
    this.fieldRegex = insideClickRegex || new RegExp(`(${this.id}-field|react-datepicker)`);
    this.mountSteps = [];
    this.widgets = Object.assign({}, defaultWidgets, widgets);
    this.mounted = false;

    const structure = getStructure(schema, uiSchema || {}, '');
    const values = getValues(cloneDeep(formData), structure.schema);
    const errors = getErrors(cloneDeep(errorSchema), structure.schema);
    const metas = getMetas(cloneDeep(metaSchema || values), structure.schema, structure.uiSchema);
    const required = getRequired(structure.schema);

    this.state = {
      values,
      errors,
      metas,
      required,
      schema: structure.schema,
      uiSchema: structure.uiSchema,
      formDataProp: formData,
      schemaProp: schema,
      uiSchemaProp: uiSchema,
      errorSchemaProp: errorSchema,
      metaSchemaProp: metaSchema,
      update: {},
      clearCache: false,
    };

    if (onRef) {
      onRef(this);
    }
  }

  componentDidMount(): void {
    if (Platform.OS === 'web' && this.clickListener && typeof window !== 'undefined') {
      window.addEventListener('click', this.clickListener);
    }
    this.mounted = true;
    this.onMount();
  }

  componentWillUnmount(): void {
    this.mounted = false;
    if (Platform.OS === 'web' && this.clickListener && typeof window !== 'undefined') {
      window.removeEventListener('click', this.clickListener);
    }
  }

  onMount(handler?: () => void): void {
    if (handler) {
      this.mountSteps.push(handler);
    }
    if (this.mounted) {
      const fn = this.mountSteps.shift();
      if (fn) {
        fn.call(this);
      }
    }
  }

  onChange = (value: any, name: string, params: {
    update?: string[];
    nextErrors?: any;
    nextMeta?: any;
    silent?: boolean;
  } = {}): void => {
    const {
      update = [],
      nextErrors = false,
      nextMeta = false,
      silent = false,
    } = params;

    const { metas, values, errors } = this.state;
    const { onChange } = this.props;

    // Ensure values is never undefined
    const formValues = values || {};

    const event = new FormEvent('change', {
      name,
      value,
      values: formValues,
      metas,
      nextMeta,
      nextErrors,
      silent,
      path: toPath(name),
      update: [name].concat(update),
    });

    this.run(onChange ? onChange(event) : undefined, () => {
      if (!event.isDefaultPrevented()) {
        const path = event.params.path;
        if (event.params.values && path) {
          set(event.params.values, path, event.params.value);
        }
        if (event.params.nextMeta !== false && path) {
          set(metas, path, event.params.nextMeta);
        }
        if (event.params.nextErrors !== false && path) {
          set(errors, path, event.params.nextErrors);
        }
        const error = path ? get(errors, path) : undefined;
        if (error) {
          if (normalized(error.lastValue) !== normalized(event.params.value)) {
            error.hidden = true;
          } else {
            error.hidden = false;
          }
        }
        this.onMount(() => this.setState({
          metas: { ...metas },
          errors: { ...errors },
          values: { ...(event.params.values || {}) },
          update: expand(event.params.update || []) || {},
        }));
      }
    });
  };

  onCancel = (): void => {
    const { values } = this.state;
    const { onCancel } = this.props;
    const event = new FormEvent('cancel', { values });
    this.run(onCancel ? onCancel(event) : undefined);
  };

  onSubmit = (): void => {
    if (Platform.OS !== 'web') {
      Keyboard.dismiss();
    }
    setTimeout(() => {
      const { metas, values } = this.state;
      const { onSubmit, filterEmptyValues } = this.props;
      let nextValues = this.filterDisabled(values, metas);
      if (filterEmptyValues) {
        nextValues = this.filterEmpty(nextValues);
      }
      const event = new FormEvent('submit', { values: nextValues });
      this.run(onSubmit ? onSubmit(event) : undefined, (response) => {
        if (!event.isDefaultPrevented()) {
          this.onSuccess(response);
        }
      }, (errorSchema) => {
        if (!event.isDefaultPrevented()) {
          this.onError(errorSchema);
        }
      });
    }, Platform.OS !== 'web' ? 50 : 0);
  };

  onSuccess = (response: any): void => {
    const { schema, values } = this.state;
    const { onSuccess } = this.props;
    const event = new FormEvent('success', {
      values,
      response,
      update: [],
    });
    this.run(onSuccess ? onSuccess(event) : undefined, () => {
      if (!event.isDefaultPrevented()) {
        this.onMount(() => this.setState({
          errors: Object.fromEntries(
            Object.entries(getErrors({}, schema)).map(([key]) => [key, new FormErrorsArray()])
          ),
          values: event.params.values || {},
          update: expand(event.params.update || []) || {},
        }));
      }
    });
  };

  onError = (err: Error | Record<string, any>): void => {
    const { schema } = this.state;
    const { onError } = this.props;
    let errorSchema = err;
    if (isError(errorSchema)) {
      errorSchema = { Error: [err.message] };
    }
    const errors = getErrors(errorSchema || {}, schema);
    const exceptions = getExceptions(errorSchema, errors);
    const event = new FormEvent('error', {
      errors,
      exceptions,
      update: [],
    });
    this.run(onError ? onError(event) : undefined, () => {
      if (!event.isDefaultPrevented()) {
        this.onMount(() => this.setState({
          errors: Object.fromEntries(
            Object.entries(event.params.errors || {}).map(([key]) => [key, new FormErrorsArray()])
          ),
          update: expand(event.params.update || []) || {},
        }));
      }
    });
  };

  run = <T extends unknown>(
    maybePromise: T | Promise<T> | undefined,
    resolveHandler?: (value: T) => void,
    rejectHandler?: (error: any) => void,
  ): void => {
    const resolve = resolveHandler || noop;
    const reject = rejectHandler || defaultReject;
    if (maybePromise && (maybePromise as Promise<T>).then) {
      void (maybePromise as Promise<T>)
        .then(resolve)
        .catch(reject);
      return;
    }
    if (maybePromise !== undefined) {
      resolve(maybePromise);
    }
  };

  filterEmpty(values: Record<string, any> | any[], path = '', type: 'object' | 'array' = 'object'): Record<string, any> | any[] {
    const { required } = this.state;
    const filteredValues: Record<string, any> | any[] = type === 'object' ? {} : [];
    const add = type === 'object'
      ? (v: any, k: string) => Object.assign(filteredValues as Record<string, any>, { [k]: v })
      : (v: any) => (filteredValues as any[]).push(v);
    each(values, (v: any, k: string) => {
      let empty = false;
      const name = path ? `${path}.${k}` : k;
      let value = v;
      if (isArray(v)) {
        value = this.filterEmpty(v, name, 'array');
        empty = value.length === 0;
      } else if (isPlainObject(v)) {
        value = this.filterEmpty(v, name, 'object');
        empty = Object.keys(value).length === 0;
      } else {
        empty = value === '' || value === undefined || value === null;
      }
      if (required[toPath(name, '[]')] || !empty) {
        add(value, k);
      }
    });
    return filteredValues;
  }

  filterDisabled(values: Record<string, any> | any[], metas: Record<string, any>, path = '', type: 'object' | 'array' = 'object'): Record<string, any> | any[] {
    const filteredValues: Record<string, any> | any[] = type === 'object' ? {} : [];
    const add = type === 'object'
      ? (v: any, k: string) => Object.assign(filteredValues as Record<string, any>, { [k]: v })
      : (v: any) => (filteredValues as any[]).push(v);
    each(values, (v: any, k: string) => {
      const disabled = !!(metas && metas[k] && metas[k]['ui:disabled']);
      if (!disabled) {
        const name = path ? `${path}.${k}` : k;
        let value = v;
        if (isArray(v)) {
          value = this.filterDisabled(v, (metas && metas[k]) || [], name, 'array');
        } else if (isPlainObject(v)) {
          value = this.filterDisabled(v, (metas && metas[k]) || {}, name, 'object');
        }
        add(value, k);
      }
    });
    return filteredValues;
  }

  render(): React.ReactNode {
    const {
      event,
      schema,
      uiSchema,
      metas,
      values,
      errors,
      update,
      required,
      clearCache,
    } = this.state;

    const {
      children,
      cancelButton,
      CancelButton,
      submitButton,
      SubmitButton,
      buttonPosition,
    } = this.props;

    const { ObjectField } = fields;

    return (
      <React.Fragment>
        <View style={styles.form}>
          <ObjectField
            {...this.props}
            name=""
            id={this.id}
            event={event}
            schema={schema}
            uiSchema={uiSchema}
            meta={metas}
            metas={metas}
            value={values}
            values={values}
            errors={errors}
            update={update}
            required={required}
            fields={fields}
            widgets={this.widgets}
            onChange={this.onChange}
            onSubmit={this.onSubmit}
            renderId={Math.random()}
            clearCache={clearCache}
          />
        </View>
        {children || (submitButton === false && cancelButton === false) ? children : (
          <View style={getButtonPosition(buttonPosition || 'right')}>
            {cancelButton && CancelButton ? (
              <CancelButton
                onPress={this.onCancel}
                text={isString(cancelButton) ? cancelButton : 'Cancel'}
              />
            ) : null}
            {submitButton && SubmitButton ? (
              <SubmitButton
                onPress={this.onSubmit}
                text={isString(submitButton) ? submitButton : 'Submit'}
              />
            ) : null}
          </View>
        )}
      </React.Fragment>
    );
  }
}

const ThemedJsonSchemaForm = withTheme<FormProps>('JsonSchemaForm')(JsonSchemaForm);
export default ThemedJsonSchemaForm;
