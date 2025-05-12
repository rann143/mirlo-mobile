# Mirlo Mobile App

**Built with React Native & TypeScript**

***Currently Under Development**

This is the iOS mobile app for [mirlo](https://mirlo.space) allowing users to listen to recent releases and their purchased songs. 

The current focus is developing for iOS. Development for Android is on the roadmap.

## App Preview
This gif displays the most recent versions of the artist, album, and now-playing views:

![mirlo app preview](https://github.com/rann143/mirlo-mobile/blob/main/assets/images/mirlo-app-preview.gif)

## Get started

### Prerequisites
- Node.js 18+
- Xcode (for iOS)
- [Cocoapods](https://guides.cocoapods.org/using/getting-started.html) - For building native app
- npm

### Setup

1. Install dependencies

   ```bash
   npm install
   ```

2. Build native iOS app

   ```bash
   npx expo run:ios
   ```
   
3. Start the app

   ```bash
   npx expo start
   ```

Follow Expo's guides to set up a build for the iOS simulator:

- [Setting up the iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Create build for iOS Simulator](https://docs.expo.dev/build-reference/simulators/)

**Note:** This project contains native dependencies, so it cannot be run in Expo Go. You must build the native app first using the commands above.

This project uses [file-based routing](https://docs.expo.dev/router/introduction).
