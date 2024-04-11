import { StyleSheet } from "react-native";

import theme from 'theme';

export default StyleSheet.create({
    container: {
		backgroundColor: theme.colors.white,
		flex: 1,
	},
	scrollView: {
		zIndex: 1000,
	},
	carousel: {

	},
	header: {
		position: 'absolute',
		top: 30,
		zIndex: 1500,
	},
	scrollContent: {
		paddingTop: theme.spacing(5),
		paddingBottom: 250,
		borderRadius: 30,
		top: 255,
		backgroundColor: theme.colors.white,
	},
	content: {
		paddingTop: theme.spacing(2),
		paddingHorizontal: theme.spacing(6),
		paddingBottom: theme.spacing(5),
	},
	title: {
		...theme.styles.P1,
		marginBottom: theme.spacing(3),
	},
	text: {
		...theme.styles.P1R,
	},
	row: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	carCharacteristics: {
		marginBottom: 15,
	},
	moreCarInfoBtnView: {
		marginBottom: 30,
		alignItems: 'flex-start',
	},
	moreCarInfoBtn: {
		padding: 0,
	},
	deliveryPlace: {
		...theme.styles.P1R
	},
	helpText: {
		...theme.styles.note,
		color: theme.colors.darkGrey,
	},
	dateBar: {
		marginBottom: theme.spacing(5),		
	},
	rentDiscount: {
		marginBottom: theme.spacing(2),	
	},
	price: {
		fontSize: 22,
		fontWeight: '500',
		marginRight: 3,
	},
	discountLabel: {
		borderRadius: 5,
		backgroundColor: '#F0F6FC',
		marginRight: 11,
	},
	discountLabelText: {
		paddingVertical: 3,
		paddingHorizontal: 5,
		fontSize: 11,
		color: theme.colors.blue,
	},
	strikedThroughPrice: {
		color: theme.colors.grey,
		textDecorationLine: 'line-through',
	},
	ownerCard: {
		marginBottom: 30,
		paddingHorizontal: theme.spacing(6),
		alignItems: 'flex-start',
	},
	panelIcon: {
		marginBottom: 15,
	},
	panelTitle: {
		...theme.styles.P1_22,
		marginBottom: 7,
	},
	panelText: {
		...theme.styles.P2R,
	},
	reviewHeader: {
		marginBottom: 20,
		paddingHorizontal: theme.spacing(6),
	},
	calcDelivery: {
		padding: 0, 
		marginBottom: 30, 
		alignItems: 'flex-start'
	},
	panelIcon: {
		marginBottom: 15,
	},
	panelTitle: {
		...theme.styles.P1_22,
		marginBottom: 7,
	},
	panelText: {
		...theme.styles.P2R,
	},
	reviewHeader: {
		marginBottom: 20,
		paddingHorizontal: theme.spacing(6),
	},
	calcDelivery: {
		padding: 0, 
		marginBottom: 30, 
		alignItems: 'flex-start'
	},

	withoutStats: {
		marginBottom: theme.spacing(3),
	},
	stats: {
		marginTop: theme.spacing(4),
		marginBottom: theme.spacing(3),
	},
	shadow: {
		...theme.shadow(1),
	},
	ratingReviewsBar: {
		marginRight: theme.spacing(6),
	},
	ratingReviewsBarBottom: {
		marginBottom: theme.spacing(6),
		marginTop: theme.spacing(1),
	},
	featureItem: {
		paddingLeft: theme.spacing(6),
	},
	note: {
		...theme.styles.P1R,
		marginBottom: theme.spacing(3),
	},
	addressTitle: {
		height: theme.normalize(44),
		marginBottom: 0,
	},
	address: {
		...theme.styles.P2R,
		marginTop: -theme.spacing(3),
		marginBottom: theme.spacing(2),
	},
	dateSection: {
		paddingTop: theme.spacing(2),
		paddingHorizontal: theme.spacing(6),
		paddingBottom: theme.spacing(5),
	},
	withIngosstrakh: {
		fontWeight: '600',
		fontSize: 13,
		lineHeight: 24,
		marginBottom: 30,
	},
	chat: {
		position: 'absolute',
		height: 20,
		right: 10,
	},
	chatBtn: {
		flexDirection: 'row',
	},
	chatIcon: {
		marginRight: 7,
	},
	chatText: {
		...theme.styles.P2R,
	}
});
