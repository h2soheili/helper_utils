import React from 'react';

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from 'react-native';
import {connect} from 'react-redux';
import {commonStyles} from '../../SharedStyles/commonStyles';

import {width, height, isIphoneX} from '../../Utils/window';

class SmallCircle extends React.PureComponent {
  render() {
    return (
      <View style={[styles.container, this.props.containerStyle || {}]}>
        <View style={[styles.circle, this.props.circleStyle || {}]} />
      </View>
    );
  }
}

export default SmallCircle;
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: height * Platform.select({ios: isIphoneX ? 0.825 : 0.85, android: 0.85}),
    right: -width * 0.29,
  },
  circle: {
    width: width * 0.6,
    height: width * 0.6,
    backgroundColor: '#F6F9FC',
    borderRadius: width * 0.4,
  },
});
