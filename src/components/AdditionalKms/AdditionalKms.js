import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';

import Separator from '../Separator';

import s from './styles';
import theme from 'theme';

const AdditionalKms = ({ 
    distancePackages,
    selectedDistantPackage,
    onPressAdditionKm,
}) => {
    
    return (
        <View style={s.content}>
            <Text style={s.title}>
                Дополнительные километры в день
            </Text>
            <ScrollView 
                horizontal
                showsHorizontalScrollIndicator={false}
            >
                <View style={s.additionalKmsRow}>
                    {
                        distancePackages?.map((km, i) => {

                            const isActive = km.price === selectedDistantPackage?.price

                            return (
                                <TouchableOpacity
                                    key={i} 
                                    style={[
                                        s.additionalKmBtn,
                                        isActive && s.additionalKmBtnActive,

                                    ]}
                                    onPress={() => onPressAdditionKm(km)}
                                >
                                    <Text style={[
                                        km.kmQuantity === 'infinity'
                                        ?
                                            s.additionalKmBtnText
                                        :
                                            s.additionalKmBtnNumberText,
                                        isActive && s.additionalKmBtnActiveText

                                    ]}>
                                        {
                                            km.kmQuantity === 'infinity'
                                            ?
                                                'Неограниченный пробег'
                                            :
                                                `+${km.kmQuantity} км`
                                        }
                                    </Text>
                                </TouchableOpacity>
                            )
                        })
                    }
                </View>
            </ScrollView>
            <View style={s.priceWithAdditionalKmsRow}>
                <Text style={s.text}>
                    Стоимость:
                </Text>
                <Text style={theme.styles.P1}>
                    {` ${selectedDistantPackage?.price || 0} `}
                </Text>
                <Text style={s.currency}>
                    ₽
                </Text>
                <Text style={s.helpText}>
                    /день
                </Text>
            </View>
            <View style={{ paddingHorizontal: theme.spacing(6) }}>
                <Separator light />
            </View>
        </View>
    )
}

export default React.memo(AdditionalKms)
