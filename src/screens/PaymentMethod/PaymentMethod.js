import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView, View, Text } from 'react-native';

import { 
    Header, 
    Waiter,
    PaymentCard, 
    PrimaryButton,
    ScrollViewChangeContent, 
} from 'components';
import actions from 'actions';
import { pluralize, formatPrice } from 'functions';
import { trackCarSericesConfirmRent } from '../../myTrackerService';
import s from './styles';
import theme from 'theme';

const PaymentMethod = () => {

    const dispatch = useDispatch();

    const { paymentCard, paymentScreenData, waiter } = useSelector(({ payment }) => payment);

    const { pan } = paymentCard || {};
    const { price, rentDuration, paymentData } = paymentScreenData || {};

    useEffect(() => {
        dispatch(actions.bankCardRequest());
    }, []);

    const onSubmit = useCallback(() => {
        trackCarSericesConfirmRent();
        dispatch(actions.createRent(paymentData));
    }, [paymentData]);
    
    return (
        <SafeAreaView style={[theme.styles.paper, theme.styles.flex]}>
            <Header title="Оплата" />
            {
                waiter
                ?
                    <Waiter />
                :
                    <ScrollViewChangeContent
                        style={theme.styles.container}
                        contentContainerStyle={theme.styles.grow}
                    >
                        <View style={s.content}>
                            {
                                pan
                                ?
                                    <View style={s.textView}>
                                        <Text style={s.text}>
                                            {`Убедитесь, что на вашей карте *${pan.slice(-4)} есть сумма ${Math.round(price)} ₽. Она будет списана `}
                                            <Text style={s.bold}>
                                                после начала аренды.
                                            </Text>
                                        </Text>
                                    </View>
                                :
                                    <View style={s.textView}>
                                        <Text style={s.text}>
                                            Добавьте карту к вашему аккаунту.
                                            Деньги за аренду будут списаны 
                                            <Text style={s.bold}> после получения машины. </Text>
                                            Подойдет карта любого банка из России. 
                                            Сейчас мы заморозим 1 рубль и сразу же его вернем.
                                        </Text>
                                    </View>

                            }
                            <Text style={s.price}>
                                <Text style={s.boldPrice}>
                                    {formatPrice(price)}
                                </Text>
                                /{rentDuration}
                                {pluralize(rentDuration, ' день', ' дня', ' дней')}
                            </Text>
                            <PaymentCard stage='CHECKOUT' />
                        </View>
                        {
                            pan
                            &&
                                <PrimaryButton
                                    title="Забронировать"
                                    style={s.submitBtn}
                                    onPress={onSubmit}
                                />
                        }
                    </ScrollViewChangeContent>
            }
        </SafeAreaView>
    )
}

export default PaymentMethod;
