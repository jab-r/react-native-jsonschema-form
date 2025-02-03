import React from 'react';
import { KeyboardTypeOptions } from 'react-native';
import { repeat, isNaN } from 'lodash';
import TextInputWidget from './TextInputWidget';
import { OnChangeProps } from '../types/utils';
import { UISchema } from '../types';

const INITIAL_ZEROS = /^0*/g;
const NUMBER_ONLY = /[^0-9]/g;
const THOUSANDS = /\B(?=(\d{3})+(?!\d))/g;

interface NumberSettings {
  currency: boolean;
  prefix: string;
  suffix: string;
  affixesStay: boolean;
  thousands: string;
  decimal: string;
  precision: number;
  allowNegative: boolean;
  allowEmpty: boolean;
  reverse: boolean;
}

function setSymbol(value: string, settings: NumberSettings): string {
  let operator = '';
  if (value.indexOf('-') > -1) {
    value = value.replace('-', '');
    operator = '-';
  }
  if (value.indexOf(settings.prefix) > -1) {
    value = value.replace(settings.prefix, '');
  }
  if (value.indexOf(settings.suffix) > -1) {
    value = value.replace(settings.suffix, '');
  }
  return operator + settings.prefix + value + settings.suffix;
}

function buildIntegerPart(integerPart: string, negative: string, settings: NumberSettings): string {
  // remove initial zeros
  integerPart = integerPart.replace(INITIAL_ZEROS, '');

  // put settings.thousands every 3 chars
  integerPart = integerPart.replace(THOUSANDS, settings.thousands);
  if (integerPart === '') {
    integerPart = '0';
  }
  return negative + integerPart;
}

function maskValueStandard(value: string, settings: NumberSettings): string {
  const negative = (value.indexOf('-') > -1 && settings.allowNegative) ? '-' : '';
  let onlyNumbers = value.replace(NUMBER_ONLY, '');
  let integerPart = onlyNumbers.slice(0, onlyNumbers.length - settings.precision);
  let newValue;
  let decimalPart;
  let leadingZeros;

  newValue = buildIntegerPart(integerPart, negative, settings);

  if (settings.precision > 0) {
    if (!Number.isNaN(value) && value.indexOf('.')) {
      const precision = value.substr(value.indexOf('.') + 1);
      onlyNumbers += '0'.repeat(Math.max(0, (settings.precision + 1) - precision.length));
      integerPart = onlyNumbers.slice(0, onlyNumbers.length - settings.precision);
      newValue = buildIntegerPart(integerPart, negative, settings);
    }
    decimalPart = onlyNumbers.slice(onlyNumbers.length - settings.precision);
    leadingZeros = '0'.repeat((settings.precision + 1) - decimalPart.length);
    newValue += settings.decimal + leadingZeros + decimalPart;
  }
  return setSymbol(newValue, settings);
}

function maskValueReverse(value: string, settings: NumberSettings): string {
  const negative = (value.indexOf('-') > -1 && settings.allowNegative) ? '-' : '';
  const valueWithoutSymbol = value.replace(settings.prefix, '').replace(settings.suffix, '');
  let integerPart = valueWithoutSymbol.split(settings.decimal)[0];
  let newValue;
  let decimalPart = '';

  if (integerPart === '') {
    integerPart = '0';
  }
  newValue = buildIntegerPart(integerPart, negative, settings);

  if (settings.precision > 0) {
    const arr = valueWithoutSymbol.split(settings.decimal);
    if (arr.length > 1) {
      [, decimalPart] = arr;
    }
    newValue += settings.decimal + decimalPart;
    const rounded = Number.parseFloat((`${integerPart}.${decimalPart}`)).toFixed(settings.precision);
    const roundedDecimalPart = rounded.toString().split(settings.decimal)[1];
    newValue = `${newValue.split(settings.decimal)[0]}.${roundedDecimalPart}`;
  }
  return setSymbol(newValue, settings);
}

function maskValue(text: string, settings: NumberSettings): string {
  if (settings.allowEmpty && text === '') {
    return '';
  }
  let value = text.replace(new RegExp(settings.thousands, 'g'), '');
  if (settings.precision > 0 && value.indexOf(settings.decimal) >= 0) {
    const parts = value.split(settings.decimal);
    if (parts[1].length < settings.precision) {
      if (parseFloat(parts[0]) + parseFloat(parts[1]) === 0) {
        return '';
      }
      value = `${parts[0].substring(0, parts[0].length - 1)}${settings.decimal}${parts[0][parts[0].length - 1]}${parts[1]}`;
    } else {
      value = `${parts[0]}${settings.decimal}${parts[1]}`;
    }
  } else if (settings.precision > 0) {
    if (settings.reverse) {
      value = `${text}${settings.decimal}0`;
    } else {
      value = `0${settings.decimal}${'0'.repeat(settings.precision)}${text}`;
    }
  }
  if (settings.reverse) {
    return maskValueReverse(value, settings);
  }
  return maskValueStandard(value, settings);
}

const useMask = ({ currency, ...settings }: Partial<NumberSettings> & Pick<NumberSettings, 'currency'>) => 
  (value: string, direction?: 'in' | 'out'): string => {
    if (!currency) {
      return value;
    }
    let textValue = value;
    if (direction === 'in') {
      const { decimal, precision = 0 } = settings;
      if (precision > 0 && decimal) {
        const parts = textValue.split(decimal);
        if (parts.length < 2) {
          parts.push('0');
        }
        if (parts[1].length < precision) {
          parts[1] += repeat('0', precision - parts[1].length);
          textValue = parts.join(decimal);
        }
      }
    }
    return maskValue(textValue, { currency, ...settings } as NumberSettings);
  };

const useTextParser = ({ currency, thousands, decimal }: Partial<NumberSettings>) => 
  (value: string): string => {
    if (!currency) {
      if (value[value.length - 1] === decimal && value.split(decimal).length === 2) {
        return value;
      }
      const result = parseFloat(value);
      return !isNaN(result) ? result.toString() : '';
    }
    if (thousands && decimal) {
      const thousandsRegex = new RegExp(`\\${thousands}`, 'g');
      const decimalRegex = new RegExp(`\\${decimal}`);
      const result = parseFloat(value.replace(thousandsRegex, '').replace(decimalRegex, '.'));
      return !isNaN(result) ? result.toString() : '';
    }
    return value;
  };

interface NumberWidgetProps extends OnChangeProps {
  uiSchema: UISchema;
  update: string | Record<string, any>;
  renderId: number;
  hasError: boolean;
  value?: any;
  readonly?: boolean;
  disabled?: boolean;
  placeholder?: string;
  auto?: boolean;
  currency?: boolean;
  prefix?: string;
  suffix?: string;
  affixesStay?: boolean;
  thousands?: string;
  decimal?: string;
  precision?: number;
  allowNegative?: boolean;
  allowEmpty?: boolean;
  reverse?: boolean;
}

const NumberWidget: React.FC<NumberWidgetProps> = (props) => {
  const mask = useMask(props as NumberSettings);
  const textParser = useTextParser(props as NumberSettings);

  return (
    <TextInputWidget
      {...props}
      mask={mask}
      textParser={textParser}
      keyboardType={'number-pad' as KeyboardTypeOptions}
    />
  );
};

NumberWidget.defaultProps = {
  currency: false,
  prefix: '',
  suffix: '',
  affixesStay: true,
  thousands: ',',
  decimal: '.',
  precision: 2,
  allowNegative: false,
  allowEmpty: false,
  reverse: false,
  value: undefined,
  readonly: false,
  disabled: false,
  placeholder: '',
  auto: false,
};

export default NumberWidget;
