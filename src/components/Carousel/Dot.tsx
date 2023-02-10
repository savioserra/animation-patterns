import React from 'react';
import Animated, {
  Extrapolate,
  interpolate,
  StyleProps,
  useAnimatedStyle,
} from 'react-native-reanimated';
import styled from 'styled-components/native';

import {useCarouselContext} from './Carousel';

const DOT_DIMENSION = 6;

const Dot = ({index, style}: {index: number; style?: StyleProps}) => {
  const {animatedIndex} = useCarouselContext();
  const animatedStyle = useAnimatedStyle(() => {
    const config = {
      extrapolateLeft: Extrapolate.CLAMP,
      extrapolateRight: Extrapolate.CLAMP,
    };

    if (index === 0) {
      return {
        height: interpolate(
          animatedIndex.value,
          [0, index + 1],
          [16, DOT_DIMENSION],
          config,
        ),
        opacity: interpolate(
          animatedIndex.value,
          [0, index + 1],
          [1, 0.5],
          config,
        ),
      };
    }

    return {
      height: interpolate(
        animatedIndex.value,
        [index - 1, index, index + 1],
        [DOT_DIMENSION, 16, DOT_DIMENSION],
        config,
      ),
      opacity: interpolate(
        animatedIndex.value,
        [index - 1, index, index + 1],
        [0.5, 1, 0.5],
        config,
      ),
    };
  }, [animatedIndex, index]);

  return <DotContainer style={[animatedStyle, style]} />;
};

const DotContainer = styled(Animated.View)`
  height: 6px;
  width: 6px;
  border-radius: 99;
`;

export default Dot;
