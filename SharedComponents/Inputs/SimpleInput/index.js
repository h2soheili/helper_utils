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
import {height, width, scaleFontSize} from '../../../Utils/window';
import Font from '../../../Constants/font';
class Input extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View style={[styles.container, this.props.containerStyle || {}]}>
        {this.props.label ? (
          <View style={[commonStyles.box1]}>
            <Text
              style={[
                commonStyles.textStyle,
                // {fontSize: width * 0.048},
                {fontSize: scaleFontSize(20)},
                this.props.labelStyle || {},
              ]}>
              {this.props.label || ''}
            </Text>
          </View>
        ) : null}
        <View style={[commonStyles.box1]}>
          <TextInput
            editable={this.props.editable}
            value={this.props.value || ''}
            onChangeText={this.props.onChangeText}
            style={[styles.textInput, this.props.textInputStyle || {}]}
            placeholder={this.props.placeholder || ''}
            placeholderStyle={{color: '#C2CDD9', fontSize: scaleFontSize(20)}}
            keyboardType={this.props.keyboardType || 'default'}
            multiline={this.props.multiline || false}
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
    minHeight: Platform.select({
      ios: height * 0.1,
      android: height * 0.1,
    }),
    alignItems: 'center',
  },
  textInput: {
    padding: 0,
    margin: 0,
    marginTop: Platform.select({
      ios: height * 0.04,
      android: height * 0.04,
    }),
    flex: 1,
    minHeight: Platform.select({
      ios: height * 0.078,
      android: height * 0.078,
    }),
    borderWidth: width * 0.004,
    borderColor: '#0000000D',
    borderRadius: width * 0.02,
    width: width * 0.9,
    backgroundColor: '#ffffff',
    textAlign: 'right',
    ...Platform.select({
      android: {
        fontFamily: Font.Vazir,
      },
    }),
    paddingHorizontal: width * 0.04,
    fontSize: scaleFontSize(20),
    textAlignVertical: 'center',
  },
});
