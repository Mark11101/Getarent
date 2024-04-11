import { StyleSheet } from "react-native"
import theme from "../../../theme"

const styles = StyleSheet.create({
	timeSelector: {
		...theme.styles.flexRowCentered,
		justifyContent: 'space-between',

		borderWidth: 1,
		borderRadius: 50,
		borderColor: '#DBE3EF',
		paddingHorizontal: 20,
		paddingVertical: 9,

		text: {
			fontFamily: 'Inter-Regular',
			fontSize: 14,
			lineHeight: 20,
			color: theme.colors.black
		}
	}
})

export default styles
