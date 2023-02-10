import React from 'react';
import {ImageProps} from 'react-native';
import Animated, {
  AnimateProps,
  useAnimatedProps,
  useAnimatedStyle,
} from 'react-native-reanimated';

import {useCarouselContext} from './Carousel';

const CarouselImage = ({
  end,
  start,
  source,
  index,
  style,
  ...props
}: CarouselImageProps) => {
  const {animatedIndex, overshoot, height, width} = useCarouselContext();

  const imageStyle = useAnimatedStyle(() => {
    if ((end && overshoot.value < 0) || (start && overshoot.value > 0)) {
      return {height: height + Math.abs(overshoot.value), width};
    }

    return {height, width};
  }, [overshoot, start, end, height, width]);

  const animatedProps = useAnimatedProps<ImageProps>(() => {
    let isVisible = false;
    const indexValue = animatedIndex.value;

    if (start) {
      isVisible = indexValue < index + 1;
    } else if (end) {
      isVisible = indexValue > index - 1;
    } else {
      isVisible = indexValue > index - 1 && indexValue < index + 1;
    }

    return {
      accessibilityElementsHidden: !isVisible,
      accessible: index === animatedIndex.value,
    };
  }, [animatedIndex, index, end, start]);

  return (
    <Animated.Image
      {...props}
      {...animatedProps}
      source={source}
      resizeMode="cover"
      resizeMethod="scale"
      accessibilityRole="image"
      style={[style, imageStyle]}
    />
  );
};

export type CarouselImageProps = AnimateProps<ImageProps> & {
  end: boolean;
  start: boolean;
  index: number;
};

export default CarouselImage;
