import { ComponentType } from 'react';
import { ThemeProps } from './types';

export function withTheme<P extends object>(
  name: string,
): (Component: ComponentType<P & ThemeProps>) => ComponentType<P>;

export default withTheme;
