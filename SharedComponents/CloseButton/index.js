import {height, width} from '../../Utils/window';
import {
  Platform,
  TouchableWithoutFeedback,
  View,
  StyleSheet,
} from 'react-native';
import {colors} from '../../Constants/colors';
import * as React from 'react';
import Icons from 'react-native-vector-icons/MaterialIcons';
function CloseButton(props) {
  return (
    <TouchableWithoutFeedback
      onPress={props.onPress}
      hitSlop={{
        right: width * 0.02,
        bottom: height * 0.02,
        left: width * 0.02,
      }}>
      <View style={[styles.container, props.containerStyle || {}]}>
        <Icons
          name={'close'}
          size={props.iconSize||(width * 0.08)}
          color={props.iconColor || colors.circleCardGray}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}
export default React.memo(CloseButton);
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    position: 'absolute',
    top: height * 0.01,
    right: width * 0.035,
    height:
      Platform.select({
        ios: 0.07,
        android: 0.07,
      }) * height,
    zIndex: 9999999,
  },
});
