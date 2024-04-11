import { StyleSheet } from 'react-native';

import theme from 'theme';

export default StyleSheet.create({
    select: {
        height: 38,
        borderRadius: 50,
        borderColor: '#DBE3EF',
        marginVertical: 0,
    },
    textStyle: {
        fontFamily: 'Inter-Regular',
        fontSize: 14,
        lineHeight: 20,
        color: theme.colors.black,
        left: 5,
    },
	placeholder: {

		position: 'absolute',
		left: 18,
		top: 9,
		paddingHorizontal: 5,
		backgroundColor: theme.colors.white,

		text: {
			fontFamily: 'Inter-Regular',
			fontSize: 14,
			lineHeight: 20,
			color: '#878F9B',
		}
	},
	errorMessageContainer: {
		position: 'absolute',
		left: 0,
        bottom: 12,
		width: '90%',
		flexDirection: 'row',
		alignItems: 'center',
	},
	errorMessage: {
		width: '100%',
		color: theme.colors.red,
		flex: 1,
		flexWrap: 'wrap',
		fontFamily: 'Inter-Regular',
		fontSize: 12,
		lineHeight: 18,
	},
	errorMessageIcon: {
		marginRight: 6
	}
});
