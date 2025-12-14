import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { PaymentProvider } from './src/context/PaymentContext';
import { RootNavigator } from './src/navigation/RootNavigator';

function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <PaymentProvider>
          <NavigationContainer>
            <StatusBar barStyle="dark-content" />
            <RootNavigator />
          </NavigationContainer>
        </PaymentProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

export default App;
