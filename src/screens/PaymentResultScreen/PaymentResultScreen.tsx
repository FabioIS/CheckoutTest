import FastImage from '@d11/react-native-fast-image';
import { useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { IMAGES } from '../../constants/images.constants';
import { SCREEN_NAMES } from '../../constants/navigation.constants';
import { usePaymentContext } from '../../context/PaymentContext';
import { PaymentStatus } from '../../types/payment.types';
import { styles } from './PaymentResultScreen.styles';

export const PaymentResultScreen = () => {
  const navigation = useNavigation();
  const { state, resetPayment } = usePaymentContext();

  const isSuccess = state.status === PaymentStatus.success;

  const handleTryAgain = useCallback(() => {
    resetPayment();
    navigation.navigate(SCREEN_NAMES.CARD_DETAILS);
  }, [resetPayment, navigation]);

  return (
    <View style={styles.container}>
      <FastImage
        source={IMAGES[isSuccess ? 'check' : 'cross']}
        style={styles.iconContainer}
        resizeMode={FastImage.resizeMode.contain}
      />
      <Text style={[styles.title, isSuccess ? styles.successTitle : styles.errorTitle]}>
        {isSuccess ? 'Payment Successful' : 'Payment Failed'}
      </Text>
      <Text>
        {isSuccess
          ? 'Your payment has been processed successfully.'
          : "We couldn't process your payment."}
      </Text>
      {!isSuccess && state.error && <Text style={styles.errorMessage}>{state.error}</Text>}

      <TouchableOpacity style={styles.button} onPress={handleTryAgain}>
        <Text style={styles.buttonText}>{isSuccess ? 'Make Another Payment' : 'Try Again'}</Text>
      </TouchableOpacity>
    </View>
  );
};
