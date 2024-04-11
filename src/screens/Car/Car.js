import React, {
	useRef,
	useMemo,
	useState,
	useEffect,
	useCallback,
} from 'react';
import {
	View,
	Text,
	Alert,
	Platform,
	Dimensions,
	ScrollView,
	RefreshControl,
	TouchableOpacity,
} from 'react-native';
import Dialog from "react-native-dialog";
import { Modalize } from 'react-native-modalize';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { differenceInHours, addDays, isAfter } from 'date-fns';

import {
	Empty,
	Header,
	Waiter,
	DateBar,
	Carousel,
	TotalCost,
	Separator,
	OwnerCard,
	ButtonText,
	DynamicMap,
	FeatureItem,
	SectionItem,
	SafeAreaView,
	DepositPopup,
	AccordionView,
	MileageLimits,
	AdditionalKms,
	KillerFeatures,
	RatingReviewsBar,
	UsageRestrictions,
} from 'components';
import {
	calcAge,
	pluralize,
	formatPrice,
	getStartDate,
	getDaysDeclention,
	getWorkingHoursText,
	calculateMileageLimit,
	checkIfPeriodsOverlap,
	calculateDiscountPrice,
	setCancellationDateTime,
} from 'functions';
import api from '../../api';
import actions from 'actions';
import { carFeatures } from 'data';
import Reviews from 'screens/ForReview/Reviews';
import ReviewModal from 'screens/ForReview/ReviewModal';
import ChatIconBlack from 'img/chat/chat_black_24dp.svg';
import { carBodyType, engineTypes, transmissionTypes } from 'data';

import s from './styles';
import theme from 'theme';
import { trackCarViewContinue } from '../../myTrackerService';
import { ROLE } from '../../constants/roles';
const HEIGHT = Dimensions.get('window').height;

const Car = ({
	route: {
		params: { uuid, dateStart: dateStartParam, dateEnd: dateEndParam } = {},
	},
}) => {

	const {
		role,
		email,
		birthDate,
		authorized,
		id: profileId,
		scoringStatus,
		yearsOfExperience,
		driversLicenseFirstIssueYear,
	} = useSelector(st => st.profile);

	const [isMapVisible, setIsMapVisible] = useState(false);
	const [shouldUpdate, setShouldUpdate] = useState(false);
	const [waiterVisible, setWaiterVisible] = useState(true);

	const [firstLicenseIssueYear, setFirstLicenseIssueYear] = useState(null);
	const [isFirstLicenseIssueYearVisible, setIsFirstLicenseIssueYearVisible] = useState(false);
	const [isFirstLicenseIssueYearValid, setIsFirstLicenseIssueYearValid] = useState(false);

	const dispatch = useDispatch();

	const { car, user, error, waiter, refreshing, deliveryPlace } = useSelector(
		st => st.car,
		shallowEqual
	);

	const dateStart = dateStartParam
		? new Date(dateStartParam)
		: useSelector(st => st.car.dateStart);

	const dateEnd = dateEndParam
		? new Date(dateEndParam)
		: useSelector(st => st.car.dateEnd);

	const {
		photos,
		brand,
		model,
		registrationNumber,
		productionYear,
		rating,
		bestReview,
		reviews,
		reviewsQty,
		rentsQty,
		bodyType,
		minRentDays,
		maxRentDays,
		distancePackages,
		seatsQuantity,
		transmissionType,
		engineType,
		twoDaysDiscount,
		guestRestrictions,
		threeDaysDiscount,
		fiveDaysDiscount,
		weekDiscount,
		twoWeeksDiscount,
		monthDiscount,
		dailyMilageLimit,
		weeklyMilageLimit,
		monthlyMilageLimit,
		rentLocations,
		location,
		additionalKmPrice,
		description,
		includedFeatures,
		unavailabilityDates,
		fuelLiterCompensationPrice,
		offHoursReturnPrice,
		afterRentWashingPrice,
		unlimitedMilagePrice,
		predefinedAdditionalFeatures,
		rentPricePerDay,
		delivery,
		pledge,
		insurance,
		price,
	} = car || {};

	const {
		uuid: userUuid,
		firstName,
		lastName,
		avatar,
		labels: userLabels,
		rating: userRating,
		reviewsQty: userReviewsQty,
		rentsQty: userRentsQty,
		reviews: userReviews,
		hostPreferences,
	} = user || {};

	const [selectedDistantPackage, setSelectedDistantPackage] = useState(null);

	const period = useSelector(st => st.search.period);

	const resDateStart = dateStart || period.start || getStartDate();
	const resDateEnd = dateEnd || period.end || addDays(getStartDate(), 4);

	const { latitude, longitude } = location || {};
	const [timeZone, setTimeZone] = useState("UTC");

	useEffect(() => {
		if (latitude && longitude) {
			(async () => {
				try {
				const response = await fetch(
					`https://timeapi.io/api/TimeZone/coordinate?latitude=${latitude}&longitude=${longitude}`,
				);
				const json = await response.json();
				const tz = json["timeZone"];
				setTimeZone(tz)
				if (tz) {
					setTimeZone(tz);
				} else {
					dispatch(
					actions.error(
						"Не удалось получить часовой пояс. Время отображается в UTC (всемирное координатное время)",
					),
					);
				}
				} catch (e) {
				dispatch(
					actions.error(
					"Не удалось получить часовой пояс. Время отображается в UTC (всемирное координатное время)",
					),
				);
				}
			})();
		}
	}, [latitude, longitude, dispatch] );

	const canChangeAddress = !!(
		delivery?.popularPlaces.length || delivery?.radiuses.length
	);

	const [modalReview, setModalReview] = useState({});

	const modalizeRef = useRef(null);

	const onOpenModalReview = () => {
		modalizeRef.current?.open();
	};

	const depositModalRef = useRef(null);

	const openDepositModal = () => {
		depositModalRef.current?.open();
	};


	const openCarPark = useCallback(async () => {

		try {
			const res = await api.web.profile(userUuid);

			if (res?.error) {
				throw res.error;
			}

			const cars = res.cars;

			api.navigation.navigate('ProfileCars', { cars }, true);

		} catch (err) {

			dispatch(
				actions.error(
					'Не удалось загрузить данные профиля, попробуйте еще раз'
				)
			);
		}

	}, [dispatch, userUuid]);

	const checkIfDateIsAvalible = (dateStart, dateEnd, unavailabilityDates) => {

		if (!unavailabilityDates || !dateStart || !dateEnd) {
			return true;
		}

		return !Object.values(unavailabilityDates).some(
			({ startDate, endDate }) => (
				checkIfPeriodsOverlap(dateStart, dateEnd, startDate, endDate)
			)
		);
	};

	const invalidDate = useMemo(
		() =>
			!checkIfDateIsAvalible(
				resDateStart,
				resDateEnd,
				unavailabilityDates
			),
		[resDateStart, resDateEnd, unavailabilityDates]
	);

	const rentDuration = useMemo(
		() =>
			(resDateStart &&
				resDateEnd &&
				Math.ceil(differenceInHours(resDateEnd, resDateStart) / 24)) ||
			0,
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

	const mileageLimit = useMemo(
		() =>
			calculateMileageLimit(
				rentDuration,
				dailyMilageLimit,
				weeklyMilageLimit,
				monthlyMilageLimit
			),
		[rentDuration, dailyMilageLimit, weeklyMilageLimit, monthlyMilageLimit]
	);

	const cancellationDateTime = setCancellationDateTime(resDateStart, timeZone);

	const meetingAtTheAirportPrice = useMemo(() => {

		return delivery?.popularPlaces.reduce((acc, place, i) => {

			if (i === 0) {
				return place.price;
			}

			const newAcc = place.price < acc ? place.price : acc;

			return newAcc;
		}, 0);

	}, [delivery?.popularPlaces]);

	const deliveryPlaceObject = useMemo(() => {

		return delivery?.radiuses.reduce(

			(acc, radius) => {

				const minPrice = radius.price < acc.minPrice ? radius.price : acc.minPrice;

				const { maxKms, maxId } = radius.radius_id > acc.maxId
					? { maxKms: radius.text, maxId: radius.radius_id }
					: { maxKms: acc.maxKms, maxId: acc.maxId };

				return { minPrice, maxKms, maxId };
			},
			{
				minPrice: delivery?.radiuses[0]?.price || 99999,
				maxKms: '',
				maxId: 0,
			}
		);
	}, [delivery?.radiuses]);

	const additionalServicesData = useMemo(() => {

		return {
			uuid,
			startDate: dateStart || period.start,
			endDate: dateEnd || period.end,
			rentDuration,
			rentDiscountPrice,
			cancellationDateTime,
			afterRentWashingPrice,
			dailyMilageLimit,
			additionalKmPrice,
			mileageLimit,
			unlimitedMilagePrice,
			distancePackages,
			distancePackage: selectedDistantPackage,
			offHoursReturnPrice,
			unavailabilityDates,
			fuelLiterCompensationPrice,
			predefinedAdditionalFeatures,
			rentalAgreement: hostPreferences?.rentalAgreement,
			insurance,
			price,
		};
	}, [
		uuid,
		afterRentWashingPrice,
		cancellationDateTime,
		dateEnd,
		dateStart,
		period.end,
		period.start,
		predefinedAdditionalFeatures,
		rentDuration,
		dailyMilageLimit,
		weeklyMilageLimit,
		monthlyMilageLimit,
		mileageLimit,
		unlimitedMilagePrice,
		distancePackages,
		unavailabilityDates,
		selectedDistantPackage,
		offHoursReturnPrice,
		fuelLiterCompensationPrice,
		hostPreferences?.rentalAgreement,
		insurance,
		price,
	]);

	const isRatingShowing = Boolean(rating) || Boolean(rentsQty) || Boolean(reviewsQty);

	const onRefresh = useCallback(
		() => dispatch(actions.carRequest(uuid, true)),
		[uuid, dispatch]
	);

	const onPressDeliveryPlace = useCallback(
		() =>
			api.navigation.navigate(
				'DeliveryPlace',
				{
					...delivery,
					uuid,
					location,
					deliveryPlace,
					callback: (place) => dispatch(actions.carSetDeliveryPlace(place)),
				},
				true
			),
		[deliveryPlace, delivery, location, uuid, dispatch]
	);

	const onPressBack = useCallback(
		() => api.navigation.navigate('Car', { uuid }, true),
		[uuid]
	);

	const onPressResume = useCallback(async () => {

      	trackCarViewContinue();

		if (authorized) {

			if (role === 'GUEST') {

				if (yearsOfExperience < guestRestrictions?.drivingExperience) {

					Alert.alert('😞', '\nДля этого автомобиля необходим более длительный стаж вождения')

				} else if (calcAge(birthDate) < guestRestrictions?.driversAge) {

					Alert.alert('', 'Есть хорошая новость и плохая. Хорошая: вы очень молоды, плохая: вы слишком молоды для этой машины по мнению владельца\n\nПожалуйста, выберите другой автомобиль')
				
				} else if (isAfter(new Date(), resDateStart)) {

					Alert.alert(
						'',
						'Время истекло, пожалуйста, выберите более позднее время начала аренды',
						[
							{
								text: 'Ок',
								onPress: () => onPressDateBar(),
							},
							{
								text: 'Отмена',
								style: 'cancel',
							},
						]
					);

				} else {

					if (!driversLicenseFirstIssueYear) {
						setIsFirstLicenseIssueYearVisible(true)
					} else {
						api.navigation.navigate(
							'AdditionalServices',
							{
								...additionalServicesData,
							},
							true
						);
					}
				}

			} else {

				Alert.alert(
					'Невозможно взять машину в аренду',
					'\nНеобходимо перезайти в приложение через аккаунт водителя',
					[
						{
							text: 'Отмена',
						},
						{
							text: 'Перезайти',
							onPress: () => {
								dispatch(actions.logout())
								api.navigation.deepNavigate('ProfileRoot', 'Auth', 'SignIn')
							}
						},
					]
				);
			}

		} else {
			dispatch(actions.setPotentialRole(ROLE.GUEST));
			
			api.navigation.deepNavigate('ProfileRoot', 'Auth', {
				onAuthAction: [
					{
						type: 'deepNavigate',
						payload: [
							'LocationTab', 'AdditionalServices',
							{
								...additionalServicesData,
								carId: uuid,
								startDate: additionalServicesData.startDate.toISOString(),
								endDate: additionalServicesData.endDate.toISOString(),
							}
						]
					},
				],
				onGoBackAction: {
					type: 'navigate',
					payload: [ 'LocationTab' ]
				}
			})
		}
	}, [authorized, additionalServicesData, onPressBack, role, email]);

	const onPressDateBar = useCallback(
		() =>
			api.navigation.navigate(
				'DatePicker',
				{
					start: dateStart || period.start,
					end: dateEnd || period.end,
					timeZone: timeZone,
					minRentDays: minRentDays,
					maxRentDays: maxRentDays,
					unavailablePeriods:
						unavailabilityDates
						&&
							Object.values(unavailabilityDates).reduce(
								(res, cur) => res.concat(cur),
								[]
							),
					callback: (start, end) => dispatch(actions.carSetPeriod(start, end)),
				},
				true
			),

		[dateStart, dateEnd, unavailabilityDates, period, timeZone, dispatch]
	);

	const onPressAvatar = useCallback(() => {

		setShouldUpdate(true);

		api.navigation.navigate(
			'PublicProfile',
			{
				uuid: userUuid,
			},
			true
		);

	}, [userUuid]);

	useEffect(() => {
		Object.keys(car).length === 0 && onRefresh();
	}, [car]);

	useEffect(() => {
		shouldUpdate || dispatch(actions.carRequest(uuid));
	}, [dispatch, shouldUpdate, uuid]);

	useEffect(
		() => () => dispatch(actions.carReset()),
		[]
	);

	useEffect(() => {
		!waiter && setWaiterVisible(false);
	}, [waiter]);

	return (
		<>
			<SafeAreaView top style={s.container}>
				<Header 
					titleStyle={s.chat} 
					title={
					<>
						{/* {role !== 'HOST' && scoringStatus !== 'REJECTED' && (
							<TouchableOpacity 
								style={s.chatBtn}
								onPress={() => handleChatFabPress(role)}
							>
								<ChatIconBlack 
									width={24} 
									height={24} 
									style={s.chatIcon}
								/>
								<Text style={s.chatText}>
									Написать владельцу
								</Text>
							</TouchableOpacity>
						)} */}
					</>
				}/>
				{waiter || waiterVisible ? (
					<Waiter />
				) : (
					<View style={s.container}>
						<ScrollView
							style={[s.container, s.shadow]}
							contentContainerStyle={theme.styles.grow}
							showsVerticalScrollIndicator={false}
							refreshControl={
								<RefreshControl
									{...{ refreshing, onRefresh }}
								/>
							}
						>
							{!!error && (
								<Empty {...emptyProps} {...{ error }} />
							)}
							{!(waiter || error) && (
								<>
									<Carousel {...{ photos }} />

									<View style={s.content}>
										<Text
											style={[
												theme.styles.H3,
												!isRatingShowing &&
													s.withoutStats,
											]}
										>
											{brand} {model}, {productionYear}
										</Text>
										{isRatingShowing && (
											<View style={[s.row, s.stats]}>
												<RatingReviewsBar
													style={s.ratingReviewsBar}
													{...{ rating }}
												/>
												<View
													style={[
														s.row,
														theme.styles.flex,
													]}
												>
													<Text
														style={theme.styles.P2R}
													>
														поездки: {rentsQty || 0}
													</Text>
													<Text
														style={theme.styles.P2R}
													>
														отзывы:{' '}
														{reviewsQty || 0}
													</Text>
												</View>
											</View>
										)}
										<View
											style={[
												s.row,
												s.carCharacteristics,
											]}
										>
											<View style={theme.styles.flex}>
												<FeatureItem
													big
													icon={bodyType}
													label={
														carBodyType[bodyType]
															?.label
													}
												/>
												<FeatureItem
													icon="SEAT"
													label={`${seatsQuantity} ${pluralize(
														seatsQuantity,
														'место',
														'места',
														'мест'
													)}`}
												/>
											</View>
											<View
												style={[
													theme.styles.flex,
													s.featureItem,
												]}
											>
												<FeatureItem
													icon={
														transmissionTypes[
															transmissionType
														]?.value
													}
													label={
														transmissionTypes[
															transmissionType
														]?.label
													}
												/>
												<FeatureItem
													icon={
														engineTypes[engineType]
															?.value
													}
													label={
														engineTypes[engineType]
															?.label
													}
												/>
											</View>
										</View>
										{includedFeatures?.length > 4 && (
											<View style={s.moreCarInfoBtnView}>
												<ButtonText
													style={s.moreCarInfoBtn}
													title="Подробнее о машине"
													onPress={() =>
														api.navigation.navigate(
															'CarFeatures',
															{
																name: firstName,
																carDescription:
																	description,
																features:
																	includedFeatures,
															},
															true
														)
													}
												/>
											</View>
										)}
										<Separator light />
									</View>
									<UsageRestrictions
										pledge={pledge}
										insurance={insurance}
										driversAge={
											guestRestrictions?.driversAge
										}
										drivingExperience={
											guestRestrictions?.drivingExperience
										}
										sectionTitle={`${firstName} предлагает выгодные условия`}
										openDepositModal={openDepositModal}
										{...{
											rentLocations,
										}}
									/>
									<View style={s.content}>
										<View style={s.row}>
											<Text style={s.title}>
												Место получения
											</Text>
											<ButtonText
												title={
													isMapVisible
														? 'Скрыть карту'
														: 'Показать на карте'
												}
												style={{
													paddingRight: 0,
													marginBottom:
														theme.spacing(3),
												}}
												onPress={() =>
													setIsMapVisible(
														!isMapVisible
													)
												}
											/>
										</View>
										<Text style={s.deliveryPlace}>
											{deliveryPlace
												? deliveryPlace.name
												: location?.address}
										</Text>
										{!!hostPreferences?.workingHours && (
											<Text style={s.helpText}>
												{getWorkingHoursText(
													hostPreferences.workingHours
												)}
											</Text>
										)}
										{!!offHoursReturnPrice && (
											<Text style={s.helpText}>
												{`Передача/возврат в нерабочее время +${offHoursReturnPrice} ₽`}
											</Text>
										)}
									</View>
									{isMapVisible && (
										<DynamicMap
											{...{ longitude, latitude }}
										/>
									)}
									<View style={s.content}>
										{delivery &&
											(delivery.radiuses.length > 0 ||
												delivery.popularPlaces.length >
													0) && (
												<>
													<Text style={s.title}>
														Доставка
													</Text>
													<>
														{delivery.radiuses
															.length > 0 && (
															<SectionItem>
																<Text>
																	По городу
																	<Text
																		style={
																			theme
																				.styles
																				.P1
																		}
																	>
																		{' до ' +
																			deliveryPlaceObject.maxKms +
																			' от ' +
																			formatPrice(
																				deliveryPlaceObject.minPrice
																			)}
																	</Text>
																</Text>
															</SectionItem>
														)}
														{delivery.popularPlaces
															.length > 0 && (
															<SectionItem>
																<Text>
																	В аэропорт
																	<Text
																		style={
																			theme
																				.styles
																				.P1
																		}
																	>
																		{' ' +
																			formatPrice(
																				meetingAtTheAirportPrice
																			)}
																	</Text>
																</Text>
															</SectionItem>
														)}
														{canChangeAddress && (
															<ButtonText
																title="Расчитать доставку"
																style={
																	s.calcDelivery
																}
																onPress={
																	onPressDeliveryPlace
																}
															/>
														)}
													</>
												</>
											)}
										<Separator light />
									</View>

									<View style={s.content}>
										<Text style={s.title}>
											Даты поездки
										</Text>
										<DateBar
											onPress={onPressDateBar}
											invalid={invalidDate}
											dateFrom={resDateStart}
											dateTo={resDateEnd}
											timeZone={timeZone}
											style={s.dateBar}
										/>
										{rentDiscountPrice && (
											<View
												style={[s.row, s.rentDiscount]}
											>
												<View style={s.row}>
													<Text style={s.price}>
														{formatPrice(
															(rentDiscountPrice.rentPricePerDay +
																(selectedDistantPackage?.price ||
																	0) +
																(insurance?.alreadyInsured
																	? insurance?.price
																	: 0)) *
																rentDuration
														)}
													</Text>
													<View
														style={s.discountLabel}
													>
														<Text
															style={
																s.discountLabelText
															}
														>
															-
															{
																rentDiscountPrice.discountPercentage
															}
															%
														</Text>
													</View>
													<Text
														style={
															s.strikedThroughPrice
														}
													>
														{formatPrice(
															(rentPricePerDay +
																(selectedDistantPackage?.price ||
																	0) +
																(insurance?.alreadyInsured
																	? insurance?.price
																	: 0)) *
																rentDuration
														)}
													</Text>
												</View>
												<Text style={theme.styles.P1}>
													{`за ${rentDuration} ${getDaysDeclention(
														rentDuration
													)}`}
												</Text>
											</View>
										)}
										<MileageLimits
											mileageLimit={mileageLimit}
											rentDuration={rentDuration}
											dailyMilageLimit={dailyMilageLimit}
											additionalKmPrice={
												additionalKmPrice
											}
											selectedDistantPackage={
												selectedDistantPackage
											}
										/>
										{!mileageLimit && (
											<Separator
												light
												style={{
													marginTop: theme.spacing(8),
													marginBottom:
														theme.spacing(4),
												}}
											/>
										)}
									</View>

									{distancePackages?.length !== 0 && (
										<AdditionalKms
											distancePackages={distancePackages}
											selectedDistantPackage={
												selectedDistantPackage
											}
											onPressAdditionKm={pack => {
												pack.price ===
												selectedDistantPackage?.price
													? setSelectedDistantPackage(
															null
													  )
													: setSelectedDistantPackage(
															pack
													  );
											}}
										/>
									)}

									<OwnerCard
										name={firstName}
										reviewsQty={userReviewsQty}
										reviews={userReviews}
										rating={userRating}
										rentsQty={userRentsQty}
										avatar={avatar}
										labels={userLabels}
										firstName={firstName}
										lastName={lastName}
										onPress={onPressAvatar}
									/>
									<View style={s.ownerCard}>
										<ButtonText
											style={{
												padding: 0,
												marginBottom: 30,
											}}
											title="Показать весь автопарк"
											onPress={openCarPark}
										/>
										{!!reviews?.length && (
											<Separator light />
										)}
									</View>

									{!!reviews?.length && bestReview && (
										<View style={{ marginBottom: 30 }}>
											<View
												style={[s.row, s.reviewHeader]}
											>
												<Text style={theme.styles.P1}>
													Отзывы о машине
												</Text>
												{reviews.length > 3 && (
													<ButtonText
														title="Ещё"
														style={{ padding: 0 }}
														onPress={
															reviews?.length >
																1 &&
															(() =>
																api.navigation.deepNavigate(
																	[ 'ProfileRoot', 'Reviews' ],
																	{
																		reviewsQty,
																		rating,
																		reviews
																	}
																))
														}
													/>
												)}
											</View>
											<Reviews
												reviews={reviews.slice(0, 3)}
												style={{ marginBottom: 32 }}
												openReview={review => {
													setModalReview(review);
													onOpenModalReview();
												}}
											/>
										</View>
									)}
									<View
										style={[s.content, { marginTop: -50 }]}
									>
										<KillerFeatures
											insurance={insurance}
											cancellationDateTime={cancellationDateTime}
											rentalAgreement={
												hostPreferences?.rentalAgreement
											}
										/>
										<Separator
											style={{ marginTop: 32 }}
											light
										/>
									</View>
									<View
										style={[
											s.content,
											{
												paddingBottom: 0,
												marginBottom: 35,
											},
										]}
									>
										<Text style={s.title}>
											{`${firstName} - надежный партнер сервиса Getarent`}
										</Text>
										<Text style={s.text}>
											Мы проверили все документы, машина
											исправна и постоянно обслуживается.
											Фотографии настоящие.
										</Text>
									</View>

									{(!!afterRentWashingPrice ||
										!!unlimitedMilagePrice) && (
										<View
											style={[
												predefinedAdditionalFeatures?.length ===
													0 && {
													paddingBottom:
														theme.spacing(7),
												},
												{
													paddingHorizontal:
														theme.spacing(6),
												},
											]}
										>
											<Separator light />
											<AccordionView
												title={`${firstName} предлагает услуги`}
											>
												{afterRentWashingPrice !==
													null && (
													<SectionItem
														subtitle={
															afterRentWashingPrice ===
															0
																? 'Бесплатно'
																: null
														}
													>
														<Text>
															{
																'Мойка после аренды'
															}
															{!!afterRentWashingPrice && (
																<Text
																	style={
																		theme
																			.styles
																			.P1
																	}
																>
																	{'\n' +
																		formatPrice(
																			afterRentWashingPrice
																		)}
																</Text>
															)}
														</Text>
													</SectionItem>
												)}

												{unlimitedMilagePrice !==
													null && (
													<SectionItem
														subtitle={
															unlimitedMilagePrice ===
															0
																? 'Бесплатно'
																: null
														}
													>
														<Text>
															{
																'Неограниченный пробег'
															}
															{!!unlimitedMilagePrice && (
																<Text
																	style={
																		theme
																			.styles
																			.P1
																	}
																>
																	{'\n' +
																		formatPrice(
																			unlimitedMilagePrice
																		)}
																	{' / день'}
																</Text>
															)}
														</Text>
													</SectionItem>
												)}
												<Text style={s.helpText}>
													* Выбор услуг будет доступен
													при бронировании
												</Text>
											</AccordionView>
											{predefinedAdditionalFeatures?.length !==
												0 && <Separator light />}
										</View>
									)}

									{predefinedAdditionalFeatures &&
										predefinedAdditionalFeatures.length !==
											0 && (
											<View
												style={[
													s.content,
													{ paddingTop: 0 },
												]}
											>
												{!(
													afterRentWashingPrice ||
													unlimitedMilagePrice
												) && <Separator light />}
												<AccordionView title="Возможно, вам потребуется в дороге">
													{predefinedAdditionalFeatures.map(
														(item, index) => (
															<SectionItem
																key={index}
															>
																<Text>
																	{carFeatures[
																		item
																			.name
																	]?.label +
																		'\n'}
																</Text>
																{rentDuration <
																7 ? (
																	<Text
																		style={
																			theme
																				.styles
																				.P1
																		}
																	>
																		{formatPrice(
																			item.dailyPrice
																		) +
																			' / день'}
																	</Text>
																) : (
																	<Text
																		style={
																			theme
																				.styles
																				.P1
																		}
																	>
																		{formatPrice(
																			item.wholeRentPrice
																		)}
																	</Text>
																)}
															</SectionItem>
														)
													)}
												</AccordionView>
											</View>
										)}
								</>
							)}
						</ScrollView>
						<TotalCost
							insurance={insurance}
							dayPrice={rentPricePerDay}
							rentDuration={rentDuration}
							disabled={scoringStatus === 'REJECTED'}
							discountPrice={rentDiscountPrice.rentPricePerDay}
							selectedDistantPackage={selectedDistantPackage}
							onPress={onPressResume}
						/>
					</View>
				)}
			</SafeAreaView>
			<Modalize
				ref={modalizeRef}
				snapPoint={HEIGHT / 2}
				modalHeight={HEIGHT / 1.2}
			>
				{Object.keys(modalReview).length !== 0 && (
					<ReviewModal review={modalReview} />
				)}
			</Modalize>
			<DepositPopup
				pledge={pledge}
				modalRef={depositModalRef}
				rentalAgreement={hostPreferences?.rentalAgreement}
			/>
			<Dialog.Container visible={isFirstLicenseIssueYearVisible}>
				<Dialog.Description>
					Укажите, пожалуйста, год выдачи ваших первых прав.
				</Dialog.Description>
				<Dialog.CodeInput onCodeChange={(data) => {

					setFirstLicenseIssueYear(data)

					if (data >= 1920 && data <= new Date().getFullYear()) {
						setIsFirstLicenseIssueYearValid(true)
					} else {
						setIsFirstLicenseIssueYearValid(false)
					}
				}} />
				<Dialog.Button
					label="Отмена"
					onPress={() => setIsFirstLicenseIssueYearVisible(false)}
				/>
				<Dialog.Button
					label="Ок"
					disabled={!isFirstLicenseIssueYearValid}
					onPress={() => {
						dispatch(actions.setDriversLicenseFirstIssueYear(firstLicenseIssueYear.toString()));
						setIsFirstLicenseIssueYearVisible(false);
					}}
					color={
						Platform.OS === 'ios'
						?
							(isFirstLicenseIssueYearValid ? '#007ff9' : '#007ff980')
						:
							(isFirstLicenseIssueYearValid ? '#169689' : '#16968980')}
					/>
			</Dialog.Container>
		</>
	);
};

export default Car;
