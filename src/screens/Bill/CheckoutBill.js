import { isAfter } from 'date-fns';
import DeviceInfo from 'react-native-device-info';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { StyleSheet, View, Text, Alert, Platform } from 'react-native';

import {
	Header,
	Waiter,
	Separator,
	Promocode,
	TextButton,
	CarLocation,
	PrimaryButton,
	CarIndicators,
	RentReferenceInfo,
	SafeAreaSpacingView,
	ScrollViewChangeContent,
	PriceRow
} from 'components';
import api from 'api';
import actions from 'actions';
import { STATUSES } from 'constants';
import { carFeatures, declineRentRules } from 'data';
import { pluralize } from 'functions';
import { trackCarSericesConfirm } from '../../myTrackerService';
import theme from 'theme';

const CheckoutBill = ({
	route: {
		params: {
			car: {
				uuid,
				photo,
				brand,
				model,
				productionYear,
				rentsQty,
				reviewsQty,
				rating,
				minRentDays,
				maxRentDays,
				location,
				insurance,
			} = {},
			bill: { details: { daily, wholeRent }, total } = {},
			rentDuration,
			distancePackages,
			cancellationDateTime,
			startDate,
			endDate,
			services,
			carTransferLocation,
			features,
			transferAddress,
			unavailabilityDates,
			guestsGreetingMessage,
			rentalAgreement,
			withInsurance,
		} = {},
	},
}) => {

	const [promocode, setPromocode] = useState('');
	const [promocodeWaiter, setPromocodeWaiter] = useState(false);
	const [isContractError, setIsContractError] = useState(false);
	const [isContractSigned, setIsContractSigned] = useState(false);

	const dispatch = useDispatch();

	const role = useSelector(st => st.profile.role);
	const waiter = useSelector(st => st.payment.waiter);
	const { dateStart, dateEnd } = useSelector(st => st.car);
	const { status } = useSelector(st => st.rentRoom.rent, shallowEqual);

	const devices = daily?.features || {};
	const deliveryPrice = wholeRent?.delivery || 0;
	const rentPricePerDay = daily?.rentPriceDiscounted || 0;
	const distancePackagePrice = daily?.distancePackage || 0;
	const offHoursReturnPrice = wholeRent?.offHoursReturnPrice || 0;
	const afterRentWashingPrice = wholeRent?.afterRentWashingPrice || 0;
	
	const insurancePrice =
		insurance?.alreadyInsured || withInsurance ? insurance?.price : 0;

	const rentPricePerDayWithInsurance = rentPricePerDay + insurancePrice;
	
	const promocodeDiscount = wholeRent?.promocodeDiscount || promocode?.discount || 0;

	const devicesDayPrice = 
		(rentDuration < 7 && Object.keys(devices).length !== 0) 
		? 
			Object.values(devices).reduce((a, b) => a + b, 0) 
		: 
			0;

	const sumDayPriceWithInsurance = 
		rentPricePerDayWithInsurance + 
		devicesDayPrice + 
		distancePackagePrice;

	const sumDayPriceWithoutInsurance = 
		rentPricePerDay + 
		devicesDayPrice + 
		distancePackagePrice;

	const sumServicesPrice = offHoursReturnPrice + afterRentWashingPrice;

	const rentPriceWithoutInsurance =
		sumDayPriceWithoutInsurance * rentDuration +
		sumServicesPrice +
		deliveryPrice -
		promocodeDiscount;

	const serviceFee = Math.ceil(rentPriceWithoutInsurance * 0.04);

	const isRatingShowing =
		Boolean(rating) || Boolean(rentsQty) || Boolean(reviewsQty);

	const onSubmit = useCallback(

		(dateStart) => {

			if (isAfter(new Date(), dateStart || startDate)) {
				Alert.alert(
					'',
					'Время истекло, пожалуйста, выберите более позднее время начала аренды',
					[
						{
							text: 'Ок',
							onPress: () => {
								api.navigation.navigate(
									'DatePicker',
									{
										start: startDate,
										end: endDate,
										minRentDays: minRentDays,
										maxRentDays: maxRentDays,
										unavailablePeriods:
											unavailabilityDates &&
											Object.values(
												unavailabilityDates
											).reduce(
												(res, cur) => res.concat(cur),
												[]
											),
										callback: (start, end) =>
											dispatch(
												actions.carSetPeriod(start, end)
											),
									},
									true
								);
							},
						},
						{
							text: 'Отмена',
							style: 'cancel',
						},
					]
				);
			} else {
				const paymentScreenData = {
					price: total - (promocode.discount || 0),
					rentDuration,
					paymentData: [
						uuid,
						startDate,
						endDate,
						services,
						carTransferLocation,
						features,
						guestsGreetingMessage,
						promocode.id,
						withInsurance,
					],
				};

			dispatch(actions.setPaymentScreenData(paymentScreenData))

			api.navigation.navigate('PaymentMethod')
		}
	}, [
		uuid,
		startDate,
		endDate,
		services,
		carTransferLocation,
		features,
		guestsGreetingMessage,
		dispatch,
		promocode,
	]);

	useEffect(() => () => dispatch(actions.paymentReset()), []);
	
	const distancePackage = distancePackages?.find((pack) => pack.price === daily.distancePackage);

	const scrollViewRef = React.useRef();

	const isYoungDriverFee = daily?.youngDriverFee !== undefined;

	return (
		<SafeAreaSpacingView style={styles.safeAreaSpacing}>
			<Header 
				big 
				title="Подтверждение" 
				titleStyle={styles.titleStyle} 
			/>
			<View style={theme.styles.container}>
				<ScrollViewChangeContent
					scrollViewRef={scrollViewRef}
					style={theme.styles.container}
					contentContainerStyle={styles.content}
				>
					<CarIndicators
						photo={photo}
						brand={brand}
						model={model}
						productionYear={productionYear}
						rentsQty={rentsQty}
						reviewsQty={reviewsQty}
						rating={rating}
						isRatingShowing={isRatingShowing}
					/>
					<Separator light style={styles.separator} />
					{location ? (
						<CarLocation
							address={transferAddress || location?.address}
							lon={location?.longitude || null}
							lat={location?.latitude || null}
							startDate={dateStart || startDate}
							endDate={dateEnd || endDate}
						/>
					) : (
						<CarLocation
							showMap
							address={
								carTransferLocation?.data?.address ||
								carTransferLocation?.data?.name ||
								null
							}
							lon={carTransferLocation?.data?.longitude || null}
							lat={carTransferLocation?.data?.latitude || null}
							startDate={dateStart || startDate}
							endDate={dateEnd || endDate}
						/>
					)}

					{!!daily && <Separator light style={styles.separator} />}
					
					{daily?.rentPrice !== undefined && (
						<PriceRow
							title="Стоимость аренды / день"
							price={daily.rentPrice}
							style={isYoungDriverFee && styles.extendedPriceRow}
						/>
					)}

					{!!daily?.discountedAmount && (
						<PriceRow
							title="Скидка за аренду / день"
							price={'-' + daily.discountedAmount}
							style={isYoungDriverFee && styles.extendedPriceRow}
						/>
					)}

					{!!daily?.features &&
						Object.keys(daily.features).map(function (key) {
							return (
								<PriceRow
									key={key}
									title={carFeatures[key]?.label + ' / день'}
									price={daily.features[key]}
									style={isYoungDriverFee && styles.extendedPriceRow}
								/>
							);
						})}

					{!!wholeRent?.features &&
						Object.keys(wholeRent.features).map(function (key) {
							return (
								<PriceRow
									key={key}
									title={carFeatures[key]?.label + ' / день'}
									price={wholeRent.features[key]}
									style={isYoungDriverFee && styles.extendedPriceRow}
								/>
							);
						})}

					{daily?.distancePackage !== undefined && distancePackage && (
						<PriceRow
							title={
								distancePackage.kmQuantity === 'infinity'
								?
									"Неограниченный пробег / день"
								:
									`Доп. пакет ${distancePackage.kmQuantity} км / день`
							}
							price={daily.distancePackage}
							style={isYoungDriverFee && styles.extendedPriceRow}
						/>
					)}

					{(withInsurance || insurance?.alreadyInsured) && !!insurance?.price && (
						<PriceRow
							title="Страхование КАСКО / день"
							price={insurance.price}
							style={isYoungDriverFee && styles.extendedPriceRow}
							onPressPopup={() => api.navigation.navigate('InsurancePopup', { price: insurance.price })}
						/>
					)}

					{isYoungDriverFee && (
						<PriceRow
							title="Повышенный сбор КАСКО / день"
							price={daily.youngDriverFee}
							style={isYoungDriverFee && styles.extendedPriceRow}
							textContainerStyle={{ maxWidth: null }}
							onPressPopup={() => api.navigation.navigate('IncreasedFeePopup')}
						/>
					)}

					<Separator light style={[styles.separator, { marginBottom: theme.spacing(4) }]} />
			
					{daily?.total !== undefined && (
						<PriceRow 
							title="Итого / день" 
							price={daily.total} 
							style={{ marginBottom: 0 }}
						/>
					)}

					<Separator light style={styles.separator} />

					{!!wholeRent?.delivery && (
						<PriceRow
							title="+ Доставка"
							price={wholeRent?.delivery}
						/>
					)}

					{wholeRent?.afterRentWashingPrice !== undefined && (
						<PriceRow
							title="+ Мойка после аренды"
							price={wholeRent.afterRentWashingPrice}
						/>
					)}

					{wholeRent?.offHoursReturnPrice !== undefined && (
						<PriceRow
							title="+ Передача / возврат в нерабочее время"
							price={wholeRent.offHoursReturnPrice}
						/>
					)}

					<PriceRow
						title="+ Комиссия Getarent"
						style={{ marginBottom: 0 }}
						price={serviceFee}
						onPressPopup={() => api.navigation.navigate('GuarantorOfSecurity')}
					/>

					{
						!!promocode 
						&&
							<>
								<PriceRow
									title="- Скидка по промокоду"
									price={promocode.discount}
								/>
							</>
					}

					<Separator light style={styles.separator} />

					{role === 'HOST' ? (
						<PriceRow
							titleStyle={styles.totalPrice}
							priceStyle={styles.totalPrice}
							title={
								'Ваш доход x ' +
								rentDuration +
								' ' +
								pluralize(rentDuration, 'день', 'дня', 'дней') +
								' аренды'
							}
							price={total}
						/>
					) : (
						<PriceRow
							titleStyle={styles.totalPrice}
							priceStyle={styles.totalPrice}
							title={
								'Итого x ' +
								rentDuration +
								' ' +
								pluralize(rentDuration, 'день', 'дня', 'дней') +
								' аренды'
							}
							price={total - (promocode.discount || 0)}
						/>
					)}

					<Separator light style={styles.separator} />

					<RentReferenceInfo
						showCancellation={
							((status === STATUSES.AWAITS_HOST_APPROVAL ||
								status === STATUSES.APPROVED_BY_HOST ||
								status ===
									STATUSES.AWAITS_GUEST_SCORING_COMPLETION) &&
								role === 'GUEST') ||
							location
						}
						showRefund={Boolean(location)}
						cancellationDateTime={cancellationDateTime}
					/>

					<Separator light style={styles.separator} />

					<View>
						<Text style={styles.promocodeHeader}>
							Есть промокод?
						</Text>
						<Promocode
							onSubmit={setPromocode}
							setWaiter={setPromocodeWaiter}
						/>
					</View>

					<Separator light style={styles.separator} />

					<View>
						{
							!rentalAgreement
							?
								<>
									<Text style={styles.contractText}>
										Вы подписываете
										<TextButton
											style={styles.textButton}
											title=" Договор аренды "
											onPress={() =>
												api.navigation.navigate('DocumentPopup', {
													uri: 'https://storage.yandexcloud.net/getarent-documents-bucket/4a3531f263936f16.pdf',
												})
											}
										/>
										онлайн. Обязательно ознакомьтесь с ним
									</Text>
									<BouncyCheckbox 
										style={styles.checkbox}
										text='Подписать договор'
										isChecked={isContractSigned}
										fillColor={isContractError ? theme.colors.red : theme.colors.blue}
										textStyle={[
											theme.styles.P1R,
											isContractError && { color: theme.colors.red },
											{ marginLeft: -5, textDecorationLine: "none", },
										]}
										onPress={() => {
											setIsContractError(false);
											setIsContractSigned(!isContractSigned);
										}}
									/>
								</>
							:
								<>
									<Text style={styles.contractText}>
										При получении машины необходимо подписать бумажный
										<TextButton
											style={styles.textButton}
											title=" Договор аренды"
											onPress={() => {

												if (Platform.OS === 'android') {

													api.navigation.navigate('DocumentPopup', {
														uri: rentalAgreement,
													});
													
												} else {

													let request = new XMLHttpRequest();
	
													request.open('GET', `https://tinyurl.com/api-create.php?url=${rentalAgreement}`);
													request.send();
	
													request.onload = () => {
														
														request.status === 200
														?
															api.navigation.navigate('DocumentPopup', {
																uri: request.response,
															})
														:
															Alert.alert('', 'Невозможно загрузить договор, попробуйте позже')
													}
												}
											}}
										/>
									</Text>
									<BouncyCheckbox 
										style={styles.checkbox}
										isChecked={isContractSigned}
										text='С Договором ознакомлен(а)'
										fillColor={isContractError ? theme.colors.red : theme.colors.blue}
										textStyle={[
											theme.styles.P1R,
											isContractError && { color: theme.colors.red },
											{ marginLeft: -5, textDecorationLine: "none", },
										]}
										onPress={() => {
											setIsContractError(false);
											setIsContractSigned(!isContractSigned);
										}}
									/>
								</>
						}
					</View>
				</ScrollViewChangeContent>
				{location && (
					<View style={styles.buttonShadow}>
						<PrimaryButton
							style={styles.button}
							title="Продолжить"
							onPress={() => {

								if (isContractSigned) {
									onSubmit(dateStart, dateEnd)
									trackCarSericesConfirm()
								} else {
									setIsContractError(true)
									scrollViewRef.current.scrollToEnd({animated: true})
								}
							}}
						/>
						<Text style={styles.licenseText}>
							{'Я прочитал и согласен с '}
							<TextButton
								style={styles.textButton}
								title="Правилами отмены"
								onPress={() =>
									api.navigation.navigate('ListPopup', {
										header: declineRentRules.header,
										content: declineRentRules.content,
									})
								}
							/>
						</Text>
					</View>
				)}
				{(waiter || promocodeWaiter) && <Waiter />}
			</View>
		</SafeAreaSpacingView>
	);
};

export default CheckoutBill;

const styles = StyleSheet.create({
	safeAreaSpacing: {
		...theme.styles.container,
		paddingTop: 0,
	},
	titleStyle: {
		...theme.styles.P1,
	},
	buttonShadow: {
		backgroundColor: '#fff',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 7,
		},
		shadowOpacity: 0.41,
		shadowRadius: 9.11,
		elevation: 14,
		paddingBottom: DeviceInfo.hasNotch()
			? theme.spacing(8)
			: theme.spacing(4),
	},
	button: {
		marginHorizontal: theme.spacing(6),
		marginTop: theme.spacing(6),
		marginBottom: 0,
	},
	content: {
		paddingHorizontal: theme.spacing(6),
	},
	totalPrice: {
		fontWeight: '500',
		color: theme.colors.black,
	},
	separator: {
		marginVertical: theme.spacing(5),
	},
	licenseText: {
		...theme.styles.P2R,
		marginTop: theme.spacing(2),
		marginHorizontal: theme.spacing(6),
		textAlign: 'center',
	},
	getarentServicesBigText: {
		...theme.styles.P1R,
		color: theme.colors.darkGrey,
	},
	getarentServicesSmallText: {
		...theme.styles.P2R,
		color: theme.colors.darkGrey,
	},
	getarentServicesTotalPriceRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	getarentServicesTotalPrice: {
		...theme.styles.P1_22,
		color: theme.colors.darkGrey,
	},
	promocodeHeader: {
		...theme.styles.P1,
		marginBottom: 15,
	},
    checkbox: {
		marginBottom: 50,
    },  
	contractText: {
		...theme.styles.P2R,
		marginBottom: 15,
	},
	extendedPriceRow: {
		width: '105%',
		left: '-0.5%',
	}
});
