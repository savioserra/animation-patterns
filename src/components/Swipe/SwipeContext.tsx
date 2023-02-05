import React, {useContext} from 'react';
import {createContext, PropsWithChildren} from 'react';
import {SharedValue, useSharedValue} from 'react-native-reanimated';

const SwipeContext = createContext({} as {progress: SharedValue<number>});

const SwipeProvider = ({children}: PropsWithChildren) => {
  const progress = useSharedValue(0);

  return (
    <SwipeContext.Provider value={{progress}}>{children}</SwipeContext.Provider>
  );
};

export const useSwipeContext = () => useContext(SwipeContext);

export default SwipeProvider;
