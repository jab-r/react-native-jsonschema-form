import { useState } from 'react';
import {
  has,
  get,
  each,
  uniq,
  first,
  indexOf,
  flatten,
  isNaN,
  isArray,
  isString,
  isPlainObject,
} from 'lodash';
import { humanize } from 'underscore.string';
import { JSONSchema7 } from 'json-schema';
import { ViewStyle } from 'react-native';
import {
  GridChild,
  Structure,
  AutoFocusProps,
  AutoFocusResult,
  OnChangeProps,
  SchemaWithProperties,
  SchemaWithItems,
} from './types/utils';
import { UISchema } from './types';

export const EMPTY = '%empty%';
export const FIELD_KEY = '%key%';
export const FIELD_NAME = '%name%';
export const FIELD_VALUE = '%value%';
export const FIELD_TITLE = '%title%';

const FIELD_KEY_REGEX = /%key%/g;
const FIELD_NAME_REGEX = /%name%/g;
const FIELD_VALUE_REGEX = /%value%/g;
const FIELD_TITLE_REGEX = /%title%/g;
const ORIGINAL_VALUES_REGEX = /__originalValues/;

const passThrough = () => (value: any) => value;

const withDefaults = (uiSchema: UISchema, base: UISchema = {}): UISchema => ({
  '*': base['*'] || uiSchema['*'] || {}, // Pass default through
  ...(base['*'] || uiSchema['*'] || {}), // Inherit default properties
  ...(uiSchema || {}),
});

const getGridStructure = (
  grid: GridChild,
  schema: SchemaWithProperties,
  uiSchema: UISchema,
  getStructure: (
    schema: JSONSchema7,
    uiSchema: UISchema,
    key: string,
    compiledSchema: Record<string, JSONSchema7>,
    compiledUiSchema: Record<string, UISchema>
  ) => Structure
): Structure => {
  if (grid.type === 'label') {
    return { schema: {}, uiSchema: {} };
  }
  const compiledSchema: Record<string, JSONSchema7> = {};
  const compiledUiSchema: Record<string, UISchema> = {};
  
  each(grid.children, (item) => {
    if (isString(item)) {
      getStructure(
        schema.properties[item],
        withDefaults(uiSchema[item] as UISchema, uiSchema),
        item,
        compiledSchema,
        compiledUiSchema,
      );
    } else {
      const gridStructure = getGridStructure(item, schema, uiSchema, getStructure);
      Object.assign(compiledSchema, gridStructure.schema);
      Object.assign(compiledUiSchema, gridStructure.uiSchema);
    }
  });
  
  return {
    schema: compiledSchema,
    uiSchema: compiledUiSchema,
  };
};

const isValid = (key: string, pick: string[], omitted: string[], include: string[]): boolean => (
  (include.length && include.indexOf(key) >= 0) || (
    (!pick.length || pick.indexOf(key) >= 0)
    && (!omitted.length || omitted.indexOf(key) < 0)
  )
);

const getUiSchemaPick = (schema: SchemaWithProperties, uiSchema: UISchema): string[] => {
  let pick = uiSchema['ui:pick'] || [];
  if (pick === 'required') {
    pick = schema.required || [];
  } else if (pick && pick.length) {
    const requiredIndex = indexOf(pick, '*required');
    if (requiredIndex >= 0) {
      pick = pick.concat([]);
      pick[requiredIndex] = schema.required || [];
      pick = uniq(flatten(pick));
    }
  } else {
    pick = Object.keys(schema.properties);
  }
  return pick;
};

const orderedKeys = (schema: SchemaWithProperties, uiSchema: UISchema): string[] => uniq((
  uiSchema['ui:order'] as string[]
  || getUiSchemaPick(schema, uiSchema)
).concat(Object.keys(schema.properties)));

const orderedEach = (
  schema: SchemaWithProperties,
  uiSchema: UISchema,
  iterator: (schema: JSONSchema7, key: string) => void
): void => {
  const keys = orderedKeys(schema, uiSchema);
  each(keys, key => iterator(schema.properties[key], key));
};

export const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const getAutoFocus = ({ uiSchema }: AutoFocusProps): boolean => !!uiSchema['ui:autofocus'];

export const useAutoFocus = ({ uiSchema, onFocus, onBlur }: AutoFocusProps): AutoFocusResult => {
  const [autoFocus, setAutoFocus] = useState<boolean>(getAutoFocus({ uiSchema }));

  return {
    autoFocus,
    onFocus: (...args: any[]) => {
      setAutoFocus(true);
      if (onFocus) {
        onFocus(...args);
      }
    },
    onBlur: (...args: any[]) => {
      setAutoFocus(false);
      if (onBlur) {
        onBlur(...args);
      }
    },
  };
};

export const useOnChange = (props: OnChangeProps) => {
  const {
    name,
    onChange,
    parser = passThrough,
  } = props;

  return (value: any) => onChange(parser(props)(value), name);
};

export const getStructure = (
  possibleSchema: JSONSchema7 | undefined,
  uiSchema: UISchema,
  key: string,
  compiledSchema: Record<string, JSONSchema7> = {},
  compiledUiSchema: Record<string, UISchema> = {},
): Structure => {
  if (!possibleSchema) {
    return {
      schema: compiledSchema,
      uiSchema: compiledUiSchema,
    };
  }

  let schema = possibleSchema;
  if (schema.anyOf && Array.isArray(schema.anyOf) && schema.anyOf.length > 0) {
    const firstSchema = first(schema.anyOf) as JSONSchema7;
    if (firstSchema) {
      schema = firstSchema;
    }
  } else if (schema.oneOf && Array.isArray(schema.oneOf) && schema.oneOf.length > 0) {
    const firstSchema = first(schema.oneOf) as JSONSchema7;
    if (firstSchema) {
      schema = firstSchema;
    }
  }

  if (schema.type === 'object') {
    const schemaNode: SchemaWithProperties = {
      ...schema,
      properties: {},
      required: schema.required || [],
    };
    const uiSchemaNode = withDefaults(uiSchema);

    if (uiSchemaNode['ui:grid']) {
      // Pull properties defined on/ordered by the grid
      each(uiSchema['ui:grid'] as GridChild[], (grid) => {
        const gridStructure = getGridStructure(grid, schema as SchemaWithProperties, uiSchemaNode, getStructure);
        Object.assign(schemaNode.properties, gridStructure.schema);
        Object.assign(uiSchemaNode, gridStructure.uiSchema);
      });
    } else {
      // Pull valid properties in order of ui:order
      const pick = getUiSchemaPick(schema as SchemaWithProperties, uiSchema);
      const omitted = uiSchema['ui:omit'] as string[] || [];
      const include = uiSchema['ui:include'] as string[] || [];
      
      orderedEach(schema as SchemaWithProperties, uiSchema, (propertySchema, propertyKey) => {
        if (isValid(propertyKey, pick, omitted, include)) {
          getStructure(
            propertySchema,
            withDefaults(uiSchema[propertyKey] as UISchema, uiSchemaNode),
            propertyKey,
            schemaNode.properties,
            uiSchemaNode,
          );
        }
      });
    }

    if (key) {
      compiledSchema[key] = schemaNode;
      compiledUiSchema[key] = uiSchemaNode;
    } else {
      Object.assign(compiledSchema, schemaNode);
      Object.assign(compiledUiSchema, uiSchemaNode);
    }
  } else if (schema.type === 'array') {
    const schemaNode: SchemaWithItems = {
      ...schema,
      items: schema.items as JSONSchema7,
    };
    const uiSchemaNode = withDefaults(uiSchema);

    getStructure(
      schemaNode.items,
      withDefaults(uiSchemaNode.items as UISchema, uiSchemaNode),
      'items',
      schemaNode as unknown as Record<string, JSONSchema7>,
      uiSchemaNode,
    );

    compiledSchema[key] = schemaNode;
    compiledUiSchema[key] = uiSchemaNode;
  } else {
    compiledSchema[key] = { ...schema };
    compiledUiSchema[key] = { ...uiSchema };
  }

  return {
    schema: compiledSchema,
    uiSchema: compiledUiSchema,
  };
};

export const isField = (element: Element | null, classNameRegex: RegExp): boolean => {
  if (!element || !classNameRegex) return false;
  
  let currentNode: Element | null = element;
  while (currentNode && currentNode !== document.documentElement) {
    const className = currentNode.className || '';
    const dataClass = currentNode.getAttribute('data-class') || '';
    
    if (classNameRegex.test(className) || classNameRegex.test(dataClass)) {
      return true;
    }
    currentNode = currentNode.parentElement;
  }
  return false;
};

// Similar to lodash's merge but it doesn't merge arrays.
// Instead, arrays are replaced by source's array.
export const merge = (destination: Record<string, any>, source: Record<string, any> = {}): Record<string, any> => {
  const result = { ...destination };
  each(source, (v, k) => {
    if (!has(result, k)) {
      result[k] = v;
    } else if (isPlainObject(v)) {
      if (!isPlainObject(result[k])) {
        result[k] = v;
      } else {
        result[k] = merge(result[k], v);
      }
    } else {
      result[k] = v;
    }
  });
  return result;
};

export const getValues = (
  data: any,
  schema: JSONSchema7,
  key?: string,
  casting: boolean = true,
  uiSchema: UISchema | false = false,
  errors: boolean = false
): any => {
  let value = key ? get(data, key) : data;
  
  if (schema.type === 'object') {
    value = isPlainObject(value) ? value : {};
    const node: Record<string, any> = {};
    
    each((schema as SchemaWithProperties).properties, (propertySchema, propertyKey) => {
      node[propertyKey] = getValues(
        value,
        propertySchema,
        propertyKey,
        casting,
        uiSchema && (uiSchema[propertyKey] as UISchema),
        errors,
      );
    });

    if (uiSchema) {
      value['ui:disabled'] = (uiSchema && uiSchema['ui:disabled']) || false;
    }
    if (errors) {
      node.__originalValues = value;
    }
    return node;
  }

  if (schema.type === 'array') {
    value = isArray(value) ? value : [];
    if (uiSchema) {
      value['ui:disabled'] = (uiSchema && uiSchema['ui:disabled']) || false;
    }
    const values = value.map((item: any) => getValues(
      item,
      (schema as SchemaWithItems).items,
      undefined,
      casting,
      uiSchema && (uiSchema.items as UISchema),
      errors,
    ));

    if (errors) {
      values.__originalValues = value;
    }
    return values;
  }

  if (casting) {
    if (value === null || value === undefined) {
      switch (schema.type) {
        case 'string': value = schema.enum ? null : ''; break;
        case 'number':
        case 'integer':
        default: value = null;
      }
    } else {
      switch (schema.type) {
        case 'string': value = `${value}`; break;
        case 'number': value = parseFloat(value); break;
        case 'integer': value = parseInt(value, 10); break;
        default: break;
      }
      if (isNaN(value)) {
        value = null;
      }
    }
  } else if (uiSchema) {
    value = {
      'ui:disabled': (uiSchema && uiSchema['ui:disabled']) || false,
    };
  }
  return value;
};

export const getMetas = (data: any, schema: JSONSchema7, uiSchema: UISchema): any =>
  getValues(data, schema, undefined, false, uiSchema);

export const getErrors = (data: any, schema: JSONSchema7, key?: string): any =>
  getValues(data, schema, key, false, false, true);

export const withPrefix = (key: string, prefix: string): string =>
  prefix ? `${prefix}.${key}` : key;

export const getExceptions = (
  errorSchema: any,
  errors: any,
  path: string = ''
): Record<string, string[]> => {
  const exceptions: Record<string, string[]> = {};
  
  if (
    isArray(errorSchema)
    && errorSchema.length
    && isString(errorSchema[0])
    && !errors
    && !ORIGINAL_VALUES_REGEX.test(path)
  ) {
    exceptions[path] = errorSchema;
  } else if (isPlainObject(errorSchema) || isArray(errorSchema)) {
    each(errorSchema, (v, k) => Object.assign(
      exceptions,
      getExceptions(errorSchema[k], get(errors, k), withPrefix(k, path)),
    ));
  }
  return exceptions;
};

const nameToPath = /\.([0-9]+)\.?/g;

export const toPath = (name: string, replacement: string = '[$1]'): string =>
  name.replace(nameToPath, replacement);

export interface TitleParams {
  key?: string;
  name?: string;
  value?: string;
}

export const getTitle = (format: string | undefined, params: TitleParams = {}): string => {
  let title = format || '';
  title = title.replace(FIELD_TITLE_REGEX, humanize(params.key || ''));
  title = title.replace(FIELD_KEY_REGEX, params.key || '');
  title = title.replace(FIELD_NAME_REGEX, params.name || '');
  title = title.replace(FIELD_VALUE_REGEX, params.value || '');
  return title;
};

export const getTitleFormat = (schema: JSONSchema7, uiSchema: UISchema): string | false => {
  let format = uiSchema['ui:title'];
  if (format === undefined) {
    format = schema.title;
  }
  if (format === undefined && schema.type !== 'object') {
    format = FIELD_TITLE;
  }
  if (format === undefined) {
    format = false;
  }
  if (format && !isString(format)) {
    if (schema.type !== 'object') {
      format = FIELD_TITLE;
    } else {
      format = false;
    }
  }
  return format;
};

export const ucfirst = (text: string): string => {
  if (!text) {
    return '';
  }
  return `${text[0].toUpperCase()}${text.substring(1)}`;
};

export const getComponent = <T>(
  name: string,
  suffix: string,
  library: Record<string, T>
): T | undefined => library[`${ucfirst(name)}${suffix}`];

export const expand = (update: string | string[]): Record<string, boolean> => {
  const parts: Record<string, boolean> = {};
  const updates = Array.isArray(update) ? update : [update];
  each(updates, (name) => {
    const keys = name.split('.');
    let prefix = '';
    each(keys, (key) => {
      prefix = withPrefix(key, prefix);
      parts[prefix] = true;
    });
  });
  return parts;
};

export const getRequired = (schema: JSONSchema7, prefix: string = ''): Record<string, boolean> => {
  let required: Record<string, boolean> = {};
  
  if (schema.type === 'object') {
    each((schema as SchemaWithProperties).required || [], (propertyKey) => {
      required[withPrefix(propertyKey, prefix)] = true;
    });
    each((schema as SchemaWithProperties).properties, (propertySchema, propertyKey) => Object.assign(
      required,
      getRequired(propertySchema, withPrefix(propertyKey, prefix)),
    ));
  }
  
  if (schema.type === 'array') {
    Object.assign(
      required,
      getRequired((schema as SchemaWithItems).items, withPrefix('0', prefix))
    );
  }
  
  if (prefix === '') {
    const normalizedRequired: Record<string, boolean> = {};
    each(required, (v, k) => {
      normalizedRequired[toPath(k, '[]')] = v;
    });
    required = normalizedRequired;
  }
  
  return required;
};

export const maskOptions = {
  undefined: /^$/,
  a: /^[A-Za-zÀ-ÖØ-öø-ÿ]$/,
  9: /^[0-9]$/,
  '*': /^.$/,
};

const defaultParser = (value: any): string =>
  ((value === null || value === undefined) ? '' : `${value}`);

export const formatMask = (
  value: any,
  mask: string,
  maskParser?: (value: any) => string
): string => {
  const parse = maskParser || defaultParser;
  const text = parse(value);
  let result = '';
  let cursorText = 0;
  let cursorMask = 0;
  
  for (; cursorText < text.length; cursorText += 1) {
    let charText = text[cursorText];
    let charMask;
    let extras = '';
    
    do {
      charMask = mask[cursorMask];
      cursorMask += 1;
      if (!(charMask in maskOptions)) {
        extras += charMask;
        if (charMask === charText) {
          cursorText += 1;
          charText = text[cursorText] || '';
          result += extras;
          extras = '';
        }
      }
    } while (!(charMask in maskOptions));
    
    if (maskOptions[charMask as keyof typeof maskOptions].test(charText)) {
      result += extras + charText;
    }
  }
  
  return result;
};

export const normalized = (value: any): string => {
  if (value === '' || value === null || value === undefined) {
    return '';
  }
  return value;
};

export const isEmpty = (value: any): boolean =>
  value === '' || value === null || value === undefined;

export const viewStyleKeys: Array<keyof ViewStyle> = [
  'alignContent',
  'alignItems',
  'alignSelf',
  'aspectRatio',
  'backfaceVisibility',
  'backgroundColor',
  'borderBottomColor',
  'borderBottomEndRadius',
  'borderBottomLeftRadius',
  'borderBottomRightRadius',
  'borderBottomStartRadius',
  'borderBottomWidth',
  'borderColor',
  'borderEndColor',
  'borderEndWidth',
  'borderLeftColor',
  'borderLeftWidth',
  'borderRadius',
  'borderRightColor',
  'borderRightWidth',
  'borderStartColor',
  'borderStartWidth',
  'borderStyle',
  'borderTopColor',
  'borderTopEndRadius',
  'borderTopLeftRadius',
  'borderTopRightRadius',
  'borderTopStartRadius',
  'borderTopWidth',
  'borderWidth',
  'bottom',
  'direction',
  'display',
  'elevation',
  'end',
  'flex',
  'flexBasis',
  'flexDirection',
  'flexGrow',
  'flexShrink',
  'flexWrap',
  'height',
  'justifyContent',
  'left',
  'margin',
  'marginBottom',
  'marginEnd',
  'marginHorizontal',
  'marginLeft',
  'marginRight',
  'marginStart',
  'marginTop',
  'marginVertical',
  'maxHeight',
  'maxWidth',
  'minHeight',
  'minWidth',
  'opacity',
  'overflow',
  'padding',
  'paddingBottom',
  'paddingEnd',
  'paddingHorizontal',
  'paddingLeft',
  'paddingRight',
  'paddingStart',
  'paddingTop',
  'paddingVertical',
  'position',
  'right',
  'shadowColor',
  'shadowOffset',
  'shadowOpacity',
  'shadowRadius',
  'start',
  'top',
  'transform',
  'width',
  'zIndex'
] as const;
