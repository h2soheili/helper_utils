import React, { memo, useRef, useEffect } from 'react'
import Animated, { Value, Node, interpolate } from 'react-native-reanimated'
import size from '../styles/size'

const SINGLE_ELEMENT_DELAY = 85
const SPRING_CONFIG = {
  damping: 80,
  mass: 6,
  stiffness: 500,
  overshootClamping: false,
  restDisplacementThreshold: 0.001,
  restSpeedThreshold: 0.001,
}

interface Props {
  children: JSX.Element | JSX.Element[]
  animation?: 'fadeInUp'
  type?: 'mount' | 'interpolation' | 'animatedChange' | 'stateChange'
  springConfig?: typeof SPRING_CONFIG
  hidden?: boolean
  interpolationValue?: Value<number> | Node<number>
  staggerIndex?: number
}

function createPaddingForValue(
  side: 'left' | 'right',
  type: Props['type'],
  staggerIndex: number | undefined,
): number {
  let value = side === 'left' ? 0 : 2

  if (type === 'interpolation') {
    const leftPadding = 0.1 * (staggerIndex || 0)
    const rightPadding = Math.min(1.5 + 0.1 * (staggerIndex || 0), 2)

    value = side === 'left' ? leftPadding : rightPadding
  }

  return value
}

function createYValue(
  type: Props['type'],
  animation: Props['animation'],
  animatedValue: Value<number> | Node<number>,
  staggerIndex: Props['staggerIndex'],
): Node<number> {
  switch (animation) {
    case 'fadeInUp':
      return interpolate(animatedValue, {
        inputRange: [
          createPaddingForValue('left', type, staggerIndex),
          1,
          createPaddingForValue('right', type, staggerIndex),
        ],
        outputRange: [size.verticalScale(50), 0, -size.verticalScale(50)],
      })

    default:
      return new Value(0)
  }
}

function createOpacityValue(
  type: Props['type'],
  animation: Props['animation'],
  animatedValue: Value<number> | Node<number>,
  staggerIndex: Props['staggerIndex'],
): Node<number> {
  switch (animation) {
    case 'fadeInUp':
      return interpolate(animatedValue, {
        inputRange: [
          createPaddingForValue('left', type, staggerIndex),
          1,
          createPaddingForValue('right', type, staggerIndex),
        ],
        outputRange: [0, 1, 0],
      })

    default:
      return new Value(0)
  }
}

const AnimateComponent = ({
  children,
  animation = 'fadeInUp',
  interpolationValue,
  type = 'mount',
  staggerIndex = 0,
}: Props): JSX.Element => {
  const mountAnimatedValue = useRef(new Value(0)).current

  useEffect(() => {
    if (type === 'mount') {
      console.log('hji')
      const timer = setTimeout(() => {
        Animated.spring(mountAnimatedValue, {
          toValue: 1,
          ...SPRING_CONFIG,
        }).start()
      }, staggerIndex * SINGLE_ELEMENT_DELAY)

      return (): void => clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const animatedValue =
    type === 'interpolation' && interpolationValue
      ? interpolationValue
      : mountAnimatedValue

  const translateY = createYValue(type, animation, animatedValue, staggerIndex)
  const opacity = createOpacityValue(
    type,
    animation,
    animatedValue,
    staggerIndex,
  )

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }}>
      {children}
    </Animated.View>
  )
}

export default memo(AnimateComponent)
