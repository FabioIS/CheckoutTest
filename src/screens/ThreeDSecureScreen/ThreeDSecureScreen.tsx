import FastImage from '@d11/react-native-fast-image';
import { useNavigation } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Text, TouchableOpacity, View } from 'react-native';
import WebView, { WebViewNavigation } from 'react-native-webview';
import { FAILURE_URL, SUCCESS_URL } from '../../constants/checkout.constants';
import { IMAGES } from '../../constants/images.constants';
import { SCREEN_NAMES } from '../../constants/navigation.constants';
import { usePaymentContext } from '../../context/PaymentContext';
import { PaymentStatus } from '../../types/payment.types';
import { styles } from './ThreeDSecureScreen.styles';

export const ThreeDSecureScreen = () => {
  const { state, updateStatus } = usePaymentContext();
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const handleNavigationStateChange = useCallback(
    (navState: WebViewNavigation) => {
      const { url } = navState;

      if (url.includes(SUCCESS_URL)) {
        updateStatus(PaymentStatus.success);
      } else if (url.includes(FAILURE_URL)) {
        updateStatus(PaymentStatus.error, '3D Secure authentication failed');
      }
    },
    [updateStatus]
  );

  useEffect(() => {
    if (state.status === 'success' || state.status === 'error') {
      navigation.navigate(SCREEN_NAMES.PAYMENT_RESULT);
    }
  }, [state.status, navigation]);

  const handleLoadEnd = useCallback(() => {
    setLoading(false);
  }, []);

  const handleGoBack = useCallback(() => {
    Alert.alert(
      'Cancel Payment',
      'Are you sure you want to cancel the 3D Secure authentication? This will cancel your payment.',
      [
        {
          text: 'Continue Payment',
          style: 'cancel',
        },
        {
          text: 'Cancel Payment',
          style: 'destructive',
          onPress: () => {
            updateStatus(PaymentStatus.error, '3D Secure authentication cancelled by user');
          },
        },
      ]
    );
  }, [updateStatus, navigation]);

  if (!state.threeDSecureUrl) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <FastImage style={styles.backArrow} source={IMAGES.back} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Secure Payment</Text>
        <View style={styles.backButton} />
      </View>

      <WebView
        source={{ uri: state.threeDSecureUrl }}
        style={styles.webView}
        onNavigationStateChange={handleNavigationStateChange}
        onLoadEnd={handleLoadEnd}
        startInLoadingState={false}
      />
      <View style={styles.webView} />

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>Loading secure payment...</Text>
        </View>
      )}
    </View>
  );
};
