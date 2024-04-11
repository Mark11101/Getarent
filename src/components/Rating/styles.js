import { StyleSheet } from 'react-native'
import theme from '../../theme';

const styles = StyleSheet.create({
	inlineContainer: {
		height: 22,
		flexDirection: 'row',
		alignItems: 'center',

		paddingVertical: 2,
		paddingHorizontal: 4,
		
		borderRadius: 8
	},
	inlineValue: {
		color: theme.colors.black,
		fontFamily: theme.fonts.inter,
		fontSize: 12,
		fontWeight: '700',
		lineHeight: 18
	}
})

export default styles
