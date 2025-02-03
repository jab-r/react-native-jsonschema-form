import { StyleSheet, Platform, TextInput, View, ViewStyle, TextStyle, NativeSyntheticEvent, TextInputSelectionChangeEventData, KeyboardTypeOptions } from 'react-native';
import { Component } from 'react';
import type { ComponentType } from 'react';
import { noop, isString, isFunction } from 'lodash';
import { isEmpty, formatMask } from '../utils';

interface Styles {
  defaults: ViewStyle;
  fullWidth: ViewStyle;
  auto: ViewStyle;
  input: ViewStyle & TextStyle;
  error: ViewStyle;
}

const styles = StyleSheet.create<Styles>({
  defaults: {
    marginBottom: 10,
  },
  fullWidth: {
    width: '100%',
  },
  auto: {
    marginBottom: 0,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  error: {
    borderColor: 'red',
  },
});

interface TextValue {
  mask?: string | ((value: string, direction: 'in' | 'out') => string);
  value: string | number | null;
  maskParser?: ((value: string) => string) | undefined;
}

const getTextValue = ({ mask, value, maskParser }: TextValue): string => {
  let textValue = '';
  if (value !== null && value !== undefined) {
    if (isString(mask)) {
      textValue = formatMask(`${value}`, mask, maskParser || undefined);
    } else if (isFunction(mask)) {
      textValue = mask(`${value}`, 'in');
    } else {
      textValue = value.toString();
    }
  }
  return textValue;
};

interface TextInputWidgetProps {
  update?: Record<string, any> | string;
  renderId?: number;
  name: string;
  uiSchema?: {
    'ui:autofocus'?: boolean;
    'ui:emptyValue'?: string;
    [key: string]: any;
  };
  hasError?: boolean;
  style?: ViewStyle | ViewStyle[];
  mask?: string | ((value: string, direction: 'in' | 'out') => string);
  onBlur?: (...args: any[]) => void;
  onFocus?: (...args: any[]) => void;
  onChange: (value: any, name: string) => void;
  onSubmit?: () => void;
  focus?: string | null;
  value: string | number | null;
  placeholder?: string;
  readonly?: boolean;
  disabled?: boolean;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  multiline?: boolean;
  numberOfLines?: number;
  auto?: boolean;
  textParser?: (value: string) => string;
  Input?: ComponentType<any>;
  inputProps?: Record<string, any>;
  onChangeText?: (text: string) => void;
  register?: (setText: (text: string) => void) => void;
  changeOnBlur?: boolean;
  maskParser?: ((value: string) => string) | undefined;
  scroller?: Record<string, any>;
}

interface TextInputWidgetState {
  text: string;
  valueProp: string | number | null;
  renderIdProp: number;
  autoFocus: boolean;
}

interface Selection {
  start: number;
  end: number;
}

class TextInputWidget extends Component<TextInputWidgetProps, TextInputWidgetState> {
  static defaultProps = {
    update: undefined,
    renderId: 0,
    uiSchema: {},
    style: undefined,
    mask: null,
    onBlur: noop,
    onFocus: noop,
    onChange: noop,
    onSubmit: noop,
    focus: null,
    value: null,
    placeholder: '',
    readonly: false,
    disabled: false,
    secureTextEntry: false,
    keyboardType: 'default' as KeyboardTypeOptions,
    multiline: false,
    numberOfLines: 1,
    auto: false,
    textParser: (value: string) => value,
    Input: TextInput,
    inputProps: {},
    onChangeText: null,
    register: noop,
    changeOnBlur: true,
    maskParser: undefined,
    scroller: undefined,
    hasError: false,
  };

  private selection: Selection;
  private focused: boolean;
  private input: TextInput | null;

  constructor(props: TextInputWidgetProps) {
    super(props);
    const { value, renderId = 0, uiSchema = {} } = props;

    const text = getTextValue({ ...props, value });
    this.selection = {
      start: text.length,
      end: text.length,
    };

    this.focused = false;
    this.input = null;

    this.state = {
      text,
      valueProp: value,
      renderIdProp: renderId,
      autoFocus: !!uiSchema['ui:autofocus'],
    };
  }

  static getDerivedStateFromProps(nextProps: TextInputWidgetProps, prevState: TextInputWidgetState) {
    const state: Partial<TextInputWidgetState> = {};

    const { update, value, renderId = 0 } = nextProps;
    const { valueProp, renderIdProp } = prevState;

    if (value !== valueProp) {
      state.valueProp = value;
    }
    if (renderId !== renderIdProp) {
      state.renderIdProp = renderId;
    }
    if (update === 'all' && value !== valueProp && renderId !== renderIdProp) {
      state.text = getTextValue({ ...nextProps, value });
    }
    if (!Object.keys(state).length) {
      return null;
    }
    return state;
  }

  private parse = (text: string): string => {
    const { mask, textParser = (v: string) => v, maskParser } = this.props;
    if (!mask) {
      return textParser(text);
    }
    if (isFunction(mask)) {
      return textParser(mask(text, 'out'));
    }
    return textParser(formatMask(text, mask, maskParser || undefined));
  };

  private setText = (text: string) => this.setState({ text });

  private onRef = (input: TextInput) => {
    this.input = input;
  };

  private onChangeText = (nextText: string) => {
    const { name, onChangeText, onChange } = this.props;
    const nextValue = this.parse(nextText);
    const nextTextValue = getTextValue({ ...this.props, value: nextValue });
    if (onChangeText) {
      onChangeText(nextTextValue);
    }

    // Check for unsolicited autofill.
    if (!this.focused) {
      onChange(nextValue, name);
    }

    this.setText(nextTextValue);
  };

  private onBlur = (...args: any[]) => {
    const {
      name,
      value,
      onBlur,
      onChange,
      changeOnBlur,
    } = this.props;

    this.focused = false;
    this.setState({ autoFocus: false });
    const { text } = this.state;
    const nextValue = this.parse(text);
    if (onBlur) {
      onBlur(...args);
    }
    if (changeOnBlur && nextValue !== value) {
      onChange(nextValue, name);
    }
  };

  private onFocus = (...args: any[]) => {
    this.focused = true;
    this.setState({ autoFocus: true });
    const { onFocus } = this.props;
    if (onFocus) {
      onFocus(...args);
    }
  };

  private onSubmitEditing = () => {
    const { text } = this.state;
    const {
      name,
      value,
      onChange,
      onSubmit,
      changeOnBlur,
    } = this.props;
    const nextValue = this.parse(text);
    if (changeOnBlur && nextValue !== value) {
      onChange(nextValue, name);
    }
    if (onSubmit) {
      onSubmit();
    }
  };

  private onSelectionChange = (event: NativeSyntheticEvent<TextInputSelectionChangeEventData>) => {
    this.selection = event.nativeEvent.selection;
  };

  render() {
    const {
      name,
      auto,
      style,
      multiline,
      hasError,
      disabled,
      readonly,
      placeholder,
      keyboardType,
      numberOfLines,
      secureTextEntry,
      inputProps,
      register,
      uiSchema = {},
      mask,
    } = this.props;

    const { text, autoFocus } = this.state;

    if (register) {
      register(this.setText);
    }

    const inputStyles = [
      styles.input,
      styles.defaults,
      auto ? styles.auto : styles.fullWidth,
      hasError && styles.error,
      ...(Array.isArray(style) ? style : style ? [style] : []),
    ].filter(Boolean);

    const selectionProps: Record<string, any> = {};
    if (!mask && Platform.OS === 'web') {
      selectionProps.selection = this.selection;
      selectionProps.onSelectionChange = this.onSelectionChange;
    }

    return (
      <View style={styles.fullWidth}>
        <TextInput
          key={name}
          ref={this.onRef}
          style={inputStyles}
          value={isEmpty(text) ? (uiSchema['ui:emptyValue'] || '') : text}
          onChangeText={this.onChangeText}
          onBlur={this.onBlur}
          onFocus={this.onFocus}
          onSubmitEditing={multiline ? undefined : this.onSubmitEditing}
          placeholder={placeholder}
          autoCapitalize="none"
          autoFocus={autoFocus}
          editable={!disabled && !readonly}
          multiline={multiline}
          numberOfLines={numberOfLines}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          {...selectionProps}
          {...inputProps}
        />
      </View>
    );
  }
}

export default TextInputWidget;
