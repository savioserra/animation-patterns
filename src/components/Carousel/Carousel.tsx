import React from 'react';
import {ImageSourcePropType, View} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useDerivedValue,
  interpolate,
  withSpring,
  withTiming,
  Easing,
  useAnimatedStyle,
  SharedValue,
  AnimateProps,
  Extrapolate,
  cancelAnimation,
} from 'react-native-reanimated';
import styled from 'styled-components/native';
import {clamp} from 'utils';
import CarouselImage from './CarouselImage';

export interface CarouselProps<T> {
  values: T[];
  height?: number;
  overshootFactor?: number;
  keyExtractor: (v: T) => string;
  getSource: (v: T) => ImageSourcePropType;
}

const Carousel = <T,>({
  values,
  getSource,
  keyExtractor,
  height = 300,
  overshootFactor = 0.15,
}: CarouselProps<T>) => {
  const posY = useSharedValue(0);
  const initialY = useSharedValue(0);
  const overshoot = useSharedValue(0);

  const currentIndex = useDerivedValue(() => {
    return interpolate(
      Math.abs(posY.value),
      values.map((_, idx) => idx * height),
      values.map((_, idx) => idx),
    );
  }, [values, height, posY]);

  const gesture = Gesture.Pan()
    .onBegin(() => {
      cancelAnimation(posY);
    })
    .onUpdate(e => {
      const newPosY = initialY.value + e.translationY;
      const clampedY = clamp([-(height * (values.length - 1)), newPosY, 0]);

      overshoot.value = clamp([
        -height * overshootFactor,
        newPosY - clampedY,
        height * overshootFactor,
      ]);

      posY.value = clampedY;
    })
    .onFinalize(() => {
      const index = Math.trunc(currentIndex.value);
      const restingPosition =
        -(index + (currentIndex.value > index + 0.5 ? 1 : 0)) * height;

      overshoot.value = withTiming(0, {easing: Easing.inOut(Easing.cubic)});
      posY.value = withSpring(restingPosition, {stiffness: 62}, f => {
        initialY.value = posY.value;
        console.log({f});
      });
    });

  const innerContainerStyle = useAnimatedStyle(() => {
    return {transform: [{translateY: posY.value}], height: height};
  }, [posY, overshoot, height]);

  const containerStyle = useAnimatedStyle(() => {
    return {height: height + overshoot.value, overflow: 'hidden'};
  }, [overshoot, height]);

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={containerStyle}>
        <Animated.View style={[innerContainerStyle]}>
          {values.map((it, idx) => (
            <CarouselImage
              height={height}
              first={idx === 0}
              overshoot={overshoot}
              source={getSource(it)}
              key={keyExtractor(it)}
              end={idx === values.length - 1}
            />
          ))}
        </Animated.View>

        <DotsContainer>
          {values.map((_, idx) => (
            <RenderDot
              index={idx}
              indexProgress={currentIndex}
              style={[{marginTop: idx > 0 ? 8 : 0}]}
            />
          ))}
        </DotsContainer>
      </Animated.View>
    </GestureDetector>
  );
};

const RenderDot = ({
  indexProgress,
  index,
  style,
}: {
  index: number;
  indexProgress: SharedValue<number>;
  style?: AnimateProps<View>['style'];
}) => {
  const dotStyle = useAnimatedStyle(() => {
    const config = {
      extrapolateLeft: Extrapolate.CLAMP,
      extrapolateRight: Extrapolate.CLAMP,
    };

    if (index === 0) {
      return {
        height: interpolate(
          indexProgress.value,
          [0, index + 1],
          [16, 4],
          config,
        ),
      };
    }

    return {
      height: interpolate(
        indexProgress.value,
        [index - 1, index, index + 1],
        [4, 16, 4],
        config,
      ),
    };
  }, [indexProgress, index]);

  return <Dot style={[dotStyle, style]} />;
};

const DotsContainer = styled.View`
  position: absolute;
  bottom: 24px;
  right: 12px;

  height: 100px;
  justify-content: flex-end;
`;

const Dot = styled(Animated.View)`
  height: 4px;
  width: 4px;
  border-radius: 10px;
  background-color: white;
`;

export default Carousel;
