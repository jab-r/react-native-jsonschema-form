import { ComponentType } from 'react';

export interface SubmitButtonProps {
  onPress: () => void;
  text: string;
}

declare const SubmitButton: ComponentType<SubmitButtonProps>;
export default SubmitButton;
