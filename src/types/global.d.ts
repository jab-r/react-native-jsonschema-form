import { ViewProps } from 'react-native';

declare global {
  interface Window {
    addEventListener(type: string, listener: (event: Event) => void): void;
    removeEventListener(type: string, listener: (event: Event) => void): void;
  }
}

declare module 'react-native' {
  interface ViewProps {
    children?: React.ReactNode;
  }

  export class View extends React.Component<ViewProps> {}
}

export {};
