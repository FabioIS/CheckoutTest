# Checkout Test - React Native Payment App

A React Native payment application demonstrating secure card payment processing with 3D Secure authentication integration.

## Tech Stack

- **React Native** 0.83.0
- **TypeScript** 5.8.3
- **React Navigation** v7
- **FastImage** for optimized image loading
- **React Native WebView** for 3D Secure
- **React Native Config** for environment variables

In order to keep the bundle size small and since the problem to solve is simple, I decided to manage all the state of the app through Context instead of using Redux nor React Query as there is no need to cache the response of endpoints.

## Prerequisites

- Node.js >= 20
- React Native CLI
- Xcode (for iOS development)
- Android Studio (for Android development)

## Installation

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Install iOS dependencies**

   ```bash
   cd ios && pod install && cd ..
   ```

3. **Environment Setup**

   Create a `.env` file in the root directory:

   ```env
   CHECKOUT_SECRET_KEY=your_secret_key_here
   ```

## 🚀 Running the App

### iOS

```bash
npm run ios
```

### Android

```bash
npm run android
```

### Development Server

```bash
npm start
```

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── CardInput/       # Card input component with validation
│   └── PaymentButton/   # Payment action button
├── constants/           # App constants
│   ├── checkout.constants.ts    # API configuration
│   ├── images.constants.ts      # Image assets
│   └── navigation.constants.ts  # Screen names
├── context/            # React Context providers
│   └── PaymentContext.tsx      # Payment state management
├── navigation/         # Navigation configuration
│   └── RootNavigator.tsx       # Main navigation stack
├── screens/           # Screen components
│   ├── CardDetailsScreen/      # Payment form
│   ├── ThreeDSecureScreen/     # 3DS authentication
│   └── PaymentResultScreen/    # Payment outcome
├── services/          # API services
│   └── checkoutApi.ts         # Payment API calls
├── types/            # TypeScript type definitions
│   ├── navigation.types.ts    # Navigation types
│   └── payment.types.ts       # Payment types
└── utils/            # Utility functions
    ├── cardFormatting.ts      # Card formatting logic
    └── cardValidation.ts      # Card validation logic
```

## Testing

Run the test suite:

```bash
npm test
```

## Known Issues

- This is a test implementation focused on 3D Secure payments
- Error handling is simplified for demonstration
- UI styling is basic and can be enhanced
- As future implementation, users could log in and use its auth token to do the request instead of private key
- Missing proper testing of 3DSecure webview
