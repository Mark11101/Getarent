import { StyleSheet } from 'react-native'
import theme from '../../theme'

const styles = StyleSheet.create({
	content: {
		paddingHorizontal: 8,
		backgroundColor: '#fff'
	},
	flexRowCentered: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center'
	},
	text: {
		color: theme.colors.black,
		fontFamily: theme.fonts.inter,
		fontSize: 14
	},
	sectionTitle: {
		marginLeft: 16,
		marginBottom: 8,
		fontSize: 12
	},
	secondaryText: {
		color: theme.colors.secondaryTextGrey,
		fontFamily: theme.fonts.inter,
		fontSize: 14
	},
	blueText: {
		color: theme.colors.blue,
	},
	redText: {
		color: theme.colors.red
	},
	bold: {
		fontWeight: '700'
	},
	textBtn: {
		padding: 0,
	
		alignItems: 'flex-start',
	}
})

export default styles
