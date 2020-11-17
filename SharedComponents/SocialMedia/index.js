import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableWithoutFeedback,
  StyleSheet,
  Linking,
} from 'react-native';
import {commonStyles} from '../../SharedStyles/commonStyles';
import {height, scaleFontSize, width} from '../../Utils/window';
import colors from '../../Constants/colors';
const mediaListImages = {
  instagram:
    'data:image/png;base64,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',
};
const Media = React.memo(props => {
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        if (!props.name) {
          return;
        }
        let url = '';
        if (props.image === 'instagram') {
          url = 'https://www.instagram.com/';
        }
        url += props.name;
        Linking.openURL(url);
      }}>
      <View
        style={{
          flexDirection: 'row',
          height: height * 0.034,
          // backgroundColor:'red'
        }}>
        {props.image && mediaListImages.hasOwnProperty(props.image) ? (
          <View style={{justifyContent: 'center'}}>
            <Image
              source={{uri: mediaListImages[props.image]}}
              style={styles.mediaImage}
            />
          </View>
        ) : null}
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={[
              commonStyles.textStyle,
              commonStyles.leftText,
              {
                color: colors.blue,
                fontSize: scaleFontSize(17),
                // borderBottomColor: 'red',
                // borderBottomWidth: 1,
              },
            ]}>
            {`${props.name || ''}`}
          </Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
});

function SocialMedia(props) {
  if (!props.instagram_id) {
    return null;
  }
  return (
    <View
      style={{
        marginBottom: height * 0.01,
      }}>
      <Media image={'instagram'} name={props.instagram_id} />
    </View>
  );
}

export default React.memo(SocialMedia);
const styles = StyleSheet.create({
  mediaImage: {
    width: width * 0.04,
    height: height * 0.06,
    resizeMode: 'contain',
    marginRight: width * 0.015,
  },
});
