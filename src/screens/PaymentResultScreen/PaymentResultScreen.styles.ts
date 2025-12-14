import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  successTitle: {
    color: '#4CAF50',
  },
  errorTitle: {
    color: '#F44336',
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: '#F44336',
    textAlign: 'center',
    marginBottom: 32,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 48,
    minWidth: 200,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
});
