import React from 'react';
import Handle from './Handle';

interface SaveHandleProps {
  theme: {
    colors: {
      primary: string;
    };
  };
  to?: string;
  onPress?: () => void;
}

const SaveHandle: React.FC<SaveHandleProps> = (props) => (
  <Handle {...props}>
    Save
  </Handle>
);

export default SaveHandle;
