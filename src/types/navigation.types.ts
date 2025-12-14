import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SCREEN_NAMES } from '../constants/navigation.constants';

export type RootStackParamList = {
  [SCREEN_NAMES.CARD_DETAILS]: undefined;
  [SCREEN_NAMES.THREE_D_SECURE]: undefined;
  [SCREEN_NAMES.PAYMENT_RESULT]: undefined;
};

export type CardDetailsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  typeof SCREEN_NAMES.CARD_DETAILS
>;

export type ThreeDSecureScreenProps = NativeStackScreenProps<
  RootStackParamList,
  typeof SCREEN_NAMES.THREE_D_SECURE
>;

export type PaymentResultScreenProps = NativeStackScreenProps<
  RootStackParamList,
  typeof SCREEN_NAMES.PAYMENT_RESULT
>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
