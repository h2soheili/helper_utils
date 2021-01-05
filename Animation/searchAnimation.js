import React, { PureComponent } from 'react'
import {
  View,
  StyleSheet,
  Animated,
  Easing,
  TouchableOpacity,
  Dimensions,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native'
import LottieView from 'lottie-react-native'

const { width: ww, height: wh } = Dimensions.get('screen')

class App extends PureComponent {
  state = {
    isSearchActive: false,
  }

  overlayAnimatedValue = new Animated.Value(0)

  componentDidUpdate = (prevProps, prevState) => {
    const willFocusSearch = !prevState.isSearchActive && this.state.isSearchActive
    const willBlurSearch = prevState.isSearchActive && !this.state.isSearchActive

    if (willFocusSearch) {
      this.animateOverlay(1)
    }

    if (willBlurSearch) {
      this.animateOverlay(0)
    }
  }

  animateOverlay = value => {
    Animated.timing(this.overlayAnimatedValue, {
      toValue: value,
      duration: 650,
      easing: Easing.bezier(.54,0,.21,1),
      useNativeDriver: true,
    }).start()
  }

  toggleSearch = () => {
    this.setState(state => ({ isSearchActive: !state.isSearchActive }))
  }

  renderOverlay() {
    const scale = this.overlayAnimatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0.1, 30],
    })

    const opacity = this.overlayAnimatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    })

    return <Animated.View pointerEvents="none" style={styles.overlay(scale, opacity)} />
  }

  renderSearchList() {
    return <View style={{ flex: 1 }} />
  }

  renderSearchBar() {

    const translateY = this.overlayAnimatedValue.interpolate({
      inputRange: [0, .4, 1],
      outputRange: [150, 150, 0],
    })

    const opacity = this.overlayAnimatedValue.interpolate({
      inputRange: [0, .4, 1],
      outputRange: [0, 0,  1],
    })

    return (
      <Animated.View style={styles.searchBarContainer(translateY)}>
        <Animated.View style={styles.textInputContainer(opacity)}>
          <TextInput
            style={{
              width: '100%',
              height: 64,
              paddingHorizontal: 16,
            }}
            placeholder="Search for countries"
            underlineColorAndroid="transparent"
          />
        </Animated.View>
      </Animated.View>
    )
  }

  renderSearch() {
    const { isSearchActive } = this.state
    const pointerEvents = isSearchActive ? 'auto' : 'none'

    return (
      <View pointerEvents={pointerEvents} style={styles.searchContainer}>
        {this.renderSearchList()}
        {this.renderSearchBar()}
      </View>
    )
  }

  renderFAB() {
    return (
      <Animated.View style={styles.fab}>
        <TouchableOpacity onPress={this.toggleSearch} style={styles.fabTouchable}>
          <LottieView
            style={{ width: 24, height: 24 }}
            source={require('../JSON/search-animation.json')}
            progress={this.overlayAnimatedValue}
          />
        </TouchableOpacity>
      </Animated.View>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderOverlay()}
        {this.renderSearch()}
        {this.renderFAB()}
      </View>
    )
  }
}

export default App

const styles = StyleSheet.create({
  textInputContainer:  (opacity) => ({
    width: '100%',
    height: 64,
    borderRadius: 32,
    elevation: 3,
    backgroundColor: 'white',
    opacity: opacity,
  }),
  searchBarContainer: (translateY) => ({
    width: ww,
    height: 64 * 2 + 16,
    // backgroundColor: 'green',
    paddingRight: 64 + 32 + 16,
    paddingLeft: 32,
    paddingTop: 16,
    transform: [{ translateY }]
  }),
  searchContainer: {
    ...StyleSheet.absoluteFill,
    // backgroundColor: 'red',
  },
  overlay: (scale, opacity) => ({
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'white',
    position: 'absolute',
    right: 32,
    bottom: 64,
    opacity: opacity,
    transform: [{ scale }],
  }),
  fabTouchable: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fab: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#333ddd',
    position: 'absolute',
    right: 32,
    bottom: 64,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  container: {
    flex: 1,
    backgroundColor: 'pink',
  },
})
