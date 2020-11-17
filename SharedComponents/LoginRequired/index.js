import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import {connect} from 'react-redux';
import {commonStyles} from '../../SharedStyles/commonStyles';
import {height, scaleFontSize, width} from '../../Utils/window';
import ModalComponent from '../Modal';
import SimpleInput from '../Inputs/SimpleInput';
import {authActions, sentOtpCode} from '../../Redux/actions/authActions';
import {
  dispatchItemToRedux,
  getNecessaryData,
} from '../../Redux/actions/commonActions';
import {INPUT_VALUE_HANDLER} from '../../Redux/types/reducerTypes';
import {SIGN_IN} from '../../Redux/types/actionTypes';
import SpinnerButton from '../SpinnerButton';
import {Events} from '../../Constants/firebaseEvent';
import {getData} from '../../Redux/actions/dbActions';
import {CustomIcons} from '../../Utils/customIcons';
import {colors} from '../../Constants/colors';
import {hasNotch} from '../../Utils/window';
import CloseButton from '../CloseButton';
import {analyticsModule, extractNumberFromString} from '../../Utils/helpers';
import CardView from 'react-native-cardview';
const INITIAL_STATE = {
  showInputBox: false,
  showCodeInput: false,
  time: '1:00',
  timer: 60,
  runTimer: false,
  showLoginBox: false,
};
class LoginRequired extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      ...INITIAL_STATE,
      showInputBox: this.props.showInputBox ? this.props.showInputBox : false,
    };
    this.onButtonPress = this.onButtonPress.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.startTimer = this.startTimer.bind(this);
    this.getCodeAgain = this.getCodeAgain.bind(this);
    this.sendMobile = this.sendMobile.bind(this);
    this.showOrHideLoginBox = this.showOrHideLoginBox.bind(this);
    this.onReceiveSms = this.onReceiveSms.bind(this);
    this.onSmsListener = this.onSmsListener.bind(this);
    this.removeSmsListener = this.removeSmsListener.bind(this);
  }
  getCodeAgain() {
    if (this.mounted) {
      this.setState({runTimer: true, time: '1:00', timer: 60}, () => {
        this.startTimer();
      });
      this.sendMobile();
    }
  }
  startTimer() {
    if (this.state.runTimer && this.state.timer > 0 && this.mounted) {
      this.setState(
        {
          time:
            this.state.timer - 1 > 10
              ? this.state.timer - 1
              : '0' + this.state.timer - 1,
          timer: this.state.timer - 1,
        },
        () => {
          setTimeout(() => {
            this.startTimer();
          }, 1000);
        },
      );
    }
  }
  sendMobile() {
    const analytics = analyticsModule();
    analytics().logEvent('Map_Insert_Phone', Events.Map_Insert_Phone);
    this.props
      .authActions({type: SIGN_IN, payload: {}})
      .then(res => {
        if (this.mounted) {
          this.setState({showCodeInput: true});
        }
        if (this.mounted && this.state.runTimer === false) {
          this.setState({runTimer: true, showCodeInput: true}, () => {
            this.startTimer();
          });
        }
      })
      .catch(e => {});
  }
  onButtonPress() {
    if (this.state.showCodeInput) {
      const analytics = analyticsModule();
      analytics().logEvent('Map_Insert_OTP', Events.Map_Insert_OTP);

      this.props
        .sentOtpCode()
        .then(res => {
          // remove sms retriever api listener
          this.removeSmsListener();
          this.props.getNecessaryData({type: 'NecessaryData', payload: {}});
          if (this.mounted) {
            this.setState({
              showCodeInput: false,
              showInputBox: false,
              runTimer: false,
            });
          }
          if (this.props.onLoginSuccess) {
            this.props.onLoginSuccess();
          }
        })
        .catch(e => {});
    } else {
      this.sendMobile();
    }
  }
  showOrHideLoginBox(access) {
    if (this.mounted) {
      if (
        access &&
        typeof access === 'string' &&
        this.state.showLoginBox === true
      ) {
        this.setState({
          showLoginBox: false,
        });
      } else if (access === null) {
        getData('MANIFEST').then(result => {
          if (result && Array.isArray(result) && result.length > 0) {
            const manifest = JSON.parse(result[0].payload);
            if (manifest && manifest.hasOwnProperty('access')) {
              if (this.mounted) {
                this.setState({
                  showLoginBox: manifest.access === null ? true : false,
                });
              }
            } else {
              if (this.mounted) {
                this.setState({
                  showLoginBox: true,
                });
              }
            }
          }
        });
      }
    }
  }
  toggleModal() {
    if (this.mounted) {
      this.setState({
        showInputBox: !this.state.showInputBox,
      });
    }
    if (this.state.showInputBox === true && this.props.onClose) {
      this.props.onClose();
    }
  }
  async onSmsListener() {
    if (Platform.OS === 'android') {
      const SmsRetriever = require('react-native-sms-retriever').default;
      try {
        const registered = await SmsRetriever.startSmsRetriever();
        // const signature = await SmsRetriever.getAppSignature();
        // alert(signature);
        if (registered) {
          SmsRetriever.addSmsListener(this.onReceiveSms);
        }
      } catch (error) {}
    }
  }
  onReceiveSms(e) {
    if (e && e.hasOwnProperty('message')) {
      let code = extractNumberFromString(e.message);
      this.props.dispatchItemToRedux({
        type: INPUT_VALUE_HANDLER,
        payload: {
          type: 'code',
          value: code,
        },
      });
      setTimeout(() => {
        this.onButtonPress();
      }, 350);
    }
  }
  componentDidMount(): void {
    this.mounted = true;
    this.timer = setTimeout(() => {
      this.showOrHideLoginBox(this.props.access);
    }, this.props.timeOut || 1000);
    this.onSmsListener();
  }
  removeSmsListener() {
    if (Platform.OS === 'android') {
      const SmsRetriever = require('react-native-sms-retriever').default;
      SmsRetriever.removeSmsListener();
    }
  }
  componentWillUnmount(): void {
    this.mounted = false;
    clearTimeout(this.timer);
    this.removeSmsListener();
  }
  componentDidUpdate(prevProps, prevState, snapshot): void {
    if (prevProps.access !== this.props.access) {
      setTimeout(() => {
        this.showOrHideLoginBox(this.props.access);
      }, 1000);
    }
  }

  render() {
    if (this.state.showLoginBox === false) {
      return null;
    }
    return (
      <React.Fragment>
        {this.props.showSpinneButton === false ? null : (
          <View style={[styles.container]}>
            <Text
              style={[
                commonStyles.textStyle,
                {fontSize: scaleFontSize(25), color: '#D0332C'},
              ]}>
              {' تــوجــه: '}
              <Text
                style={[
                  commonStyles.textStyle,
                  {fontSize: scaleFontSize(22), color: '#FFFFFF'},
                ]}>
                برای استفاده از مزایای منحصر به ‏فرد داپ ‏اَپ، ابتدا شمارۀ تلفن
                همراه خود را وارد کنید
              </Text>
            </Text>
            <SpinnerButton
              text={'وارد کردن شماره موبایل'}
              onPress={this.toggleModal}
              containerStyle={styles.buttonStyle}
            />
          </View>
        )}
        {this.state.showInputBox ? (
          <CardView
            cardElevation={2}
            maxCardElevation={2}
            cornerRadius={styles.modalCont.borderRadius}
            style={[
              styles.modalCont,
              {
                height:
                  (this.state.showCodeInput && this.state.runTimer
                    ? 0.48
                    : 0.4) * height,
              },
              this.props.modalCont || {},
            ]}>
            {this.state.showCodeInput ? (
              <TouchableWithoutFeedback
                onPress={() => {
                  if (this.mounted) {
                    this.setState({showCodeInput: false});
                  }
                }}
                hitSlop={{bottom: height * 0.03, right: width * 0.04}}>
                <View
                  style={{
                    position: 'absolute',
                    top: height * 0.035,
                    left: 0.035 * width,
                  }}>
                  <CustomIcons
                    name={'left'}
                    size={width * 0.05}
                    color={colors.circleCardGray}
                  />
                </View>
              </TouchableWithoutFeedback>
            ) : null}
            <Text
              style={[
                commonStyles.textStyle,
                commonStyles.centerText,
                {fontSize: scaleFontSize(22), marginTop: height * 0.02},
              ]}>
              ورود
            </Text>
            <Text
              style={[
                commonStyles.textStyle,
                commonStyles.centerText,
                {
                  fontSize: scaleFontSize(24),
                  marginTop: height * 0.025,
                  paddingHorizontal: width * 0.1,
                },
              ]}>
              {this.state.showCodeInput
                ? ` کد ارسال شده به شماره موبایل ${this.props.mobile ||
                    ''} را وارد کنید`
                : 'شماره موبایل خود را وارد نمایید'}
            </Text>
            <SimpleInput
              value={
                this.state.showCodeInput ? this.props.code : this.props.mobile
              }
              containerStyle={{
                height: height * 0.066,
                alignSelf: 'center',
              }}
              textInputStyle={[commonStyles.leftText, {width: width * 0.65}]}
              onChangeText={value => {
                this.props.dispatchItemToRedux({
                  type: INPUT_VALUE_HANDLER,
                  payload: {
                    type: this.state.showCodeInput ? 'code' : 'mobile',
                    value: value,
                  },
                });
                if (this.state.showCodeInput && value.length === 6) {
                  Keyboard.dismiss();
                  this.onButtonPress();
                }
              }}
              placeholder={
                this.state.showCodeInput
                  ? '  412266 مثال'
                  : ' ** ** *** 0912 مثال'
              }
              keyboardType={'number-pad'}
            />
            <SpinnerButton
              text={this.state.showCodeInput ? 'ورود' : 'ارسال کد'}
              onPress={this.onButtonPress}
              containerStyle={{
                width: width * 0.65,
                marginTop: height * 0.04,
                height: height * 0.075,
              }}
            />
            {this.state.showCodeInput && this.state.runTimer ? (
              <TouchableOpacity
                onPress={this.getCodeAgain}
                disabled={this.state.timer > 0}>
                <View style={[commonStyles.row, {marginTop: height * 0.03}]}>
                  <Text
                    style={[
                      commonStyles.textStyle,
                      commonStyles.centerText,
                      {},
                    ]}>
                    {`${this.state.time + '"'}`}
                  </Text>
                  <Text
                    style={[
                      commonStyles.textStyle,
                      commonStyles.centerText,
                      {},
                    ]}>
                    {' دوباره تلاش کنید'}
                  </Text>
                </View>
              </TouchableOpacity>
            ) : null}

            <CloseButton
              onPress={() => {
                this.setState({
                  ...INITIAL_STATE,
                });
                if (this.props.onClose) {
                  this.props.onClose();
                }
              }}
            />
          </CardView>
        ) : null}
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  const {
    input: {mobile, code},
    auth: {access},
  } = state;
  return {
    mobile: mobile,
    code,
    access,
  };
}
export default connect(
  mapStateToProps,
  {authActions, dispatchItemToRedux, getNecessaryData, sentOtpCode},
)(LoginRequired);

const styles = StyleSheet.create({
  container: {
    width: '95%',
    alignSelf: 'center',
    position: 'absolute',
    top:
      Platform.select({
        android: 0.11,
        ios: 0.11,
      }) *
        height +
      (hasNotch ? 0.02 * height : 0),
    backgroundColor: '#19212E',
    borderRadius: width * 0.03,
    paddingHorizontal: width * 0.04,
    paddingVertical:
      Platform.select({
        ios: 0.01,
        android: 0.01,
      }) * height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonStyle: {
    width: width * 0.8,
    height:
      Platform.select({
        ios: 0.065,
        android: 0.065,
      }) * height,
    marginTop:
      Platform.select({
        ios: 0.03,
        android: 0.03,
      }) * height,
    marginBottom:
      Platform.select({
        ios: 0.01,
        android: 0.01,
      }) * height,
  },
  modalCont: {
    width: width * 0.95,
    backgroundColor: '#fff',
    borderRadius: width * 0.025,
    alignSelf: 'center',
    marginTop: height * 0.12,
  },
});
