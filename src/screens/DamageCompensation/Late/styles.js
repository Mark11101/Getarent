import { StyleSheet } from "react-native";

import theme from 'theme';

export default StyleSheet.create({
    safeArea: {
        height: '100%',
        backgroundColor: theme.colors.white, 
    },
    container: {
        paddingHorizontal: theme.spacing(5),
    },
    text: {
        ...theme.styles.P1R,
        marginBottom: theme.spacing(6),
    },
    checkboxView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing(6),
    },
    checkbox: {
        width: 18,
        height: 18,
        marginRight: theme.spacing(4),
    },  
    accidentCertificateLoader: {
        marginBottom: theme.spacing(8),
    },
    carPhotosView: {
        marginBottom: theme.spacing(20),
    },
    carPhotosText: {
        ...theme.styles.P2R,
        marginBottom: theme.spacing(4),
    },
    carPhotos: {
		flexDirection: 'row',
		flexWrap: 'wrap',
    },
	thumbnail: {
		...theme.styles.thumbnail,
        width: 74,
        height: 51,
		marginBottom: theme.spacing(2.5),
		marginRight: theme.spacing(2.5),
	},
    certificatePhoto: {
        width: 152,
        height: 112,
    },
    resumeBtn: {
        paddingHorizontal: theme.spacing(5),
        marginBottom: theme.spacing(6),
    },
    progressBtn: {
        paddingHorizontal: theme.spacing(5),
        marginBottom: theme.spacing(2),
    },
});
