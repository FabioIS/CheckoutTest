import { ActivityIndicator, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { styles } from './PaymentButton.styles';

interface PaymentButtonProps extends Omit<TouchableOpacityProps, 'style'> {
  title: string;
  loading?: boolean;
  disabled?: boolean;
  onPress: () => void;
}

export const PaymentButton: React.FC<PaymentButtonProps> = ({
  title,
  loading = false,
  disabled = false,
  onPress,
  ...props
}) => {
  const isDisabled = disabled || loading;

  const buttonStyle = [styles.button, isDisabled && styles.buttonDisabled];
  const textStyle = [styles.buttonText, isDisabled && styles.buttonTextDisabled];

  return (
    <TouchableOpacity style={buttonStyle} onPress={onPress} disabled={isDisabled} {...props}>
      {loading ? (
        <ActivityIndicator testID="activity-indicator" />
      ) : (
        <Text style={textStyle}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};
