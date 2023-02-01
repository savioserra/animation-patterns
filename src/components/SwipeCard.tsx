import React, {PropsWithChildren} from 'react';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useDerivedValue,
  useAnimatedReaction,
  useAnimatedRef,
  withSpring,
  measure,
  withTiming,
  runOnJS,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
  FadeIn,
} from 'react-native-reanimated';
import {StyleProp, ViewStyle} from 'react-native/types';
import styled from 'styled-components/native';
import {useSwipeContext} from './SwipeContext';

export type CardProps = PropsWithChildren<{
  position?: number;
  disabled?: boolean;
  threshold?: number;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  style?: StyleProp<Animated.AnimateStyle<StyleProp<ViewStyle>>>;
}>;

const Card = ({
  style,
  children,
  onSwipeLeft,
  onSwipeRight,
  disabled = false,
  threshold = 200,
  position: pos = 0,
}: CardProps) => {
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const {progress} = useSwipeContext();

  const distance = useDerivedValue(() => {
    return Math.sqrt(Math.pow(x.value, 2) + Math.pow(y.value, 2));
  }, [x, y]);

  useAnimatedReaction(
    () => distance,
    result => (progress.value = Math.min(result.value / threshold, 1)),
    [progress],
  );

  const ref = useAnimatedRef<Animated.View>();

  const panGesture = Gesture.Pan()
    .onUpdate(event => {
      y.value = event.translationY;
      x.value = event.translationX;
    })
    .onEnd(event => {
      const isRight = x.value > 0;
      const swipeHandler = isRight ? onSwipeRight : onSwipeLeft;

      if (progress.value < 1) {
        y.value = withSpring(0);
        x.value = withSpring(0);
        return;
      }

      const measurements = measure(ref);

      if (measurements) {
        y.value = withTiming(
          (measurements.height + event.y) * Math.sign(event.translationY),
        );

        x.value = withTiming(
          (measurements.width + event.x) * Math.sign(event.translationX),
          {},
          () => {
            if (swipeHandler) {
              runOnJS(swipeHandler)();
            }
          },
        );
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    const addYRatio = 40;
    const scaleRatio = 0.1;
    const rotationClip = 12;
    const angleVelocityRatio = 12;

    const scale = interpolate(
      progress.value,
      [0, 1],
      [1 - scaleRatio * pos, 1 - scaleRatio * Math.max(pos - 1, 0)],
      {extrapolateLeft: Extrapolate.CLAMP, extrapolateRight: Extrapolate.CLAMP},
    );

    const rotateZ = interpolate(
      x.value / angleVelocityRatio,
      [-rotationClip, rotationClip],
      [-rotationClip, rotationClip],
      {extrapolateLeft: Extrapolate.CLAMP, extrapolateRight: Extrapolate.CLAMP},
    );

    const addY = interpolate(
      progress.value,
      [0, 1],
      [addYRatio * pos, addYRatio * Math.max(pos - 1, 0)],
      {extrapolateLeft: Extrapolate.CLAMP, extrapolateRight: Extrapolate.CLAMP},
    );

    return {
      transform: [
        {translateX: x.value},
        {translateY: y.value + addY},
        {rotateZ: `${rotateZ}deg`},
        {scale},
      ],
    };
  }, [x, y, pos]);

  const card = (
    <CardContainer
      ref={ref}
      focusable
      accessible
      entering={FadeIn}
      accessibilityRole="button"
      style={[animatedStyle, style]}>
      {children}
    </CardContainer>
  );

  if (disabled) {
    return card;
  }

  return <GestureDetector gesture={panGesture}>{card}</GestureDetector>;
};

const CardContainer = styled(Animated.View)`
  position: absolute;
  border-radius: 36px;
`;

export default Card;
