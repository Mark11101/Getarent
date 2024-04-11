import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native'

import UploadIcon from 'img/upload-arrow.svg';

import theme from 'theme';

const HEIGHT = Dimensions.get('window').height;

const DocumentUploader = () => {

    const [result, setResult] = useState()

    useEffect(() => {
        console.log(JSON.stringify(result, null, 2));
    }, [result]);

    // const handleError = (err) => {
    //     if (isCancel(err)) {
    //         console.warn('cancelled');
    //         // User cancelled the picker, exit any dialogs or menus and move on
    //     } else if (isInProgress(err)) {
    //         console.warn('multiple pickers were opened, only the last will be considered');
    //     } else {
    //         throw err
    //     };
    // };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.uploader}
                onPress={() => {
                    // DocumentPicker.pick({
                    //     type: types.pdf,
                    // })
                    //     .then(setResult)
                    //     .catch(handleError)
                }}
            >
                <UploadIcon 
                    width={90} 
                    height={90} 
                    style={styles.icon}
                />
                <Text style={styles.label}>
                    Загрузите <Text style={styles.bold}>PDF</Text>
                </Text>
            </TouchableOpacity>
        </View>
    )
};

export default DocumentUploader;

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        height: HEIGHT - HEIGHT * 0.5,
    },
    uploader: {
        width: '100%',
        flexGrow: 1,
		borderWidth: 2.5,
		borderRadius: theme.normalize(4),
		borderStyle: 'dashed',
		borderColor: theme.colors.midBlue,
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: { 
        marginBottom: 20, 
        transform: [{ rotate: '180deg'}],
    },
    label: {
        ...theme.styles.P1,
        color: theme.colors.blue, 
        opacity: 0.7,
    },
    bold: {
        fontWeight: 'bold',
    },
});
