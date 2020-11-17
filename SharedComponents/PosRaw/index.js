import {Image, Text, View} from 'react-native';
import {height, scaleFontSize, width} from '../../Utils/window';
import {commonStyles} from '../../SharedStyles/commonStyles';
import {PSP_LOGO} from '../../Constants/api';
import React from 'react';
import {CachedImage} from 'react-native-img-cache';
function PosRaw(props) {
  return (
    <View
      style={[
        {
          alignSelf: 'flex-end',
          width: '100%',
          justifyContent: 'center',
          marginVertical: height * 0.0035,
          height: height * 0.033,
          maxHeight: height * 0.033,
          // backgroundColor: 'red',
        },
        props.containerStyle || {},
      ]}>
      <View
        style={{
          flexDirection: 'row',
          alignSelf: 'flex-end',
          height: '100%',
        }}>
        <Text
          style={[
            commonStyles.textStyle,
            commonStyles.rightText,
            {
              color: '#C2CDD9',
              fontSize: scaleFontSize(17),
              paddingHorizontal: width * 0.01,
            },
          ]}
          numberOfLines={2}>
          {props.title || ''}
        </Text>
        <View>
          {props.image ? (
            <CachedImage
              source={{uri: PSP_LOGO + props.image}}
              style={{
                width: width * 0.08,
                height: height * 0.04,
                resizeMode: 'contain',
                marginTop: height * 0.002,
                alignSelf: 'flex-end',
                marginRight: -width * 0.01,
              }}
            />
          ) : null}
        </View>
      </View>
    </View>
  );
}
export default React.memo(PosRaw);
