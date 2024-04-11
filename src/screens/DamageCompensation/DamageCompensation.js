import { 
    View, 
    Text, 
    Linking, 
    ScrollView, 
    SafeAreaView, 
    TouchableHighlight,
} from 'react-native';
import React from 'react';

import api from 'api';
import { Header, TextButton, Panel } from 'components';
import FuelIcon from 'img/damage-compensation/fuel.svg';
import FuelBlueIcon from 'img/damage-compensation/fuel-blue.svg';
import LateIcon from 'img/damage-compensation/late.svg';
import LateBlueIcon from 'img/damage-compensation/late-blue.svg';
import OtherIcon from 'img/damage-compensation/loupe.svg';
import OtherBlueIcon from 'img/damage-compensation/loupe-blue.svg';
import WashingIcon from 'img/damage-compensation/washing.svg';
import WashingBlueIcon from 'img/damage-compensation/washing-blue.svg';
import AccidentIcon from 'img/damage-compensation/accident.svg';
import AccidentBlueIcon from 'img/damage-compensation/accident-blue.svg';

import s from './styles';
import theme from 'theme';

const DamageCompensation = ({ route: { params: { rentId, timeLeft, isInTime } = {} } }) => {

    const [pressedType, setPressedType] = React.useState('');

    return (
        <SafeAreaView style={{ backgroundColor: theme.colors.white }}>
            <ScrollView>
                <Header
                    big
                    title='Возмещение ущерба'
                />
                <View style={s.container}>
                    <Text style={s.text}>
                        Нам очень жаль, что вам пришлось столкнуться с трудностями. 
                        Мы тщательно разберемся в ситуации и компенсируем убытки в 
                        полном объеме согласно 
                        <TextButton 
                            title=' Политике возмещения ущерба. '
                            style={[s.text, { color: theme.colors.blue }]}
                            onPress={() =>
                                Linking.openURL(
                                    'https://help.getarent.ru/ru/knowledge-bases/2/articles/48-zapros-na-vozmeschenie-uscherba'
                                )
                            }
                        />
                        Выберите вид ущерба и, при необходимости, загрузите фотографии
                    </Text>
                    <TouchableHighlight 
                        underlayColor='none'
                        onHideUnderlay={() => setPressedType('')}
                        onShowUnderlay={() => setPressedType('Accidents')}
                        onPress={() => api.navigation.navigate('Accidents', { rentId })}
                        onLongPress={() => api.navigation.navigate('Accidents', { rentId })}
                    >
                        <Panel style={[
                            s.category, 
                            pressedType === 'Accidents' && { 
                                shadowOpacity: 0, 
                                elevation: 0,
                            }
                        ]}>
                            <View style={s.categoryIcon}>
                                {
                                    pressedType === 'Accidents'
                                    ?
                                        <AccidentBlueIcon width={45} height={45} />
                                    :
                                        <AccidentIcon width={45} height={45} />
                                }
                            </View>
                            <Text style={[s.categoryText, pressedType === 'Accidents' && { color: '#066BD6' }]}>
                                ДТП, аварии, повреждения
                            </Text>
                        </Panel>
                    </TouchableHighlight>
                    <TouchableHighlight 
                        underlayColor='none'
                        onHideUnderlay={() => setPressedType('')}
                        onShowUnderlay={() => setPressedType('Washing')}
                        onPress={() => api.navigation.navigate('Washing', { rentId })}
                        onLongPress={() => api.navigation.navigate('Washing', { rentId })}
                    >
                        <Panel style={[
                            s.category, 
                            pressedType === 'Washing' && { 
                                shadowOpacity: 0, 
                                elevation: 0,
                            }
                        ]}>
                            <View style={s.categoryIcon}>
                                {
                                    pressedType === 'Washing'
                                    ?
                                        <WashingBlueIcon width={45} height={45} />
                                    :
                                        <WashingIcon width={45} height={45} />
                                }
                            </View>
                            <Text style={[s.categoryText, pressedType === 'Washing' && { color: '#066BD6' }]}>
                                Мойка
                            </Text>
                        </Panel>
                    </TouchableHighlight>
                    <TouchableHighlight 
                        underlayColor='none'
                        onHideUnderlay={() => setPressedType('')}
                        onShowUnderlay={() => setPressedType('Fuel')}
                        onPress={() => api.navigation.navigate('Fuel', { rentId })}
                        onLongPress={() => api.navigation.navigate('Fuel', { rentId })}
                    >
                        <Panel style={[
                            s.category, 
                            pressedType === 'Fuel' && { 
                                shadowOpacity: 0, 
                                elevation: 0,
                            }
                        ]}>
                            <View style={s.categoryIcon}>
                                {
                                    pressedType === 'Fuel'
                                    ?
                                        <FuelBlueIcon width={45} height={45} />
                                    :
                                        <FuelIcon width={45} height={45} />
                                }
                            </View>
                            <Text style={[s.categoryText, pressedType === 'Fuel' && { color: '#066BD6' }]}>
                                Заправка топлива
                            </Text>
                        </Panel>
                    </TouchableHighlight>
                    <TouchableHighlight 
                        underlayColor='none'
                        onHideUnderlay={() => setPressedType('')}
                        onShowUnderlay={() => setPressedType('Late')}
                        onPress={() => api.navigation.navigate('Late', { rentId, timeLeft, isInTime })}
                        onLongPress={() => api.navigation.navigate('Late', { rentId, timeLeft, isInTime })}
                    >
                        <Panel style={[
                            s.category, 
                            pressedType === 'Late' && { 
                                shadowOpacity: 0, 
                                elevation: 0,
                            }
                        ]}>
                            <View style={s.categoryIcon}>
                                {
                                    pressedType === 'Late'
                                    ?
                                        <LateBlueIcon width={45} height={45} />
                                    :
                                        <LateIcon width={45} height={45} />
                                }
                            </View>
                            <Text style={[s.categoryText, pressedType === 'Late' && { color: '#066BD6' }]}>
                                Опоздание
                            </Text>
                        </Panel>
                    </TouchableHighlight>
                    <TouchableHighlight 
                        underlayColor='none'
                        onHideUnderlay={() => setPressedType('')}
                        onShowUnderlay={() => setPressedType('Other')}
                        onPress={() => api.navigation.navigate('Other', { rentId })}
                        onLongPress={() => api.navigation.navigate('Other', { rentId })}
                    >
                        <Panel style={[
                            s.category, 
                            pressedType === 'Other' && { 
                                shadowOpacity: 0, 
                                elevation: 0,
                            }
                        ]}>
                            <View style={s.categoryIcon}>
                                {
                                    pressedType === 'Other'
                                    ?
                                        <OtherBlueIcon width={45} height={45} />
                                    :
                                        <OtherIcon width={45} height={45} />
                                }
                            </View>
                            <Text style={[s.categoryText, pressedType === 'Other' && { color: '#066BD6' }]}>
                                Другое
                            </Text>
                        </Panel>
                    </TouchableHighlight>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
};

export default DamageCompensation;
