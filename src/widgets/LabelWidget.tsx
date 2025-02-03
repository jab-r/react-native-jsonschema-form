import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { pick, omit } from 'lodash';
import { useTheme } from '../Theme';
import { viewStyleKeys } from '../utils';
import CheckBox from './CheckBox';

interface Styles {
  error: TextStyle;
  container: ViewStyle;
  labelContainer: ViewStyle;
  labelText: TextStyle;
  checkbox: ViewStyle;
  checkboxIcon: TextStyle;
  fullWidth: ViewStyle;
  touchable: ViewStyle;
}

const styles = StyleSheet.create<Styles>({
  error: {
    color: '#EE2D68',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '100%',
  },
  labelContainer: {
    paddingTop: 10,
    paddingBottom: 5,
  },
  labelText: {
    fontWeight: 'bold',
  },
  checkbox: {
    height: 20,
    marginRight: 5,
  },
  checkboxIcon: {
    fontSize: 20,
    height: 20,
    lineHeight: Platform.select({
      ios: 20,
      android: 24,
      default: 20,
    }),
  },
  fullWidth: {
    width: '100%',
  },
  touchable: {
    flex: 1,
  },
});

interface UseOnPressParams {
  name: string;
  meta: Record<string, any>;
  value: any;
  onChange: (value: any, name: string, options: { nextMeta: Record<string, any> }) => void;
}

const useOnPress = ({
  name,
  meta,
  value,
  onChange,
}: UseOnPressParams) => (checked: boolean) => onChange(value, name, {
  nextMeta: { ...meta, 'ui:disabled': !!checked },
});

interface LabelWidgetProps {
  theme: {
    input: {
      error: {
        border: ViewStyle;
      };
    };
  };
  themeTextStyle: {
    text: TextStyle;
  };
  hasError: boolean;
  hasTitle: boolean;
  toggleable: boolean;
  children?: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  label?: boolean;
  auto?: boolean;
  meta?: Record<string, any>;
  onPress?: () => void;
  testID?: string;
  name: string;
  value: any;
  onChange: (value: any, name: string, options: { nextMeta: Record<string, any> }) => void;
}

const LabelWidget: React.FC<LabelWidgetProps> = (preProps) => {
  const props = useTheme('LabelWidget', preProps);

  const {
    onPress,
    children,
    theme,
    themeTextStyle,
    style,
    hasError,
    label,
    meta,
    auto,
    hasTitle,
    toggleable,
    testID,
  } = props;

  const onCheckboxPress = useOnPress(props);

  const currentContainerStyle = [
    styles.container,
    auto ? null : styles.fullWidth,
  ];
  const currentTextStyle = [];
  if (label) {
    currentContainerStyle.push(styles.labelContainer);
    currentTextStyle.push(styles.labelText);
  }
  if (hasError) {
    currentTextStyle.push({ color: StyleSheet.flatten(theme.input.error.border).borderColor });
  } else {
    currentTextStyle.push(themeTextStyle.text);
  }
  const css = StyleSheet.flatten(style || {});

  const TextComponent: typeof TouchableOpacity | typeof View = onPress ? TouchableOpacity : View;
  const textProps = onPress ? {
    onPress,
    style: styles.touchable,
  } : {};

  return (
    <View testID={testID} style={[currentContainerStyle, pick(css, viewStyleKeys)]}>
      {toggleable ? (
        <CheckBox
          value={!(meta && meta['ui:disabled'])}
          onValueChange={onCheckboxPress}
          style={styles.checkbox}
        />
      ) : null}
      {hasTitle ? (
        <TextComponent {...textProps}>
          <Text style={[currentTextStyle, omit(css, viewStyleKeys)]}>
            {children}
          </Text>
        </TextComponent>
      ) : null}
    </View>
  );
};

LabelWidget.defaultProps = {
  style: undefined,
  label: false,
  auto: false,
  children: null,
  onPress: undefined,
  testID: undefined,
  meta: undefined,
};

export default LabelWidget;
