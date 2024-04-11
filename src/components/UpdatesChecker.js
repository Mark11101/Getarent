import {
    Alert,  
    Linking,
    Platform,
} from 'react-native';
import React from 'react';
import { useSelector } from 'react-redux';
import DeviceInfo from 'react-native-device-info';

import api from 'api';

const isAndroid = Platform.OS === 'android';

const UpdatesChecker = () => {

    const openStore = () => {

        const link = 
            isAndroid
            ? 'https://play.google.com/store/apps/details?id=ru.getarent.app'
            : 'itms-apps://apps.apple.com/ru/app/getarent-аренда-авто-прокат/id1541999129';

        Linking.canOpenURL(link).then(
          (supported) => {
            supported && Linking.openURL(link);
          },
          (err) => console.log(err)
        );
    };

    const openRequiredUpdateAlert = () => {

        Alert.alert('Обновление', 'Для дальнейшего использования приложения, пожалуйста, обновитесь', [
            {
                text: 'Загрузить',
                onPress: () => {
                    openStore();
                    openRequiredUpdateAlert();
                },
            },
        ])
    };

    const openRecommendedUpdateAlert = () => {
        
        Alert.alert('Обновление', 'Вышла новая версия приложения, рекомендуем обновить его сейчас или можете сделать это потом', [
            {
                text: 'Загрузить',
                onPress: () => openStore(),
            },
            {
                text: 'Отмена',
            },
        ])
    };

    const checkIfVersionNeedsUpToDate = (deviceVersion, requiredVersion) => {
        
        return (
            requiredVersion?.toString().localeCompare(deviceVersion, undefined, {
                numeric: true,
                sensitivity: 'base',
            }) === 1
        );
    
        // 0 - versions are equal
        // 1 - requiredVersion is greater than deviceVersion
        // -1 - deviceVersion is greater than requiredVersion
    };

    const devMode = useSelector(st => st.devMode);

    React.useEffect(() => {

        api.web.getAppVersions().then((res) => {

            const deviceVersion = DeviceInfo.getVersion();

            const requiredVersion = 
                devMode 
                ? 
                    res.devRequired 
                : 
                    isAndroid
                    ?
                        res.androidProdRequired
                    :
                        res.iosProdRequired

            const recommendedVersion = 
                devMode 
                ? 
                    res.devRecommended 
                : 
                    isAndroid
                    ?
                        res.androidProdRecommended
                    :
                        res.iosProdRecommended
                       
            if (checkIfVersionNeedsUpToDate(deviceVersion, requiredVersion)) {
                openRequiredUpdateAlert()
            } else if (checkIfVersionNeedsUpToDate(deviceVersion, recommendedVersion)) {
                openRecommendedUpdateAlert()
            }
        });
    }, [])

    return (
        <></>
    )
};

export default UpdatesChecker;
