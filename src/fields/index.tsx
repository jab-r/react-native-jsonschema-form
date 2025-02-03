import { ComponentType } from 'react';
import ArrayField from './ArrayField';
import BooleanField from './BooleanField';
import IntegerField from './IntegerField';
import NullField from './NullField';
import NumberField from './NumberField';
import ObjectField from './ObjectField';
import StringField from './StringField';
import { AbstractFieldProps } from './AbstractField';

interface Fields {
  [key: string]: ComponentType<AbstractFieldProps>;
}

const fields: Fields = {
  ArrayField,
  BooleanField,
  IntegerField,
  NullField,
  NumberField,
  ObjectField,
  StringField,
};

export type { Fields, AbstractFieldProps as FieldProps };
export type FieldComponent = ComponentType<AbstractFieldProps>;

export default fields;
