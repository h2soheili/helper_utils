import React from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import {height, width} from '../../Utils/window';
import LottieView from 'lottie-react-native';

function CircleLoading(props) {
  const {containerStyle, lottieStyle, renderLoading} = props;
  if (renderLoading) {
    return (
      <View style={[styles.cont, containerStyle || {}]}>
        <LottieView
          source={require('../../Assetes/LottieFiles/loading-circle.json')}
          autoPlay
          loop={true}
          style={[styles.lottieStyle, lottieStyle || {}]}
        />
      </View>
    );
  }
  return null;
}

export default React.memo(CircleLoading);
const styles = StyleSheet.create({
  cont: {
    alignSelf: 'center',
    alignItems: 'center',
    width: width * 0.26,
    height: height * 0.16,
    padding: 10,
    // backgroundColor: 'red',
  },
  lottieStyle: {
    position: 'absolute',
    top: 0,
    transform: [{scale: 1.25}],
    padding: 10,
  },
});
