import RJSFForm from '@rjsf/core';
import { FormProps } from '@rjsf/core';
import { FormContextType, RJSFSchema } from '@rjsf/utils';
import React from 'react';
import { View, ViewStyle } from 'react-native';
import theme from '../theme';

interface RNFormProps extends Omit<FormProps<any>, 'className' | 'style'> {
  style?: ViewStyle;
}

export default function Form(props: RNFormProps) {
  const { style, children, ...formProps } = props;

  return (
    <View style={style}>
      <RJSFForm
        {...formProps}
        templates={theme.templates}
        widgets={theme.widgets}
      >
        {children}
      </RJSFForm>
    </View>
  );
}
