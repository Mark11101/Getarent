import { StyleSheet, Platform } from 'react-native';

import theme from 'theme';

export default StyleSheet.create({
    existingCard: {
        top: 6,
        maxWidth: 140,
        padding: 20,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems:'center',
        backgroundColor: '#066BD6',
        borderRadius: 20,
    },
    existingCardImg: {
        marginBottom: 10,
    },
    existingCardText: {
        color: '#FFFFFF',
    },
    deleteButton: {
        position: 'absolute',
        top: -6,
        right: -6,
        width: 25,
        height: 25,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderWidth: 2,
        borderColor: theme.colors.greyBlue,
        borderRadius: 50,
    },
    deleteButtonText: {
        top: Platform.OS === 'android' ? -1 : 0,
        fontSize: 14,
        color: theme.colors.greyBlue,
    },
    newCard: {
        maxWidth: 140,
        padding: 20,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems:'center',
        backgroundColor: '#EDF1F7',
        borderRadius: 20,
    },
    newCardImg: {
        marginBottom: 10,
    },
    newCardText: {
        color: '#8F9BB3',
    }
});
