import React from 'react';
import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import Link from 'react-native-web-ui-components/Link';

interface Styles {
  handle: ViewStyle;
  fullWidth: ViewStyle;
}

const styles = StyleSheet.create<Styles>({
  handle: {
    paddingRight: 10,
    paddingTop: 6,
  },
  fullWidth: {
    width: '100%',
  },
});

interface UploadHandleProps {
  auto: boolean;
  theme: {
    colors: {
      primary: string;
    };
  };
  onUploadPress: () => void;
  uploadLabel: React.ReactNode;
  uploadStyle?: ViewStyle | TextStyle;
  [key: string]: any; // For other props that get spread
}

const UploadHandle: React.FC<UploadHandleProps> = ({
  theme,
  auto,
  onUploadPress,
  uploadLabel,
  uploadStyle,
  ...props
}) => (
  <Link
    {...props}
    auto={auto}
    onPress={onUploadPress}
    style={[
      styles.handle,
      auto ? undefined : styles.fullWidth,
      uploadStyle,
    ]}
    type={theme.colors.primary}
  >
    {uploadLabel}
  </Link>
);

UploadHandle.defaultProps = {
  uploadStyle: undefined,
};

export default UploadHandle;
