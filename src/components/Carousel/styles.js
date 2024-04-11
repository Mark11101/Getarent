import { StyleSheet, Dimensions } from 'react-native';

import theme from 'theme';

const { width } = Dimensions.get('window');
const height = (width * 253) / 376;

export default StyleSheet.create({
	container: {
		height,
	},
	image: {
		height,
		width,
	},
	pagination: {
		position: 'absolute',
		bottom: theme.spacing(5),
		left: 0,
		right: 0,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
	},
	dot: {
		width: theme.normalize(8),
		height: theme.normalize(8),
		backgroundColor: theme.colors.lightGrey,
		borderRadius: theme.normalize(8) / 2,
		marginHorizontal: theme.spacing(1),
	},
    leftArrow: {
        position: 'absolute',
        left: 10,
        width: '50%',
        height: 258,
    },
    rightArrow: {
        position: 'absolute',
        right: 10,
        width: '50%',
        height: 258,
    },
    rightArrowIcon: {
        position: 'absolute',
        top: '50%',
        right: 0,
    },
    leftArrowIcon: {
        position: 'absolute',
        top: '50%',
        left: 0,
        transform: [{ rotate: '180deg' }],
    },
});