import PosRaw from '../PosRaw';
import React from 'react';
import {View} from 'react-native';
import {height} from '../../Utils/window';
import {removeDuplicateFromArray} from '../../Redux/actions';
function BusinessPoses(props) {
  if (props.poses && Array.isArray(props.poses) && props.poses.length > 0) {
    const poses = removeDuplicateFromArray(props.poses, 'psp_id');
    // const poses = props.poses;
    return (
      <React.Fragment>
        {poses.map(pos => (
          <PosRaw
            key={'pos_' + pos.id || pos.pos_number}
            title={
              pos.hasOwnProperty('psp') && pos.psp.hasOwnProperty('name')
                ? pos.psp.name
                : ''
            }
            image={
              pos.hasOwnProperty('psp') && pos.psp.hasOwnProperty('icon')
                ? pos.psp.icon
                : null
            }
            containerStyle={props.containerStyle || {}}
          />
        ))}
      </React.Fragment>
    );
  }
  return <View style={{height: height * 0.04}} />;
}

export default React.memo(BusinessPoses);
