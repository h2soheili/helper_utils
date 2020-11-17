import * as React from 'react';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Linking,
  AppState,
} from 'react-native';
import {
  commonStyles,
  WebViewTypeFace,
} from '../../../SharedStyles/commonStyles';
import {height, scaleFontSize, width} from '../../../Utils/window';
import CardView from 'react-native-cardview';
import Dot from '../../../Assetes/SvgIcons/Dot';
import CardNotValidatedIcon from '../../../Assetes/SvgIcons/CardNotValidated';
import {separateDigits} from '../../../Utils/cardNumberUtils';
import {showSimpleToast} from '../../../Redux/actions/appActions';
import Clipboard from '@react-native-community/clipboard';
import {connect} from 'react-redux';
import {
  deleteCard,
  getUserCardList,
  verifyCard,
} from '../../../Redux/actions/cardActions';
import {API, IMAGE_DOMAIN} from '../../../Constants/api';
import analytics from '@react-native-firebase/analytics';
import {Events} from '../../../Constants/firebaseEvent';
import ModalComponent from '../../Modal';
import LottieView from 'lottie-react-native';
import SpinnerButton from '../../SpinnerButton';
import Colors, {colors} from '../../../Constants/colors';
import AutoHeightWebView from 'react-native-autoheight-webview';
import {CustomIcons} from '../../../Utils/customIcons';
import {activateCard} from '../../../Redux/actions';
import {CachedImage} from 'react-native-img-cache';
import {priceDigitSeperator} from '../../../Utils/helpers';
import * as Progress from 'react-native-progress';
import moment from 'moment';
const delayBeforeActivation = 300; // 5 min
function convertSecondToMinuteAndSecond(second) {
  if (second) {
    let sec = parseInt(second);
    return '' + parseInt(sec / 60) + ':' + parseInt(sec % 60);
  }
  return '';
}
const OverlayUntilCardActivation = React.memo(props => {
  if (props.showDelayBeforeCardActivation === false) {
    return null;
  }

  return (
    <View style={styles.cardActivationCont}>
      <View style={styles.pieCont}>
        <View style={styles.whitePie} />
        <Progress.Pie
          progress={
            (delayBeforeActivation - parseFloat(props.timerValue)) /
            delayBeforeActivation
          }
          // progress={0.1}
          size={width * 0.135}
          borderWidth={0}
          color={colors.green}
          // borderColor={'#fff'}
        />
      </View>

      <Text
        style={[
          commonStyles.textStyle,
          commonStyles.centerText,
          {color: '#fff', marginTop: height * 0.025},
        ]}>
        {`${props.timerText || ''} دیگر کارت بانکی فعال می گردد`}
      </Text>
    </View>
  );
});
function InactiveOverlay(props) {
  if (props.state === 'inactive' && props.status === 'verified') {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.6)',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}>
        <TouchableWithoutFeedback onPress={props.onPress}>
          <View
            style={[
              {
                flexDirection: 'row',
                paddingTop:
                  Platform.select({
                    ios: 0.01,
                    android: 0.01,
                  }) * height,
                width: width * 0.35,
                alignSelf: 'flex-start',
                justifyContent: 'center',
                position: 'absolute',
                bottom: height * 0.02,
                left: width * 0.025,
              },
            ]}>
            <View style={[commonStyles.box1]}>
              <CustomIcons
                name={'angle-left'}
                size={width * 0.055}
                color={'#fff'}
              />
            </View>
            <View style={[{flex: 8}]}>
              <Text
                style={[
                  commonStyles.textStyle,
                  commonStyles.leftText,
                  {
                    color: '#fff',
                    fontSize: scaleFontSize(21),
                    alignSelf: 'flex-start',
                  },
                ]}>
                فعال کردن کارت
              </Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
  return null;
}
function CardValidationComponent(props) {
  if (props.validated) {
    return (
      // <CardValidatedIcon
      //   style={{
      //     transform: [{scale: 1.2}],
      //   }}
      // />
      <CustomIcons
        name={'card-verified'}
        size={width * 0.055}
        color={colors.blue}
      />
    );
  }
  return (
    <TouchableOpacity onPress={props.validateCard}>
      <View
        style={[
          commonStyles.row,
          {
            backgroundColor: '#6498E6',
            paddingHorizontal: width * 0.02,
            borderRadius: width * 0.02,
          },
        ]}>
        <View style={[commonStyles.box1, {flex: 7}]}>
          <Text
            style={[
              commonStyles.textStyle,
              {
                color: '#FFFFFF',
                marginRight: width * 0.02,
                textAlign: 'center',
              },
            ]}>
            تایید مالکیت
          </Text>
        </View>
        <View style={[commonStyles.box1]}>
          <CardNotValidatedIcon
            stryle={{
              transform: [{scale: 1.6}],
              marginHorizontal: width * 0.03,
            }}
          />
          {/*<CustomIcons*/}
          {/*  name={'card-unverified-1'}*/}
          {/*  size={width * 0.055}*/}
          {/*  // color={'transparent'}*/}
          {/*/>*/}
        </View>
      </View>
    </TouchableOpacity>
  );
}
class CardItem extends React.PureComponent {
  constructor(props) {
    super(props);
    const {card_number} = this.props;
    this.state = {
      cardNumber: separateDigits(card_number || ''),
      showOverlayView: false,
      showVerifyModal: false,
      url: null,
      showDeleteCardWarning: false,
      showDelayBeforeCardActivation: false,
      timerText: '5:00',
      timerValue: 300,
      showCardActivateWarning: false,
      appState: AppState.currentState,
    };

    this.toggleOverlayView = this.toggleOverlayView.bind(this);
    this.copyCardNumberToClipboard = this.copyCardNumberToClipboard.bind(this);
    this.deleteCard = this.deleteCard.bind(this);
    this.validateCard = this.validateCard.bind(this);
    this.checkToShowDelayOverlayBeforeActivation = this.checkToShowDelayOverlayBeforeActivation.bind(
      this,
    );
    this.handleAppStateChange = this.handleAppStateChange.bind(this);
    this.showMockedActivationTimer = this.showMockedActivationTimer.bind(this);
    this.clearIntervals = this.clearIntervals.bind(this);
    this.updateTimer = this.updateTimer.bind(this);
    this.timerUntilActivation = null;
  }
  validateCard() {
    analytics().logEvent('Cart_Authentication', Events.Cart_Authentication);
    if (this.mounted) {
      this.setState({
        showVerifyModal: true,
      });
    }
    this.props
      .verifyCard(this.props.id)
      .then(result => {
        if (result.data && result.data.redirect_url) {
          this.setState({
            url: result.data.redirect_url,
          });
        }
      })
      .catch(e => {
        this.setState({url: null});
      });
  }
  deleteCard() {
    this.props.deleteCard(this.props.id);
    if (this.props.actionAfterDeleteCard) {
      this.props.actionAfterDeleteCard();
    }
  }
  updateTimer() {
    if (this.state.timerValue > 1) {
      this.setState(
        {
          timerValue: this.state.timerValue - 1,
          timerText: convertSecondToMinuteAndSecond(this.state.timerValue - 1),
        },
        () => {
          if (this.state.appState.match(/active/)) {
            this.timerUntilActivation = setTimeout(this.updateTimer, 1000);
          }
        },
      );
    } else {
      this.clearIntervals();
      if (this.state.showDelayBeforeCardActivation === true) {
        this.setState({showDelayBeforeCardActivation: false});
      }
    }
  }
  checkToShowDelayOverlayBeforeActivation(mockCreateTime = null) {
    const {created_at, card_number} = this.props;
    if (created_at && card_number !== '1111111111111111') {
      let a = moment(new Date());
      let b = moment(mockCreateTime === null ? created_at : mockCreateTime);
      let activationTime = b.add(5, 'minutes');
      let diff = activationTime.diff(a, 'seconds');
      // if (__DEV__) {
      //   alert(
      //     activationTime.toString() + ' :   ' + a.toString() + ':::' + diff,
      //   );
      // }
      // alert(diff)
      // 5 min delay
      if (diff <= delayBeforeActivation && diff > 0) {
        this.setState(
          {
            showDelayBeforeCardActivation: true,
            timerValue: diff,
            timerText: convertSecondToMinuteAndSecond(diff),
          },
          () => {
            this.clearIntervals();
            this.timerUntilActivation = setTimeout(this.updateTimer, 1000);
          },
        );
      }
    }
  }
  copyCardNumberToClipboard() {
    Clipboard.setString(this.props.card_number);
    showSimpleToast('شماره کارت کپی شد');
  }
  toggleOverlayView() {
    if (this.mounted) {
      this.setState({
        showOverlayView: !this.state.showOverlayView,
      });
    }
  }
  clearIntervals() {
    if (this.timerUntilActivation) {
      clearTimeout(this.timerUntilActivation);
    }
    this.timerUntilActivation = null;
  }
  handleAppStateChange(nextAppState) {
    if (
      this.state.appState &&
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      this.clearIntervals();
      this.showMockedActivationTimer();
    }
    if (this.mounted) {
      this.setState({appState: nextAppState});
    }
    if (nextAppState.match(/inactive|background/)) {
      this.clearIntervals();
    }
  }
  showMockedActivationTimer() {
    /**
     *
     * show mock Activation Overlay after activating card
     *
     * also we show Activation Overlay after card adding
     *
     *
     */
    const {showingActivationTimerBeforeCardActive, id} = this.props;
    let showMockedActivationOverlay = showingActivationTimerBeforeCardActive.hasOwnProperty(
      id.toString(),
    )
      ? true
      : false;
    this.checkToShowDelayOverlayBeforeActivation(
      showMockedActivationOverlay
        ? showingActivationTimerBeforeCardActive[id.toString()]
        : null,
    );
  }
  componentDidMount(): void {
    this.mounted = true;
    AppState.addEventListener('change', this.handleAppStateChange);
    this.showMockedActivationTimer();
  }
  componentWillUnmount(): void {
    this.mounted = false;
    this.clearIntervals();
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  render() {
    const {
      id,
      bank_name,
      bank_logo,
      bank_background_path,
      cardOwner,
      containerStyle,
      showCheckLabel,
      showNavigationButton,
      bank_min_transaction,
    } = this.props;
    return (
      <>
        <CardView
          cardElevation={2}
          cardMaxElevation={2}
          cornerRadius={width * 0.025}
          style={[styles.card, containerStyle || {}]}>
          {bank_background_path ? (
            <CachedImage
              style={[
                styles.card,
                {position: 'absolute', top: 0, left: 0, right: 0, bottom: 0},
              ]}
              source={{uri: IMAGE_DOMAIN + bank_background_path}}
            />
          ) : null}

          <View
            style={[
              commonStyles.row,
              {
                height:
                  Platform.select({
                    ios: 0.15,
                    android: 0.15,
                  }) * height,
              },
            ]}>
            {this.props.showDot === false ? null : (
              <TouchableOpacity
                style={{
                  position: 'absolute',
                  top:
                    Platform.select({
                      ios: 0.03,
                      android: 0.025,
                    }) * height,
                  left: width * 0.05,
                }}
                onPress={this.toggleOverlayView}
                hitSlop={{
                  top: height * 0.04,
                  bottom: height * 0.04,
                  left: width * 0.05,
                  right: width * 0.05,
                }}>
                <Dot style={{transform: [{scale: 1.1}]}} />
              </TouchableOpacity>
            )}
            <View
              style={[
                commonStyles.row,
                {
                  position: 'absolute',
                  right: width * 0.18,
                  top: Platform.select({android: 0.0325, ios: 0.0325}) * height,
                  height:
                    Platform.select({
                      ios: 0.06,
                      android: 0.06,
                    }) * height,
                },
              ]}>
              <View
                style={[
                  commonStyles.box1,
                  {
                    paddingTop:
                      Platform.select({
                        ios: 0.01,
                        android: 0.01,
                      }) * height,
                  },
                ]}>
                {showCheckLabel ? (
                  <CardValidationComponent
                    validated={this.props.status !== 'not_verified'}
                    validateCard={this.validateCard}
                  />
                ) : null}
              </View>
              <View style={[commonStyles.box1, {paddingLeft: width * 0.015}]}>
                <Text
                  style={[commonStyles.textStyle, styles.titleBank]}
                  numberOfLines={2}>
                  {bank_name || ''}
                </Text>
              </View>
            </View>
            {bank_logo ? (
              <CachedImage
                style={{
                  width: width * 0.1,
                  height: height * 0.08,
                  resizeMode: 'contain',
                  position: 'absolute',
                  right: width * 0.05,
                  top: Platform.select({android: 0.02, ios: 0.02}) * height,
                }}
                source={{uri: IMAGE_DOMAIN + bank_logo}}
              />
            ) : null}
          </View>

          <Text style={[commonStyles.textStyle, styles.cardTitle]}>
            {this.state.cardNumber || ''}
          </Text>

          <View
            style={[
              commonStyles.row,
              {
                position: 'absolute',
                bottom:
                  Platform.select({
                    ios: 0.02,
                    android: 0.02,
                  }) * height,
                alignSelf: 'center',
                paddingLeft: width * 0.04,
              },
            ]}>
            {showNavigationButton ? (
              <TouchableWithoutFeedback onPress={this.props.onPress}>
                <View
                  style={[
                    {
                      flexDirection: 'row',
                      paddingTop:
                        Platform.select({
                          ios: 0.01,
                          android: 0.01,
                        }) * height,
                      width: width * 0.35,
                      alignSelf: 'flex-start',
                      justifyContent: 'center',
                    },
                  ]}>
                  <View style={[commonStyles.box1]}>
                    <CustomIcons
                      name={'angle-left'}
                      size={width * 0.055}
                      color={colors.blue}
                    />
                  </View>
                  <View style={[{flex: 8}]}>
                    <Text
                      style={[
                        commonStyles.textStyle,
                        commonStyles.leftText,
                        {
                          color: '#6498E6',
                          fontSize: scaleFontSize(21),
                          alignSelf: 'flex-start',
                        },
                      ]}>
                      تراکنش‌ها
                    </Text>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            ) : (
              <View style={[commonStyles.box1]} />
            )}
            <View style={[commonStyles.box1, {flex: 5}]}>
              <Text
                style={[
                  commonStyles.textStyle,
                  commonStyles.rightText,
                  styles.userName,
                ]}>
                {cardOwner || ''}
              </Text>
            </View>
          </View>
          <View
            style={{
              position: 'absolute',
              right: width * 0.2,
              top: Platform.select({android: 0.05, ios: 0.05}) * height,
            }}
          />
          {this.state.showOverlayView ? (
            <TouchableWithoutFeedback onPress={this.toggleOverlayView}>
              <View style={styles.overlayContainer}>
                <View style={styles.whiteOverlayBox}>
                  <TouchableWithoutFeedback
                    onPress={this.copyCardNumberToClipboard}>
                    <View style={[commonStyles.row, styles.overlayItem]}>
                      <View
                        style={[
                          commonStyles.box1,
                          {flex: 5, paddingRight: width * 0.02},
                        ]}>
                        <Text
                          style={[
                            commonStyles.textStyle,
                            commonStyles.rightText,
                            {color: '#19212E', textAlign: 'center'},
                          ]}>
                          کپی شماره کارت
                        </Text>
                      </View>
                      <View style={[commonStyles.box1, {}]}>
                        <CustomIcons
                          name={'copy-card'}
                          size={width * 0.055}
                          color={colors.black}
                        />
                      </View>
                    </View>
                  </TouchableWithoutFeedback>
                  {this.props.status === 'not_verified' ? (
                    <TouchableWithoutFeedback onPress={this.validateCard}>
                      <View style={[commonStyles.row, styles.overlayItem]}>
                        <View
                          style={[
                            commonStyles.box1,
                            {flex: 5, paddingRight: width * 0.02},
                          ]}>
                          <Text
                            style={[
                              commonStyles.textStyle,
                              commonStyles.rightText,
                              {color: '#6498E6', textAlign: 'center'},
                            ]}>
                            تایید مالکیت
                          </Text>
                        </View>
                        <View style={[commonStyles.box1, {}]}>
                          <CustomIcons
                            name={'verified'}
                            size={width * 0.055}
                            color={colors.blue}
                          />
                        </View>
                      </View>
                    </TouchableWithoutFeedback>
                  ) : null}
                  <TouchableWithoutFeedback
                    onPress={() => {
                      this.setState({
                        showDeleteCardWarning: true,
                        showOverlayView: false,
                      });
                    }}>
                    <View style={[commonStyles.row, styles.overlayItem]}>
                      <View
                        style={[
                          commonStyles.box1,
                          {flex: 5, paddingRight: width * 0.02},
                        ]}>
                        <Text
                          style={[
                            commonStyles.textStyle,
                            commonStyles.rightText,
                            {color: '#D0332C', textAlign: 'center'},
                          ]}>
                          حذف کارت
                        </Text>
                      </View>
                      <View style={[commonStyles.box1, {}]}>
                        {/*<TrashIcon style={[{transform: [{scale: 1.3}]}]} />*/}
                        <CustomIcons
                          name={'trash'}
                          size={width * 0.055}
                          color={colors.red}
                        />
                      </View>
                    </View>
                  </TouchableWithoutFeedback>
                  <TouchableWithoutFeedback onPress={this.toggleOverlayView}>
                    <View
                      style={{
                        position: 'absolute',
                        left: width * 0.025,
                        top: height * 0.02,
                        height: height * 0.06,
                        width: width * 0.09,
                      }}>
                      <CustomIcons
                        name={'cancel'}
                        size={width * 0.055}
                        color={colors.circleCardGray}
                      />
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </View>
            </TouchableWithoutFeedback>
          ) : null}
          <InactiveOverlay
            state={this.props.state}
            status={this.props.status}
            onPress={() => {
              /**
               *  show warning before activate card
               */
              this.setState({
                showCardActivateWarning: true,
              });
            }}
          />
          <OverlayUntilCardActivation
            showDelayBeforeCardActivation={
              this.state.showDelayBeforeCardActivation
            }
            timerText={this.state.timerText}
            timerValue={this.state.timerValue}
          />
        </CardView>
        <ModalComponent
          visible={this.state.showVerifyModal}
          opacity={0.001}
          onClose={() => {}}>
          <TouchableWithoutFeedback onPress={function() {}}>
            <CardView
              style={styles.container}
              cardElevation={2}
              maxCardElevation={2}
              cornerRadius={width * 0.025}>
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  alignSelf: 'center',
                  width: '100%',
                  height: height * 0.25,
                }}>
                <LottieView
                  source={require('../../../Assetes/LottieFiles/card-verify.json')}
                  autoPlay
                  loop={false}
                  style={{
                    alignSelf: 'center',
                    transform: [
                      {
                        scale: 0.7,
                      },
                    ],
                  }}
                />
              </View>
              <View
                style={{
                  marginTop: height * 0.2,
                  marginBottom: -height * 0.465,
                  minHeight: height * 0.4,
                }}>
                <AutoHeightWebView
                  style={{
                    width: width * 0.725,
                    marginTop: 0,
                    paddingBottom: 0,
                  }}
                  customScript={''}
                  customStyle={WebViewTypeFace}
                  files={[]}
                  originWhitelist={['*']}
                  source={{
                    baseUrl: '',
                    html: `<p style="text-align: justify;font-size: 14px" dir="rtl">
                جهت صحت سنجی کارت بانکی شما، ناگزیر به انجام یک تراکنش ${
                  bank_min_transaction
                    ? priceDigitSeperator(bank_min_transaction)
                    : ' ۵ هزار '
                }
                تومانی در اپلیکیشن هستیم که فقط یکبار برای همیشه انجام می‏شود.
                این تراکنش با اتصال به درگاه امن بانک ملت انجام شده و مبلغ فوق
                بلافاصله به کیف پول شما در اپلیکیشن بازگردانده می‏شود که به
                همراه سایر پاداش‏های دریافتی از داپ اَپ از کیف پول قابل برداشت
                است.
                 </p>`,
                  }}
                  scalesPageToFit={true}
                  viewportContent={'width=device-width, user-scalable=no'}
                />
              </View>
              {this.state.url ? (
                <SpinnerButton
                  containerStyle={{
                    width: width * 0.67,
                    height:
                      Platform.select({android: 0.06, ios: 0.06}) * height,
                    position: 'absolute',
                    ...Platform.select({
                      ios: {top: height * 0.36},
                      android: {bottom: height * 0.025},
                    }),
                  }}
                  text={'موافقم'}
                  onPress={() => {
                    if (this.mounted && this.state.showVerifyModal === true) {
                      this.setState(
                        {
                          showVerifyModal: false,
                        },
                        () => {},
                      );
                      Linking.openURL(this.state.url)
                        .then(res => {})
                        .catch(e => {});
                    }
                  }}
                />
              ) : null}
              <TouchableWithoutFeedback
                onPress={() => {
                  if (this.mounted) {
                    this.setState(
                      {
                        showVerifyModal: false,
                        url: null,
                      },
                      () => {},
                    );
                  }
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
                  <CustomIcons
                    name={'cancel'}
                    size={width * 0.06}
                    color={colors.circleCardGray}
                  />
                </View>
              </TouchableWithoutFeedback>
            </CardView>
          </TouchableWithoutFeedback>
        </ModalComponent>
        <ModalComponent
          visible={
            this.state.showDeleteCardWarning ||
            this.state.showCardActivateWarning
          }
          opacity={0.001}
          onClose={() => {
            if (this.state.showDeleteCardWarning) {
              this.setState({showDeleteCardWarning: false});
            } else if (this.state.showCardActivateWarning) {
              this.setState({
                showCardActivateWarning: false,
              });
            }
          }}>
          <TouchableWithoutFeedback onPress={function() {}}>
            <CardView
              style={[
                styles.container,
                {
                  minHeight: height * 0.4,
                  maxHeight: height * 0.4,
                  marginTop: height * 0.25,
                },
              ]}
              cardElevation={2}
              maxCardElevation={2}
              cornerRadius={width * 0.025}>
              <LottieView
                source={require('../../../Assetes/LottieFiles/toast_lotties/warning.json')}
                autoPlay
                loop={false}
                style={{
                  position: 'absolute',
                  top:
                    -Platform.select({
                      ios: 0.06,
                      android: 0.06,
                    }) * height,
                  alignSelf: 'center',
                  transform: [
                    {
                      scale: 0.7,
                    },
                  ],
                }}
              />
              <Text
                style={[
                  commonStyles.textStyle,
                  commonStyles.centerText,
                  {
                    marginTop: height * 0.25,
                    fontSize: scaleFontSize(19),
                    paddingHorizontal: width * 0.06,
                  },
                ]}>
                {this.state.showDeleteCardWarning
                  ? ' آیا از حذف کارت خود اطمینان دارید ؟'
                  : this.state.showCardActivateWarning
                  ? ' آیا از تایید کارت خود اطمینان دارید ؟'
                  : ''}
              </Text>
              <View style={{flexDirection: 'row', marginTop: height * 0.04}}>
                <SpinnerButton
                  containerStyle={{
                    width: width * 0.35,
                    height:
                      Platform.select({android: 0.06, ios: 0.06}) * height,
                    marginHorizontal: width * 0.01,
                    backgroundColor: '#fff',
                    borderColor: Colors.buttonGray,
                    borderWidth: 1.2,
                  }}
                  text={'خیر'}
                  fontStyle={{color: Colors.black}}
                  onPress={() => {
                    if (this.mounted) {
                      if (this.state.showDeleteCardWarning) {
                        this.setState({
                          showDeleteCardWarning: false,
                        });
                      } else if (this.state.showCardActivateWarning) {
                        this.setState({
                          showCardActivateWarning: false,
                        });
                      }
                    }
                  }}
                />
                <SpinnerButton
                  containerStyle={{
                    width: width * 0.35,
                    height:
                      Platform.select({android: 0.06, ios: 0.06}) * height,
                    marginHorizontal: width * 0.01,
                  }}
                  text={'بلی'}
                  onPress={() => {
                    if (this.mounted) {
                      if (this.state.showDeleteCardWarning) {
                        this.setState({
                          showDeleteCardWarning: false,
                        });
                      } else if (this.state.showCardActivateWarning) {
                        this.setState({
                          showCardActivateWarning: false,
                        });
                      }
                    }

                    if (this.state.showDeleteCardWarning) {
                      /**
                       * delete card
                       */
                      this.deleteCard();
                    } else if (this.state.showCardActivateWarning) {
                      /**
                       *  activate card
                       */
                      this.props.activateCard(id).then(res => {
                        /**
                         * mock 5 minute for card activating
                         */
                        this.checkToShowDelayOverlayBeforeActivation(
                          new Date(),
                        );
                      });
                    }
                  }}
                />
              </View>
              <TouchableWithoutFeedback
                onPress={() => {
                  if (this.mounted) {
                    this.setState(
                      {
                        showDeleteCardWarning: false,
                      },
                      () => {},
                    );
                  }
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
                  <CustomIcons
                    name={'cancel'}
                    size={width * 0.06}
                    color={colors.circleCardGray}
                  />
                </View>
              </TouchableWithoutFeedback>
            </CardView>
          </TouchableWithoutFeedback>
        </ModalComponent>
      </>
    );
  }
}
function mapStateToProps(state) {
  const {
    card: {showingActivationTimerBeforeCardActive},
  } = state;
  return {showingActivationTimerBeforeCardActive};
}
export default connect(
  mapStateToProps,
  {deleteCard, getUserCardList, verifyCard, activateCard},
)(CardItem);
const styles = StyleSheet.create({
  card: {
    width: width * 0.9,
    overflow: 'hidden',
    backgroundColor: '#fff',
    height: Platform.select({
      ios: height * 0.3,
      android: height * 0.3,
    }),
    alignSelf: 'center',
  },
  titleBank: {
    fontSize: width * 0.0425,
    overflow: 'hidden',
  },

  cardTitle: {
    fontSize: scaleFontSize(34),
    textAlign: 'center',
  },
  nameBank: {
    fontSize: width * 0.035,
  },
  userName: {
    fontSize: width * 0.045,
    color: '#C2CDD9',
    marginRight: width * 0.015,
  },
  overlayContainer: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  whiteOverlayBox: {
    width: width * 0.55,
    backgroundColor: '#fff',
    position: 'absolute',
    top: width * 0.01,
    left: width * 0.01,
    borderRadius: width * 0.02,
    paddingHorizontal: width * 0.025,
    paddingVertical:
      Platform.select({
        ios: 0.01,
        android: 0.01,
      }) * height,
  },
  overlayItem: {
    marginVertical:
      Platform.select({
        ios: 0.015,
        android: 0.012,
      }) * height,
  },
  container: {
    width: width * 0.85,
    minHeight: height * 0.6,
    marginTop: height * 0.2,
    borderRadius: width * 0.025,
    backgroundColor: '#fff',
    alignItems: 'center',
    alignSelf: 'center',
  },
  cardActivationCont: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  whitePie: {
    width: width * 0.135,
    height: width * 0.135,
    position: 'absolute',
    top: 0,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: width * 0.5,
  },
  pieCont: {
    width: width * 0.135,
    height: width * 0.135,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
