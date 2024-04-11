import {
	View,
	Text,
	Alert,
	Linking,
	Platform,
	ScrollView,
	StyleSheet,
	Dimensions,
	SafeAreaView,
	RefreshControl,
	TouchableOpacity,
} from "react-native";
import { Modalize } from "react-native-modalize";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
	Icon,
	Empty,
	Waiter,
	Header,
	ReadMore,
	CarRental,
	AlertBlock,
	DriverInfo,
	StatusLine,
	TextButton,
	DriverReport,
	DepositPopup,
	PrimaryButton,
	OwnerContactCard,
	NotAvailableScreen,
	AvailabilityCalendar,
	RentInProgressCountDown,
} from "components";
import api from "api";
import actions from "actions";
import { useTimeLeft } from "hooks";
import { STATUSES } from "constants";
import { ru } from "date-fns/locale";
import { rentRoomSettings } from "data";
import FuelIcon from "img/terms/fuel.svg";
import CloseIcon from "img/close/close.svg";
import ChatIconWhite from 'img/chat/chat_white_24dp.svg';
import {addDays, differenceInHours, format} from "date-fns";
import { calculateMileageLimit, fromUTCToLocalDate } from "../functions";

import WashingIcon from "img/terms/washing.svg";
import GeographyIcon from "img/terms/geography.svg";
import KilometresIcon from "img/terms/kilometres.svg";
import InsuranceIcon from "img/terms/insurance.svg";
import ContractIcon from "img/terms/contract.svg";
import DepositIcon from "img/terms/deposit.svg";

import ProlongDatePickerModal, {
	getMaxAvailableProlongationDate,
} from "../components/RentProlongation/components/DatePicker/ProlongDatePickerModal";
import RentProlongation from "../components/RentProlongation/RentProlongation";
import { trackCarRentPay } from '../myTrackerService';
import theme from 'theme';

const MAX_CASCO_COMPENSATION = 3500000;

const HEIGHT = Dimensions.get("window").height;

const emptyProps = {
	icon: "error",
	iconColor: theme.colors.grey,
	iconSize: theme.normalize(92),
};

const RentRoom = ({
	route: { params: { uuid, openUnavailableDatesModal, onPressBack } = {} },
}) => {

	const [driverReportData, setDriverReportData] = useState({});

	const modalizeRef = useRef(null);

	const openImportantMessageModal = () => {
		modalizeRef.current?.open();
	};

	const depositModalRef = useRef(null);

	const openDepositModal = () => {
		depositModalRef.current?.open();
	};

	const superGuestModalizeRef = useRef(null);

	const openSuperGuestModal = () => {
		superGuestModalizeRef.current?.open();
	};

	const profileId = useSelector(st => st.profile.id);
	const carEditData = useSelector(st => st.profile.carEditData);
	const scoringStatus = useSelector(st => st.profile.scoringStatus);

    const [blockedDatesToUpdate, setBlockedDatesToUpdate] = useState([]);

	const unavailableDatesModalizeRef = useRef(null);

	const openUnavailableDatesModalize = () => {
		unavailableDatesModalizeRef.current?.open();
	};

	useEffect(() => {

		if (openUnavailableDatesModal && carEditData?.unavailabilityDates) {

			setTimeout(() => {
				openUnavailableDatesModalize();
			}, 300);
		}

	}, [openUnavailableDatesModal, carEditData]);

	useEffect(() => {

		carEditData?.unavailabilityDates?.blocked
		&&
			dispatch(
				actions.updateBlockedDurations(
					carEditData.unavailabilityDates.blocked
				)
			);

	}, [carEditData]);

	const [isReviewed, setIsReviewed] = useState(false);

	const role = useSelector(st => st.profile.role);

	const dispatch = useDispatch();

	const [waiter2, setWaiter2] = useState(false);

	const {
		waiter,
		refreshing,
		car = {},
		rent = {},
		preRentalInspection = {},
		host = {},
		guest = {},
		driver = {},
		bill = [],
		contentInfo,
		error,
	} = useSelector(st => st.rentRoom, shallowEqual);

	const {
		id: carId,
		vin,
		photo,
		brand,
		model,
		registrationNumber,
		pledge,
		productionYear,
		usageRestrictions,
		insurance: carInsurance,
	} = car;

	const {
		status,
		isPayed,
		endDate,
		startDate,
		hasReviewed,
		finishRentDate,
		rentDeclineComment,
		carTransferLocation,
		guestsGreetingMessage,
		insurance: insuranceServiceChosen,
	} = rent;

	const { card, labels } = guest;

	const {
		uuid: userUuid,
		avatar,
		midName,
		lastName,
		rentsQty,
		firstName,
		birthDate,
		bestReview,
		contactDetails,
		rating: userRating,
		isScoringReportAvailable,
		reviewsQty: userReviewsQty,
		reviews: hostCurrentCarReviews,
	} = role === 'GUEST' ? host : guest;

	const {
		passportNumber,
		passportIssueDate,
		driversLicenseNumber,
		driversLicenseIssueDate,
	} = driver;

	const rentalAgreement = host?.rentalAgreement;

	const [timeLeft, isInTime, isRentFinished, refreshTimeLeft] = useTimeLeft(
		endDate,
		status,
		finishRentDate
	);

	const pageScrollViewRef = useRef();

	const [prolongationDateCreate, setProlongationDateCreate] = useState(null);
	const [unavailableProlongationDates, setUnavailableProlongationDates] = useState(null);
	const [availableForProlongationCreateRequest, setAvailableForProlongationCreateRequest] = useState(false);
	const createProlongationDatePickerModalRef = useRef();

	const onRefresh = useCallback(() => {
		fetchUnavailableDates();
		dispatch(actions.rentRoomRequest(uuid, role, true));
		refreshTimeLeft();
	}, [uuid, role, dispatch, refreshTimeLeft]);

	const onRentFinish = useCallback(async () => {

		let isFinished;

		setWaiter2(true);

		try {

			const {
				hostInspection: { finished: hostInspectionFinished },
				guestInspection: { finished: guestInspectionFinished },
			} = await api.web.getPsoEndpoint(role, uuid, null, false);

			isFinished = role === 'GUEST'
				? guestInspectionFinished
				: hostInspectionFinished;

		} catch (err) {

			dispatch(
				actions.error('Не удалось загрузить данные, попробуйте еще раз')
			);

		} finally {
			setWaiter2(false);
		};

		api.navigation.navigate(isFinished ? 'PsoWait' : 'PostInspection', {
			uuid,
			isStart: false,
			role,
		});

	}, [dispatch, uuid, role]);

	const onApprove = useCallback(() => {

		setWaiter2(true);

		api.web
			.rentRoomApprove(uuid)
			.then(() => dispatch(actions.rentRoomRequest(uuid, role, true)))
			.catch(() =>
				dispatch(
					actions.error(
						'Не удалось подтвердить аренду, попробуйтте еще раз'
					)
				)
			)
			.finally(() => setWaiter2(false));
	}, [setWaiter2, role, uuid, dispatch]);

	const onCancel = useCallback(() => {

		api.navigation.navigate('ReasonCancellation', {
			uuid,
			role,
			carId,
		});

	}, [role, uuid, carId]);

	const rentDuration = useMemo(

		() => (
			(
				startDate && endDate
				&&
					Math.ceil(
						differenceInHours(
							fromUTCToLocalDate(endDate),
							fromUTCToLocalDate(startDate)
						) / 24
					)
			) || 0
		),
		[startDate, endDate]
	);

	const showContacts = useMemo(
		() =>
			role === 'HOST' &&
			(
				status === STATUSES.IN_PROGRESS ||
				status === STATUSES.APPROVED_BY_HOST ||
				status === STATUSES.AWAITS_HOST_APPROVAL
			),
		[role, status]
	);

	useEffect(() => {
		fetchUnavailableDates();
		dispatch(actions.rentRoomRequest(uuid, role));
	}, [uuid, role, dispatch, setUnavailableProlongationDates]);

	useEffect(() => {
		updateAvailabilityForRentProlongationCreate();
	}, [rent, car, availableForProlongationCreateRequest, unavailableProlongationDates])

	useEffect(() => () => dispatch(actions.rentRoomReset()), [dispatch]);

	const guestWaitWhenHostIsFinished = preRentalInspection.isGuestFinished;
	const hostWaitWhenGuestIsFinished = preRentalInspection.isHostFinished;

	const waitWhenInspectionIsFinished = role === "GUEST"
		? guestWaitWhenHostIsFinished
		: hostWaitWhenGuestIsFinished;

	const rentStartButtonTitle = useMemo(() => {
		if (waiter2) {
			return <Waiter size="small" />;
		}

		if (role === "GUEST" && preRentalInspection.isGuestFinished) {
			return 'Ожидаем владельца'
		}

		if (role === 'HOST' && preRentalInspection.isHostFinished) {
			return 'Ожидаем водителя'
		}

		return 'Начать аренду';
	}, [role, preRentalInspection]);

	const { contactRole, phone, email, message } = {
		contactRole: role === 'GUEST' ? 'Владелец' : 'Водитель',
		phone: contactDetails?.phone || null,
		email: contactDetails?.email || null,
		message:
			status === STATUSES.AWAITS_GUEST_SCORING_COMPLETION
				? role === 'HOST'
					? 'контакты водителя будут доступны после подтверждения аренды'
					: 'контакты владельца будут доступны после подтверждения аренды'
				: 'контакты недоступны',
	};

	const isElement = (role, status, element) => {
		return (
			rentRoomSettings[role] &&
			rentRoomSettings[role][status] &&
			rentRoomSettings[role][status][element]
		);
	};

	const updateAvailabilityForRentProlongationCreate = () => {
		if (!("startDate" in rent) || !unavailableProlongationDates) {
			setAvailableForProlongationCreateRequest(false);
			return;
		}

		const endDate = new Date(rent.endDate);

		if (!unavailableProlongationDates.length) {
			setAvailableForProlongationCreateRequest(true);
			return;
		}

		const nextDayBeforeEnd = addDays(endDate, 1).toLocaleDateString();
		const nextDayBeforeEndIsBlocked = unavailableProlongationDates.some(
			interval => new Date(interval.startDate).toLocaleDateString() === nextDayBeforeEnd
		);
		if (nextDayBeforeEndIsBlocked) {
			setAvailableForProlongationCreateRequest(false);
			return;
		}

		setAvailableForProlongationCreateRequest(true);
	}

	const allBillsTotal = bill
		? bill.reduce((sum, { total }) => {
				const newSum = sum + total;
				return newSum;
		  }, 0)
		: 0;

	const dailyMilageLimit = usageRestrictions?.milageLimits.day;
	const weeklyMilageLimit = usageRestrictions?.milageLimits.week;
	const monthlyMilageLimit = usageRestrictions?.milageLimits.month;

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

	const distancePackage = rent.services?.distancePackage;
	const kmQuantity = distancePackage?.kmQuantity || 0;

	const isRentInsured = carInsurance?.alreadyInsured || insuranceServiceChosen;

	const cascoCompensation = carInsurance?.carPrice > MAX_CASCO_COMPENSATION
		? MAX_CASCO_COMPENSATION
		: carInsurance?.carPrice;

	const fetchUnavailableDates = () => {
		api.web.getUnavailableProlongationDates({rentId: uuid}).then((data) => {
			setUnavailableProlongationDates(
				data.unavailableDates
					.map(item => {
						if ("props" in item) {
							return item.props;
						}

						return item;
					})
					.filter((interval) => !(
						new Date(interval.startDate).toLocaleDateString() === new Date(rent.startDate).toLocaleDateString() &&
						new Date(interval.endDate).toLocaleDateString() === new Date(rent.endDate).toLocaleDateString()
					))
			);
		});

	}

	const startRent = useCallback(rentId => {
		api.web
			.payForRent(rentId)
			.then(({ error }) => {

				if (error) {

					api.navigation.navigate('AttachFailed', {
						goBackTitle: 'К аренде',
						rentId,
						callback: () => {
							api.navigation.navigate('RentRoom', {
								uuid: rentId,
							});
						},
					});

					throw error;

				} else {
                    trackCarRentPay();
					api.navigation.navigate('AttachSuccess', {
						title: 'Аренда успешно оплачена',
						callback: () => {
							api.navigation.navigate('DefectsStainsStep', {
								uuid,
								role,
								isStart: true,
							});
						},
					});
				}
			})
			.finally(() => setWaiter2(false));
	}, []);

	const checkDriver = (guestId) => {

		try {

			setDriverReportData({})

			setWaiter2(true);

			api.web.checkDriver(guestId).then((data) => {

				if (data?.error) {
					throw error;
				} else {
					setDriverReportData(data)
				}
			});

		} catch {
			dispatch(
				actions.error(
					'Не удалось загрузить данные, попробуйте еще раз'
				)
			);
		} finally {
			setWaiter2(false);
		}
	};

	const handleSaveDates = () => {

		unavailableDatesModalizeRef?.current.close();

		try {

			dispatch(
				actions.postEditData(carId, {
					...carEditData,
					blockedDates: blockedDatesToUpdate,
				})
			);

		} catch (error) {

			Alert.alert(
				'',
				'Произошла ошибка, попробуйте обновить даты в разделе редактирования авто',
				[
					{
						text: 'Ок',
						style: 'cancel',
					},
				]
			);
		}
	};

	const handleChatFabPress = () => {

		const userToChatUser = () => {
			return {
				id: userUuid,
				name: firstName,
				photoUrl: avatar,
			};
		};

		const rentAndCarToConversationData = () => {

			const startDateFormatted = format(
				fromUTCToLocalDate(rent.startDate),
				'dd MMM, HH:mm',
				{
					locale: ru,
				}
			);

			const endDateFormatted = format(
				fromUTCToLocalDate(rent.endDate),
				'dd MMM, HH:mm',
				{
					locale: ru,
				}
			);

			return {
				id: role === 'HOST'
					? `${carId}-${profileId}-${userUuid}`
					: `${carId}-${userUuid}-${profileId}`,
				subject: `${brand} ${model} ${registrationNumber}`,
				custom: {
					rentId: uuid,
					carId: carId,
				}
			};
		}

		api.navigation.navigate(
			"Chat",
			{
				conversationData: rentAndCarToConversationData(),
				otherUser: userToChatUser(),
				withoutScreenLink: true,
			},
			true,
		);
	};

	const onProlongDatePickerChange = useCallback((date) => {
		setProlongationDateCreate(date.toISOString());
	}, []);

	const authorized = useSelector(st => st.profile.authorized);

	if (
		!(
			authorized &&
			(role === "GUEST" || role === "HOST" || role === "OBSERVER")
		)
	) {
		return <NotAvailableScreen />;
	}

	return (
		<SafeAreaView style={theme.styles.container}>
			<ScrollView
				style={theme.styles.container}
				ref={pageScrollViewRef}
				contentContainerStyle={theme.styles.grow}
				scrollEnabled={!waiter}
				refreshControl={
					<RefreshControl {...{ refreshing, onRefresh }} />
				}
			>
				{!!error && <Empty {...emptyProps} {...{ error }} />}
				{!(waiter || error) && (
					<React.Fragment>
						<Header
							big
							style={styles.header}
							title={brand + ' ' + model + ', ' + productionYear}
							onPressBack={() => onPressBack ? onPressBack() : api.navigation.navigate('Trips')}
						/>
						<View style={styles.content}>
							<StatusLine
								style={styles.statusLine}
								status={status}
							/>
							{(isInTime && isRentFinished) ||
							(status !== 'IN_PROGRESS' &&
								status !== 'FINISHED') ? null : (
								<RentInProgressCountDown
									timeLeft={timeLeft}
									isInTime={isInTime}
									isRentFinished={isRentFinished}
									role={role}
									sty
								/>
							)}
							{isReviewed && (
								<View style={styles.alertReviewed}>
									<TouchableOpacity
										style={styles.alertReviewedCloseBtn}
										onPress={() => setIsReviewed(false)}
									>
										<CloseIcon width={16} height={16} />
									</TouchableOpacity>
									<Text style={styles.alertReviewedText}>
										Ваш отзыв успешно отправлен! Спасибо за
										оценку
									</Text>
								</View>
							)}
							<AlertBlock
								style={styles.marginBottom20}
								role={role}
								status={status}
								rentId={uuid}
								hasReviewed={hasReviewed}
								openImportantMessageModal={
									openImportantMessageModal
								}
								onReviewed={() => setIsReviewed(true)}
							/>
							{(status === 'DECLINED_BY_HOST' ||
								status === "DECLINED_BY_GUEST") && (
								<View style={styles.decline}>
									<Text style={styles.declineTitle}>
										Причина отмены поездки
									</Text>
									<Text style={styles.declineText}>
										{rentDeclineComment}
									</Text>
								</View>
							)}
							<RentProlongation
								createProlongationDatePickerModalRef={createProlongationDatePickerModalRef}
								availableForProlongationCreateRequest={availableForProlongationCreateRequest}
								pageScrollViewRef={pageScrollViewRef}
								prolongationDateCreate={prolongationDateCreate}
								setProlongationDateCreate={setProlongationDateCreate}
								unavailableProlongationDates={unavailableProlongationDates}
							/>
							<View style={{ marginBottom: theme.normalize(40) }}>
								{!!isElement(
									role,
									status,
									"beginRentButton",
								) && (
									<PrimaryButton
										style={[
											styles.button,
											{ marginTop: theme.spacing(2) },
										]}
										title={rentStartButtonTitle}
										disabled={waitWhenInspectionIsFinished}
										onPress={() => {
											if (role === 'HOST') {
												api.navigation.navigate(
													isRentInsured
														? 'PreviewStep'
														: 'MilageFuelStep',
													{
														uuid,
														role,
														insured: isRentInsured,
														isStart: true,
													}
												);
											} else if (isPayed) {
												api.navigation.navigate(
													'DefectsStainsStep',
													{
														uuid,
														role,
														insured: isRentInsured,
														isStart: true,
													}
												);
											} else {
												!card
													? api.navigation.navigate(
															'ProfilePayments',
															{
																stage: 'ACCOUNT',
																rentId: uuid,
															},
															true
													  )
													: Alert.alert(
															'Сейчас произойдет списание денег с карты',
															'\nНачать аренду?',
															[
																{
																	text: 'Да',
																	onPress:
																		() => {
																			setWaiter2(
																				true
																			),
																				startRent(
																					rent.id
																				);
																		},
																},
																{
																	text: 'Отмена',
																	style: 'cancel',
																},
															]
													  );
											}
										}}
									/>
								)}
								{!!isElement(
									role,
									status,
									'cancelRentButton'
								) && (
									<PrimaryButton
										style={styles.button}
										outlined
										disabled={waitWhenInspectionIsFinished}
										title="Отменить аренду"
										onPress={onCancel}
									/>
								)}
								{!!isElement(
									role,
									status,
									'finishRentButton'
								) && (
									<PrimaryButton
										style={styles.button}
										outlined
										title="Завершить аренду"
										onPress={onRentFinish}
									/>
								)}
								{!!isElement(
									role,
									status,
									'approveRentButton'
								) && (
									<PrimaryButton
										style={[
											styles.button,
											{ marginTop: theme.spacing(2) },
										]}
										title="Подтвердить аренду"
										onPress={onApprove}
									/>
								)}
								{!!isElement(
									role,
									status,
									'rejectRentButton'
								) && (
									<PrimaryButton
										style={styles.button}
										outlined
										title="Отклонить аренду"
										onPress={onCancel}
									/>
								)}
								{role === 'HOST' &&
									!!isElement(
										role,
										status,
										'damageCompensateButton'
									) && (
										<PrimaryButton
											style={[
												styles.button,
												{ marginTop: theme.spacing(4) },
											]}
											title="Запросить возмещение"
											onPress={() =>
												api.navigation.navigate(
													'DamageCompensation',
													{
														rentId: rent.id,
														timeLeft,
														isInTime,
													}
												)
											}
										/>
									)}
							</View>
							{!isPayed &&
								card &&
								role === 'GUEST' &&
								(status === 'AWAITS_GUEST_SCORING_COMPLETION' ||
									status === 'AWAITS_HOST_APPROVAL' ||
									status === 'APPROVED_BY_HOST') && (
									<View style={styles.costWarning}>
										<Icon
											name="info"
											color={theme.colors.yellow}
											style={styles.icon}
											size={theme.normalize(20)}
										/>
										<Text style={styles.costWarningText}>
											{`Убедитесь, что на вашей карте *${card.slice(
												-4
											)} есть сумма ${Math.round(
												allBillsTotal
											)} руб. Она будет списана после начала аренды.`}
										</Text>
									</View>
								)}
							{role === 'HOST' &&
								labels &&
								labels.includes('SUPERGUEST') && (
									<View style={styles.costWarning}>
										<Icon
											name="info"
											color={theme.colors.yellow}
											style={styles.icon}
											size={theme.normalize(20)}
										/>
										<Text style={styles.costWarningText}>
											Getarent доверяет
											<TextButton
												title=" суперводителю "
												style={[
													styles.costWarningText,
													{
														color: theme.colors
															.blue,
													},
												]}
												onPress={() =>
													openSuperGuestModal()
												}
											/>
											{firstName} {lastName}. Передача
											автомобиля осуществляется без
											залога. В случае возникновения
											убытков, владелец получит возмещение
											напрямую от Getarent.
										</Text>
									</View>
								)}
							<OwnerContactCard
								style={{ marginBottom: theme.spacing(4) }}
								name={
									showContacts
										? lastName +
										  ' ' +
										  firstName +
										  ' ' +
										  midName
										: firstName
								}
								uuid={userUuid}
								avatar={avatar}
								phone={phone}
								email={email}
								firstName={firstName}
								lastName={lastName}
								rentStatus={status}
								birthDate={showContacts ? birthDate : null}
								role={contactRole}
								message={message}
								rating={userRating}
								rentsQty={rentsQty}
								reviews={hostCurrentCarReviews}
								reviewsQty={userReviewsQty}
								bestReview={bestReview}
							/>
							<PrimaryButton
								title={
									<View style={{ flexDirection: 'row' }}>
										<ChatIconWhite style={styles.chatIcon} />
										<Text style={styles.chatText}>
											Написать {`${role === 'HOST' ? 'водителю' : 'владельцу'}`}
										</Text>
									</View>
								}
								style={styles.chat}
								disabled={
									scoringStatus === STATUSES.IN_PROGRESS || 
									scoringStatus === STATUSES.REJECTED
								}
								onPress={handleChatFabPress}
							/>
							{role === 'HOST' && !!isScoringReportAvailable &&
								(
									status === STATUSES.IN_PROGRESS ||
									status === STATUSES.APPROVED_BY_HOST ||
									status === STATUSES.AWAITS_HOST_APPROVAL
								) && (
									<View style={styles.checkDriverBtn}>
										<PrimaryButton
											outlined
											title={
												waiter2 ? (
													<Waiter size="small" />
												) : (
													'Проверить водителя'
												)
											}
											onPress={() => checkDriver(userUuid)}
										/>
									</View>
								)
							}
							<PrimaryButton
								outlined
								style={{
									marginBottom: 16
								}}
								title={
									contentInfo.rentPhotosButtonName || "Фотографии аренды"
								}
								onPress={async () => {
									// todo Remove [rentRoomRequest] when image urls to be public
									//  and remove check refreshing in PsoPhotosView
									await dispatch(actions.rentRoomRequest(uuid, role, true));
									api.navigation.navigate(
										'PsoPhotosView',
									)
								}}
							/>
							{
								role === 'HOST'
								&&
									<>
										<DriverInfo
											title="Данные об основном водителе"
											data={{
												passportNumber,
												passportIssueDate,
												driversLicenseNumber,
												driversLicenseIssueDate,
												vin,
												rentId: uuid,
											}}
										/>
										{guestsGreetingMessage && (
											<View
												style={{
													marginBottom: theme.normalize(36),
												}}
											>
												<Text style={theme.styles.P1}>
													Cообщение от водителя
												</Text>
												<ReadMore
													style={theme.styles.P1R}
													numberOfLines={4}
												>
													{guestsGreetingMessage}
												</ReadMore>
											</View>
										)}
									</>
							}
							<CarRental
								style={{ marginBottom: theme.normalize(40) }}
								car={car}
								bill={bill}
								user={host || guest}
								startDate={startDate}
								endDate={endDate}
								rentDuration={rentDuration}
								carTransferLocation={carTransferLocation}
								distancePackage={distancePackage}
							/>
							<View>
								<View style={styles.rentConditions}>
									<Text style={styles.rentConditionsTitle}>
										Условия аренды
									</Text>
									<View style={styles.rentCondition}>
										<View
											style={[
												styles.rentConditionIcon,
												{
													marginLeft: 3,
													marginRight: 13,
												},
											]}
										>
											<ContractIcon
												width={28}
												height={28}
											/>
										</View>
										{!rentalAgreement ? (
											<Text style={theme.styles.P1R}>
												<TextButton
													style={styles.textButton}
													title="Договор аренды "
													onPress={() =>
														api.navigation.navigate(
															'DocumentPopup',
															{
																uri: 'https://storage.yandexcloud.net/getarent-documents-bucket/4a3531f263936f16.pdf',
															}
														)
													}
												/>
												заключен онлайн
											</Text>
										) : (
											<Text style={theme.styles.P1}>
												Необходимо подписать бумажный
												<TextButton
													style={styles.textButton}
													title=" Договор аренды"
													onPress={() => {
														if (
															Platform.OS ===
															'android'
														) {
															api.navigation.navigate(
																'DocumentPopup',
																{
																	uri: rentalAgreement,
																}
															);
														} else {
															let request =
																new XMLHttpRequest();

															request.open(
																'GET',
																`https://tinyurl.com/api-create.php?url=${rentalAgreement}`
															);
															request.send();

															request.onload =
																() => {
																	request.status ===
																	200
																		? api.navigation.navigate(
																				'DocumentPopup',
																				{
																					uri: request.response,
																				}
																		  )
																		: Alert.alert(
																				'',
																				'Невозможно загрузить договор, попробуйте позже'
																		  );
																};
														}
													}}
												/>
											</Text>
										)}
									</View>
									{pledge &&
										Object.keys(pledge).lentgh !== 0 && (
											<View style={styles.rentCondition}>
												<View
													style={
														styles.rentConditionIcon
													}
												>
													<DepositIcon
														width={32}
														height={32}
													/>
												</View>
												<Text style={theme.styles.P1}>
													Залог — {pledge.pledgePrice}{' '}
													₽ {''}
													<TouchableOpacity
														onPress={
															openDepositModal
														}
													>
														<Icon
															name="question"
															color={
																theme.colors
																	.blue
															}
															size={theme.normalize(
																16
															)}
														/>
													</TouchableOpacity>
												</Text>
											</View>
										)}
									<View style={styles.rentCondition}>
										<View style={styles.rentConditionIcon}>
											<InsuranceIcon
												width={32}
												height={32}
											/>
										</View>
										{isRentInsured ? (
											<View>
												<Text style={theme.styles.P1}>
													КАСКО включено
												</Text>
												<Text style={styles.helpText}>
													* Поездка застрахована от
													повреждений до{' '}
													{cascoCompensation
														.toLocaleString('en')
														.replace(
															/,/g,
															' '
														)}{' '}
													₽
												</Text>
											</View>
										) : (
											<View>
												<Text style={theme.styles.P1}>
													КАСКО не включено
												</Text>
												<Text style={styles.helpText}>
													* Водитель несет полную
													ответственность
												</Text>
											</View>
										)}
									</View>
									{usageRestrictions && (
										<View style={styles.rentCondition}>
											<View
												style={styles.rentConditionIcon}
											>
												<GeographyIcon
													width={32}
													height={32}
												/>
											</View>
											<Text style={theme.styles.P1}>
												{usageRestrictions.rentLocations ===
													'CITY' && 'Только в городе'}
												{usageRestrictions.rentLocations ===
													'WORLD' && (
													<>
														По всей стране {''}
														<Text
															style={
																theme.styles.P1R
															}
														>
															(по согласованию
															региона)
														</Text>
													</>
												)}
												{usageRestrictions.rentLocations ===
													'COUNTRY' && (
													<>
														По региону и области{' '}
														{''}
														<Text
															style={
																theme.styles.P1R
															}
														>
															(краю)
														</Text>
													</>
												)}
											</Text>
										</View>
									)}
									{!!mileageLimit && (
										<View style={styles.rentCondition}>
											<View
												style={styles.rentConditionIcon}
											>
												<KilometresIcon
													width={32}
													height={32}
												/>
											</View>
											<View>
												{kmQuantity === 'infinity' ? (
													<Text
														style={theme.styles.P1}
													>
														Неограниченный пробег
													</Text>
												) : (
													<>
														<Text
															style={
																theme.styles.P1
															}
														>
															{`Включено в поездку — ${
																mileageLimit +
																kmQuantity *
																	rentDuration
															} км`}
														</Text>
														{!!usageRestrictions.additionalKmPrice && (
															<Text
																style={
																	styles.helpText
																}
															>
																{`* Перерасход 1 км - ${usageRestrictions.additionalKmPrice}₽`}
															</Text>
														)}
													</>
												)}
											</View>
										</View>
									)}
									{!rent.services?.afterRentWashing && (
										<View style={styles.rentCondition}>
											<View
												style={styles.rentConditionIcon}
											>
												<WashingIcon
													width={32}
													height={32}
												/>
											</View>
											<View>
												<Text style={theme.styles.P1}>
													Мойка после аренды: {''}
													<Text
														style={theme.styles.P1R}
													>
														не оплачено
													</Text>
												</Text>
												<Text style={styles.helpText}>
													* Необходимо вернуть в
													чистом виде или купить
													услугу
												</Text>
											</View>
										</View>
									)}
									<View style={styles.rentCondition}>
										<View style={styles.rentConditionIcon}>
											<FuelIcon width={32} height={32} />
										</View>
										<View>
											<Text style={theme.styles.P1}>
												Необходимо вернуть автомобиль с
												тем же количеством топлива
											</Text>
										</View>
									</View>
								</View>
							</View>
							<TextButton
								style={styles.textButton}
								title="Правила отмены аренды"
								onPress={() =>
									Linking.openURL(
										role == 'GUEST'
											? 'https://help.getarent.ru/knowledge-bases/2/articles/19-otmena-bronirovaniya-arendatorom'
											: 'https://help.getarent.ru/knowledge-bases/2/articles/18-otmena-bronirovaniya-vladeltsem'
									)
								}
							/>
							<TextButton
								style={styles.textButton}
								title="ДТП, авария, неисправность машины"
								onPress={() =>
									Linking.openURL(
										'https://help.getarent.ru/knowledge-bases/2/articles/75-ya-popal-v-avariyu-povredil-avtomobil'
									)
								}
							/>
							<TextButton
								style={styles.textButton}
								title="Конфликт между водителем и владельцем"
								onPress={() =>
									Linking.openURL(
										'https://help.getarent.ru/knowledge-bases/2/articles/210-konflikt-mezhdu-voditelem-i-vladeltsem'
									)
								}
							/>
							<TextButton
								style={styles.textButton}
								title="Что входит в страховку, если она включена"
								onPress={() =>
									Linking.openURL(
										'https://help.getarent.ru/knowledge-bases/2/articles/204-chto-vhodit-v-strahovku'
									)
								}
							/>
							<TextButton
								style={styles.textButton}
								title="Продление аренды"
								onPress={() =>
									Linking.openURL(
										'https://help.getarent.ru/knowledge-bases/2/articles/44-upravlenie-arendoj-i-izmeneniyami'
									)
								}
							/>
							<TextButton
								style={styles.textButton}
								title="Дополнительные водители"
								onPress={() =>
									Linking.openURL(
										'https://help.getarent.ru/knowledge-bases/2/articles/61-dopolnitelnyie-voditeli'
									)
								}
							/>
							<TextButton
								style={styles.textButton}
								title="Изменения дат, времени и услуг в аренде"
								onPress={() =>
									Linking.openURL(
										"https://help.getarent.ru/knowledge-bases/2/articles/63-izmenenie-arendyi",
									)
								}
							/>
						</View>
					</React.Fragment>
				)}
				{(waiter || waiter2) && <Waiter />}
			</ScrollView>
			<ProlongDatePickerModal
				modalizeRef={createProlongationDatePickerModalRef}
				prolongationDateCreate={prolongationDateCreate ? new Date(prolongationDateCreate) : null}
				unavailableProlongationDates={unavailableProlongationDates}
				onDateChange={onProlongDatePickerChange}
				onContinue={() => {
					createProlongationDatePickerModalRef.current?.close();
					// check if date valid min rent date
				}}
			/>
			<Modalize
				ref={modalizeRef}
				snapPoint={HEIGHT / 1.1}
				modalHeight={HEIGHT / 1.1}
			>
				<View style={styles.modal}>
					<Text style={styles.modalTitle}>Важное сообщение</Text>
					<Text style={styles.modalText}>
						При любом повреждении автомобиля (ДТП, наезд на
						препятствие, повреждение третьими лицами и т.д.)
						необходимо вызвать сотрудников полиции для оформления
						события и получения справки ГИБДД, подтверждающую факт
						происшествия (с указанием обстоятельств происшествия) и
						содержащую перечень повреждений.
					</Text>
					<Text style={styles.modalText}>
						Если Водитель не сообщит о происшествии Владельцу и
						сотрудникам Getarent, а также не предоставит
						соответствующую справку по окончанию аренды, то он будет
						нести ответственность на полную стоимость ущерба и все
						ремонтные и восстановительные работы будет оплачивать за
						свой счет.
					</Text>
					<Text
						style={[
							styles.modalText,
							{ marginBottom: theme.spacing(10) },
						]}
					>
						Подробнее о
						<TextButton
							style={styles.textButton}
							title=" страховании и ответственности водителя"
							onPress={() =>
								Linking.openURL(
									'https://help.getarent.ru/ru/knowledge-bases/2/articles/75-ya-popal-v-avariyu-povredil-avtomobil'
								)
							}
						/>
					</Text>
					<PrimaryButton
						title="Спасибо, понятно"
						onPress={() => modalizeRef?.current.close()}
					/>
				</View>
			</Modalize>
			<DepositPopup
				modalRef={depositModalRef}
				pledge={pledge}
				rentalAgreement={rentalAgreement}
			/>
			<DriverReport
				data={driverReportData}
				driverAvatar={guest.avatar}
				driverCreatedAt={guest.createdAt}
				name={`${firstName} ${lastName}`}
				visible={Object.keys(driverReportData).length !== 0}
			/>
			<Modalize
				ref={superGuestModalizeRef}
				adjustToContentHeight
				snapPoint={HEIGHT / 3}
			>
				<View style={[styles.modal, { paddingVertical: 20 }]}>
					<Text style={styles.modalText}>
						Суперводитель - это проверенный и надёжный арендатор в
						сообществе. Такие пользователи арендуют машины на
						Getarent без залога. Для партнёра Getarent - вам не
						нужно брать залоги у таких арендаторов, Getarent возьмет
						на себя компенсацию возможных убытков в рамках
						установленного вами залога.
					</Text>
				</View>
			</Modalize>
			{
				!!carEditData.unavailabilityDates
				&&
					<Modalize
						ref={unavailableDatesModalizeRef}
						snapPoint={HEIGHT / 1.1}
						modalHeight={HEIGHT / 1.1}
					>
						<View style={styles.modal}>
							<Text style={[theme.styles.P1, { marginBottom: 15 }]}>
								Пожалуйста, выберите недоступные даты для аренды
							</Text>
							<AvailabilityCalendar
								style={{ marginBottom: 15 }}
								unavailabilityDates={carEditData.unavailabilityDates}
								initiallyBlockedDates={carEditData.unavailabilityDates.blocked}
								onUpdateBlockedDates={setBlockedDatesToUpdate}
							/>
							<PrimaryButton
								title="Сохранить"
								onPress={handleSaveDates}
							/>
						</View>
					</Modalize>
			}
		</SafeAreaView>
	);
};

export default RentRoom;

const styles = StyleSheet.create({
	header: {
		paddingBottom: theme.spacing(1),
	},
	button: {
		marginBottom: theme.spacing(4),
	},
	checkmark: {
		marginRight: theme.spacing(3),
		marginTop: theme.spacing(2),
	},
	content: {
		flex: 1,
		marginHorizontal: theme.spacing(6),
		paddingBottom: theme.spacing(40),
	},
	restrictions: {
		paddingTop: 0,
		paddingHorizontal: 0,
		paddingBottom: 0,
	},
	restrictionsTitle: {
		...theme.styles.P1,
	},
	listRow: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
	},
	marginBottom20: {
		marginBottom: theme.spacing(5),
	},
	statusLine: {
		marginBottom: theme.spacing(4),
		marginLeft: theme.spacing(8),
	},
	textButton: {
		...theme.styles.P1R,
		color: theme.colors.blue,
		marginBottom: theme.spacing(1),
	},
	fineInfoButton: {
		...theme.styles.XS,
		fontWeight: '400',
		color: theme.colors.blue,
		marginBottom: theme.spacing(6),
	},
	questions: {
		...theme.styles.P1,
		marginBottom: theme.spacing(1.5),
	},
	reviews: {
		paddingHorizontal: 0,
	},
	ratingReviewsBarBottom: {
		marginBottom: theme.spacing(6),
		marginTop: theme.spacing(1),
	},
	alertReviewed: {
		borderWidth: theme.normalize(1),
		borderRadius: theme.normalize(4),
		borderStyle: 'dotted',
		borderColor: theme.colors.midBlue,
		backgroundColor: theme.colors.lightBlue,
		paddingHorizontal: theme.spacing(5),
		paddingVertical: theme.spacing(3),
		marginBottom: theme.spacing(4),
	},
	alertReviewedText: {
		...theme.styles.P1R,
		color: theme.colors.darkGrey,
	},
	alertReviewedCloseBtn: {
		position: 'absolute',
		top: 8,
		right: 8,
	},
	bordered: {
		borderColor: theme.colors.yellow,
		borderRadius: theme.normalize(4),
		borderWidth: theme.normalize(1),
		flexDirection: 'column',
		alignItems: 'center',
		padding: theme.spacing(3),
	},
	rentConditions: {
		marginBottom: theme.normalize(36),
		marginRight: 33,
	},
	rentConditionsTitle: {
		...theme.styles.P1,
		marginBottom: theme.spacing(4),
	},
	rentCondition: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: theme.spacing(4),
	},
	rentConditionIcon: {
		marginRight: theme.spacing(3),
	},
	helpText: {
		...theme.styles.note,
		color: theme.colors.darkGrey,
	},
	modal: {
		paddingHorizontal: theme.spacing(6),
		paddingVertical: theme.spacing(10),
	},
	modalTitle: {
		...theme.styles.H4,
		fontWeight: '700',
		marginBottom: theme.spacing(4),
	},
	modalText: {
		...theme.styles.P2R,
		fontSize: 14,
		lineHeight: 22,
		marginBottom: theme.spacing(4),
	},
	decline: {
		marginBottom: theme.spacing(4),
		marginTop: theme.spacing(4),
	},
	declineTitle: {
		...theme.styles.P1_22,
		marginBottom: theme.spacing(3),
	},
	declineText: {
		...theme.styles.P1R,
		color: theme.colors.darkGrey,
	},
	costWarning: {
		flexDirection: 'row',
		shadowColor: 'rgb(36, 93, 150)',
		shadowOffset: {
			width: 0,
			height: 4,
		},
		shadowOpacity: 0.15,
		shadowRadius: 8,
		elevation: 6,
		backgroundColor: 'white',
		borderRadius: 5,
		marginBottom: 60,
		paddingVertical: 10,
		paddingHorizontal: 12,
	},
	costWarningText: {
		color: '#5D5D5D',
		fontSize: 14,
		lineHeight: 20,
		flexShrink: 1,
	},
	icon: {
		marginRight: 8,
	},
	checkDriverBtn: {
		marginBottom: theme.spacing(4),
	},
	chat: {
		marginBottom: 15,
		backgroundColor: theme.colors.green
	},
	chatIcon: {
		top: 3,
		marginRight: 7,
	},
	chatText: {
		...theme.styles.src.P1,
		color: theme.colors.white,
		fontWeight: 'bold',
	},
});
