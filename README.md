# tictactoe-cloud
The project is a <b>tic tac toe</b> game for two players. It allows a user to play with anyone in the world in real time. The application consists of both
front end side built using Ionic cross-platform framework and [backend side](https://github.com/YouQam/tictactoe-cloud-backend) developed using nodeJS and containerized into a docker
container. It's implementation been tested using both android & iOS devices.

## Installation and Usage
- Clone/download the repo
- Run `npm install`
- Build & deploy to <b>Android</b>
  - Prerequisites
      - Java JDK 8
      - Android Studio
  - Run the following CLI commands
    - `ionic build`
    - `ionic cordova platform add android`
    - `ionic cordova run android` #To run on an android studio emulator
    - `ionic cordova run android  --device` #To run on a device

- Build & deploy to <b>iOS</b>:
  - Prerequisites
    - macOS
    - Xcode, install it from the App Store
    - iOS Developer account, sign up on [developer.apple.com](https://developer.apple.com/), it's free
  - Run the following CLI command
    - `ionic cordova build ios --prod`

## Licence
MIT
