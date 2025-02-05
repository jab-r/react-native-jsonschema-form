import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { WidgetProps } from '@rjsf/utils';
import { format } from 'date-fns';

const DateTimeWidget = ({
  id,
  value,
  required,
  readonly,
  disabled,
  label,
  onChange,
  options,
  schema,
  uiSchema,
}: WidgetProps) => {
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState<'date' | 'time'>('date');
  const [selectedDate, setSelectedDate] = useState<Date>(
    value ? new Date(value) : new Date()
  );

  const showMode = (currentMode: 'date' | 'time') => {
    setShow(true);
    setMode(currentMode);
  };

  const handleChange = (_: any, date?: Date) => {
    setShow(false);
    if (date) {
      setSelectedDate(date);
      // Format the date according to the schema type
      let formattedValue: string;
      if (schema.type === 'string' && schema.format === 'date') {
        formattedValue = format(date, 'yyyy-MM-dd');
      } else if (schema.type === 'string' && schema.format === 'time') {
        formattedValue = format(date, 'HH:mm:ss');
      } else {
        // Default to ISO string for date-time
        formattedValue = date.toISOString();
      }
      onChange(formattedValue);
    }
  };

  const displayFormat = () => {
    if (!selectedDate) return '';
    if (schema.type === 'string' && schema.format === 'date') {
      return format(selectedDate, 'MMM dd, yyyy');
    }
    if (schema.type === 'string' && schema.format === 'time') {
      return format(selectedDate, 'hh:mm a');
    }
    return format(selectedDate, 'MMM dd, yyyy hh:mm a');
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.pickerContainer}>
        <Pressable
          onPress={() => showMode('date')}
          disabled={disabled || readonly}
          style={[
            styles.button,
            (disabled || readonly) && styles.buttonDisabled,
          ]}
          accessibilityRole="button"
          accessibilityLabel={`Select ${schema.format || 'date-time'}`}
          accessibilityState={{
            disabled: disabled || readonly,
          }}
        >
          <Text style={styles.buttonText}>{displayFormat()}</Text>
        </Pressable>

        {show && (
          <DateTimePicker
            testID={id}
            value={selectedDate}
            mode={mode}
            onChange={handleChange}
            disabled={disabled || readonly}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  label: {
    marginBottom: 5,
    fontSize: 16,
    fontWeight: '500',
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    flex: 1,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 16,
  },
});

export default DateTimeWidget;
