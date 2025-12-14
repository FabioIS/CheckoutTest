import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
  },
  inputContainerFocused: {
    borderColor: '#007AFF',
    borderWidth: 2,
  },
  inputContainerError: {
    borderColor: '#FF3B30',
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: '#000',
  },
  errorText: {
    fontSize: 12,
    color: '#FF3B30',
    marginTop: 4,
  },
});
