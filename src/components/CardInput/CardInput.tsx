import { useCallback, useState } from 'react';
import { Text, TextInput, View, type TextInputProps } from 'react-native';
import { styles } from './CardInput.styles';

interface CardInputProps extends Omit<TextInputProps, 'style' | 'onChangeText' | 'onBlur'> {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  showError?: boolean;
  onBlur?: () => void;
  icon?: React.ReactNode;
}

export const CardInput: React.FC<CardInputProps> = ({
  label,
  value,
  onChangeText,
  error,
  showError = false,
  onBlur,
  icon,
  ...textInputProps
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    onBlur && onBlur();
  }, [onBlur]);

  const inputContainerStyle = [
    styles.inputContainer,
    isFocused && styles.inputContainerFocused,
    showError && error && styles.inputContainerError,
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={inputContainerStyle}>
        {icon}
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...textInputProps}
        />
      </View>
      {showError && error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};
