import { StyleSheet, View, Text, Pressable, ViewStyle, TextStyle, Platform } from 'react-native';
import { Component, Fragment } from 'react';
import type { ComponentType, ReactNode } from 'react';
import { omit } from 'lodash';
import TextInputWidget from '../TextInputWidget';
import EditHandle from './EditHandle';
import SaveHandle from './SaveHandle';
import CancelHandle from './CancelHandle';

interface Styles {
  container: ViewStyle;
  defaults: ViewStyle;
  fullWidth: ViewStyle;
  auto: ViewStyle;
  main: ViewStyle;
  text: TextStyle;
  link: TextStyle;
}

const styles = StyleSheet.create<Styles>({
  container: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  defaults: {
    height: 40,
  },
  fullWidth: {
    width: '100%',
  },
  auto: {
    marginBottom: 0,
  },
  main: {
    flex: 1,
  },
  text: {
    height: 40,
    borderWidth: 1,
    borderColor: 'transparent',
    lineHeight: 40,
    overflow: 'hidden',
  },
  link: {
    textDecorationLine: 'underline',
  },
});

interface TextWidgetState {
  value: string | number | null;
  editing: boolean;
  displayValue: string | number | null;
}

interface TextWidgetProps {
  theme: {
    input: {
      regular: {
        text: TextStyle;
      };
    };
    colors: {
      primary: string;
    };
  };
  name: string;
  textParser?: (value: any, props: TextWidgetProps) => string;
  onChange: (value: any, name: string) => void;
  value?: string | number | null;
  to?: string | ((props: TextWidgetProps) => string);
  auto?: boolean;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle | TextStyle[];
  textContainerStyle?: ViewStyle | ViewStyle[];
  inputStyle?: ViewStyle | ViewStyle[];
  inputContainerStyle?: ViewStyle | ViewStyle[];
  editable?: boolean;
  EditComponent: ComponentType<any>;
  SaveComponent: ComponentType<any>;
  CancelComponent: ComponentType<any>;
  children?: ReactNode | ComponentType<any>;
  onLinkPress?: (url: string) => void;
}

class TextWidget extends Component<TextWidgetProps, TextWidgetState> {
  static defaultProps = {
    value: null,
    to: null,
    auto: false,
    textParser: (value: any) => (value !== null && value !== undefined ? value : ''),
    style: undefined,
    textStyle: undefined,
    textContainerStyle: undefined,
    inputStyle: undefined,
    inputContainerStyle: undefined,
    editable: true,
    EditComponent: EditHandle,
    SaveComponent: SaveHandle,
    CancelComponent: CancelHandle,
    children: null,
    onLinkPress: (url: string) => {
      // Default link handler - can be overridden via props
      if (Platform.OS === 'web') {
        window.open(url, '_blank');
      }
    },
  };

  static getDerivedStateFromProps(nextProps: TextWidgetProps, prevState: TextWidgetState) {
    if (nextProps.value !== prevState.value) {
      return {
        value: nextProps.value ?? null,
        displayValue: nextProps.value ?? null,
      };
    }
    return null;
  }

  constructor(props: TextWidgetProps) {
    super(props);
    const { value } = props;
    this.state = {
      value: value ?? null,
      editing: false,
      displayValue: value ?? null,
    };
  }

  onChange = (value: string | number) => this.setState({ displayValue: value });

  onSave = () => {
    const { name, onChange } = this.props;
    const { displayValue } = this.state;
    this.setState({
      editing: false,
      value: displayValue,
    });
    setTimeout(() => onChange(displayValue, name));
  };

  onCancel = () => {
    const { value } = this.state;
    this.setState({
      editing: false,
      displayValue: value,
    });
  };

  onEdit = () => this.setState({ editing: true });

  renderChildren(element: ReactNode | ComponentType<any>) {
    if (typeof element === 'function') {
      const Component = element;
      return <Component {...this.props} />;
    }
    return element;
  }

  render() {
    const {
      to,
      theme,
      auto,
      style,
      textStyle,
      textContainerStyle,
      inputStyle,
      inputContainerStyle,
      editable,
      EditComponent,
      SaveComponent,
      CancelComponent,
      children,
      textParser = value => (value !== null && value !== undefined ? String(value) : ''),
      onLinkPress,
    } = this.props;
    const { editing, displayValue, value } = this.state;
    let href = null;
    if (to) {
      href = typeof to === 'function' ? to(this.props) : to;
    }

    const baseStyles = [
      styles.container,
      styles.defaults,
      auto ? styles.auto : styles.fullWidth,
      ...(Array.isArray(style) ? style : style ? [style] : []),
    ].filter(Boolean) as ViewStyle[];

    const mainStyles = [
      styles.main,
      ...(Array.isArray(inputContainerStyle) ? inputContainerStyle : inputContainerStyle ? [inputContainerStyle] : []),
    ].filter(Boolean) as ViewStyle[];

    const inputStyles = [
      styles.fullWidth,
      ...(Array.isArray(inputStyle) ? inputStyle : inputStyle ? [inputStyle] : []),
    ].filter(Boolean) as ViewStyle[];

    const textStyles = [
      theme.input.regular.text,
      styles.defaults,
      styles.text,
      styles.fullWidth,
      ...(Array.isArray(textStyle) ? textStyle : textStyle ? [textStyle] : []),
      href ? styles.link : null,
    ].filter(Boolean) as (TextStyle | ViewStyle)[];

    return (
      <View style={baseStyles}>
        {editing ? (
          <Fragment>
            <View style={auto ? undefined : mainStyles}>
              <TextInputWidget
                {...omit(this.props, 'textParser')}
                auto
                style={inputStyles}
                value={displayValue}
                onChange={this.onChange}
                update="all"
                renderId={0}
                uiSchema={{}}
                hasError={false}
              />
              {this.renderChildren(children)}
            </View>
            <SaveComponent {...this.props} to={undefined} onPress={this.onSave} />
            <CancelComponent {...this.props} to={undefined} onPress={this.onCancel} />
          </Fragment>
        ) : (
          <Fragment>
            <View style={auto ? undefined : mainStyles}>
              {!href ? (
                <Text style={textStyles}>
                  {value !== null && value !== undefined ? value : ''}
                </Text>
              ) : (
                <Pressable onPress={() => onLinkPress?.(href)}>
                  <Text style={[textStyles, { color: theme.colors.primary }]}>
                    {textParser(value, this.props)}
                  </Text>
                </Pressable>
              )}
              {this.renderChildren(children)}
            </View>
            {editable ? (
              <EditComponent
                {...this.props}
                to={undefined}
                onPress={this.onEdit}
              />
            ) : null}
          </Fragment>
        )}
      </View>
    );
  }
}

export default TextWidget;
