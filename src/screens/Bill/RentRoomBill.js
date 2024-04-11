import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, View, Text } from 'react-native';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';

import {
	Header,
	Waiter,
	Separator,
	TextButton,
	CarLocation,
	CarIndicators,
	PrimaryButton,
	RentReferenceInfo,
	SafeAreaSpacingView,
	ScrollViewChangeContent,
	PriceRow
} from 'components';
import api from 'api';
import theme from 'theme';
import actions from 'actions';
import { STATUSES } from 'constants';
import BillDetails from './BillDetails';
import { carFeatures, declineRentRules } from 'data';
import { pluralize, setCancellationDateTime } from 'functions';

export default function RentRoomBill({
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
				location,
				insurance,
			} = {},
			bill = [],
			rentDuration,
			startDate,
			endDate,
			services,
			carTransferLocation,
			features,
			transferAddress,
			guestsGreetingMessage,
			promocode,
			distancePackage,
		} = {},
	},
}) {
	const dispatch = useDispatch();

	const { status } = useSelector(st => st.rentRoom.rent, shallowEqual);
	const waiter = useSelector(st => st.payment.waiter);
	const role = useSelector(st => st.profile.role);

	const isRatingShowing = Boolean(rating) || Boolean(rentsQty) || Boolean(reviewsQty);

	const onSubmit = useCallback(() => {

		const paymentAction = actions.paymentRequest([
			uuid,
			startDate,
			endDate,
			services,
			carTransferLocation,
			features,
			guestsGreetingMessage,
			promocode.id,
		]);

		dispatch(paymentAction);

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

	const wholeRentFeaturesOrUndefined = bill.find(
		hostBill => hostBill?.details?.wholeRent?.features
	);

	const wholeRentFeatures = wholeRentFeaturesOrUndefined
		? wholeRentFeaturesOrUndefined.details.wholeRent.features
		: {};

	const afterRentWashingPriceOrUndefined = bill.find(
		hostBill => hostBill?.details?.wholeRent?.afterRentWashingPrice
	);

	const afterRentWashingPrice = afterRentWashingPriceOrUndefined
		? afterRentWashingPriceOrUndefined.details.wholeRent.afterRentWashingPrice
		: null;

	const offHoursReturnPriceOrUndefined = bill.find(
		hostBill => hostBill?.details?.wholeRent?.offHoursReturnPrice
	);

	const offHoursReturnPrice = offHoursReturnPriceOrUndefined
		? offHoursReturnPriceOrUndefined.details.wholeRent.offHoursReturnPrice
		: null;

	const fuelCompensationPriceOrUndefined = bill.find(
		hostBill => hostBill?.details?.wholeRent?.fuelCompensationPrice
	);

	const fuelCompensationPrice = fuelCompensationPriceOrUndefined
		? fuelCompensationPriceOrUndefined.details.wholeRent.fuelCompensationPrice
		: null;

	const deliveryOrUndefined = bill.find(
		hostBill => hostBill?.details?.wholeRent?.delivery
	);

	const delivery = deliveryOrUndefined
		? deliveryOrUndefined.details.wholeRent.delivery
		: 0;

	const promocodeDiscountOrUndefined = bill.find(
		guestBill => guestBill?.details?.wholeRent?.promocodeDiscount
	);

	const promocodeDiscount = promocodeDiscountOrUndefined
		? promocodeDiscountOrUndefined.details.wholeRent.promocodeDiscount
		: 0;

	const allBillsAdditionalsFee = bill.reduce((sum, hostBill) => {

		const newSum = hostBill.details?.wholeRent?.additionalsServiceFee
			? hostBill.details.wholeRent.additionalsServiceFee + sum
			: sum;

		return newSum;
	}, 0);

	const allBillsSelfEployedFee = bill.reduce((sum, hostBill) => {

		const newSum = hostBill.details?.wholeRent?.selfEmployedFee
			? hostBill.details.wholeRent.selfEmployedFee + sum
			: sum;

		return newSum;
	}, 0);

	const allBillsRentServiceFee = bill.reduce((sum, hostBill) => {

		const newSum = hostBill.details?.wholeRent?.rentServiceFee
			? hostBill.details.wholeRent.rentServiceFee + sum
			: sum;

		return newSum;
	}, 0);

	const allBillsTotal = bill.reduce((sum, { total }) => {
		const newSum = sum + total;
		return newSum;
	}, 0);

	const [timeZone, setTimeZone] = useState("UTC");
	const cancellationDateTime = setCancellationDateTime(new Date(startDate), timeZone);

	useEffect(() => {
		if (location) {
			const {latitude, longitude} = location;
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
		}
	}, [location, dispatch] );

	useEffect(() => () => dispatch(actions.paymentReset()), []);

	const allBillsTotalWithPromocode = allBillsTotal - (promocode?.discount || 0);

	const allBillsServiceFee = bill.reduce((sum, { details: { wholeRent } }) => {
		const newSum = sum + wholeRent?.serviceFee;
		return newSum;
	}, 0);

	return (
		<SafeAreaSpacingView style={styles.safeAreaSpacing}>
			<Header big />
			<View style={theme.styles.container}>
				<ScrollViewChangeContent
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
						style={styles.carInfo}
					/>
					<Separator light style={styles.separator} />
					{location ? (
						<CarLocation
							address={transferAddress || location?.address}
							lon={location?.longitude || null}
							lat={location?.latitude || null}
							startDate={startDate}
							endDate={endDate}
							style={{ marginBottom: theme.spacing(3) }}
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
							startDate={startDate}
							endDate={endDate}
							style={{ marginBottom: theme.spacing(3) }}
						/>
					)}

					<Separator light style={styles.separator} />

					{bill &&
						bill.map((guestBill, i) => (
							<BillDetails
								key={i}
								role={role}
								bill={guestBill}
								insurance={insurance}
								rentDuration={rentDuration}
								isOnlyOneBill={bill.length === 1}
								isFinalBill={i === bill.length - 1}
								distancePackage={distancePackage}
							/>
						))}

					<View style={{ marginTop: theme.spacing(6) }}>
						{wholeRentFeatures &&
							Object.keys(wholeRentFeatures).map(key => {
								return (
									<PriceRow
										key={key}
										title={carFeatures[key]?.label}
										price={wholeRentFeatures[key]}
									/>
								);
							})}

						{delivery !== 0 && (
							<PriceRow title="+ Доставка" price={delivery} />
						)}

						{afterRentWashingPrice !== null && (
							<PriceRow
								title="+ Мойка после аренды"
								price={afterRentWashingPrice}
							/>
						)}

						{offHoursReturnPrice !== null && (
							<PriceRow
								title="+ Передача / возврат в нерабочее время"
								price={offHoursReturnPrice}
							/>
						)}

						{fuelCompensationPrice !== null && (
							<PriceRow
								title="+ Возврат с пустым баком"
								price={fuelCompensationPrice}
							/>
						)}

						{Boolean(promocodeDiscount) && (
							<>
								<PriceRow
									title="- Скидка по промокоду"
									price={promocodeDiscount}
								/>
							</>
						)}

						{(allBillsServiceFee !== undefined) && (
							<PriceRow
								title="+ Комиссия Getarent"
								price={allBillsServiceFee}
								onPressPopup={() => api.navigation.navigate('GuarantorOfSecurity')}
							/>
						)}

						{role === 'HOST' && allBillsSelfEployedFee !== 0 && (
							<PriceRow
								title="+ Комиссия для самозанятых"
								price={'-' + allBillsSelfEployedFee}
							/>
						)}
					</View>

					{
						(
							Object.keys(wholeRentFeatures).length !== 0 ||
							afterRentWashingPrice !== null ||
							offHoursReturnPrice !== null ||
							fuelCompensationPrice !== null ||
							delivery !== 0 ||
							allBillsServiceFee !== undefined ||
							role === 'HOST' && allBillsAdditionalsFee !== 0 ||
							role === 'HOST' && allBillsRentServiceFee !== 0 ||
							role === 'HOST' && allBillsSelfEployedFee !== 0
						) && (
							<Separator light style={{
								marginTop: theme.spacing(5),
								marginBottom: theme.spacing(6)
							}} />
						)
					}

					{role === 'HOST' ? (
						<PriceRow
							style={styles.totalPrice}
							titleStyle={styles.totalTitle}
							title={
								'Ваш доход x ' +
								rentDuration +
								' ' +
								pluralize(rentDuration, 'день', 'дня', 'дней') +
								' аренды'
							}
							price={allBillsTotal}
						/>
					) : (
						<PriceRow
							style={styles.totalPrice}
							titleStyle={styles.totalTitle}
							title={
								'Итого x ' +
								rentDuration +
								' ' +
								pluralize(rentDuration, 'день', 'дня', 'дней') +
								' аренды'
							}
							price={allBillsTotalWithPromocode}
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
						showInsurance={role !== 'HOST'}
						cancellationDateTime={cancellationDateTime}
					/>
				</ScrollViewChangeContent>
				{location && (
					<React.Fragment>
						<PrimaryButton
							style={styles.button}
							title="Перейти к оплате"
							onPress={onSubmit}
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
							{' и '}
							<TextButton
								style={styles.textButton}
								title="Договором
							аренды"
								onPress={() =>
									api.navigation.navigate('DocumentPopup', {
										uri: 'https://storage.yandexcloud.net/getarent-documents-bucket/4a3531f263936f16.pdf',
									})
								}
							/>
						</Text>
					</React.Fragment>
				)}
				{waiter && <Waiter />}
			</View>
		</SafeAreaSpacingView>
	);
}

const styles = StyleSheet.create({
	safeAreaSpacing: {
		...theme.styles.container,
		paddingTop: 0,
		paddingBottom: theme.spacing(6),
	},
	button: {
		marginHorizontal: theme.spacing(6),
		marginTop: theme.spacing(6),
		marginBottom: 0,
	},
	content: {
		marginHorizontal: theme.spacing(6),
	},
	carInfo: {
		marginBottom: theme.spacing(3),
	},
	totalPrice: {
		marginBottom: theme.spacing(6),
	},
	totalTitle: {
		...theme.styles.P1,
		color: theme.colors.darkGrey,
	},
	separator: {
		marginBottom: theme.spacing(6),
	},
	licenseText: {
		...theme.styles.P2R,
		marginTop: theme.spacing(2),
		marginHorizontal: theme.spacing(6),
		textAlign: 'center',
	},
});
