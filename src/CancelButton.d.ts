import { ComponentType } from 'react';

export interface CancelButtonProps {
  onPress: () => void;
  text: string;
}

declare const CancelButton: ComponentType<CancelButtonProps>;
export default CancelButton;
