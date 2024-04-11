#!/bin/bash
# Fix for react-native-calendars@1.403.0

echo Fix react-native-calendars

BASE_PATH=$1/../node_modules/react-native-calendars/src

declare -a arr=("$BASE_PATH/agenda/index.js" "$BASE_PATH/calendar/index.js")

for file in "${arr[@]}"
do
	if ! grep -q deprecated-react-native-prop-types "$file"; then
		sed -i '' 's/, ViewPropTypes}/}/g' $file
		sed -i '' "1s/^/import {ViewPropTypes} from 'deprecated-react-native-prop-types'\n/" $file
	fi
done

echo Done
