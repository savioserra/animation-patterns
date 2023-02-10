import {identity} from 'lodash';
import React, {useContext} from 'react';
import {ImageSourcePropType} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useDerivedValue,
  interpolate,
  withTiming,
  Easing,
  useAnimatedStyle,
  SharedValue,
} from 'react-native-reanimated';
import {useWindowDimensions} from 'react-native/Libraries/Utilities/Dimensions';
import styled from 'styled-components/native';
import {clamp} from 'utils';
import CarouselImage from './CarouselImage';
import Dot from './Dot';

export interface CarouselProps<T> {
  data: T[];
  width?: number;
  height?: number;
  keyExtractor: (v: T) => string;
  sourceExtractor?: (v: T) => ImageSourcePropType;
  settings?: Partial<CarouselSettings>;
}

export type CarouselSettings = {
  overshootFactor: number;
  overshootWeight: number;
  actionsAreaFactor: number;
  fastSwipeThreshold: number;
  duration: number;
};

export type CarouselContextValue = {
  posY: SharedValue<number>;
  overshoot: SharedValue<number>;
  animatedIndex: SharedValue<number>;
  height: number;
  width: number;
};

const Carousel = <T,>({
  data,
  settings,
  width: widthProp,
  keyExtractor = String,
  sourceExtractor = identity,
  height = 420,
}: CarouselProps<T>) => {
  const {
    overshootFactor,
    overshootWeight,
    actionsAreaFactor,
    fastSwipeThreshold,
  } = {...defaultSettings, ...settings};

  const {width: windowWidth} = useWindowDimensions();
  const width = widthProp ?? windowWidth;

  const posY = useSharedValue(0);
  const initialY = useSharedValue(0);
  const overshoot = useSharedValue(0);

  const animateToIndex = (index: number) => {
    'worklet';
    const nextIndex = clamp(0, index, data.length - 1);

    posY.value = withTiming(
      nextIndex * -height,
      {duration: 320},
      () => (initialY.value = posY.value),
    );
  };

  const animatedIndex = useDerivedValue(() => {
    return interpolate(
      Math.abs(posY.value),
      data.map((_, idx) => idx * height),
      data.map((_, idx) => idx),
    );
  }, [data, height, posY]);

  const tapGesture = Gesture.Tap().onEnd(({y}) => {
    const nextIndex = Math.trunc(animatedIndex.value);

    if (y <= height * actionsAreaFactor) {
      animateToIndex(nextIndex - 1);
    }

    if (y >= height - height * actionsAreaFactor) {
      animateToIndex(nextIndex + 1);
    }
  });

  const panGesture = Gesture.Pan()
    .onUpdate(e => {
      const newPosY = initialY.value + e.translationY;
      const clampedY = clamp(-(height * (data.length - 1)), newPosY, 0);
      const max = height * overshootFactor;
      const currentOvershoot = newPosY - clampedY;

      posY.value = clampedY;
      overshoot.value = clamp(-max, currentOvershoot / overshootWeight, max);
    })
    .onEnd(({velocityY}) => {
      const currentIndex = Math.trunc(animatedIndex.value);
      let nextIndex = currentIndex;

      if (Math.abs(velocityY) >= fastSwipeThreshold) {
        nextIndex -= Math.sign(velocityY);
      } else {
        nextIndex += currentIndex + 1 - animatedIndex.value <= 0.5 ? 1 : 0;
      }

      overshoot.value = withTiming(0, {easing: Easing.inOut(Easing.cubic)});
      animateToIndex(nextIndex);
    });

  const innerContainerStyle = useAnimatedStyle(() => {
    const translateY = posY.value + (overshoot.value < 0 ? overshoot.value : 0);
    return {transform: [{translateY}], height};
  }, [posY, overshoot, height]);

  const viewportStyle = useAnimatedStyle(() => {
    return {height: height + overshoot.value, overflow: 'hidden'};
  }, [overshoot, height]);

  return (
    <CarouselProvider value={{animatedIndex, height, overshoot, posY, width}}>
      <GestureDetector gesture={Gesture.Race(panGesture, tapGesture)}>
        <Animated.View
          style={viewportStyle}
          accessible
          accessibilityActions={[
            {name: 'next', label: 'Next'},
            {name: 'previous', label: 'Previous'},
          ]}
          onAccessibilityAction={({nativeEvent: {actionName}}) => {
            animateToIndex(
              Math.trunc(animatedIndex.value) + actionName === 'previous'
                ? -1
                : 1,
            );
          }}>
          <Animated.View style={innerContainerStyle}>
            {data.map((it, idx) => (
              <CarouselImage
                index={idx}
                start={idx === 0}
                key={keyExtractor(it)}
                source={sourceExtractor(it)}
                end={idx === data.length - 1}
              />
            ))}
          </Animated.View>

          <DotsContainer pointerEvents="none">
            {data.map((it, idx) => (
              <Dot
                index={idx}
                key={keyExtractor(it)}
                style={{marginTop: idx > 0 ? 4 : 0}}
              />
            ))}
          </DotsContainer>
        </Animated.View>
      </GestureDetector>
    </CarouselProvider>
  );
};

const defaultSettings: CarouselSettings = {
  duration: 320,
  overshootWeight: 10,
  overshootFactor: 0.15,
  actionsAreaFactor: 0.3,
  fastSwipeThreshold: 300,
};

const DotsContainer = styled(Animated.View)`
  position: absolute;
  bottom: 40px;
  right: 40px;
  justify-content: flex-end;
`;

const CarouselContext = React.createContext({} as CarouselContextValue);

export const useCarouselContext = () => useContext(CarouselContext);

export const CarouselProvider = CarouselContext.Provider;

export default Carousel;
