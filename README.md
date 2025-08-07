# Mirlo Mobile App

**Built with React Native & TypeScript**

***Currently Under Development**

This is the official mobile app for [Mirlo](https://mirlo.space) developed in collaboration with the Mirlo team. This app will allow users to listen to their purchased songs and the publicly available catalog of music. Check out [Mirlo's GitHub](https://github.com/funmusicplace/mirlo)!

The current focus is developing for iOS. Development for Android is on the roadmap.

## App Preview

This gif displays the most recent versions of the home, search, menu, album, and artist views:

<img src="https://github.com/rann143/mirlo-mobile/blob/main/assets/images/mirlo-app-preview-2.gif" alt="mirlo app preview" width="300" height="600"/>

## Get started

### Prerequisites

- Node.js v18+
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

Follow Expo's guides to set up a development build for your iOS simulator:

- [Setting up the iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Create build for iOS Simulator](https://docs.expo.dev/build-reference/simulators/)

**Note:** This project contains native dependencies, so it cannot be run in Expo Go. You must build the native app first using the commands above.

This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Contributing

_Branch Structure:_

**main** - Production branch (what users see in app store)

**preview** - Staging/Testing branch (for reviewing changes with our internal distribution builds before they go live)

**1. Create Feature Branch**

Always branch from main with the latest code
```bash
git checkout main
git pull origin main
git checkout -b feature/your-feature-name
```

**2. Make Your Changes**

  - Write your code
  - Test locally with 'npm start' or 'npx expo start'
  - Commit

**3. Submit Pull Request**
   
   ***Important: Always target the 'preview' branch, never 'main'.**
  
   Then create a PR with:
   
   - Base branch: preview ← Your branch: feature/your-feature-name
   - Clear description of what you changed
   - Screenshots/videos if it's a UI change
**4. Testing Your Changes**
 
 After your PR merges to staging:

   - Changes are automatically available in our staging app builds
   - Maintainers will test your changes before promoting to production

### What Happens Next

- Your PR gets reviewed against the preview branch
- Once merged to preview, your changes automatically deploy to our testing environment
- After testing, maintainers merge preview → main for production release
