jest.mock('react-native-config', () => ({
  CHECKOUT_SECRET_KEY: 'mock-secret-key',
}));

jest.mock('@d11/react-native-fast-image', () => {
  const React = require('react');
  const { Image } = require('react-native');

  const FastImage = (props) => React.createElement(Image, props);

  FastImage.resizeMode = {
    contain: 'contain',
    cover: 'cover',
    stretch: 'stretch',
    center: 'center',
  };

  return FastImage;
});

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
  }),
  NavigationContainer: ({ children }) => children,
}));

jest.mock('@react-navigation/native-stack', () => ({
  createNativeStackNavigator: () => ({
    Navigator: ({ children }) => children,
    Screen: ({ children }) => children,
  }),
}));

jest.mock('react-native-webview', () => {
  const React = require('react');
  const { View } = require('react-native');

  const WebViewComponent = (props) => React.createElement(View, { testID: 'webview', ...props });

  return {
    __esModule: true,
    default: WebViewComponent,
    WebView: WebViewComponent,
  };
});

global.fetch = jest.fn();

jest.mock('react-native/Libraries/Alert/Alert', () => ({
  alert: jest.fn(),
}));
