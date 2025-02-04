import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { FormContextType, RJSFSchema, StrictRJSFSchema, SubmitButtonProps } from '@rjsf/utils';

export interface EnhancedSubmitButtonProps<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any
> extends Omit<SubmitButtonProps<T, S, F>, 'registry'> {
  formContext?: F;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const SubmitButton = <T extends any, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>({
  uiSchema,
  formContext,
  loading = false,
  style,
  textStyle,
}: EnhancedSubmitButtonProps<T, S, F>) => {
  const submitText = uiSchema?.['ui:submitButtonOptions']?.submitText || 'Submit';
  const customProps = uiSchema?.['ui:submitButtonOptions']?.props || {};
  const disabled = (formContext as any)?.readOnly || customProps.loading || loading;
  const customStyle = customProps.style || {};
  const customTextStyle = customProps.textStyle || {};

  return (
    <TouchableOpacity 
      style={[
        styles.submitButton,
        disabled && styles.submitButtonDisabled,
        customStyle,
        style
      ]}
      disabled={disabled}
      activeOpacity={0.7}
    >
      {(loading || customProps.loading) ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <Text style={[styles.submitButtonText, customTextStyle, textStyle]}>
          {submitText}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
    minHeight: 48,
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#B0B0B0',
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SubmitButton;
