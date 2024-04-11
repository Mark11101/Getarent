import { Dimensions, StyleSheet } from 'react-native'
import theme from '../../theme'

const styles = StyleSheet.create({
	prolongation: {
		position: 'absolute',
		top: -40,
		left: 0,
		width: Dimensions.get('window').width,
		height: 50,
		backgroundColor: '#F5F5F7'
	},
	flexCentered: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	container: {
		backgroundColor: '#F5F5F7',
		padding: 16,
		marginBottom: 16,

		borderEndStartRadius: 20,
		borderEndEndRadius: 20
	},
	avatarContainer: {

	},
	avatarEditIcon: {
		position: 'absolute',
		top: 0,
		right: 0,
		zIndex: 1
	},
	content: {
		marginLeft: 16,
		flex: 1
	},
	title: {
		flexDirection: 'row',
		alignContent: 'center'
	},
	name: {
		fontFamily: theme.fonts.delaGothicOne,
		fontSize: 16,
		fontWeight: '400',
		// lineHeight: 18
	},
	rating: {

	},
	status: {
		marginTop: 2,
		flexDirection: 'row',
		alignItems: 'center'
	},
	statusTitle: {
		marginLeft: 4,

		color: theme.colors.black,
		fontSize: 12,
		fontFamily: theme.fonts.inter
	},
	manageLink: {
		padding: 0,

		alignItems: 'flex-start',
		width: 170,
	},
	manageLinkText: {
		fontSize: 12
	},
	text: {
		fontSize: 14,
		fontFamily: theme.fonts.inter,
		color: theme.colors.black
	},
	secondaryText: {
		fontSize: 12,
		fontFamily: theme.fonts.inter,
		color: theme.colors.secondaryTextGrey
	},
	backBtn: {
		marginBottom: 30
	},
	backBtnIcon: {
		transform: [ { rotate: '180deg' } ],
		marginRight: 16
	}
})

export default styles
