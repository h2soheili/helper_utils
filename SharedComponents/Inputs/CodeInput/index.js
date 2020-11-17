import React from 'react';

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import {connect} from 'react-redux';
import {commonStyles} from '../../../SharedStyles/commonStyles';
import {height, scaleFontSize, width} from '../../../Utils/window';
import Font from '../../../Constants/font';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';

class Input extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View style={[styles.container, this.props.containerStyle || {}]}>
        <View style={[commonStyles.box1]}>
          <Text
            style={[
              commonStyles.textStyle,
              {fontSize: width * 0.048},
              this.props.labelStyle || {},
            ]}>
            {this.props.label || ''}
          </Text>
        </View>
        <View style={[commonStyles.box1, {flex: 4}]}>
          <CodeField
            value={this.props.value}
            onChangeText={this.props.onChangeText}
            cellCount={6}
            rootStyle={styles.codeFiledRoot}
            keyboardType="number-pad"
            renderCell={({index, symbol, isFocused}) => (
              <Text
                key={index}
                style={[styles.cell, isFocused && styles.focusCell]}>
                {symbol || (isFocused ? <Cursor /> : null)}
              </Text>
            )}
          />
        </View>
      </View>
    );
  }
}

export default Input;
const styles = StyleSheet.create({
  container: {
    width: width,
    minHeight:
      Platform.select({
        ios: 0.2,
        android: 0.2,
      }) * height,
    alignItems: 'center',
    marginTop:
      Platform.select({
        ios: 0.1,
        android: 0.0,
      }) * height,
  },
  codeFiledRoot: {
    marginTop:
      Platform.select({
        ios: 0.03,
        android: 0.03,
      }) * height,
    borderRadius: width * 0.02,
    borderColor: '#0000000D',
    borderWidth: width * 0.006,
    paddingHorizontal: width * 0.01,
    paddingVertical:
      Platform.select({
        ios: 0.01,
        android: 0.01,
      }) * height,
    width: width * 0.7,
    alignItems: 'center',
  },
  cell: {
    width: width * 0.07,
    height: 40,
    lineHeight: 38,
    fontSize: scaleFontSize(28),
    borderBottomWidth: 2,
    borderColor: '#00000030',
    textAlign: 'center',
    marginHorizontal: width * 0.02,
  },
  focusCell: {
    borderColor: '#000',
  },
});
