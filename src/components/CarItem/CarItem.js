import {
	View,
	Text,
    Image,
	TouchableOpacity,
    TouchableWithoutFeedback,
} from 'react-native';
import React, { useMemo, useCallback } from 'react';
import { differenceInHours, addDays } from 'date-fns';
import { useSelector, shallowEqual } from 'react-redux';

import Icon from '../Icon'
import Paper from '../Paper'
import Avatar from '../Avatar'
import Carousel from '../Carousel/Carousel'
import Separator from '../Separator'
import TouchableScale from '../TouchableScale'

import {
	formatRating,
	getStartDate,
	calculateDiscountPrice,
    convertNumberWithDeclension,
} from 'functions';
import { 
    engineTypes,
    carBodyType,
    transmissionTypes, 
    carItemFeatures,
    transmissionLayouts,
} from 'data';
import api from 'api';
import PlaneIcon from 'img/plane.svg';
import MapPointIcon from 'img/map-point.svg';

import s from './styles';
import theme from 'theme';

const locations = {
    1: 'Только в городе',
	2: 'По региону и области',
	3: 'По всей стране',
};

const CarItem = ({
	style,
	photoUrl: photo,
	brand,
	model,
	owner: { avatar, firstName, lastName, id } = {},
	productionYear,
	rentPricePerDay,
	twoDaysDiscount,
	threeDaysDiscount,
	fiveDaysDiscount,
	weekDiscount,
	twoWeeksDiscount,
	monthDiscount,
	rating,
	tags = [],
	onPress,
	onLayout,
	cascoFee,
    reviewsQty,
    transmissionType,
    engineDisplacement,
    bodyType,
    enginePower,
    transmissionLayout,
    seatsQuantity,
    engineType,
    homeLocation: { address } = {},
    driversAge,
    rentLocations,
    drivingExperience,
    pledgePrice,
    includedFeatures,
}) => {

    const [isItemPressed, setIsItemPressed] = React.useState(false);

	const period = useSelector(st => st.search.period);
	const { dateStart, dateEnd } = useSelector(st => st.car, shallowEqual);

	const resDateStart = dateStart || period.start || getStartDate();
	const resDateEnd   = dateEnd   || period.end   || addDays(getStartDate(), 4);

	const isRatingShowing = Boolean(rating) || Boolean(reviewsQty);

	const rentDuration = useMemo(
		() => (
            resDateStart &&
            resDateEnd &&
            Math.ceil(differenceInHours(resDateEnd, resDateStart) / 24)
        ) || 0,
		[resDateStart, resDateEnd]
	);

	const rentDiscountPrice = useMemo(
		() =>
			calculateDiscountPrice({
				rentDuration,
				rentPricePerDay,
				twoDaysDiscount,
				threeDaysDiscount,
				fiveDaysDiscount,
				weekDiscount,
				twoWeeksDiscount,
				monthDiscount,
			}),
		[
			rentDuration,
			rentPricePerDay,
			twoDaysDiscount,
			threeDaysDiscount,
			fiveDaysDiscount,
			weekDiscount,
			twoWeeksDiscount,
			monthDiscount,
		]
	);

    const onPressProfile = useCallback(() => {

		api.navigation.navigate(
			'PublicProfile',
			{
				uuid: id,
			},
			true
		);
	}, [id]);

    const photosArray = [photo];

    const setSpacesForPrice = (price) => price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

	return (
        <View style={s.container}>
            {
                Number(photosArray.length) > 1
                &&
                    <Carousel 
                        withArrows
                        styles={s.img} 
                        photos={[photo]} 
                    />
            }
            <TouchableScale
                activeScale={0.97}
                tension={100}
                friction={100}
                style={style}
                onPress={() => {
                    setIsItemPressed(true);
                    onPress();
                    setTimeout(() => setIsItemPressed(false), 1000);
                }}
                {...{ onLayout }}
            >
                <View>
                    {
                        Number(photosArray.length) === 1
                        &&
                            <Image
                                style={s.img}
                                source={{ uri: photo }}
                                resizeMode="cover"
                            />
                    }
                    <Paper style={s.paper} elevation={10}>
                        <View style={s.content}>
                            <View style={s.column}>
                                <Text style={s.title}>
                                    {brand}{' '}
                                    {model}{' '} 
                                    {engineDisplacement}{' '} 
                                    {transmissionTypes[transmissionType]?.second_label},{' '}
                                    {productionYear},{' '} 
                                    {carBodyType[bodyType]?.label.toLowerCase()}{' '}
                                </Text>
                            </View>
                            <View style={{ marginBottom: 8 }}>
                                <View style={s.column2}>
                                    {
                                        !!enginePower
                                        &&
                                            <View style={s.row}>
                                                <Text style={s.carFeature}>
                                                    {enginePower} л/с
                                                </Text>
                                                <Text style={s.carFeatureDivider}>
                                                    •
                                                </Text>
                                            </View>
                                    }
                                    {
                                        transmissionLayout
                                        &&
                                            <View style={s.row}>
                                                <Text style={s.carFeature}>
                                                    {transmissionLayouts[transmissionLayout].label}
                                                </Text>
                                                <Text style={s.carFeatureDivider}>
                                                    •
                                                </Text>
                                            </View>
                                    }
                                    {
                                        transmissionType
                                        &&
                                            <View style={s.row}>
                                                <Text style={s.carFeature}>
                                                    {transmissionTypes[transmissionType].third_label}
                                                </Text>
                                                <Text style={s.carFeatureDivider}>
                                                    •
                                                </Text>
                                            </View>
                                    }
                                    {
                                        !!seatsQuantity
                                        &&
                                            <View style={s.row}>
                                                <Text style={s.carFeature}>
                                                    {convertNumberWithDeclension(seatsQuantity, 'место', 'места', 'мест')}
                                                </Text>
                                                <Text style={s.carFeatureDivider}>
                                                    •
                                                </Text>
                                            </View>
                                    }
                                    {
                                        engineType
                                        &&
                                            <Text style={s.carFeature}>
                                                {engineTypes[engineType].label}
                                            </Text>

                                    }
                                </View>
                            </View>
                            <Separator style={s.divider} />
                            <TouchableOpacity 
                                style={s.userInfoWrap} 
                                onPress={onPressProfile}
                            >
                                <Avatar
                                    style={s.avatar}
                                    avatar={avatar}
                                    diameter={35}
									name={`${firstName} ${lastName}`} 
                                />
                                <Text style={s.name}>
                                    {firstName}
                                </Text>
                                {
                                    isRatingShowing 
                                    ? 
                                        <View style={s.column2}>
                                            <View style={s.rating}>
                                                <Text style={s.ratingValue}>
                                                    {formatRating(rating)}{' '}
                                                </Text>
                                                <Icon
                                                    style={s.icon}
                                                    name="star"
                                                    size={17}
                                                    color={theme.colors.white}
                                                />
                                            </View>
                                            <Text style={s.reviewsQty}>
                                                {convertNumberWithDeclension(reviewsQty, 'отзыв', 'отзыва', 'отзывов')}
                                            </Text>
                                        </View>
                                    :
                                        <View style={s.newOffer}>
                                            <Text style={s.newOfferText}>
                                                Новое предложение
                                            </Text>
                                        </View>
                                }
                            </TouchableOpacity>
                            {
                                address
                                &&
                                    <View style={[s.column2, { marginBottom: 16, flexWrap: 'nowrap' }]}>
                                        <MapPointIcon 
                                            width={12} 
                                            height={16} 
                                            style={s.mapPoint}
                                        />
                                        <Text style={s.mapText}>
                                            {address.split(', ')[0]}
                                        </Text>
                                        <PlaneIcon 
                                            width={16} 
                                            height={16} 
                                            style={s.mapPoint}
                                        />
                                        <Text style={[s.mapText, { marginRight: 0 }]}>
                                            {address.split(', ')[1]}
                                            {address.split(', ')[2] && ','}
                                            {' '}
                                            {address.split(', ')[2]}
                                        </Text>
                                    </View>
                            }
                            <View style={[s.column2, { marginBottom: 2 }]}>
                                {
                                    drivingExperience
                                    &&
                                        <View style={s.row}>
                                            <Text style={s.carFeature}>
                                                Стаж {convertNumberWithDeclension(drivingExperience, 'год', 'года', 'лет' )}
                                            </Text>
                                            <Text style={s.carFeatureDivider}>
                                                •
                                            </Text>
                                        </View>
                                }
                                {
                                    driversAge
                                    &&
                                        <View style={s.row}>
                                            <Text style={s.carFeature}>
                                                От {driversAge} {
                                                    (driversAge === 1 || (driversAge > 20 && driversAge % 10 === 1))
                                                    ?
                                                        'года'
                                                    :
                                                        'лет'
                                                }
                                            </Text>
                                            <Text style={s.carFeatureDivider}>
                                                •
                                            </Text>
                                        </View>
                                }
                                {
                                    pledgePrice
                                    &&
                                        <View style={s.row}>
                                            <Text style={s.carFeature}>
                                                Залог {setSpacesForPrice(pledgePrice)} ₽ 
                                            </Text>
                                            <Text style={s.carFeatureDivider}>
                                                •
                                            </Text>
                                        </View>
                                }
                                {
                                    rentLocations
                                    &&
                                        <View style={s.row}>
                                            <Text style={s.carFeature}>
                                                {locations[rentLocations]}
                                            </Text>
                                            <Text style={s.carFeatureDivider}>
                                                •
                                            </Text>
                                        </View>
                                }
                                {
                                    tags.some(item => item === 'DELIVERY_CITY' || item === 'DELIVERY_AIRPORT')
                                    &&
                                        <View style={s.row}>
                                            <Text style={s.carFeature}>
                                                Доставка 
                                            </Text>
                                            <Text style={s.carFeatureDivider}>
                                                •
                                            </Text>
                                        </View>
                                }
                                <Text style={s.carFeature}>
                                    {
                                        cascoFee
                                        ?
                                            'КАСКО включено'
                                        :
                                            'КАСКО не включено'
                                    }
                                </Text>
                            </View>
                            <Separator style={s.divider} />
                            {
                                includedFeatures && includedFeatures.length !== 0
                                &&
                                    <View style={s.column2}>
                                        {includedFeatures.filter((feature) => {
                                            if (carItemFeatures[feature]) {
                                                return carItemFeatures[feature]
                                            }
                                        }).map((feature, i, array) => (

                                            <View key={feature} style={s.row}>
                                                <Text style={s.carFeature}>
                                                    {carItemFeatures[feature]}{'  '}
                                                </Text>
                                                {
                                                    i !== (array.length - 1)
                                                    &&
                                                        <Text style={s.includedFeaturesDivider}>
                                                            •
                                                        </Text>
                                                }
                                            </View>
                                        ))}
                                    </View>
                            }
                        </View>
                        <View style={s.priceWrap}>
                            <View>
                                <Text style={s.price}>
                                    {setSpacesForPrice(rentDiscountPrice.rentPricePerDay + cascoFee)}₽
                                </Text>
                                <Text style={s.priceNote}>
                                    цена за 1 день
                                </Text>
                            </View>
                            <TouchableOpacity 
                                style={s.confirmBtn}
                                onPress={onPress}
                            >
                                <Text style={s.confirmBtnText}>
                                    Выбрать
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </Paper>
                </View>
            </TouchableScale>
        </View>
	);
};

export default React.memo(CarItem);
