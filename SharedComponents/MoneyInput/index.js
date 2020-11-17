import React from 'react';
import {StyleSheet, View, TextInput, Text, Platform} from 'react-native';
import {commonStyles} from '../../SharedStyles/commonStyles';
import {scaleFontSize} from '../../Utils/window';
import {priceDigitSeperator} from '../../Utils/helpers';
import {width, height} from '../../Utils/window';

function MoneyInput(props) {
  return (
    <View style={[styles.input, props.containerStyle || {}]}>
      <Text
        style={[
          commonStyles.textStyle,
          commonStyles.centerText,
          {
            position: 'absolute',
            fontSize: scaleFontSize(28),
          },
        ]}>
        {` ${priceDigitSeperator(props.value || '')}  `}
      </Text>
      <TextInput
        style={[
          styles.input,
          commonStyles.centerText,
          {
            color: 'transparent',
            paddingHorizontal: width * 0.02,
            backgroundColor: 'transparent',
            fontSize: scaleFontSize(28),
          },
        ]}
        onChangeText={props.onChangeText}
        keyboardType={'number-pad'}
        value={props.value || ''}
      />
    </View>
  );
}

export default React.memo(MoneyInput);
const styles = StyleSheet.create({
  input: {
    width: '100%',
    padding: 0,
    margin: 0,
  },
});
