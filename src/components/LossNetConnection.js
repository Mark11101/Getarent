import {useNetInfo} from "@react-native-community/netinfo";
import {useEffect} from "react";
import {hideMessage, showMessage} from "react-native-flash-message";

export const LossNetConnection = () => {
    const {isConnected} = useNetInfo();

    useEffect(() => {
        if (typeof isConnected !== "boolean") {
            return;
        }

        if (!isConnected) {
            showMessage({
                message: "Отсутствует соединение...",
                description: "Проверьте подключение к интернету!",

                type: "danger",
                duration: 10000
            });

        } else {
            hideMessage();
        }
    }, [isConnected]);

    return null;
}