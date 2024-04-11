import { 
    View, 
    Text, 
    Modal,
    Platform,
    StatusBar,
    ScrollView, 
    SafeAreaView, 
    TouchableOpacity,
    TouchableWithoutFeedback,
} from 'react-native';
import React from 'react';
import { BlurView } from "@react-native-community/blur";

import api from 'api';
import CloseIcon from "img/close/close.svg";
import ModalImage from 'img/auth/reg-success.svg';
import { Header, PrimaryButton } from 'components';

import s from './styles';

const CarRegistration = ({ route: { params: { goBack } = {} }}) => {

    const [isModalVisible, setIsModalVisible] = React.useState(false);

    const handlePressBack = () => {

        if (goBack) {
            goBack();
        } else {
            api.navigation.goBack();
        };
    };
    
    return (
        <SafeAreaView style={s.safeArea}>
            <StatusBar barStyle="light-content" />
            <Header 
                white
                onPressBack={handlePressBack}
            />
            <ScrollView style={s.container}>
                <Text style={s.title}>
                    Сначала давайте познакомимся!
                </Text>
                <Text style={s.text}>
                    Приготовьте ваши документы ПТС и СТС, 
                    а также паспорт или данные организации.
                </Text>
                <Text style={s.text}>
                    Спасибо, что выбрали Getarent! Надеемся, что 
                    наше приложение сделает вашу жизнь более комфортной.
                </Text>
                {
                    Platform.OS === 'ios'
                    &&
                        <Text style={s.emoji}>
                            🙂
                        </Text>
                }
            </ScrollView>
            <View style={s.resume}>
                <PrimaryButton 
                    title='Продолжить'
                    style={s.resumeBtn}
                    titleStyle={s.resumeBtnTitle}
                    onPress={() => api.navigation.navigate('DriverInfo')}
                />
            </View>
            <Modal
                transparent={true}
                animationType="fade"
                visible={isModalVisible}
            >
                <BlurView
                    style={{ 
                        position: "absolute",
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0
                    }}
                    blurType="light"
                    blurAmount={3}
                    reducedTransparencyFallbackColor="white"
                />
                <TouchableOpacity 
                    style={s.modal} 
                    onPressOut={() => setIsModalVisible(false)} 
                >
                    <TouchableWithoutFeedback>
                        <View style={s.modalPanel}>
                            <TouchableOpacity 
                                style={s.modalCloseBtn}
                                onPress={() => setIsModalVisible(false)}
                            >
                                <CloseIcon width={22} height={22}/>
                            </TouchableOpacity>
                            <ModalImage 
                                width={200} 
                                height={170}
                                style={s.modalImage} 
                            />
                            <View style={s.modalContent}>
                                <Text style={s.modalTitle}>
                                    Подготовьте, пожалуйста, документы
                                </Text>
                                <Text style={s.modalText}>
                                    {`• Документы владельца авто (паспорт или данные компании)\n• ПТС и СТС `}
                                </Text>
                                <PrimaryButton 
                                    title='Продолжить'
                                    style={s.modalResumeBtn}
                                    onPress={() => setIsModalVisible(false)}
                                />
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </TouchableOpacity>
            </Modal>
        </SafeAreaView>
    )
};

export default CarRegistration;
