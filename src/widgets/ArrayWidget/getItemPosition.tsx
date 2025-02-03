import { findNodeHandle } from 'react-native';

interface Position {
  width: number;
  height: number;
  x: number;
  y: number;
}

const getItemPosition = (element: { _nativeRef?: { measure?: Function } }): Promise<Position> => new Promise((resolve) => {
  if (element._nativeRef?.measure) {
    element._nativeRef.measure((
      _fx: number,
      _fy: number,
      width: number,
      height: number,
      px: number,
      py: number
    ) => {
      resolve({
        width,
        height,
        x: px,
        y: py,
      });
    });
  } else {
    // Fallback for web or when measure is not available
    resolve({
      width: 0,
      height: 0,
      x: 0,
      y: 0,
    });
  }
});

export default getItemPosition;
