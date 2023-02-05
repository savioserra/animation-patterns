import React from 'react';
import {ImageProps} from 'react-native';
import Animated, {
  AnimateProps,
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';

const CarouselImage = ({
  end,
  first,
  source,
  height,
  overshoot,
  ...props
}: CarouselImageProps) => {
  const imageStyle = useAnimatedStyle(() => {
    if (end && overshoot.value < 0) {
      return {height: height + overshoot.value};
    }

    if (first && overshoot.value > 0) {
      return {height: height + overshoot.value};
    }

    return {height};
  }, [overshoot, first, end, height]);

  return (
    <Animated.Image
      {...props}
      source={source}
      resizeMode="cover"
      resizeMethod="scale"
      style={[imageStyle]}
    />
  );
};

export type CarouselImageProps = AnimateProps<ImageProps> & {
  first: boolean;
  end: boolean;
  height: number;
  overshoot: SharedValue<number>;
};

export default CarouselImage;
