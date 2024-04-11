import { StyleSheet } from 'react-native';

import theme from 'theme';

export default StyleSheet.create({
	publicProfile: {
		...theme.styles.paper, 
		...theme.styles.flex,
		paddingTop: 53,
	},
	car: {
		marginTop: 16,
		marginHorizontal: theme.spacing(0),
	},
	name: {
		...theme.styles.H3,
		textAlign: 'center',
		paddingTop: theme.spacing(3.5),
		marginBottom: 12,
	},
	userSubInfo: {
		...theme.styles.P2R,
		color: theme.colors.darkGrey,
		textAlign: 'center'
	},
	blueText: {
		color: theme.colors.blue,
	},
	greenText: {
		color: theme.colors.green,
	},
	imageContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		paddingHorizontal: theme.spacing(6),
		marginBottom: 15,
	},
	icon: {
		marginHorizontal: theme.spacing(1),
		marginVertical: theme.spacing(1.5),
	},
	status: {
		height: theme.normalize(64),
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: theme.colors.lightGrey,
		marginVertical: theme.spacing(6.5),
	},
	statusText: {
		...theme.styles.src.P1R,
		color: theme.colors.green,
	},
	ratingReviewsBarBottom: {
		marginBottom: theme.spacing(6),
		marginTop: theme.spacing(3),
	},
	superHost: {
		flexDirection: 'row',
		justifyContent: 'center',
		paddingHorizontal: 40,
		marginBottom: 30,
	},
	superHostIcon: {
		left: -23,
		top: 3,
		position: 'absolute',
	},
	stats: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 30,
		paddingHorizontal: 25,
	},
	statsText: {
		...theme.styles.P1,
		marginRight: 14,
	},
	row: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	rating: {
		...theme.styles.P1R,
		borderColor: theme.colors.yellow,
		borderRadius: theme.normalize(16),
		borderWidth: theme.normalize(1),
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: 3,
		paddingHorizontal: 12,
	},
	reviewHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 20,
		paddingHorizontal: theme.spacing(6),
	},
	modal: {
		paddingTop: 30,
		paddingBottom: 18,
		paddingHorizontal: 20,
	},
	modalText: {
		...theme.styles.P1_5,
		textAlign: 'center',
	},
});
