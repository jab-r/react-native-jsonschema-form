import { FC } from 'react';
import { TouchableOpacityProps } from 'react-native';

export interface ButtonProps extends TouchableOpacityProps {
  text?: string;
  onPress?: () => void;
  theme?: Record<string, any>;
}

declare module '../CancelButton' {
  const CancelButton: FC<ButtonProps>;
  export default CancelButton;
}

declare module '../SubmitButton' {
  const SubmitButton: FC<ButtonProps>;
  export default SubmitButton;
}

declare module '../Div' {
  import { FC } from 'react';
  import { ViewProps } from 'react-native';

  interface DivProps extends ViewProps {
    className?: string;
  }

  const Div: FC<DivProps>;
  export default Div;
}
