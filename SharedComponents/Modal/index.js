import React from 'react';
import {View, TouchableWithoutFeedback, StyleSheet, Modal} from 'react-native';
function ModalComponent(props) {
  const {visible, onClose, children, opacity, animationType} = props;
  if (!visible) {
    return null;
  }
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType={animationType ? animationType : 'none'}
      onRequestClose={() => {
        if (props.onRequestClose) {
          props.onRequestClose();
        }
      }}>
      <>
        {/*<StatusBar hidden={true} />*/}
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={[styles.overlay, {backgroundColor: 'transparent'}]}>
            <View
              style={[
                styles.overlay,
                {backgroundColor: `rgba(0,0,0,${opacity || '0.4'})`},
              ]}
            />
            {children || null}
          </View>
        </TouchableWithoutFeedback>
      </>
    </Modal>
  );
}

export default React.memo(ModalComponent);
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
