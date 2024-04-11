import { StyleSheet } from "react-native"
import theme from "../../theme"

const styles = StyleSheet.create({
	price: {
		fontSize: 16,
		lineHeight: 26,
		fontWeight: '600',
		color: theme.colors.darkGrey,
	},
	title: {
		...theme.styles.P1R,
		color: theme.colors.darkGrey,
	},
	textContainer: {
		display: 'flex',
		maxWidth: '80%',
	},
	spaceBetween: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 6,
	},
})

export default styles
