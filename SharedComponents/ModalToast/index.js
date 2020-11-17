import React from 'react';

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  TouchableWithoutFeedback,
  TouchableNativeFeedback,
  KeyboardAvoidingView,
} from 'react-native';
import {connect} from 'react-redux';
import {commonStyles} from '../../SharedStyles/commonStyles';

import {width, height, isIphoneX, scaleFontSize} from '../../Utils/window';
import CardView from 'react-native-cardview';
import ModalComponent from '../Modal';
import LottieView from 'lottie-react-native';
import {
  dispatchItemToRedux,
  saveTokenAndMobile,
} from '../../Redux/actions/commonActions';
import {TOAST_MESSAGE_MODAL} from '../../Redux/types/reducerTypes';
import CloseIcon from '../../Assetes/SvgIcons/Close/Grey';
import Font from '../../Constants/font';

export const SimpleToast = React.memo(function(props) {
  const {title} = props;

  React.useEffect(
    function() {
      if (Platform.OS === 'ios') {
        const RNToasty = require('react-native-toasty').RNToasty;
        RNToasty.Show({
          title: title + '',
          fontFamily: Font.Vazir,
          position: 'bottom',
        });
      }
    },
    [title],
  );
  if (Platform.OS === 'ios') {
    return null;
  }
  return (
    <CardView
      style={[styles.simpleToastContainer, props.containerStyle || {}]}
      cardElevation={2}
      maxCardElevation={2}
      cornerRadius={width * 0.045}>
      <Text
        style={[
          commonStyles.textStyle,
          commonStyles.centerText,
          {
            fontSize: scaleFontSize(21),
            color: '#fff',
            padding: 0,
            margin: 0,
            marginVertical: height * 0.015,
          },
        ]}>
        {title || ''}
      </Text>
    </CardView>
  );
});

function ModalToast(props) {
  const {title, body, messageType, dispatchItemToRedux} = props;

  const close = React.useCallback(function() {
    dispatchItemToRedux({
      type: TOAST_MESSAGE_MODAL,
      payload: {
        toastMessage: {
          title: '',
          body: '',
          messageType: null,
        },
      },
    });
  });
  React.useEffect(
    function() {
      if (messageType && messageType !== 'gps_warning') {
        setTimeout(
          function() {
            close();
          },
          messageType === 'simpleToast' ? 3000 : 5000,
        );
      }
    },
    [messageType],
  );

  const lottiFiles = {
    error: require('../../Assetes/LottieFiles/toast_lotties/error.json'),
    success: require('../../Assetes/LottieFiles/toast_lotties/success.json'),
    warning: require('../../Assetes/LottieFiles/toast_lotties/warning.json'),
    announce: require('../../Assetes/LottieFiles/toast_lotties/announce.json'),
  };
  if (!messageType) {
    return null;
  }
  let lottieName = messageType;
  if (messageType.indexOf('_') > -1) {
    const str = messageType.split('_');
    lottieName = str[str.length - 1];
  }
  if (messageType === 'simpleToast') {
    return <SimpleToast title={title} />;
  } else {
    return (
      <CardView
        style={styles.container}
        cardElevation={2}
        maxCardElevation={2}
        cornerRadius={width * 0.025}>
        <View
          style={{
            width: '100%',
            height: height * 0.24,
          }}>
          <LottieView
            source={lottiFiles[lottieName]}
            autoPlay
            loop={false}
            style={{
              position: 'absolute',
              top: 0,
              alignSelf: 'center',
            }}
          />
        </View>
        <Text
          style={[
            commonStyles.textStyle,
            commonStyles.centerText,
            {
              marginTop: height * Platform.select({ios: 0.0, android: 0.0}),
              fontSize: scaleFontSize(25),
              fontFamily: Font.VazirBold,
            },
          ]}>
          {title || ''}
        </Text>
        {body ? (
          <Text
            style={[
              commonStyles.textStyle,
              commonStyles.centerText,
              {
                marginTop: height * 0.025,
                fontSize: scaleFontSize(22),
                overflow: 'hidden',
                paddingHorizontal: width * 0.025,
                marginBottom: height * 0.025,
              },
            ]}
            numberOfLines={3}>
            {body || ''}
          </Text>
        ) : null}
        <TouchableWithoutFeedback
          onPress={function() {
            if (messageType === 'gps_warning') {
              /**
               * save permission deny
               */
              saveTokenAndMobile({hidePermissionGrantBox: true});
              saveTokenAndMobile({hidePermissionGrantBox: true});
            } else {
            }
            close();
          }}
          hitSlop={{
            left: width * 0.05,
            right: width * 0.04,
            bottom: height * 0.045,
            top: height * 0.045,
          }}>
          <View
            style={{
              position: 'absolute',
              top: width * 0.05,
              right: width * 0.05,
            }}>
            <CloseIcon style={{transform: [{scale: 1.4}]}} />
          </View>
        </TouchableWithoutFeedback>
      </CardView>
    );
  }
}

function mapStateToProps(state) {
  const {
    app: {
      toastMessage: {title, body, messageType},
    },
  } = state;
  return {title, body, messageType};
}

export default connect(
  mapStateToProps,
  {dispatchItemToRedux},
)(ModalToast);

const styles = StyleSheet.create({
  container: {
    width: width * 0.85,
    minHeight: height * 0.35,
    borderRadius: width * 0.025,
    backgroundColor: '#fff',
    alignItems: 'center',
    alignSelf: 'center',
    position: 'absolute',
    top: height * 0.2,
    zIndex: 999999999,
  },
  simpleToastContainer: {
    minWidth: width * 0.25,
    maxWidth: width * 0.75,
    minHeight:
      height *
      Platform.select({ios: isIphoneX ? 0.0725 : 0.085, android: 0.085}),
    backgroundColor: '#000',
    alignSelf: 'center',
    paddingHorizontal: width * 0.04,
    position: 'absolute',
    bottom: height * 0.06,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999999999999,
  },
});
