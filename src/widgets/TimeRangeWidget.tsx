import { StyleSheet, View, Text, ViewStyle, TextStyle } from 'react-native';
import type { FC } from 'react';
import { pick } from 'lodash';
import moment from 'moment';
import { useOnChange, useAutoFocus } from '../utils';
import type { OnChangeProps } from '../types/utils';
import type { UISchema } from '../types';
import DateWidget from './DateWidget';

interface Styles {
  container: ViewStyle;
  rangeContainer: ViewStyle;
  separator: ViewStyle;
  separatorText: TextStyle;
  defaults: ViewStyle;
  fullWidth: ViewStyle;
  auto: ViewStyle;
  marginTop: ViewStyle;
}

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
  },
  rangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  separator: {
    paddingHorizontal: 10,
  },
  separatorText: {
    fontSize: 16,
    color: '#000000',
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
  marginTop: {
    marginTop: -10,
  },
});

// Time encoders/decoders
export const NUMBER_ENCODER = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

export const NUMBER_DECODER = (value: number): string => {
  const hours = Math.floor(value / 60);
  const minutes = value % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

export const STRING_ENCODER = (time: string): string => time;
export const STRING_DECODER = (value: string): string => value;

interface TimeRangeWidgetProps extends OnChangeProps {
  schema: Record<string, any>;
  uiSchema: UISchema;
  hasError: boolean;
  name: string;
  value?: string[] | number[];
  readonly?: boolean;
  disabled?: boolean;
  auto?: boolean;
  encoder?: 'number' | 'string' | ((value: any) => any) | null;
  decoder?: ((value: any) => any) | null;
  header?: boolean;
  style?: ViewStyle;
  minTime?: string;
  maxTime?: string;
  interval?: number;
  filterTime?: (time: string) => boolean;
  selectedStyle?: ViewStyle;
  unselectedStyle?: ViewStyle;
}

const TimeRangeWidget: FC<TimeRangeWidgetProps> = (props) => {
  const {
    schema,
    uiSchema,
    hasError,
    name,
    value = [],
    readonly,
    disabled,
    auto,
    encoder,
    decoder,
    header,
    style,
    minTime,
    maxTime,
    interval,
    filterTime,
  } = props;

  const autoFocusParams = useAutoFocus(props);
  const onChange = useOnChange(props);

  const currentStyle = [
    styles.defaults,
    auto ? styles.auto : styles.fullWidth,
    header && styles.marginTop,
    style,
  ].filter(Boolean) as ViewStyle[];

  let encoderFn: ((value: any) => any) | undefined;
  let decoderFn: ((value: any) => any) | undefined;
  if (encoder !== null) {
    if (encoder === 'number') {
      encoderFn = NUMBER_ENCODER;
      decoderFn = NUMBER_DECODER;
    } else if (encoder === 'string') {
      encoderFn = STRING_ENCODER;
      decoderFn = STRING_DECODER;
    } else if (encoder) {
      encoderFn = encoder;
      decoderFn = decoder || undefined;
    }
  }

  const handleStartTimeChange = (time: string) => {
    const endTime = value[1];
    const newValue = [time, endTime];
    onChange(encoderFn ? newValue.map(encoderFn) : newValue);
  };

  const handleEndTimeChange = (time: string) => {
    const startTime = value[0];
    const newValue = [startTime, time];
    onChange(encoderFn ? newValue.map(encoderFn) : newValue);
  };

  const startTime = value[0] ? (decoderFn ? decoderFn(value[0]) : value[0]) : '';
  const endTime = value[1] ? (decoderFn ? decoderFn(value[1]) : value[1]) : '';

  const isValidTime = (time: string) => {
    if (!time) return true;
    if (filterTime && !filterTime(time)) return false;
    if (minTime && time < minTime) return false;
    if (maxTime && time > maxTime) return false;
    return true;
  };

  return (
    <View style={currentStyle}>
      <View style={styles.rangeContainer}>
        <View style={{ flex: 1 }}>
          <DateWidget
            {...autoFocusParams}
            uiSchema={uiSchema}
            name={`${name}_start`}
            value={startTime}
            onChange={handleStartTimeChange}
            mode="time"
            format="HH:mm"
            readonly={readonly}
            disabled={disabled}
            hasError={hasError || !isValidTime(startTime)}
            is24Hour={true}
            timeIntervals={interval}
          />
        </View>
        <View style={styles.separator}>
          <Text style={styles.separatorText}>to</Text>
        </View>
        <View style={{ flex: 1 }}>
          <DateWidget
            uiSchema={uiSchema}
            name={`${name}_end`}
            value={endTime}
            onChange={handleEndTimeChange}
            mode="time"
            format="HH:mm"
            readonly={readonly}
            disabled={disabled}
            hasError={hasError || !isValidTime(endTime)}
            is24Hour={true}
            timeIntervals={interval}
          />
        </View>
      </View>
    </View>
  );
};

TimeRangeWidget.defaultProps = {
  value: [],
  readonly: false,
  disabled: false,
  auto: false,
  style: undefined,
  encoder: null,
  decoder: null,
  header: true,
};

export default TimeRangeWidget;
