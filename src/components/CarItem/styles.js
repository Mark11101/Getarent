import { StyleSheet } from 'react-native';

import theme from 'theme';

export default StyleSheet.create({
	container: {
		marginTop: 0,
		marginBottom: theme.spacing(6),
	},
	img: {
		...theme.styles.src.round,
		flex: 1,
		height: theme.normalize(258),
		width: '100%',
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
	},
    paper: {
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
		paddingBottom: 10,
    },
    title: {
        ...theme.styles.P1_22,
        lineHeight: 22,
        fontWeight: '700',
        marginBottom: 8,
    },
    divider: {
        marginVertical: 12,
    },
    carFeature: {
        ...theme.styles.P3R,
        lineHeight: 16,
        color: 'black',
    },
    carFeatureDivider: {
        ...theme.styles.P3R,
        lineHeight: 16,
        marginHorizontal: 6,
    },
	includedFeaturesDivider: {
        ...theme.styles.P3R,
        lineHeight: 16,
		marginLeft: 0,
        marginRight: 5,
	},
    userInfoWrap: {
		flexDirection: 'row',
		alignItems: 'center',
        flexWrap: 'wrap',
		marginBottom: theme.spacing(2),
	},
    avatar: {
		marginRight: 8,
        marginBottom: 16,
	},
    name: {
        ...theme.styles.P3R,
		marginRight: 8,
        color: 'black',
    },
    mapPoint: {
		marginRight: 8,
    },
    mapText: {
        ...theme.styles.P3R,
        lineHeight: 16,
		marginRight: 16,
        color: 'black',
    },
	price: {
		fontSize: 26,
		fontWeight: '500',
		lineHeight: 31,
	},
	priceNote: {
		...theme.styles.note,
		lineHeight: 16,
        color: 'black',
	},
	pricePaper: {
		position: 'absolute',
		right: theme.normalize(16),
		top: theme.normalize(152),
		width: theme.normalize(120),
		height: theme.normalize(40),
		justifyContent: 'center',
		alignItems: 'center',
	},
	priceWrap: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		padding: theme.spacing(2),
		paddingHorizontal: theme.normalize(16),
	},
	confirmBtn: {
		backgroundColor: theme.colors.blue,
		borderRadius: 5,
		left: -10,
	},
	confirmBtnText: {
		...theme.styles.P1_5,
		color: theme.colors.white,
		paddingHorizontal: 14,
		paddingVertical: 3,
	},
	superprice: {
		marginRight: theme.normalize(10),
		color: theme.colors.darkYellow,
	},
	androidPriceFix: {
		marginBottom: -theme.spacing(2),
	},
	content: {
		flexDirection: 'column',
		alignItems: 'stretch',
		paddingHorizontal: theme.spacing(4),
		paddingTop: theme.spacing(4),
		paddingBottom: theme.spacing(3),
	},
	column: {
		flex: 1,
	},
	column2: {
		flexDirection: 'row',
		alignItems: 'flex-start',
        flexWrap: 'wrap',
		paddingTop: theme.spacing(1),
	},
	trips: {
		...theme.styles.src.P2R,
		color: theme.colors.darkGrey,
		marginRight: theme.spacing(3),
	},
	rating: {
		flexDirection: 'row',
		alignItems: 'center',
		marginRight: 8,
		backgroundColor: theme.colors.yellow,
        borderRadius: 5,
        paddingHorizontal: 5,
        paddingVertical: 2,
        marginTop: -2,
	},
    ratingValue: {
        ...theme.styles.P3R,
        color: theme.colors.white,
        fontWeight: '600',
        lineHeight: 16,
    },
    reviewsQty: {
        ...theme.styles.P3R,
        marginTop: -5,
		marginRight: 8,
    },
	icon: {
		marginBottom: theme.spacing(0.5),
        height: 16,
	},
    newOffer: {
		backgroundColor: theme.colors.mint,
        borderRadius: 5,
    },
    newOfferText: {
        ...theme.styles.P3R,
        color: theme.colors.white,
        fontWeight: '600',
        lineHeight: 16,
        paddingHorizontal: 5,
        paddingVertical: 3,
    },
	tags: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		padding: theme.spacing(4),
		paddingTop: theme.spacing(1),
		paddingBottom: theme.spacing(2),
	},
	tag: {
		height: theme.normalize(24),
		borderRadius: theme.normalize(24),
		borderWidth: theme.normalize(1),
		borderColor: theme.colors.green,
		paddingHorizontal: theme.spacing(2),
		marginRight: theme.spacing(2),
		marginBottom: theme.spacing(2),
		justifyContent: 'center',
	},
	lastTag: {
		marginRight: 0,
	},
	tagLabel: {
		...theme.styles.src.XS,
		lineHeight: undefined,
	},
	noTags: {
		paddingBottom: theme.normalize(38),
	},
	superhost: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
	},
	superhostIcon: {
		marginRight: theme.normalize(4),
	},
	row: {
		flexDirection: 'row',
		marginBottom: 4,
	},
});