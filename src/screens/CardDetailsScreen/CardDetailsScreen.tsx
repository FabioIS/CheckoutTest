import FastImage from '@d11/react-native-fast-image';
import { useNavigation } from '@react-navigation/native';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Text, View } from 'react-native';
import { CardInput } from '../../components/CardInput/CardInput';
import { PaymentButton } from '../../components/PaymentButton/PaymentButton';
import { CARD_ICONS } from '../../constants/images.constants';
import { SCREEN_NAMES } from '../../constants/navigation.constants';
import { usePaymentContext } from '../../context/PaymentContext';
import { PaymentStatus } from '../../types/payment.types';
import { formatCardNumber, formatExpiryDate, parseExpiryDate } from '../../utils/cardFormatting';
import {
  detectCardScheme,
  getCardMaxLength,
  getCvvMaxLength,
  validateCardNumber,
  validateCvv,
  validateExpiryDate,
} from '../../utils/cardValidation';
import { styles } from './CardDetailsScreen.styles';

export const CardDetailsScreen = () => {
  const { state, initiatePayment } = usePaymentContext();
  const navigation = useNavigation();

  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [touched, setTouched] = useState({
    cardNumber: false,
    expiryDate: false,
    cvv: false,
  });

  const cardScheme = useMemo(() => detectCardScheme(cardNumber), [cardNumber]);

  const handleCardNumberChange = useCallback((text: string) => {
    const cleaned = text.replace(/\s/g, '');
    const currentScheme = detectCardScheme(cleaned);
    const maxLength = getCardMaxLength(currentScheme);

    if (cleaned.length <= maxLength) {
      const formatted = formatCardNumber(cleaned, currentScheme);
      setCardNumber(formatted);
    }
  }, []);

  const handleExpiryDateChange = useCallback((text: string) => {
    if (text.length <= 7) {
      const formatted = formatExpiryDate(text);
      setExpiryDate(formatted);
    }
  }, []);

  const handleCvvChange = useCallback(
    (text: string) => {
      const cleaned = text.replace(/\D/g, '');
      const maxLength = getCvvMaxLength(cardScheme);

      if (cleaned.length <= maxLength) {
        setCvv(cleaned);
      }
    },
    [cardScheme]
  );

  const isFormValid = () => {
    const { month, year } = parseExpiryDate(expiryDate);
    return (
      validateCardNumber(cardNumber) &&
      validateExpiryDate(month, year) &&
      validateCvv(cvv, cardScheme)
    );
  };

  const handlePay = useCallback(async () => {
    if (!isFormValid()) {
      setTouched({ cardNumber: true, expiryDate: true, cvv: true });
      return;
    }

    try {
      const { month, year } = parseExpiryDate(expiryDate);
      await initiatePayment(cardNumber, month, year, cvv);
    } catch (error) {
      Alert.alert('Payment Error', 'Failed to process payment. Please try again.');
    }
  }, [cardNumber, expiryDate, cvv, initiatePayment]);

  useEffect(() => {
    if (state.status === 'pending-3ds') {
      navigation.navigate(SCREEN_NAMES.THREE_D_SECURE);
    } else if (state.status === 'success' || state.status === 'error') {
      navigation.navigate(SCREEN_NAMES.PAYMENT_RESULT);
    }
  }, [state.status, navigation]);

  const cardError = useMemo(() => {
    if (!touched.cardNumber || !cardNumber) return '';
    return validateCardNumber(cardNumber) ? '' : 'Invalid card number';
  }, [touched.cardNumber, cardNumber]);

  const expiryError = useMemo(() => {
    if (!touched.expiryDate || !expiryDate) return '';
    const { month, year } = parseExpiryDate(expiryDate);
    return validateExpiryDate(month, year) ? '' : 'Invalid expiry date';
  }, [touched.expiryDate, expiryDate]);

  const cvvError = useMemo(() => {
    if (!touched.cvv || !cvv) return '';
    return validateCvv(cvv, cardScheme) ? '' : 'Invalid CVV';
  }, [touched.cvv, cvv, cardScheme]);

  const cardIcon = useMemo(() => {
    return (
      <FastImage
        source={CARD_ICONS[cardScheme]}
        style={styles.cardIcon}
        resizeMode={FastImage.resizeMode.contain}
      />
    );
  }, [cardScheme]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Payment Details</Text>
        <Text style={styles.subtitle}>Enter your card information</Text>

        <CardInput
          label="Card Number"
          value={cardNumber}
          onChangeText={handleCardNumberChange}
          keyboardType="number-pad"
          placeholder="1234 5678 9012 3456"
          maxLength={19}
          error={cardError}
          showError={touched.cardNumber}
          onBlur={() => setTouched((prev) => ({ ...prev, cardNumber: true }))}
          icon={cardIcon}
        />

        <CardInput
          label="Expiry Date"
          value={expiryDate}
          onChangeText={handleExpiryDateChange}
          placeholder="MM/YYYY"
          keyboardType="number-pad"
          error={expiryError}
          showError={touched.expiryDate}
          onBlur={() => setTouched((prev) => ({ ...prev, expiryDate: true }))}
        />

        <CardInput
          label="CVV"
          value={cvv}
          onChangeText={handleCvvChange}
          placeholder={cardScheme === 'amex' ? '1234' : '123'}
          keyboardType="number-pad"
          secureTextEntry
          error={cvvError}
          showError={touched.cvv}
          onBlur={() => setTouched((prev) => ({ ...prev, cvv: true }))}
        />

        <PaymentButton
          title="Pay £65.40"
          onPress={handlePay}
          disabled={!isFormValid()}
          loading={state.status === PaymentStatus.tokenizing}
        />
      </View>
    </KeyboardAvoidingView>
  );
};
