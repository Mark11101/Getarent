import { Dimensions, StyleSheet } from 'react-native';

import shadow from './shadow';

const { width, height } = Dimensions.get('window'),
	k = Math.min(width, height) / 376,
	normalize = val => Math.round(k * val),
	normalizeFontSize = normalize,
	spacing = val => normalize(val * 4),
	hs = normalize(10),
	hitSlop = { top: hs, left: hs, bottom: hs, right: hs },
	colors = {
		white: '#FFF',
		backgroundWhite: '#f4f4f5',
		black: '#222222',
		whiteSmoke: '#F5F5F7',
		secondaryTextGrey: '#878F9B',
		darkGrey: '#5D5D5D',
		greyBlue: '#8F9BB3',
		grey: '#D5D5D5',
		svgLightGrey: '#DBE3EF',
		lightGrey: '#EDF1F7',
		grey72: '#B8B8B8',
		lightCyan: '#8F9BB3',
		blue: '#066BD6',
		lightBlue: '#F8FBFE',
		midBlue: '#7CB2EA',
		green: '#00B283',
		lightGreen: '#00E096',
		mint: '#06BB9B',
		red: '#EB5757',
		lightRed: '#FFDADA',
		yellow: '#FFAA01',
		lightYellow: '#F4EEE4',
		darkYellow: '#F1A153',
		transparent: 'transparent',
	},
	fonts = {
		regular: 'OpenSans-Regular',
		semibold: 'OpenSans-SemiBold',
		bold: 'OpenSans-Bold',
		delaGothicOne: 'DelaGothicOne-Regular',
		inter: 'Inter'
	},
	getFontProps = (family, size, height) => ({
		fontFamily: fonts[family],
		fontSize: normalizeFontSize(size),
		lineHeight: normalize(height),
		includeFontPadding: false,
		color: colors.black,
	}),
	borderRadius = normalize(4),
	src = {
		flex: {
			flex: 1,
		},
		shrink: {
			flexShrink: 1,
		},
		grow: {
			flexGrow: 1,
		},
		disabled: {
			opacity: 0.3,
		},
		container: {
			flex: 1,
			backgroundColor: colors.white,
		},
		BH: getFontProps('bold', 44, 56),
		H1: getFontProps('bold', 32, 40),
		H2: getFontProps('bold', 24, 40),
		H2R: getFontProps('regular', 24, 40),
		H25: getFontProps('semibold', 22, 26),
		H3: getFontProps('semibold', 20, 33),
		H3R: getFontProps('regular', 20, 33),
		H4: getFontProps('semibold', 18, 26),
		H4R: getFontProps('regular', 18, 26),
		P1: getFontProps('semibold', 16, 26),
		P1_22: getFontProps('semibold', 16, 22),
		P1R: getFontProps('regular', 16, 26),
		P1_5: getFontProps('regular', 14, 22),
		P2: getFontProps('semibold', 13, 24),
		P2R: getFontProps('regular', 13, 22),
		P3R: getFontProps('regular', 12, 26),
		P4: getFontProps('semibold', 10, 18),
		P5R: getFontProps('regular', 8, 12),
		note: getFontProps('regular', 10, 22),
		XS: {
			...getFontProps('semibold', 11, 18),
			letterSpacing: normalizeFontSize(1) / 2,
		},
		BT: getFontProps('semibold', 16, 21),
		round: {
			borderRadius,
		},
		border: {
			borderWidth: normalize(1),
			borderColor: colors.grey,
			borderRadius,
		},
		paper: {
			borderRadius,
			backgroundColor: colors.white,
		},
		thumbnail: {
			width: normalize(72),
			height: normalize(50),
			borderRadius,
			overflow: 'hidden',
		},
	},
	row = {
		row: {
			flexDirection: 'row',
			alignItems: 'center',
		}
    },
    spaceBetween = {
		spaceBetween: {
			justifyContent: 'space-between',
		}
    },
	margins = {

		mt4: { marginTop: 4 },
		mb4: { marginBottom: 4 },
		mr4: { marginRight: 4 },
		ml4: { marginLeft: 4 },

		mr6: { marginRight: 6 },
		ml6: { marginLeft: 6 },

		mb8: { marginBottom: 8 },
		mr8: { marginRight: 8 },
		ml8: { marginLeft: 8 },

		mt16: { marginTop: 16 },
		mb16: { marginBottom: 16 },
		mr16: { marginRight: 16 },
		ml16: { marginLeft: 16 },

		mb24: { marginBottom: 24 },

		mb32: { marginBottom: 32 },

		p8: { padding: 8 },
		ph8: { paddingHorizontal: 8 },

		pr16: { paddingRight: 16 },
		pl16: { paddingLeft: 16 },

		pr24: { paddingRight: 24 },
		pl24: { paddingLeft: 24 },

	},
	text = {
		color: colors.black,
		fontFamily: fonts.inter,
		fontSize: 14
	},
	flexRowCentered = {
		flexDirection: 'row',
		alignItems: 'center'
	},
	styles = StyleSheet.create({
		...src,
		primaryBtn: {
			borderRadius: 30,
			width: '100%', 
			height: 38,
			paddingHorizontal: 20,

			alignSelf: 'flex-start',
			justifyContent: 'center',
			alignItems: 'center',

			fontSize: 16,
			lineHeight: 22
		},
		text: {
			...text,
			color: colors.black
		},
		secondaryText: {
			...text,
			color: colors.secondaryTextGrey
		},
		title: {
			fontFamily: fonts.delaGothicOne,
			fontSize: 16,
			fontWeight: '400'
		},
		backBtn: {

		}
	});


export default {
	normalize,
	normalizeFontSize,
	spacing,
	getFontProps,
	shadow,
	colors,
	fonts,
	styles: {
		...styles,
		text,
		flexRowCentered,
		src,
	},
	hitSlop,
	borderRadius,
	row,
	spaceBetween,
	margins,
};
