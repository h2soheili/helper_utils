import React from 'react';
import {View, Text, StyleSheet, Platform, TouchableOpacity} from 'react-native';
import {commonStyles} from '../../SharedStyles/commonStyles';
import {height, width} from '../../Utils/window';
import LinearGradient from 'react-native-linear-gradient';
import {colors} from '../../Constants/colors';
import {CustomIcons} from '../../Utils/customIcons';
import {hasNotch} from '../../Utils/window';
const LEFT_CIRCLE_DIMENSION = width * 0.4;
const RIGHT_CIRCLE_DIMENSION = width * 0.45;
function func() {}
const hitSlop = {
  top: height * 0.03,
  bottom: height * 0.03,
  right: width * 0.05,
  left: width * 0.05,
};
/**
 *
 *
 */
class Header extends React.PureComponent {
  render() {
    const {
      LeftIcon,
      leftFunc,
      title,
      titleFunc,
      titleStyle,
      RightIcon,
      rightFunc,
      rightStyle,
      LeftComponent,
      RightComponent,
    } = this.props;
    return (
      <LinearGradient
        start={{
          x: 0,
          y: 0,
        }}
        end={{
          x: 0.5,
          y: 1,
        }}
        style={[styles.container, this.props.containerStyle || {}]}
        colors={this.props.colors || ['#009B7F', '#02856E']}>
        <View style={[styles.leftCircle]} />
        <View style={[styles.rightCircle]} />
        <View style={[commonStyles.row]}>
          <View style={[commonStyles.box1, {}]}>
            <TouchableOpacity onPress={leftFunc || func} hitSlop={hitSlop}>
              <View>
                {LeftIcon ? (
                  // <LeftIcon style={[styles.leftIcon, leftStyle || {}]} />
                  <CustomIcons
                    name={LeftIcon}
                    size={width * 0.055}
                    color={colors.white}
                  />
                ) : null}
                {LeftComponent ? LeftComponent() : null}
              </View>
            </TouchableOpacity>
          </View>
          <View style={[commonStyles.box1, {flex: 3}]}>
            <TouchableOpacity onPress={titleFunc || func} hitSlop={hitSlop}>
              <View>
                {title ? (
                  <Text
                    style={[
                      commonStyles.textStyle,
                      styles.titleStyle,
                      titleStyle || {},
                    ]}>
                    {title}
                  </Text>
                ) : null}
              </View>
            </TouchableOpacity>
          </View>
          <View style={[commonStyles.box1, {}]}>
            <TouchableOpacity onPress={rightFunc || func} hitSlop={hitSlop}>
              <View>
                {RightIcon ? (
                  <RightIcon style={[styles.rightIcon, rightStyle || {}]} />
                ) : null}
                {RightComponent ? RightComponent() : null}
              </View>
            </TouchableOpacity>
          </View>
        </View>
        {this.props.children ? (
          <React.Fragment>{this.props.children}</React.Fragment>
        ) : null}
      </LinearGradient>
    );
  }
}

export default Header;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    minHeight:
      Platform.select({
        ios: 0.0825,
        android: 0.0825,
      }) *
        height +
      (hasNotch ? 0.02 * height : 0),
    justifyContent: 'center',
    overflow: 'hidden',
    paddingTop: hasNotch ? 0.035 * height : 0,
  },
  leftIcon: {
    transform: [{scale: 1.2}],
  },
  rightIcon: {
    transform: [{scale: 1.2}],
  },
  leftCircle: {
    width: LEFT_CIRCLE_DIMENSION,
    height: LEFT_CIRCLE_DIMENSION,
    backgroundColor: '#fff',
    opacity: 0.11,
    borderRadius: LEFT_CIRCLE_DIMENSION,
    position: 'absolute',
    bottom: -LEFT_CIRCLE_DIMENSION * 0.9,
    left: -LEFT_CIRCLE_DIMENSION * 0.28,
  },
  rightCircle: {
    width: RIGHT_CIRCLE_DIMENSION,
    height: RIGHT_CIRCLE_DIMENSION,
    backgroundColor: '#fff',
    opacity: 0.08,
    borderRadius: RIGHT_CIRCLE_DIMENSION,
    position: 'absolute',
    top:
      -RIGHT_CIRCLE_DIMENSION * 0.75 +
      (hasNotch ? RIGHT_CIRCLE_DIMENSION * 0.125 : 0),
    right: -RIGHT_CIRCLE_DIMENSION * 0.3,
  },
  titleStyle: {
    fontSize: width * 0.043,
    color: '#fff',
  },
});
