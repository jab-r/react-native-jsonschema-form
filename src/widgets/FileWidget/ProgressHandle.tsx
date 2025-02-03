import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import View from 'react-native-web-ui-components/View';
import Row from 'react-native-web-ui-components/Row';
import { Helmet, style } from 'react-native-web-ui-components/Helmet';

interface Styles {
  progress: ViewStyle;
  full: ViewStyle;
  error: ViewStyle;
}

const styles = StyleSheet.create<Styles>({
  progress: {
    position: 'absolute',
    top: 29,
    left: 0,
    width: '100%',
    height: 2,
    backgroundColor: 'rgba(200, 200, 200, 0.5)',
  },
  full: {
    height: 2,
  },
  error: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#FF0000',
    opacity: 0.2,
    borderRadius: 2,
  },
});

interface ProgressHandleProps {
  theme: {
    input: {
      regular: {
        selected: {
          color: string;
        };
      };
    };
  };
  meta: {
    'ui:progress'?: number;
    'ui:error'?: any;
  };
}

const ProgressHandle: React.FC<ProgressHandleProps> = ({ meta, theme }) => (
  <React.Fragment>
    <Helmet>
      <style>
        {`
          [data-class~="FileWidget__progress"] {
            transition: width 0.5s;
          }
        `}
      </style>
    </Helmet>
    {meta['ui:progress'] !== undefined && meta['ui:progress'] < 100 ? (
      <Row style={styles.progress}>
        <View
          className="FileWidget__progress"
          style={[
            styles.full,
            {
              width: `${meta['ui:progress']}%`,
              backgroundColor: StyleSheet.flatten(theme.input.regular.selected).color,
            },
          ]}
        />
      </Row>
    ) : null}
    {meta['ui:error'] !== undefined ? (
      <Row style={styles.error} />
    ) : null}
  </React.Fragment>
);

export default ProgressHandle;
