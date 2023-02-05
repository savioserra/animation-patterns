import 'react-native-gesture-handler';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

import SwipeCardScreen from './screens/Swipe';
import styled from 'styled-components/native';
import CarouselScreen from './screens/Carousel';
import {useColorScheme} from 'react-native';

const DrawerStack = createDrawerNavigator();

const App = () => {
  const scheme = useColorScheme();

  return (
    <GestureHandlerRoot>
      <NavigationContainer>
        <DrawerStack.Navigator
          initialRouteName="Carousel"
          screenOptions={{
            sceneContainerStyle: {
              backgroundColor: scheme === 'light' ? 'white' : 'black',
            },
          }}>
          <DrawerStack.Screen name="SwipeCards" component={SwipeCardScreen} />
          <DrawerStack.Screen name="Carousel" component={CarouselScreen} />
        </DrawerStack.Navigator>
      </NavigationContainer>
    </GestureHandlerRoot>
  );
};
const GestureHandlerRoot = styled(GestureHandlerRootView)`
  flex: 1;
`;

export default App;
