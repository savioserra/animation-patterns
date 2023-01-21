import React, {PropsWithChildren, useState} from 'react';
import {StyleProp, useWindowDimensions, ViewStyle} from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
  Extrapolate,
  FadeIn,
  interpolate,
  measure,
  runOnJS,
  runOnUI,
  SharedValue,
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import styled from 'styled-components/native';

const colors = ['#ca054d', '#3b1c32', '#74BE8D', '#B96D40'];

const App = () => {
  const progress = useSharedValue(0);
  const {width, height} = useWindowDimensions();

  const [stack, setStack] = useState(() =>
    Array.from({length: 50}).map((_, idx) => ({
      name: String(idx + 1).padStart(3, '0'),
      backgroundColor: colors[idx % colors.length],
    })),
  );

  const toRender = stack.slice(stack.length - 3, stack.length);

  const pop = (name: string) =>
    setStack(prev => prev.filter(it => it.name !== name));

  const cardWidth = width * 0.8;
  const cardHeight = height * 0.8;

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeArea>
        <Center>
          {toRender.map(({name, backgroundColor}, idx) => {
            const reversedIdx = toRender.length - idx - 1;

            return (
              <StyledCard
                key={name}
                threshold={200}
                progress={progress}
                position={reversedIdx}
                style={{width: cardWidth, height: cardHeight, backgroundColor}}
                onSwipeLeft={() => {
                  pop(name);
                  return true;
                }}
                onSwipeRight={() => {
                  pop(name);
                  return false;
                }}>
                <Content># {name}</Content>
              </StyledCard>
            );
          })}
        </Center>
      </SafeArea>
    </GestureHandlerRootView>
  );
};

const SafeArea = styled.SafeAreaView`
  flex: 1;
`;

const Content = styled.Text`
  color: #ffebd6;
`;

type CardProps = PropsWithChildren<{
  threshold?: number;
  onSwipeLeft?: () => boolean;
  onSwipeRight?: () => boolean;
  position?: number;
  progress: SharedValue<number>;
  disabled?: boolean;
  style?: StyleProp<Animated.AnimateStyle<StyleProp<ViewStyle>>>;
}>;

const Card = ({
  style,
  children,
  progress,
  onSwipeLeft,
  onSwipeRight,
  disabled = false,
  threshold = 200,
  position: pos = 0,
}: CardProps) => {
  const x = useSharedValue(0);
  const y = useSharedValue(0);

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

const Center = styled(GestureHandlerRootView)`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const CardContainer = styled(Animated.View)`
  position: absolute;
  border-radius: 36px;
`;

const StyledCard = styled(Card)`
  align-items: center;
  justify-content: center;
`;

export default App;
