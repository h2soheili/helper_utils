import React from 'react';
import {StyleSheet, View, TouchableWithoutFeedback} from 'react-native';
import {width, height, isIphoneX, hasNotch} from '../../Utils/window';
/**
 * svg icon
 */
import ArrowBlackIcon from '../../Assetes/SvgIcons/Arrow/ArrowBlack';
import {popScreen} from '../../Utils/nav';
const hitSlop = {
  top: height * 0.05,
  bottom: height * 0.05,
  left: width * 0.05,
  right: width * 0.05,
};
const styles = StyleSheet.create({
  cont: {
    position: 'absolute',
    top: height * (hasNotch ? 0.06 : 0.04),
    left: width * 0.08,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    justifyContent: 'center',
  },
});
/**
 *
 * @param props
 * @returns {*}
 * @constructor
 */
function BackButton(props) {
  return (
    <TouchableWithoutFeedback
      onPress={function() {
        if (props.onPress) {
          props.onPress();
        } else {
          popScreen(props.componentId);
        }
      }}
      hitSlop={hitSlop}>
      <View style={styles.cont}>
        <View style={styles.box}>
          <ArrowBlackIcon />
        </View>
        {props.children ? (
          <View style={styles.box}>{props.children}</View>
        ) : null}
      </View>
    </TouchableWithoutFeedback>
  );
}
export default React.memo(BackButton);
