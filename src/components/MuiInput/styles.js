import { StyleSheet, Platform } from 'react-native';

import theme from 'theme';

export default StyleSheet.create({
	internalInput: {
		width: '100%',
		marginTop: 0,
		marginBottom: 0
	},
	clearBtn: {
		position: 'absolute',
		right: 0,
		top: 2,
		zIndex: 2,
		width: 48.5,
		height: 38,
		alignItems: 'center',
		justifyContent: 'center'
	},
	placeholder: {

		position: 'absolute',
		left: 22,
		top: 10,
		backgroundColor: theme.colors.white,
		borderRadius: 50,

		text: {
			fontFamily: 'Inter-Regular',
			fontSize: 14,
			lineHeight: 20,
			color: '#878F9B',
			paddingHorizontal: 5,
			backgroundColor: theme.colors.white,
		}
	},
	postfix: {
		position: 'absolute',
		left: 20,
		top: Platform.OS === 'android' ? 10 : 12,
		flexDirection: 'row',
	}
});
