import React from 'react';
import { StyleSheet, Platform, ViewStyle, Pressable, GestureResponderEvent } from 'react-native';
import View from 'react-native-web-ui-components/View';

interface FileAreaProps {
  schema: Record<string, any>;
  uiSchema: Record<string, any>;
  value: any;
  meta?: Record<string, any>;
  metas?: Record<string, any>;
  values?: Record<string, any>;
  style?: ViewStyle | ViewStyle[];
  onClick: (event: GestureResponderEvent) => void;
  onAreaClick: (event: GestureResponderEvent) => void;
  onChange: (value: any, name: string, params?: Record<string, any>) => void;
  canRemove: boolean;
  onRemove: () => void;
  onUploadPress: () => void;
  RemoveComponent: React.ComponentType<{
    onPress: () => void;
    label?: React.ReactNode;
    style?: ViewStyle | ViewStyle[];
  }>;
  UploadComponent: React.ComponentType<{
    onPress: () => void;
    label?: React.ReactNode;
    style?: ViewStyle | ViewStyle[];
  }>;
  removeStyle?: ViewStyle | ViewStyle[];
  removeLabel?: React.ReactNode;
  uploadStyle?: ViewStyle | ViewStyle[];
  uploadLabel?: React.ReactNode;
}

const FileArea: React.FC<FileAreaProps> = ({
  schema,
  uiSchema,
  value,
  meta,
  metas,
  values,
  style,
  onClick,
  onAreaClick,
  onChange,
  canRemove,
  onRemove,
  onUploadPress,
  RemoveComponent,
  UploadComponent,
  removeStyle,
  removeLabel,
  uploadStyle,
  uploadLabel,
}) => {
  const handleAreaClick = (event: GestureResponderEvent) => {
    onAreaClick(event);
  };

  return (
    <Pressable onPress={Platform.OS === 'web' ? handleAreaClick : undefined}>
      <View style={style}>
        {canRemove && RemoveComponent && (
          <RemoveComponent
            onPress={onRemove}
            label={removeLabel}
            style={removeStyle}
          />
        )}
        {UploadComponent && (
          <UploadComponent
            onPress={onUploadPress}
            label={uploadLabel}
            style={uploadStyle}
          />
        )}
      </View>
    </Pressable>
  );
};

FileArea.defaultProps = {
  meta: undefined,
  metas: undefined,
  values: undefined,
  style: {},
  removeStyle: undefined,
  removeLabel: undefined,
  uploadStyle: undefined,
  uploadLabel: undefined,
};

export default FileArea;
