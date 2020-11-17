import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TextInput,
  TouchableWithoutFeedback,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {connect} from 'react-redux';
import {commonStyles} from '../../SharedStyles/commonStyles';
import {height, width, scaleFontSize} from '../../Utils/window';
import Colors from '../../Constants/colors';
import Font from '../../Constants/font';

class NotificationItem extends React.PureComponent {
  constructor(props) {
    super(props);
    this.onNotificationPress = this.onNotificationPress.bind(this);
  }

  onNotificationPress() {
    if (this.props.onPress) {
      /**
       * navigate to Screen
       */
      this.props.onPress(this.props.item);
    }
  }

  render() {
    const {
      renderBottomLine,
      item: {title, type, content, seen, date},
      containerStyle,
      titleStyle,
      bodyStyle,
      bodyNumberOfLines,
    } = this.props;
    if (!type === 'message') {
      return null;
    }
    return (
      <TouchableWithoutFeedback onPress={this.onNotificationPress}>
        <View style={[styles.container, containerStyle || {}]}>
          {seen === 0 ? <View style={styles.bullet} /> : null}
          <Text
            style={[
              commonStyles.textStyle,
              commonStyles.rightText,
              {
                fontSize: scaleFontSize(22),
                color: seen === 0 ? '#19212E' : 'rgba(25,33,46,0.49)',
                fontFamily: Font.VazirBold,
                overflow: 'hidden',
              },
              titleStyle || {},
            ]}
            numberOfLines={2}>
            {title || ''}
          </Text>
          <Text
            style={[
              commonStyles.textStyle,
              {
                color: seen === 0 ? '#19212E' : 'rgba(25,33,46,0.49)',
                fontFamily: Font.VazirLight,
                textAlign: 'right',
                alignSelf: 'flex-end',
                overflow: 'hidden',
              },
              bodyStyle || {},
            ]}
            numberOfLines={bodyNumberOfLines || 99999}>
            {content || ''}
          </Text>
          <Text
            style={[
              commonStyles.textStyle,
              commonStyles.leftText,
              {
                color: '#19212E45',
                fontFamily: Font.VazirLight,
                overflow: 'hidden',
                marginLeft: width * (renderBottomLine ? 0.02 : -0.04),
              },
              bodyStyle || {},
            ]}
            numberOfLines={bodyNumberOfLines || 99999}>
            {date || ''}
          </Text>
          {renderBottomLine ? <View style={[styles.line]} /> : null}
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

export default NotificationItem;
const styles = StyleSheet.create({
  container: {
    marginTop:
      Platform.select({
        ios: 0.02,
        android: 0.02,
      }) * height,
    paddingLeft: width * 0.04,
    paddingRight: width * 0.01,
    justifyContent: 'center',
    alignItems: 'center',
  },
  line: {
    width: '90%',
    height: 1,
    alignSelf: 'center',
    backgroundColor: '#0000000D',
    marginTop:
      Platform.select({
        ios: 0.02,
        android: 0.02,
      }) * height,
  },
  bullet: {
    width: width * 0.02,
    height: width * 0.02,
    borderRadius: width * 0.02,
    backgroundColor: '#6498E6',
    position: 'absolute',
    left: width * 0.01,
    top: height * 0.015,
  },
});
