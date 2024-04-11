import { StyleSheet, Dimensions } from 'react-native';

import theme from 'theme';

const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;

export default StyleSheet.create({
	container: {
		flex: 1,
        paddingTop: WIDTH > 350 ? 20 : 0,
        backgroundColor: theme.colors.white,
	},
    image: {
        alignItems: 'center',
    },
    title: {
        ...theme.styles.H25,
        fontWeight: '700',
        marginBottom: 20,
    },
    text: {
        ...theme.styles.P1_5,
        fontSize: 17,
        color: theme.colors.darkGrey,
        marginBottom: 30,
    },
    resumeBtn: {
        borderRadius: 30,
    },
    resumeView: { 
        position: 'absolute',
        width: '100%',
        bottom: 0,
        paddingHorizontal: 20,
        paddingBottom: 60, 
    },
    place: {
		marginHorizontal: theme.spacing(6),
	},
    cities: {
        position: 'absolute',
        width: '100%',
        height: HEIGHT,
        paddingTop: 30,
    }
});