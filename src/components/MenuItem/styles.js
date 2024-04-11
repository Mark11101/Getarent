import { StyleSheet } from 'react-native'
import theme from '../../theme'

const styles = StyleSheet.create({
	container: {
		width: '100%',

		marginBottom: 16,
		backgroundColor: theme.colors.whiteSmoke,
		borderRadius: 20
	},
	touchable: {
		width: '100%',
		padding: 16,

		flexDirection: 'row',
		alignItems: 'center',
	},
	title: {
		flex: 1,

		fontFamily: theme.fonts.inter,
		color: theme.colors.black,
		fontSize: 14
	},
	icon: {

	},
	prefixContent: {
		marginRight: 8
	},
	postfixContent: {
		marginLeft: 8
	},
	arrowIcon: {
		marginLeft: 8
	},
	line: {
		position: 'absolute',
		left: 16,
		right: 16,
		bottom: 0,

		height: 1,
		width: 'auto',
		backgroundColor: theme.colors.svgLightGrey
	},
	label: {
		...theme.styles.secondaryText,
		fontSize: 12,
		lineHeight: 18
	},
	value: {
		...theme.styles.text,
		lineHeight: 20
	}
})

export default styles
