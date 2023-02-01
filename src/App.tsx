import 'react-native-gesture-handler';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

import SwipeCardScreen from './screens/Swipe';
import styled from 'styled-components/native';

const DrawerStack = createDrawerNavigator();

const App = () => {
  return (
    <GestureHandlerRoot>
      <NavigationContainer>
        <DrawerStack.Navigator initialRouteName="SwipeCards">
          <DrawerStack.Screen name="SwipeCards" component={SwipeCardScreen} />
        </DrawerStack.Navigator>
      </NavigationContainer>
    </GestureHandlerRoot>
  );
};
const GestureHandlerRoot = styled(GestureHandlerRootView)`
  flex: 1;
`;

export default App;
