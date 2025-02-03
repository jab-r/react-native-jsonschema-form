import { StyleSheet, View, Platform, TouchableOpacity, Text, Modal, ViewStyle, TextStyle } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import type { FC } from 'react';
import moment from 'moment';
import { pick } from 'lodash';
import { useOnChange, useAutoFocus } from '../utils';
import type { OnChangeProps } from '../types/utils';
import type { UISchema } from '../types';
import TextInputWidget from './TextInputWidget';

interface Styles {
  container: ViewStyle;
  input: ViewStyle;
  modalContainer: ViewStyle;
  modalContent: ViewStyle;
  buttonContainer: ViewStyle;
  button: ViewStyle;
  buttonText: TextStyle;
  defaults: ViewStyle;
  fullWidth: ViewStyle;
  auto: ViewStyle;
}

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#C7C7CC',
    borderRadius: 4,
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    minWidth: 100,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: '#007AFF',
  },
  defaults: {
    marginBottom: 10,
  },
  fullWidth: {
    width: '100%',
  },
  auto: {
    marginBottom: 0,
  },
});

const datepickerProps = [
  'mode',
  'format',
  'timeIntervals',
  'is24Hour',
] as const;

interface DateWidgetProps extends OnChangeProps {
  uiSchema: UISchema & {
    'ui:excludeDates'?: string[] | null;
    'ui:minDate'?: string | null;
    'ui:maxDate'?: string | null;
  };
  name: string;
  value?: string | number;
  placeholder?: string;
  readonly?: boolean;
  disabled?: boolean;
  hasError?: boolean;
  auto?: boolean;
  style?: ViewStyle;
  showCalendarOnFocus?: boolean;
  mode?: 'date' | 'datetime' | 'time';
  format?: string;
  timeIntervals?: number;
  is24Hour?: boolean;
}

const DateWidget: FC<DateWidgetProps> = (props) => {
  const {
    uiSchema,
    onChange,
    name,
    value,
    placeholder,
    readonly,
    disabled,
    hasError,
    auto,
    style,
    mode = 'date',
    format,
  } = props;

  const [showPicker, setShowPicker] = useState(false);
  const [tempDate, setTempDate] = useState<Date | null>(
    value ? moment(value).toDate() : null
  );

  const autoFocusParams = useAutoFocus(props);
  const onWrappedChange = useOnChange(props);

  let currentFormat = format;
  if (!currentFormat) {
    switch (mode) {
      case 'time': currentFormat = 'h:mma'; break;
      case 'datetime': currentFormat = 'MM/DD/YYYY h:mma'; break;
      default: currentFormat = 'MM/DD/YYYY';
    }
  }

  const css = [
    styles.defaults,
    auto ? styles.auto : styles.fullWidth,
    style,
  ].filter((s): s is ViewStyle => s !== undefined);

  const handlePress = () => {
    if (!disabled && !readonly) {
      setShowPicker(true);
    }
  };

  const handleChange = (_: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }

    if (selectedDate) {
      setTempDate(selectedDate);
      if (Platform.OS === 'android') {
        const formattedDate = moment(selectedDate).format(currentFormat);
        onWrappedChange(formattedDate);
      }
    }
  };

  const handleCancel = () => {
    setShowPicker(false);
    setTempDate(value ? moment(value).toDate() : null);
  };

  const handleConfirm = () => {
    setShowPicker(false);
    if (tempDate) {
      const formattedDate = moment(tempDate).format(currentFormat);
      onWrappedChange(formattedDate);
    }
  };

  const displayValue = value 
    ? moment(value).format(currentFormat)
    : '';

  if (Platform.OS === 'ios') {
    return (
      <View style={css}>
        <TouchableOpacity
          onPress={handlePress}
          disabled={disabled || readonly}
        >
          <View style={[styles.input, hasError && { borderColor: 'red' }]}>
            <Text>{displayValue || placeholder}</Text>
          </View>
        </TouchableOpacity>

        <Modal
          visible={showPicker}
          transparent
          animationType="slide"
          onRequestClose={handleCancel}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <DateTimePicker
                {...pick(props, datepickerProps)}
                {...autoFocusParams}
                value={tempDate || new Date()}
                onChange={handleChange}
                mode={mode}
                display="spinner"
                minimumDate={uiSchema['ui:minDate'] ? moment(uiSchema['ui:minDate']).toDate() : undefined}
                maximumDate={uiSchema['ui:maxDate'] ? moment(uiSchema['ui:maxDate']).toDate() : undefined}
              />
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={handleCancel}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={handleConfirm}
                >
                  <Text style={styles.buttonText}>Confirm</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  return (
    <View style={css}>
      <TouchableOpacity
        onPress={handlePress}
        disabled={disabled || readonly}
      >
        <View style={[styles.input, hasError && { borderColor: 'red' }]}>
          <Text>{displayValue || placeholder}</Text>
        </View>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          {...pick(props, datepickerProps)}
          {...autoFocusParams}
          value={tempDate || new Date()}
          onChange={handleChange}
          mode={mode}
          minimumDate={uiSchema['ui:minDate'] ? moment(uiSchema['ui:minDate']).toDate() : undefined}
          maximumDate={uiSchema['ui:maxDate'] ? moment(uiSchema['ui:maxDate']).toDate() : undefined}
        />
      )}
    </View>
  );
};

DateWidget.defaultProps = {
  value: '',
  placeholder: '',
  readonly: false,
  disabled: false,
  hasError: false,
  auto: false,
  style: undefined,
  showCalendarOnFocus: true,
  mode: 'date',
  format: undefined,
};

export default DateWidget;
