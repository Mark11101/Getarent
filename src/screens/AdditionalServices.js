import { Formik } from 'formik';
import React, { useCallback, useState } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView, StyleSheet, View, ScrollView, Text, TouchableOpacity, Alert } from 'react-native';

import {
	Header,
	Waiter,
	Section,
	Separator,
	FormikInput,
	RadioButton,
	FormikSwitch,
	PrimaryButton,
	DeliveryPlace,
	MileageLimits,
	AdditionalKms,
} from 'components';
import api from 'api';
import actions from 'actions';
import { carFeatures } from 'data';
import { useDidUnmount } from 'hooks';
import ReadMoreArrowIcon from 'img/read-more-arrow.svg';
import { getWorkingHoursText } from 'functions';
import { trackCarServices } from '../myTrackerService';
import theme from 'theme';

const initialValues = {
	isAfterRentWashing: false,
	isOffHoursReturn: false,
	isFuelLiterCompensation: false,
	guestsGreetingMessage: '',
	distancePackage: null,
	withInsurance: false,
};

const getCarTransferLocation = (place) => {

	if (!place) {
		return { type: 'HOME', data: null };
	}

	if (place.type === 'POPULAR_LOCATION') {
		return {
			type: 'POPULAR_LOCATION',
			data: { popularLocationId: place.id },
		};
	}

	return {
		type: 'ADDRESS',
		data: {
			address: place.address,
			latitude: place.location.lat,
			longitude: place.location.lon,
		},
	};
};

const getCarTransferLocationAddress = (place, homeAddress) => {

	if (!place) {
		return homeAddress;
	};

	if (place.type === 'POPULAR_LOCATION') {
		return place.name;
	};

	return place.address;
};

const AdditionalServices = ({
	route: {
		params: {
			carId,
			startDate,
			endDate,
			rentDuration,
			rentDiscountPrice,
			cancellationDateTime,
			afterRentWashingPrice,
			additionalKmPrice,
			dailyMilageLimit,
			mileageLimit,
			offHoursReturnPrice,
			distancePackages,
			distancePackage,
			unavailabilityDates,
			predefinedAdditionalFeatures,
			rentalAgreement,
			insurance,
			price,
			onPressBack,
		} = {},
	},
}) => {
	
	const [withInsurance, setWithInsurance] = useState(false);
	const [selectedDistantPackage, setSelectedDistantPackage] = useState(distancePackage);

	const dispatch = useDispatch();

	const didUnmount = useDidUnmount();
	
	const [waiter, setWaiter] = useState(false);

	const {
		car: { uuid, location, delivery } = {},
		user: { hostPreferences },
		deliveryPlace: place,
	} = useSelector(st => st.car, shallowEqual);

	const role = useSelector(st => st.profile.role);

	const setPlace = useCallback(
		place => dispatch(actions.carSetDeliveryPlace(place)),
		[dispatch]
	);

	const onSubmit = useCallback(
		async ({
			isAfterRentWashing,
			isOffHoursReturn,
			isFuelLiterCompensation,
			guestsGreetingMessage,
			distancePackage,
			withInsurance,
			...features
		}) => {

			setWaiter(true);

			const requestServices = {
				emptyTankReturn: isFuelLiterCompensation,
				afterRentWashing: isAfterRentWashing,
				offHoursReturn: isOffHoursReturn,
				distancePackage: distancePackage || null,
			};

			const carTransferLocation = getCarTransferLocation(place);

			const requestFeatures = Object.keys(features).filter(
				feat => feat && features[feat]
			);

			await api.web
				.carRentCheckout(
					(carId || uuid),
					startDate,
					endDate,
					requestServices,
					carTransferLocation,
					requestFeatures,
					withInsurance,
				)
				.then(res => {

					if (didUnmount.current) {
						return;
					}

					if (!res || res.error) {
						throw res?.error || {};
					} else {
						
						api.navigation.navigate(
							'CheckoutBill',
							{
								startDate,
								endDate,
								rentDuration,
								distancePackages,
								rentDiscountPrice,
								cancellationDateTime,
								services: requestServices,
								carTransferLocation,
								features: requestFeatures,
								unavailabilityDates,
								transferAddress:
									getCarTransferLocationAddress(
										place,
										location?.address
									),
								guestsGreetingMessage,
								rentalAgreement,
								withInsurance,
								insuranceUnavailable: insurance.unavailable,
								...res,
							},
							true
						);
					}

					setWaiter(false);
				})
				.catch((err) => {
					
					console.log(err);
					
					dispatch(actions.error('Машина пока недоступна, попробуйте позже'));
					setWaiter(false);
				});
		},
		[
			place,
			uuid,
			startDate,
			endDate,
			didUnmount,
			rentDuration,
			cancellationDateTime,
			location?.address,
			dispatch,
		]
	);

	return (
		<SafeAreaView style={[theme.styles.paper, theme.styles.flex]}>
			<View style={styles.container}>
				<Header
					big
					title="Дополнительные услуги"
					titleStyle={theme.styles.P1}
					onPressBack={() => {
						!!onPressBack
						?
							onPressBack()
						:
							api.navigation.goBack() 
					}}
				/>
				<View style={theme.styles.container}>
					<KeyboardAwareScrollView
						resetScrollToCoords={{ x: 0, y: 0 }}
						contentContainerStyle={styles.container}
						enableOnAndroid
					>
						<ScrollView>
							<Formik
								{...{
									initialValues,
									onSubmit,
								}}
							>
								{({
									handleSubmit,
									setFieldValue,
									values: { guestsGreetingMessage },
								}) => (
									<View>
										<Section
											separator
											title="Место получения"
											titleStyle={styles.titleStyle}
										>
											<DeliveryPlace
												{...delivery}
												{...{
													uuid,
													location,
													place,
													setPlace,
												}}
											/>
										</Section>
										{(dailyMilageLimit || mileageLimit) && (
											<Section
												style={{ marginBottom: 0 }}
											>
												<MileageLimits
													mileageLimit={mileageLimit}
													rentDuration={rentDuration}
													dailyMilageLimit={
														dailyMilageLimit
													}
													additionalKmPrice={
														additionalKmPrice
													}
													selectedDistantPackage={
														selectedDistantPackage
													}
												/>
											</Section>
										)}
										{distancePackages.length !== 0 ? (
											<AdditionalKms
												distancePackages={
													distancePackages
												}
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
										) : (
											<View
												style={{
													marginBottom: 20,
													paddingHorizontal:
														theme.spacing(6),
												}}
											>
												{(dailyMilageLimit ||
													mileageLimit) && (
													<Separator light />
												)}
											</View>
										)}
										{
											!insurance?.unavailable && !insurance?.alreadyInsured
											&&
												<Section
													title="Выберите страховку"
													style={{ marginBottom: 0 }}
													titleStyle={[styles.titleStyle, { marginBottom: 20 }]}
												>
													<TouchableOpacity 
														style={[
															styles.insurance, 
															!withInsurance && styles.insuranceChecked,
															{ marginBottom: 15 }
														]}
														onPress={() => setWithInsurance(false)}
													>
														<View style={styles.insuranceHeader}>
															<RadioButton
																checked={!withInsurance} 
																label='Отказаться от страховки' 
																style={styles.insuranceRadioBtn}
																labelStyle={styles.insuranceBoldText}
																onChange={() => setWithInsurance(false)}
															/>
															<View style={[
																styles.insurancePriceBox,
																!withInsurance && styles.insurancePriceBoxChecked
															]}>
																<Text style={[
																	styles.insurancePriceBoxText,
																	!withInsurance && styles.insurancePriceBoxTextChecked
																]}>
																	+ 0 ₽/день
																</Text>
															</View>
														</View>
														<View style={styles.insuranceContent}>
															<Text style={styles.insuranceText}>
																Вы будете нести ответственность за любые повреждения машины, возникшие 
																во время аренды, в том числе в результате ДТП вплоть до рыночной стоимости 
																данного автомобиля{!!price ? ',' : '.'} {!!price && <Text style={styles.insuranceBoldText}>которая составляет {price.toLocaleString()} ₽.</Text>}Воспользуйтесь страховкой 
																КАСКО, это ваша финансовая безопасность.
															</Text>
														</View>
													</TouchableOpacity>
													<TouchableOpacity 
														style={[
															styles.insurance, 
															withInsurance && styles.insuranceChecked
														]}
														onPress={() => setWithInsurance(true)}
													>
														<View style={styles.insuranceHeader}>
															<RadioButton
																checked={withInsurance} 
																label='Страховка КАСКО' 
																style={styles.insuranceRadioBtn}
																labelStyle={styles.insuranceBoldText}
																onChange={() => setWithInsurance(true)}
															/>
															<View style={[
																styles.insurancePriceBox,
																withInsurance && styles.insurancePriceBoxChecked
															]}>
																<Text style={[
																	styles.insurancePriceBoxText,
																	withInsurance && styles.insurancePriceBoxTextChecked
																]}>
																	+ {insurance.price || '?'} ₽/день
																</Text>
															</View>
														</View>
														<View style={styles.insuranceContent}>
															<View style={styles.insuranceListItem}>
																<Text style={styles.insuranceListItemMarker}>
																	•
																</Text>
																<Text style={styles.insuranceText}>
																	Страхование КАСКО от повреждений 
																	<Text style={styles.insuranceBoldText}> до 3 500 000₽ </Text> 
																	с ответственностью водителя 
																	<Text style={styles.insuranceBoldText}> 20 000₽</Text> 
																</Text>
															</View>
															<View style={styles.insuranceListItem}>
																<Text style={styles.insuranceListItemMarker}>
																	•
																</Text>
																<Text style={styles.insuranceText}>
																	Ремонт свыше 20 000₽ возместит владельцу СПАО “Ингосстрах”. 
																</Text>
															</View>
															<View style={styles.insuranceListItem}>
																<Text style={styles.insuranceListItemMarker}>
																	•
																</Text>
																<Text style={styles.insuranceText}>
																	Для водителей от 21 года и стажа вождения от 2-х лет
																</Text>
															</View>
															<TouchableOpacity
																style={styles.insuranceReadMoreBtn}
																onPress={() => api.navigation.navigate(
																	'InsurancePopup',
																	{ price: !insurance?.alreadyInsured ? insurance?.price : null }
																)} 
															>
																<Text style={styles.insuranceReadMoreBtnText}>
																	Читать полностью 
																</Text>
																<ReadMoreArrowIcon width={17} height ={17} />
															</TouchableOpacity>
														</View>
													</TouchableOpacity>
												</Section>
										}
										<Section
											title="Добавьте услуги"
											titleStyle={styles.titleStyle}
										>
											{!!afterRentWashingPrice ||
											!!offHoursReturnPrice ? (
												<React.Fragment>
													{!!afterRentWashingPrice && (
														<FormikSwitch
															name="isAfterRentWashing"
															label="Мойка после аренды"
															price={
																afterRentWashingPrice
															}
														/>
													)}
													{!!offHoursReturnPrice && (
														<>
															<FormikSwitch
																name="isOffHoursReturn"
																label="Передача / возврат в нерабочее время"
																price={
																	offHoursReturnPrice
																}
															/>
															{!!hostPreferences?.workingHours && (
																<Text
																	style={
																		styles.helpText
																	}
																>
																	{getWorkingHoursText(
																		hostPreferences.workingHours
																	)}
																</Text>
															)}
														</>
													)}
												</React.Fragment>
											) : (
												<Text
													style={styles.description}
												>
													Владелец автомобиля не
													указал никаких
													дополнительных услуг
												</Text>
											)}
											<Separator
												light
												style={{ marginTop: 30 }}
											/>
										</Section>

										<Section
											separator
											title="Добавьте устройства"
											style={{
												paddingTop: 0,
												marginBottom: 30,
											}}
											titleStyle={styles.titleStyle}
										>
											{predefinedAdditionalFeatures?.length ? (
												<React.Fragment>
													{predefinedAdditionalFeatures.map(
														(item, index) => (
															<FormikSwitch
																key={
																	item.name +
																	'-' +
																	index
																}
																name={item.name}
																label={
																	carFeatures[
																		item
																			.name
																	]?.label
																}
																price={
																	rentDuration >=
																	7
																		? item.wholeRentPrice
																		: item.dailyPrice
																}
																unit={
																	rentDuration >=
																	7
																		? null
																		: 'день'
																}
															/>
														)
													)}
												</React.Fragment>
											) : (
												<Text
													style={styles.description}
												>
													Владелец автомобиля не
													указал никаких
													дополнительных устройств
												</Text>
											)}
										</Section>
										<Section
											title="Куда планируется поездка?"
											titleStyle={styles.titleStyle}
										>
											<FormikInput
												multiline
												style={styles.input}
												labelStyle={
													styles.textAreaLabel
												}
												inputStyle={
													styles.textAreaInput
												}
												name="guestsGreetingMessage"
												placeholder={
													'Опишите максимально подробно географию использования'
												}
												maxLength={2500}
											/>
										</Section>
										{/* <Section
											title="Есть промокод?"
											titleStyle={styles.titleStyle}
										>
											<Promocode
												stateValue={promocode}
												setWaiter={setWaiter}
											/>
										</Section> */}
										<PrimaryButton
											style={styles.button}
											title="Продолжить"
											onPress={e => {

												if (role !== 'GUEST') {

													Alert.alert(
														'',
														'Пожалуйста, авторизуйтесь под аккаунтом водителя',
														[
															{
																text: 'Отмена',
															},
															{
																text: 'Войти',
																onPress: () => {
																	dispatch(actions.logout())
																	api.navigation.deepNavigate('ProfileRoot', 'Auth', 'SignIn', {
																		onGoBackAction: {
																			type: 'navigate',
																			payload: [ 'LocationTab' ]
																		},
																		initialRouteName: 'SignIn'
																	})
																}
															},
														]
													);

												} else {

													setFieldValue(
														'distancePackage',
														selectedDistantPackage
													);
	
													setFieldValue(
														'withInsurance',
														withInsurance
													);
	
													handleSubmit(e);
													trackCarServices()
												}
											}}
											disabled={!guestsGreetingMessage}
										/>
									</View>
								)}
							</Formik>
						</ScrollView>
					</KeyboardAwareScrollView>
					{waiter && <Waiter />}
				</View>
			</View>
		</SafeAreaView>
	);
};

export default AdditionalServices;

const styles = StyleSheet.create({
	button: {
		margin: theme.spacing(6),
		marginTop: 0,
	},
	container: {
		flex: 1,
	},
	titleStyle: {
		...theme.styles.P1,
		marginBottom: 8,
	},
	description: {
		...theme.styles.P2R,
		color: theme.colors.lightCyan,
	},
	input: {
		marginBottom: 0,
	},
	textAreaLabel: {
		...theme.styles.P2R,
		marginBottom: theme.spacing(1),
	},
	textAreaInput: {
		...theme.styles.P2R,
		height: theme.normalize(120),
		textAlignVertical: 'top',
	},
	helpText: {
		...theme.styles.note,
		color: theme.colors.darkGrey,
		marginTop: -2,
	},
	insurance: {
		borderColor: '#DBE3EF',
		borderRadius: 20,
		borderWidth: 1,
		paddingHorizontal: 20,
		paddingVertical: 20,
	},
	insuranceChecked: {
		borderColor: '#066BD6',
	},
	insuranceHeader: {
		flexDirection: 'row',
		marginBottom: 20,
	},
	insuranceRadioBtn: {
		marginRight: 10,
	},
	insurancePriceBox: {
		backgroundColor: '#DBE3EF',
		borderRadius: 30,
		alignItems: 'center',
		justifyContent: 'center',
		paddingHorizontal: 10,
	},
	insurancePriceBoxChecked: {
		backgroundColor: '#066BD6',
	},
	insurancePriceBoxText: {
		color: '#000000',
		fontWeight: 'bold',
		fontSize: 12,
	},
	insurancePriceBoxTextChecked: {
		color: '#ffffff',
	},
	insuranceBoldText: {
		fontWeight: 'bold',
	},
	insuranceText: {
		lineHeight: 19,
	},
	insuranceListItem: {
		flexDirection: 'row',
		marginBottom: 15,
	},
	insuranceListItemMarker: {
		marginRight: 10,
		fontWeight: 'bold',
	},
	insuranceContent: {
		paddingRight: 10,
		paddingLeft: 5,
	},
	insuranceReadMoreBtn: {
		flexDirection: 'row',
		width: 150,
	},
	insuranceReadMoreBtnText: {
		color: '#066BD6',
		fontWeight: 'bold',
		marginRight: 5,
	},
});
