import React from 'react';
import {Text} from 'react-native';
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
        <Text>Lore Ipsum</Text>
      </PlaceholderView>
    </ScrollView>
  );
};

const PlaceholderView = styled.View`
  align-items: center;
  justify-content: center;
  flex: 1;
`;

export default CarouselScreen;
