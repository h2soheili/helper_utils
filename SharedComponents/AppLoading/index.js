import React from 'react';
import {View} from 'react-native';
import {commonStyles} from '../../SharedStyles/commonStyles';
import CircleLoading from '../CircleLoading';

function AppLoading(props) {
  if (!props.loading) {
    return null;
  }
  return (
    <View style={commonStyles.box1}>
      <CircleLoading renderLoading={props.loading} />
    </View>
  );
}

export default React.memo(AppLoading);
