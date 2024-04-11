import { StyleSheet, Dimensions, Platform } from "react-native";

import theme from "theme";

const HEIGHT = Dimensions.get('window').height;

export default StyleSheet.create({

	...theme.row,
	...theme.margins,

    picker: {
        width: Platform.OS === 'ios' ? '32%' : '33%',
		marginLeft: Platform.OS === 'ios' ? 0 : 10,
    },
    itemStyle: {
        fontSize: 18,
		width: 85,
		lineHeight: 30,
		height: HEIGHT - 300,
    },
	selectorHeader: {

		width: Platform.OS === 'ios' ? '90%' : '87%',
		left: Platform.OS === 'ios' ? 'auto' : -3,
		top: 20,
		justifyContent: 'space-between',

		text: {
			fontFamily: 'Inter-Regular',
			fontSize: 16,
			lineHeight: 20,
			color: '#878F9B',
		}
	},
    selectorCloseBtn: {

		borderWidth: Platform.OS === 'ios' ? 0.4 : 1,
		borderColor: '#878F9B', 
		borderRadius: 30,
		paddingHorizontal: 32,
		paddingVertical: 10,

		text: {
			fontFamily: 'Inter-Regular',
			fontSize: 18,
			lineHeight: 20,
			color: '#6c7480',
		}
	},
});
