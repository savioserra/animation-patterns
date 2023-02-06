import React from 'react';
import {ScrollView} from 'react-native-gesture-handler';
import styled from 'styled-components/native';
import {Carousel} from 'components/Carousel';

const CarouselScreen = () => {
  const sample = [...Array(5)].map((_, idx) => ({
    url: 'https://images.unsplash.com/photo-1575936123452-b67c3203c357',
    id: String(idx),
  }));

  return (
    <ScrollView
      contentContainerStyle={{flex: 1}}
      showsVerticalScrollIndicator={false}>
      <Carousel
        height={300}
        values={sample}
        getSource={it => ({uri: it.url})}
        keyExtractor={it => String(it.id)}
      />

      <PlaceholderView>
        <LoremIpsun>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </LoremIpsun>
      </PlaceholderView>
    </ScrollView>
  );
};

const LoremIpsun = styled.Text`
  text-align: center;
`;

const PlaceholderView = styled.View`
  padding: 24px;
  align-items: center;
  justify-content: center;
  flex: 1;
`;

export default CarouselScreen;
