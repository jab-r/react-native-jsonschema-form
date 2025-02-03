// Previous declarations remain the same...

declare module 'react-native-web-ui-components/Dropzone' {
  import { FC } from 'react';
  import { ViewStyle } from 'react-native';

  interface DropzoneProps {
    onRef?: (ref: any) => void;
    onDrop: (files: Array<{
      id: number;
      file: File;
      uri?: string;
      name: string;
      value: any;
      setData: (data: any) => void;
      setProgress: (progress: number) => void;
      setError: (error: any) => void;
    }>) => void;
    accept?: string[];
    disabled?: boolean;
    cameraText?: string;
    albumText?: string;
    fileText?: string;
    cancelText?: string;
    style?: ViewStyle | ViewStyle[];
    children: React.ReactNode;
  }

  const Dropzone: FC<DropzoneProps>;
  export default Dropzone;
}

declare module 'react-native-web-ui-components/Row' {
  import { FC } from 'react';
  import { ViewProps, ViewStyle } from 'react-native';

  interface RowProps extends ViewProps {
    className?: string;
    style?: ViewStyle | ViewStyle[];
  }

  const Row: FC<RowProps>;
  export default Row;
}

declare module 'react-native-web-ui-components/Text' {
  import { FC } from 'react';
  import { TextProps as RNTextProps, TextStyle, ViewStyle } from 'react-native';

  interface TextComponentProps extends RNTextProps {
    style?: TextStyle | ViewStyle | (TextStyle | ViewStyle | undefined)[];
    auto?: boolean;
    type?: string;
    className?: string;
  }

  const Text: FC<TextComponentProps>;
  export default Text;
}

declare module 'react-native-web-ui-components/Link' {
  import { FC } from 'react';
  import { TextStyle, ViewStyle } from 'react-native';

  interface LinkProps {
    to?: string;
    blank?: boolean;
    type?: string;
    style?: TextStyle | ViewStyle | (TextStyle | ViewStyle | undefined)[];
    children?: React.ReactNode;
    auto?: boolean;
    onPress?: () => void;
  }

  const Link: FC<LinkProps>;
  export default Link;
}

declare module 'react-native-web-ui-components/View' {
  import { FC } from 'react';
  import { ViewProps, ViewStyle } from 'react-native';

  interface ViewComponentProps extends ViewProps {
    className?: string;
    style?: ViewStyle | (ViewStyle | undefined)[] | null;
  }

  const View: FC<ViewComponentProps>;
  export default View;
}

declare module 'react-native-web-ui-components/Button' {
  import { FC } from 'react';
  import { TouchableOpacityProps, ViewStyle } from 'react-native';

  interface ButtonProps extends TouchableOpacityProps {
    auto?: boolean;
    small?: boolean;
    flat?: boolean;
    radius?: boolean;
    type?: string;
    style?: ViewStyle | ViewStyle[];
    onPress?: () => void;
    children?: React.ReactNode;
  }

  const Button: FC<ButtonProps>;
  export default Button;
}

declare module 'react-native-web-ui-components/Draggable' {
  import { FC } from 'react';
  import { ViewStyle, GestureResponderHandlers } from 'react-native';

  interface DraggableProps {
    handle?: string;
    scroller?: {
      scrollEnabled: boolean;
      setScrollEnabled: (enabled: boolean) => void;
    };
    style?: ViewStyle | ViewStyle[];
    disabled?: boolean;
    onDragStart?: () => void;
    onDragEnd?: (position: { x: number; y: number }) => void;
    axis?: 'x' | 'y' | 'both';
    children: (props: { panHandlers: GestureResponderHandlers }) => React.ReactNode;
  }

  const Draggable: FC<DraggableProps>;
  export default Draggable;
}

declare module 'react-native-web-ui-components/Helmet' {
  import { FC } from 'react';

  interface HelmetProps {
    children: React.ReactNode;
  }

  export const Helmet: FC<HelmetProps>;
  export const style: FC<{ children: string }>;
}

declare module 'react-native-web-ui-components/StylePropType' {
  import { ViewStyle } from 'react-native';
  const StylePropType: ViewStyle;
  export default StylePropType;
}

declare module 'react-native-web-ui-components/createDomStyle' {
  import { ViewStyle, TextStyle } from 'react-native';
  function createDomStyle(style: (ViewStyle | TextStyle | undefined)[] | ViewStyle | TextStyle | undefined): string;
  export default createDomStyle;
}

declare module 'react-native-web-ui-components' {
  import { FC } from 'react';
  import { ViewProps, TextProps, TouchableOpacityProps } from 'react-native';

  interface ButtonProps extends TouchableOpacityProps {
    text?: string;
    onPress?: () => void;
  }

  export const Button: FC<ButtonProps>;

  interface TextInputProps extends TextProps {
    value?: string;
    onChangeText?: (text: string) => void;
    placeholder?: string;
  }

  export const TextInput: FC<TextInputProps>;

  interface ViewContainerProps extends ViewProps {
    className?: string;
  }

  export const View: FC<ViewContainerProps>;
}
