// syntax: <KhordadRadioBtn onChangeValue={()=>this.setState({gender: true})} label={"مرد"} checkedColor={colors.buttonsGray} selected={gender}/>

import React, {Component} from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import {height, scaleFontSize, width} from '../../Utils/window';
import {commonStyles} from '../../SharedStyles/commonStyles';
import Tik from '../../Assetes/SvgIcons/Tik';
export default class RadioBtn extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const {
      containerStyle,
      labelStyle,
      label,
      checkedColor,
      selected,
    } = this.props;
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={this.props.onChangeValue}
        style={{
          justifyContent: 'center',
          flexDirection: 'row',
          // ...containerStyle,
        }}>
        <Text
          style={[
            commonStyles.textStyle,
            {
              fontSize: scaleFontSize(20),
              color: '#474747',
              // ...labelStyle,
            },
          ]}>
          {label || ''}
        </Text>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={this.props.onChangeValue}
          style={{
            width: width * 0.07,
            height: height * 0.038,
            // borderRadius: (width * 0.2) / 2,
            borderWidth: width * 0.002,
            borderColor: checkedColor,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'transparent',
            marginLeft: width * 0.02,
            borderRadius: width * 0.005,
          }}>
          {selected ? <Tik style={{transform: [{scale: 1.5}]}} /> : null}
        </TouchableOpacity>
      </TouchableOpacity>
    );
  }
}
