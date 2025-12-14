import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SCREEN_NAMES } from '../constants/navigation.constants';
import { CardDetailsScreen } from '../screens/CardDetailsScreen/CardDetailsScreen';
import { PaymentResultScreen } from '../screens/PaymentResultScreen/PaymentResultScreen';
import { ThreeDSecureScreen } from '../screens/ThreeDSecureScreen/ThreeDSecureScreen';
import { RootStackParamList } from '../types/navigation.types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => (
  <Stack.Navigator
    initialRouteName={SCREEN_NAMES.CARD_DETAILS}
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen
      name={SCREEN_NAMES.CARD_DETAILS}
      component={CardDetailsScreen}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name={SCREEN_NAMES.THREE_D_SECURE}
      component={ThreeDSecureScreen}
      options={{
        headerShown: false,
        gestureEnabled: false,
      }}
    />
    <Stack.Screen
      name={SCREEN_NAMES.PAYMENT_RESULT}
      component={PaymentResultScreen}
      options={{
        headerShown: false,
        gestureEnabled: false,
      }}
    />
  </Stack.Navigator>
);
