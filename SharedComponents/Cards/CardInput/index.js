import * as React from 'react';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  StyleSheet,
  Platform,
  Image,
  Keyboard,
  TextInput,
} from 'react-native';
import {commonStyles} from '../../../SharedStyles/commonStyles';
import {height, width, scaleFontSize} from '../../../Utils/window';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
} from 'react-native-confirmation-code-field';
import CardView from 'react-native-cardview';
import colors from '../../../Constants/colors';
import {IMAGE_DOMAIN} from '../../../Constants/api';
import Font from '../../../Constants/font';

function CardItem(props) {
  const {containerStyle, bank_icon, bank_back} = props;
  const showBankImage = bank_icon && typeof bank_icon === 'string';
  const ref = useBlurOnFulfill({value: props.value, cellCount: 16});
  return (
    <TouchableWithoutFeedback
      onPress={function() {
        Keyboard.dismiss();
      }}
      accessible={false}>
      <CardView
        cardElevation={3}
        cardMaxElevation={3}
        cornerRadius={width * 0.025}
        style={[styles.card, containerStyle || {}]}>
        {!showBankImage ? (
          <View style={styles.cardBigCircle} />
        ) : (
          <Image
            style={[
              styles.card,
              {position: 'absolute', left: 0, right: 0, top: 0, bottom: 0},
            ]}
            source={{uri: IMAGE_DOMAIN + bank_back}}
          />
        )}
        {!showBankImage ? (
          <View style={styles.cardSmallCircle} />
        ) : (
          <Image
            style={[
              styles.cardSmallCircle,
              {
                position: 'absolute',
                resizeMode: 'contain',
                width: width * 0.1,
                height: height * 0.08,
                top: height * 0.02,
                backgroundColor: 'transparent',
              },
            ]}
            source={{uri: IMAGE_DOMAIN + bank_icon}}
          />
        )}
        <View style={styles.line} />

        {props.bank_name ? (
          <Text
            style={[
              commonStyles.textStyle,
              {
                position: 'absolute',
                right: width * 0.18,
                top: height * 0.04,
                fontSize: scaleFontSize(25),
              },
            ]}>
            {props.bank_name || ''}
          </Text>
        ) : null}

        <Text style={[commonStyles.textStyle, styles.cardTitle]}>
          {props.value && props.value.length > 0
            ? ' '
            : ' شماره 16 رقمی کارت خود را وارد کنید'}
        </Text>
        <CodeField
          ref={ref}
          value={props.value}
          onChangeText={props.onChangeText}
          cellCount={16}
          rootStyle={styles.codeFiledRoot}
          keyboardType="number-pad"
          returnKeyType="done"
          renderCell={({index, symbol, isFocused}) => {
            if (Platform.OS === 'android') {
              return (
                <Text
                  key={index}
                  style={[
                    commonStyles.textStyle,
                    commonStyles.centerText,
                    styles.cell,
                    {
                      marginLeft: (index % 4 === 0 ? 0.04 : 0.005) * width,
                    },
                  ]}>
                  {symbol || (isFocused ? <Cursor /> : null)}
                </Text>
              );
            } else {
              return (
                <View
                  key={index}
                  style={{
                    flex: 1,
                    borderBottomWidth: Platform.select({
                      ios: 1.5,
                      android: 1.5,
                    }),
                    borderBottomColor: '#d7e4ed',
                    marginLeft: (index % 4 === 0 ? 0.04 : 0.005) * width,
                  }}>
                  <Text
                    style={[commonStyles.textStyle, commonStyles.centerText]}>
                    {symbol || (isFocused ? <Cursor /> : null)}
                  </Text>
                </View>
              );
            }
          }}
        />
      </CardView>
    </TouchableWithoutFeedback>
  );
}

export default CardItem;
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
  cardBigCircle: {
    height: width * 0.47,
    width: width * 0.47,
    backgroundColor: '#101F400D',
    borderRadius: height * 0.7,
    position: 'absolute',
    left: -width * 0.1,
    top: -height * 0.08,
  },
  cardSmallCircle: {
    position: 'absolute',
    top: height * 0.03,
    right: width * 0.05,
    height: width * 0.1,
    width: width * 0.1,
    backgroundColor: '#101F400D',
    // width: '40%',
    borderRadius: height * 0.2,
  },
  line: {
    position: 'absolute',
    bottom: height * 0.02,
    right: width * 0.05,
    height: height * 0.025,
    width: width * 0.4,
    backgroundColor: '#101F400D',
    borderRadius: height * 0.2,
  },
  cardTitle: {
    fontSize: scaleFontSize(25),
    right: width * 0.05,
    position: 'absolute',
    top:
      Platform.select({
        ios: 0.13,
        android: 0.13,
      }) * height,
    color: '#6498E6',
  },
  codeFiledRoot: {
    width: '93.5%',
    backgroundColor: 'transparent',
    alignSelf: 'center',
    position: 'absolute',
    top:
      Platform.select({
        ios: 0.17,
        android: 0.17,
      }) * height,
    left: width * 0.005,
    height:
      Platform.select({
        ios: 0.065,
        android: 0.065,
      }) * height,
    paddingTop:
      Platform.select({
        ios: 0.02,
        android: 0.02,
      }) * height,
  },
  cell: {
    flex: 1,
    color: colors.black,
    fontSize: scaleFontSize(26),
    borderBottomWidth: Platform.select({ios: 1.5, android: 1.5}),
    borderBottomColor: '#d7e4ed',
    textAlign: 'center',
    fontFamily: Font.Vazir,
  },
});
