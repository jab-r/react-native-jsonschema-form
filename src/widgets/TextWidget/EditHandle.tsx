import React from 'react';
import Handle from './Handle';

interface EditHandleProps {
  theme: {
    colors: {
      primary: string;
    };
  };
  to?: string;
  onPress?: () => void;
}

const EditHandle: React.FC<EditHandleProps> = (props) => (
  <Handle {...props}>
    Edit
  </Handle>
);

export default EditHandle;
