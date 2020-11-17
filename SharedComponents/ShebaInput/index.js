import React from 'react';
import {StyleSheet, View, TextInput, Text, Platform} from 'react-native';
import {commonStyles} from '../../SharedStyles/commonStyles';
import {scaleFontSize} from '../../Utils/window';
import {IBANSpaces, priceDigitSeperator} from '../../Utils/helpers';
import {width, height} from '../../Utils/window';

function ShebaInput(props) {
  return (
    <View style={[styles.input, props.containerStyle || {}]}>
      <Text
        style={[
          commonStyles.textStyle,
          commonStyles.centerText,
          {
            position: 'absolute',
            fontSize: scaleFontSize(28),
            width: width * 0.7,
          },
        ]}>
        {` ${IBANSpaces(props.value || '')}  `}
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
        // value={props.value || ''}
      />
    </View>
  );
}

export default React.memo(ShebaInput);
const styles = StyleSheet.create({
  input: {
    width: '100%',
    padding: 0,
    margin: 0,
  },
});
