#!/bin/bash
BASE_DIR=$(dirname $(realpath "$0"))

# npx react-native-fix-image -- deprecated
npx patch-package
bash $BASE_DIR/react-native-calendars.postinstall.sh $BASE_DIR
