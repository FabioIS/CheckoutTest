import { useNavigation } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import WebView, { WebViewNavigation } from 'react-native-webview';
import { FAILURE_URL, SUCCESS_URL } from '../../constants/checkout.constants';
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

  if (!state.threeDSecureUrl) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Secure Payment</Text>
      </View>

      <WebView
        source={{ uri: state.threeDSecureUrl }}
        style={styles.webView}
        onNavigationStateChange={handleNavigationStateChange}
        onLoadEnd={handleLoadEnd}
        startInLoadingState={false}
      />

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>Loading secure payment...</Text>
        </View>
      )}
    </View>
  );
};
