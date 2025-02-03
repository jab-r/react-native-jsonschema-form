import React from 'react';
import Handle from './Handle';

interface CancelHandleProps {
  theme: {
    colors: {
      primary: string;
    };
  };
  to?: string;
  onPress?: () => void;
}

const CancelHandle: React.FC<CancelHandleProps> = (props) => (
  <Handle {...props}>
    Cancel
  </Handle>
);

export default CancelHandle;
