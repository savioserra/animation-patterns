import React, {useState} from 'react';

import styled from 'styled-components/native';
import {SwipeContext, SwipeCard} from 'components/Swipe';

const colors = ['#ca054d', '#3b1c32', '#74BE8D', '#B96D40'];

const SwipeCardScreen = () => {
  const [stack, setStack] = useState(() =>
    Array.from({length: 120}).map((_, idx, arr) => ({
      name: String(idx + 1).padStart(String(arr.length).length, '0'),
      backgroundColor: colors[idx % colors.length],
    })),
  );

  const toRender = stack.slice(stack.length - 3, stack.length);

  const pop = (name: string) =>
    setStack(prev => prev.filter(it => it.name !== name));

  return (
    <Center>
      <SafeArea>
        <SwipeContext>
          {toRender.map(({name, backgroundColor}, idx) => {
            const reversedIdx = toRender.length - idx - 1;

            return (
              <StyledCard
                key={name}
                threshold={200}
                position={reversedIdx}
                style={{backgroundColor}}
                onSwipeLeft={() => pop(name)}
                onSwipeRight={() => pop(name)}>
                <Content># {name}</Content>
              </StyledCard>
            );
          })}
        </SwipeContext>
      </SafeArea>
    </Center>
  );
};

const SafeArea = styled.SafeAreaView`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const Content = styled.Text`
  color: #ffebd6;
`;

const Center = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const StyledCard = styled(SwipeCard)`
  align-items: center;
  justify-content: center;

  width: 80%;
  height: 90%;
`;

export default SwipeCardScreen;
