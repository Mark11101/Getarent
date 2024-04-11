import { StyleSheet, Platform, Dimensions } from "react-native";

import theme from 'theme';

const width = Dimensions.get('window').width;

export default StyleSheet.create({
	filter: {
		paddingBottom: theme.spacing(3),
		marginTop: -5,
	},
	filterContent: {
		paddingHorizontal: theme.spacing(5),
	},
    content: {
		paddingHorizontal: theme.spacing(6),
		paddingTop: theme.spacing(2),
    },
	section: {
		marginBottom: theme.spacing(5),
	},
	subSection: {
		marginBottom: theme.spacing(3),
	},
	title: {
		...theme.styles.P1,
		marginBottom: theme.spacing(1),
	},
	helpText: {
		...theme.styles.P2R,
		lineHeight: 18,
		color: theme.colors.darkGrey,
		marginBottom: theme.spacing(2),
	},
	label: {
		...theme.styles.P2,
		marginTop: theme.spacing(2),
	},
	select: {
		marginTop: theme.spacing(0),
	},
	radionBtnText: {
		...theme.styles.P1_5,
	},
	textField: {
		...theme.styles.P2R,
		height: theme.normalize(120),
		textAlignVertical: 'top',
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: Platform.OS === 'ios' ? -10 : 0,
		width: width - 80,
	},
	headerTitle: {
		...theme.styles.src.P1,
		marginBottom: -7,
		maxWidth: '90%',
	},
	status: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	statusIcon: {
		width: 5,
		height: 5,
		borderRadius: 50,
		marginRight: 7,
		top: 1,
	},
	submit: {
		padding: 10,
	},
	error: {
		color: theme.colors.red,
		marginTop: 5,
	},
	switch: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	eyeIcon: {
		marginRight: 5,
	},
	save: {
		width: '100%',
		flexDirection: 'row',
		alignItems: 'center',
		padding: 10,
	},
	saveBtn: {
		width: '100%',
		marginRight: 7,
	},
	deleteBtn: {
		borderWidth: 1,
		borderRadius: 4,
		borderColor: '#8d9bb5',
		padding: 11,
	},
	unavailableModal: {
		padding: 20,
	},
	checkboxes: {
		marginBottom: 25,
	},
	checkbox: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 10,
	},
	warningBlock: {
		flexDirection: 'row',
	},
	warningBlockIcon: {
		marginRight: 7, 
		top: 2,
	},
	info: {
		...theme.styles.P2R,
		lineHeight: 18,
		marginBottom: theme.spacing(2),
	},
	bold: {
		fontWeight: 'bold',
	},
	accordion: {
		marginBottom: -20,
	},
	accordionTitle: {
		...theme.styles.P2,
		marginRight: 50,
	},
	accordionText: {
		...theme.styles.P2R,
		lineHeight: 20,
		color: theme.colors.darkGrey,
		marginBottom: theme.spacing(2),
	},
	accordionList: {
		marginLeft: 10,
	},
	accordionListText: {
		...theme.styles.P2R,
		lineHeight: 22,
		color: theme.colors.darkGrey,
		marginBottom: theme.spacing(4),
	},
	deliveryRadius: {
		flexDirection: 'row', 
		justifyContent: 'space-between',
		width: '50%',
	},
	deliveryRadiusText: {
		...theme.styles.P1_5,
	},
	deliveryRadiusDeleteBtn: {
		color: theme.colors.red,
		paddingHorizontal: 20,
		paddingBottom: 5,
	},
	deliveryRadiusBlueBtn: {
		...theme.styles.P1_5,
		color: theme.colors.blue,
		marginBottom: 10,
	},
	row: {
		flexDirection: 'row', 
	},
	photos: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
		marginBottom: 30,
	},
	thumbnail: {
		...theme.styles.thumbnail,
		width: '48.5%',
		height: 100,
		marginBottom: theme.spacing(2.5),
	},
	discount: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	discountDeleteBtn: {
		padding: 20,
		top: 8,
		left: -2,
	}
});
