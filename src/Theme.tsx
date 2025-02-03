import React, { createContext, useContext, ComponentType } from 'react';
import { ThemeProps } from './types';

const defaultTheme = {
  input: {
    error: {
      border: {
        borderColor: '#EE2D68',
      },
    },
  },
  text: {
    color: '#000000',
  },
};

const defaultThemeTextStyle = {
  text: {
    color: '#000000',
  },
};

const ThemeContext = createContext<ThemeProps>({
  theme: defaultTheme,
  themeTextStyle: defaultThemeTextStyle,
});

export const useTheme = (name: string, props: any) => {
  const context = useContext(ThemeContext);
  return {
    ...props,
    theme: context.theme || defaultTheme,
    themeTextStyle: context.themeTextStyle || defaultThemeTextStyle,
  };
};

export const ThemeProvider: React.FC<{ theme?: ThemeProps['theme']; children: React.ReactNode }> = ({
  theme = defaultTheme,
  children,
}) => (
  <ThemeContext.Provider value={{ theme, themeTextStyle: { text: theme.text } }}>
    {children}
  </ThemeContext.Provider>
);

export function withTheme<P extends object>(
  name: string,
): (Component: ComponentType<P & ThemeProps>) => ComponentType<P> {
  return (WrappedComponent: ComponentType<P & ThemeProps>) => {
    const WithTheme = (props: P) => {
      const themedProps = useTheme(name, props);
      return <WrappedComponent {...themedProps} />;
    };

    WithTheme.displayName = `withTheme(${name})`;
    return WithTheme;
  };
}

export default withTheme;
