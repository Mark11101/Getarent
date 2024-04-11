import React from 'react';
import { View, Text } from 'react-native';

import api from 'api';
import PayAfterRentIcon from 'img/killer-features/pay-after-rent.svg';
import InsuranceIcon from 'img/killer-features/insurance.svg';
import AllDayHelpIcon from 'img/killer-features/all-day-help.svg';
import OnlineOnlyIcon from 'img/killer-features/online-only.svg';
import GuaranteeIcon from 'img/killer-features/guarantee.svg';
import FreeCancellationIcon from 'img/killer-features/free-cancellation.svg';

import s from './styles';

const KillerFeature = ({ icon, title, text }) => {

    return (
        <View style={s.killerFeature}>
            <View style={s.icon}>
                {icon}
            </View>
            <View style={s.content}>
                <Text style={s.title}>
                    {title}
                </Text>
                {text}
            </View>
        </View>
    )
}

const KillerFeatures = ({ insurance, rentalAgreement, cancellationDateTime }) => {

    return (
        <>
            <KillerFeature 
                icon={<PayAfterRentIcon width={30} height={28} />}
                title='Оплата после получения'
                text={
                    <Text style={s.text}>
                        Оплата осуществляется банковской картой любого банка России. Привяжите 
                        карту при бронировании, деньги спишутся после осмотра машины. Никаких 
                        списаний с карты без вашего согласия
                    </Text>
                }
            />
            {
                !insurance?.unavailable
                &&
                    <KillerFeature 
                        icon={<InsuranceIcon width={30} height={30} />}
                        title={
                            insurance?.alreadyInsured
                            ?
                                'Страховка КАСКО включена*'
                            :
                                'Доступна страховка КАСКО *'
                        }
                        text={
                            <>
                                <Text style={s.text}>
                                    {
                                        insurance?.alreadyInsured
                                        ?
                                            'Getarent застрахует вашу поездку от повреждений до 3.5 млн.₽. В случае ДТП или повреждений вы заплатите не более 20 000 р, главное не забыть получить справку от ГИБДД.'
                                        :
                                            'Оформите страховку при бронировании от повреждений до 3.5 млн.₽. В случае ДТП или повреждений вы заплатите не более 20 000 р, главное не забыть получить справку от ГИБДД.'
                                    }
                                </Text>
                                <Text 
                                    style={[s.text, s.readMoreBtn]} 
                                    onPress={() => api.navigation.navigate(
                                        'InsurancePopup',
										{ price: !insurance?.alreadyInsured ? insurance?.price : null }
                                    )}
                                >
                                    Подробнее
                                </Text>
                            </>
                        }
                    />
            }
            <KillerFeature 
                icon={<AllDayHelpIcon width={30} height={31} />}
                title='Круглосуточная помощь'
                text={
                    <Text style={s.text}>
                        Служба поддержки Getarent работает 24 / 7. Обращайтесь при любых трудностях при 
                        бронировании или во время аренды
                    </Text>
                }
            />
            {
                !rentalAgreement
                &&
                    <KillerFeature 
                        icon={<OnlineOnlyIcon width={30} height={30} />}
                        title='Все онлайн'
                        text={
                            <Text style={s.text}>
                                Быстрое и удобное получение машины без бумажных волокит, все договоры 
                                заключаются онлайн. Осмотреть машину на наличие повреждений и зафиксировать 
                                топливо и пробег можно с помощью камеры смартфона в приложении Getarent
                            </Text>
                        }
                    />
            }
            <KillerFeature 
                icon={<GuaranteeIcon width={30} height={18} />}
                title='Гарантия получения'
                text={
                    <Text style={s.text}>
                        Бронирование машины после подтверждения владельца гарантирует для вас 
                        получение автомобиля на запланированные даты
                    </Text>
                }
            />
            <KillerFeature 
                icon={<FreeCancellationIcon width={30} height={27} />}
                title='Бесплатная отмена бронирования'
                text={
                    <>
                        <Text style={s.text}>
                            Вы сможете отменить аренду без каких-либо штрафов до
                        </Text>
                        <Text style={[s.boldText, { fontSize: 16, marginTop: 15 }]}>
                            {cancellationDateTime}
                        </Text>
                    </>
                }
            />
        </>
    )
};

export default KillerFeatures;
