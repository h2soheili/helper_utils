import React from 'react';

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  TouchableNativeFeedback,
} from 'react-native';
import {connect} from 'react-redux';
import {commonStyles} from '../../SharedStyles/commonStyles';
import Colors from '../../Constants/colors';

import {width, height, isIphoneX, scaleFontSize} from '../../Utils/window';

/**
 *
 * Spinner Button
 *
 *
 * @param {String} text required
 *
 * @param {Boolean} showBigButtonSpinner requird
 *
 * @param {Func} onPress required
 *
 * @param {Object} containerStyle optional
 *
 *
 *
 */
const Touchable=Platform.OS === 'android' ? TouchableNativeFeedback : TouchableOpacity;
interface Props {
  showButtonSpinner: boolean;
  containerStyle?: undefined | object;
  onPress?: () => void;
  text?: undefined | string;
  fontStyle?: {
    color?: string;
  };
}
const SpinnerButton = (props: Props) => {
  const {showButtonSpinner} = props;
  return (
    <Touchable
      onPress={function() {
        if (props.onPress) {
          props.onPress();
        }
      }}
      disabled={showButtonSpinner}>
      <View style={[styles.cont, props.containerStyle || {}]}>
        <View style={[commonStyles.box1, {}]}>
          {showButtonSpinner === false ? (
            <Text
              style={[
                commonStyles.textStyle,
                {
                  textAlign: 'center',
                  fontSize: scaleFontSize(20),
                  color: '#FFFFFF',
                },
                props.fontStyle || {},
              ]}>
              {props.text || ''}
            </Text>
          ) : (
            <ActivityIndicator
              color={
                showButtonSpinner
                  ? '#ffffff'
                  : props.hasOwnProperty('fontStyle') && props.fontStyle?.color
                  ? props.fontStyle?.color
                  : '#ffffff'
              }
              size={Platform.OS === 'android' ? width * 0.075 : 2}
            />
          )}
        </View>
      </View>
    </Touchable>
  );
};
interface State {
  app:{
    showButtonSpinner:boolean
  };
}
function mapStateToProps(state:State) {
  return {showButtonSpinner: state.app?.showButtonSpinner};
}
export default connect(mapStateToProps)(React.memo(SpinnerButton));

const styles = StyleSheet.create({
  cont: {
    backgroundColor: Colors.green,
    width: width * 0.88,
    height: Platform.select({
      ios: isIphoneX ? height * 0.07 : height * 0.07,
      android: height * 0.08,
    }),
    borderRadius: width * 0.02,
    alignSelf: 'center',
    borderColor: '#87AFEB66',
    borderWidth: 0.1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
