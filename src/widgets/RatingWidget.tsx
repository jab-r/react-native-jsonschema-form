import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  ViewStyle,
  TextStyle,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { useOnChange } from '../utils';
import type { OnChangeProps } from '../types/utils';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

interface Styles {
  container: ViewStyle;
  starsContainer: ViewStyle;
  star: ViewStyle;
  starText: TextStyle;
  clearButton: ViewStyle;
  clearButtonText: TextStyle;
}

const styles = StyleSheet.create<Styles>({
  container: {
    width: '100%',
    marginBottom: 10,
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    padding: 5,
    marginRight: 5,
  },
  starText: {
    fontSize: 24,
    color: '#FFB800',
  },
  clearButton: {
    marginLeft: 10,
    padding: 5,
  },
  clearButtonText: {
    fontSize: 14,
    color: '#007AFF',
  },
});

interface RatingWidgetProps extends OnChangeProps {
  name: string;
  value?: number;
  maxRating?: number;
  starSize?: number;
  starColor?: string;
  emptyStarColor?: string;
  showClearButton?: boolean;
  clearButtonText?: string;
  style?: ViewStyle;
  starStyle?: ViewStyle;
  starTextStyle?: TextStyle;
  clearButtonStyle?: ViewStyle;
  clearButtonTextStyle?: TextStyle;
  disabled?: boolean;
  readonly?: boolean;
  hasError?: boolean;
}

const RatingWidget: React.FC<RatingWidgetProps> = (props) => {
  const {
    name,
    value = 0,
    maxRating = 5,
    starSize = 24,
    starColor = '#FFB800',
    emptyStarColor = '#C7C7CC',
    showClearButton = true,
    clearButtonText = 'Clear',
    style,
    starStyle,
    starTextStyle,
    clearButtonStyle,
    clearButtonTextStyle,
    disabled,
    readonly,
    hasError,
  } = props;

  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const onWrappedChange = useOnChange(props);

  const handleStarPress = useCallback((rating: number) => {
    if (disabled || readonly) return;

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    onWrappedChange(rating === value ? 0 : rating);
    setHoverRating(null);
  }, [disabled, readonly, value, onWrappedChange]);

  const handleClear = useCallback(() => {
    if (disabled || readonly) return;

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    onWrappedChange(0);
    setHoverRating(null);
  }, [disabled, readonly, onWrappedChange]);

  const renderStar = (rating: number) => {
    const isFilled = (hoverRating !== null ? hoverRating : value) >= rating;
    return (
      <TouchableOpacity
        key={rating}
        style={[styles.star, starStyle]}
        onPress={() => handleStarPress(rating)}
        onPressIn={() => setHoverRating(rating)}
        onPressOut={() => setHoverRating(null)}
        disabled={disabled || readonly}
      >
        <Text
          style={[
            styles.starText,
            { fontSize: starSize, color: isFilled ? starColor : emptyStarColor },
            starTextStyle,
          ]}
        >
          ★
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.starsContainer}>
        {Array.from({ length: maxRating }, (_, i) => renderStar(i + 1))}
        {showClearButton && value > 0 && !disabled && !readonly && (
          <TouchableOpacity
            style={[styles.clearButton, clearButtonStyle]}
            onPress={handleClear}
          >
            <Text style={[styles.clearButtonText, clearButtonTextStyle]}>
              {clearButtonText}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

RatingWidget.defaultProps = {
  value: 0,
  maxRating: 5,
  starSize: 24,
  starColor: '#FFB800',
  emptyStarColor: '#C7C7CC',
  showClearButton: true,
  clearButtonText: 'Clear',
  style: undefined,
  starStyle: undefined,
  starTextStyle: undefined,
  clearButtonStyle: undefined,
  clearButtonTextStyle: undefined,
  disabled: false,
  readonly: false,
  hasError: false,
};

export default RatingWidget;
