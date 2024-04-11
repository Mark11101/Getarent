import {
	View,
	Text,
	Linking,
	Platform,
	ScrollView,
	Dimensions,
	SafeAreaView,
	TouchableOpacity,
	KeyboardAvoidingView,
} from 'react-native';
import { Formik } from 'formik';
import { includes } from 'ramda';
import { Modalize } from 'react-native-modalize';
import { useDispatch, useSelector } from 'react-redux';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import React, { useState, useEffect, useRef } from 'react';
import { checkNotifications } from 'react-native-permissions';

import {
	Icon,
	Header,
	Waiter,
	Switch,
	Select,
	Thumbnail,
	TextButton,
	RadioButton,
	PhotoLoader,
	FormikInput,
	LocationBar,
	FormikSelect,
	AccordionView,
	PrimaryButton,
	HorizontalFilter,
	Input as InputComponent,
} from 'components';
import {
	carStatuses,
	carDurations,
	daysDiscounts,
	distancePackagesData,
} from 'constants';
import api from 'api';
import actions from 'actions';
import { callNotifAlert } from '../../functions';
import { carIncludedFeatures } from 'constants';
import carEditValidationSchema from './validationSchema';

import s from './styles';
import theme from 'theme';

const HEIGHT = Dimensions.get('window').height;

const {
	colors,
	statuses: { PUBLISHED, RENT, STASHED },
} = carStatuses;

const EDIT_SECTIONS = {
	KASKO: 'KASKO',
	PHOTOS: 'PHOTOS',
	SERVICES: 'SERVICES',
	RENT_RULES: 'RENT_RULES',
	DESCRIPTION: 'DESCRIPTION',
	PRICES_AND_DISCOUNTS: 'PRICES_AND_DISCOUNTS',
};

const tabs = [
	{
		label: 'Фотографии',
		value: EDIT_SECTIONS.PHOTOS,
	},
	{
		label: 'Адрес, описание и комплектация',
		value: EDIT_SECTIONS.DESCRIPTION,
	},
	{
		label: 'Цены и скидки',
		value: EDIT_SECTIONS.PRICES_AND_DISCOUNTS,
	},
	{
		label: 'Страхование КАСКО',
		value: EDIT_SECTIONS.KASKO,
	},
	{
		label: 'Правила аренды',
		value: EDIT_SECTIONS.RENT_RULES,
	},
	{
		label: 'Услуги',
		value: EDIT_SECTIONS.SERVICES,
	},
];

const CarEdit = ({
	route: {
		params: { carId, onPressBack },
	},
}) => {

	const isLoading = useSelector(st => st.profile.loading);
	const editError = useSelector(st => st.profile.editError);
	const carEditData = useSelector(st => st.profile.carEditData);
	const blockedDates = useSelector(st => st.profile.blockedDates);

	const [tab, setTab] = useState(tabs[0]);

	// validation

	const [isPledgePriceError, setIsPledgePriceError] = useState(false);
	const [isPledgeMaxTermError, setIsPledgeMaxTermError] = useState(false);

	const [noPhotosError, setNoPhotosError] = useState(false);

	const [isRentPricePerDayError, setIsRentPricePerDayError] = useState(false);
	const [isDailyMilageLimitError, setIsDailyMilageLimitError] = useState(false);
	const [isWeeklyMilageLimitError, setIsWeeklyMilageLimitError] = useState(false);
	const [isMonthlyMilageLimitError, setIsMonthlyMilageLimitError] = useState(false);

	const [isDriversAgeError, setIsDriversAgeError] = useState(false);
	const [isDrivingExperienceError, setIssDrivingExperienceError] = useState(false);

	/////////////

	const [address, setAddress] = useState(null);
	const [isAddressError, setIsAddressError] = useState();

	const [withPledge, setWithPledge] = useState(
		!!carEditData?.pledgePrice || !!carEditData?.pledgeMaxTerm
	);

	const [status, setStatus] = useState({
		active: false,
		text: '',
	});

	const [errorTabs, setErrorTabs] = useState({
		PRICES_AND_DISCOUNTS: false,
		RENT_RULES: false,
		DESCRIPTION: false,
	});

	const [withInsurance, setWithInsurance] = useState(false);

	const [radiusesOptions, setRadusesOptions] = useState([]);

	const pricesScrollViewRef = useRef();
	const servicesScrollViewRef = useRef();

	const dispatch = useDispatch();

	useEffect(() => {
		checkNotifications().then(({ status }) => {
			status !== 'granted' && callNotifAlert();
			dispatch(actions.setNotificationsPermissionStatus(status));
		});
	}, []); 

	useEffect(() => {
		dispatch(actions.getCarEditData(carId, true));
	}, [dispatch, carId]);

	useEffect(() => {

		if (!!carEditData?.pledgePrice || !!carEditData?.pledgeMaxTerm) {
			setWithPledge(true);
		} else {
			setWithPledge(false);
		}

	}, [carEditData.pledgePrice, carEditData.pledgeMaxTerm]);

	useEffect(() => {

		setStatus({
			active: includes(carEditData.status, [PUBLISHED, RENT]),
			text: carStatuses.names[carEditData.status],
		});

	}, [carEditData.status]);

	useEffect(() => {

		carEditData?.unavailabilityDates?.blocked 
		&&
			dispatch(
				actions.updateBlockedDurations(
					carEditData.unavailabilityDates.blocked
				)
			);

	}, [carEditData.unavailabilityDates]);

	useEffect(() => {

		carEditData?.location?.address 
		&&
			setAddress({
				name: carEditData.location.city.name,
				address: carEditData.location.address,
				index: carEditData.location.city.index,
				location: {
					lat: carEditData.location.latitude,
					lon: carEditData.location.longitude,
				},
			});

		return () => setAddress(null);

	}, [carEditData.location]);

	useEffect(() => {

		if (editError && Object.keys(editError) !== 0) {

			dispatch(actions.error('Попробуйте еще раз'));
			dispatch(actions.resetEditError());

		} else if (editError === false) {
			// api.navigation.goBack();
		}

	}, [editError]);

	useEffect(() => {

		if (carEditData.uuid) {
			dispatch(actions.getInsurance(carEditData.uuid));
			dispatch(actions.getCarPhotosList(carEditData.uuid));
		};

	}, [carEditData.uuid]);

	useEffect(() => {

		carEditData.insurance 
		&&
			setWithInsurance(carEditData.insurance.insured);
			
	}, [carEditData.insurance]);

	useEffect(() => {
		api.web.getRadiuses().then(res => setRadusesOptions(res));
	}, []);

	const modalizeRef = useRef(null);

	const onOpenModalReview = () => {
		modalizeRef.current?.open();
	};

	const handleChangeOnSearch = (isChecked, carId) => {
		isChecked
			? dispatch(actions.publishCar(carId))
			: dispatch(actions.unpublishCar(carId));
	};

	const toggleInsurance = (isInsured) => {

		setWithInsurance(isInsured);
		dispatch(actions.toggleInsurance(carId, isInsured));
	};

	const insurance = carEditData.insurance;

	const Input = ({
		name,
		value,
		title,
		error,
		style,
		notice,
		onBlur,
		multiline,
		titleStyle,
		onChangeText,
		keyboardType,
		defaultValue,
		numberOfLines,
		placeholder = '',
	}) => (

		<View style={style}>
			<Text
				style={[
					s.label,
					titleStyle,
					{ marginBottom: theme.spacing(2) },
					typeof notice === 'string' && {
						marginBottom: theme.spacing(-2),
					},
				]}
			>
				{title}
			</Text>
			<FormikInput
				name={name}
				value={value}
				error={error}
				notice={notice}
				onBlur={onBlur}
				multiline={multiline}
				defaultValue={defaultValue}
				numberOfLine={numberOfLines}
				inputStyle={[s.input, multiline && s.textField]}
				borderColor="#979797"
				placeholder={placeholder}
				keyboardType={keyboardType}
				style={{ marginBottom: -8 }}
				onChangeText={value =>
					onChangeText(
						keyboardType === 'numeric'
							? value.replace(/[^\d]/g, '')
							: value
					)
				}
			/>
		</View>
	);

	const SubmitBtn = ({
		title,
		values,
		actionType,
		handleSubmit,
		setFieldValue,
	}) => (

		<PrimaryButton
			type="submit"
			disabled={isLoading}
			title={isLoading ? <Waiter /> : title}
			onPress={() => {
				const isPhotosError = carEditData.photos.length === 0;

				const isPricesAndDiscountsError =
					!values.rentPricePerDay ||
					!values.dailyMilageLimit ||
					!values.weeklyMilageLimit ||
					!values.monthlyMilageLimit;

				const isRentRulesError =
					!values.driversAge ||
					!values.drivingExperience ||
					(
						withPledge 
						&&
							(!values.pledgePrice || !values.pledgeMaxTerm)
					);

				const isDescriptionError = !values.location.address;

				setErrorTabs({
					PHOTOS: isPhotosError,
					RENT_RULES: isRentRulesError,
					DESCRIPTION: isDescriptionError,
					PRICES_AND_DISCOUNTS: isPricesAndDiscountsError,
				});

				// photos validation
				if (isPhotosError) {
					setNoPhotosError(true);
				} else {
					setNoPhotosError(false);
				}

				// description validation
				if (isDescriptionError) {
					setIsAddressError(true);
				}

				// prices and discounts validation
				if (!values.rentPricePerDay) {
					setIsRentPricePerDayError(true);
				}

				if (!values.dailyMilageLimit) {
					setIsDailyMilageLimitError(true);
				}

				if (!values.weeklyMilageLimit) {
					setIsWeeklyMilageLimitError(true);
				}

				if (!values.monthlyMilageLimit) {
					setIsMonthlyMilageLimitError(true);
				}

				// rent rules validation
				if (withPledge) {

					if (!values.pledgePrice) {
						setIsPledgePriceError(true);
					}

					if (!values.pledgeMaxTerm) {
						setIsPledgeMaxTermError(true);
					}
				}

				if (!values.driversAge) {
					setIsDriversAgeError(true);
				}

				if (!values.drivingExperience) {
					setIssDrivingExperienceError(true);
				}

				setFieldValue('action', actionType, false);

				if (
					!isPhotosError &&
					!isPricesAndDiscountsError &&
					!isRentRulesError &&
					!isDescriptionError
				) {
					handleSubmit();
				}
			}}
		/>
	);

	const Accordion = ({ title, children }) => {

		return (
			<AccordionView
				title={
					<Text style={s.accordionTitle}>
						{title}
					</Text>
				}
				style={s.accordion}
			>
				{children}
			</AccordionView>
		);
	};

	const DeliveryCheckbox = ({ place, onChangePrice }) => {

		const [checked, setChecked] = useState(!!place.price);

		return (
			<View key={place.id}>
				<BouncyCheckbox
					text={place.name}
					style={s.checkbox}
					isChecked={checked}
					fillColor={theme.colors.blue}
					innerIconStyle={{
						borderRadius: 10,
					}}
					textStyle={[
						theme.styles.P1_5,
						{ marginLeft: -5, textDecorationLine: 'none' },
					]}
					onPress={() => {
						checked && onChangePrice(null);
						setChecked(!checked);
					}}
				/>
				{
					checked 
					&&
						<InputComponent
							keyboardType="numeric"
							placeholder="Например, 1000 (₽)"
							onChangeText={onChangePrice}
							value={place.price?.toString() || ''}
							style={{
								marginTop: 7,
								marginBottom: 20,
							}}
							inputStyle={{
								padding: 0,
							}}
						/>
				}
			</View>
		);
	};

	const DeliveryRadiuses = ({ radiuses, onDeleteRadius, onAddRadius }) => {

		const [inputPrice, setInputPrice] = useState();
		const [radiusesToAdd, setRadiusesToAdd] = useState();
		const [selectedRadius, setSelectedRadius] = useState();

		const [isAddRadiusVisible, setIsAddRadiusVisible] = useState(false);

		const isSaveBtnDisabled = !inputPrice || !selectedRadius;

		useEffect(() => {

			const filteredRadiuses = radiusesOptions.filter(
				option => !radiuses.find(radius => radius.radius_id === option.id)
			);

			setRadiusesToAdd(
				filteredRadiuses.map(option => ({
					label: option.text,
					value: option.id,
				}))
			);

		}, [radiuses]);

		const resetSelectAndInput = () => {

			setSelectedRadius();
			setInputPrice();
		};

		return (
			<>
				<View style={{ marginBottom: 7 }}>
					{radiusesOptions.map((option) => {

						const findedRadius = radiuses.find(
							(radius) => radius.radius_id === option.id
						);

						if (findedRadius) {

							return (
								<View
									key={option.radius_id}
									style={s.deliveryRadius}
								>
									<Text style={s.deliveryRadiusText}>
										до {option.text} - {findedRadius.price}{' '}
										₽
									</Text>
									<TouchableOpacity
										onPress={() =>
											onDeleteRadius(
												findedRadius.radius_id
											)
										}
									>
										<Text
											style={[
												s.deliveryRadiusText,
												s.deliveryRadiusDeleteBtn,
											]}
										>
											x
										</Text>
									</TouchableOpacity>
								</View>
							);
						}
					})}
				</View>
				{isAddRadiusVisible ? (
					<>
						<Text style={s.label}>
							Выберите радиус
						</Text>
						<Select
							value={selectedRadius}
							options={radiusesToAdd}
							style={{ marginBottom: 0 }}
							onChange={value => setSelectedRadius(value)}
						/>
						<Text style={s.label}>
							Установите цену
						</Text>
						<InputComponent
							value={inputPrice}
							keyboardType="numeric"
							onChangeText={setInputPrice}
							style={{
								marginBottom: 20,
							}}
							inputStyle={{
								height: theme.normalize(38),
								padding: 0,
							}}
						/>
						<View style={[s.row, { marginBottom: 20 }]}>
							<TouchableOpacity
								onPress={() => {
									setIsAddRadiusVisible(false);
									resetSelectAndInput();
								}}
							>
								<Text
									style={[
										s.deliveryRadiusText,
										{ marginRight: 10 },
									]}
								>
									Отмена
								</Text>
							</TouchableOpacity>
							<TouchableOpacity
								onPress={() => {
									onAddRadius(selectedRadius, inputPrice);
									setIsAddRadiusVisible(false);
									resetSelectAndInput();
								}}
								disabled={isSaveBtnDisabled}
							>
								<Text
									style={[
										s.deliveryRadiusBlueBtn,
										isSaveBtnDisabled && {
											color: theme.colors.darkGrey,
										},
									]}
								>
									Сохранить
								</Text>
							</TouchableOpacity>
						</View>
					</>
				) : (
					<TouchableOpacity
						onPress={() => {
							setIsAddRadiusVisible(true);

							setTimeout(() => {
								servicesScrollViewRef.current.scrollToEnd({
									animated: true,
								});
							}, 0);
						}}
					>
						<Text style={s.deliveryRadiusBlueBtn}>
							+ Добавить радиус
						</Text>
					</TouchableOpacity>
				)}
			</>
		);
	};

	const AddDaysDiscounts = ({ values, onAddDiscount }) => {

		const [selectedPeriod, setSelectedPeriod] = useState();
		const [inputDiscount, setInputDiscount] = useState();

		const [isAddDiscountVisible, setIsAddDiscountVisible] = useState(false);

		const isSaveBtnDisabled = !inputDiscount || !selectedPeriod;

		const discounts = daysDiscounts.filter(
			discount => values[discount.value] === null && discount
		);

		const resetSelectAndInput = () => {
			setSelectedPeriod();
			setInputDiscount();
		};

		return (
			discounts.length !== 0 
			&&
				<>
					{
						!isAddDiscountVisible 
						?
							<TouchableOpacity
								onPress={() => {
									setIsAddDiscountVisible(true);
								}}
							>
								<Text style={s.deliveryRadiusBlueBtn}>
									+ Добавить скидку
								</Text>
							</TouchableOpacity>
						:
							<>
								<Text style={s.label}>
									Укажите период
								</Text>
								<Select
									options={discounts}
									value={selectedPeriod}
									style={{ marginBottom: 10 }}
									onChange={value => setSelectedPeriod(value)}
								/>
								<Text style={s.label}>
									Размер скидки, %
								</Text>
								<InputComponent
									value={inputDiscount}
									keyboardType="numeric"
									onChangeText={setInputDiscount}
									style={{
										marginBottom: 20,
									}}
									inputStyle={{
										height: theme.normalize(38),
										padding: 0,
									}}
								/>
								<View style={[s.row, { marginBottom: 20 }]}>
									<TouchableOpacity
										onPress={() => {
											setIsAddDiscountVisible(false);
											resetSelectAndInput();
										}}
									>
										<Text
											style={[
												s.deliveryRadiusText,
												{ marginRight: 10 },
											]}
										>
											Отмена
										</Text>
									</TouchableOpacity>
									<TouchableOpacity
										onPress={() => {
											onAddDiscount(
												selectedPeriod,
												inputDiscount
											);
											setIsAddDiscountVisible(false);
											resetSelectAndInput();
										}}
										disabled={isSaveBtnDisabled}
									>
										<Text
											style={[
												s.deliveryRadiusBlueBtn,
												isSaveBtnDisabled && {
													color: theme.colors.darkGrey,
												},
											]}
										>
											Сохранить
										</Text>
									</TouchableOpacity>
								</View>
							</>
					}
				</>
		);
	};

	const AddDistancePackage = ({ distancePackages, onAddPackage }) => {

		const [inputPrice, setInputPrice] = useState();
		const [selectedDistance, setSelectedDistance] = useState();

		const [isAddPackageVisible, setIsAddPackageVisible] = useState(false);

		const isSaveBtnDisabled = !inputPrice || !selectedDistance;

		const options = Object.keys(distancePackagesData).map(
			
			(constDistancePackage) => {

				if (
					!distancePackages.find((distancePackage) => (
						distancePackage.kmQuantity.toString() ===
						constDistancePackage
					))
				) {

					const constPackage = distancePackagesData[constDistancePackage];

					return {
						value: constDistancePackage,
						label: constPackage.labelForAdd,
					};
				}
			}
		);

		const filteredOptions = options.filter(option => option !== undefined);

		const resetSelectAndInput = () => {
			setSelectedDistance();
			setInputPrice();
		};

		return (
			filteredOptions.length !== 0 
			&&
				<View style={{ marginTop: 15 }}>
					{
						!isAddPackageVisible 
						?
							<TouchableOpacity
								onPress={() => {
									setIsAddPackageVisible(true);

									setTimeout(() => {
										pricesScrollViewRef.current.scrollToEnd({
											animated: true,
										});
									}, 0);
								}}
							>
								<Text style={s.deliveryRadiusBlueBtn}>
									+ Добавить пакет километров
								</Text>
							</TouchableOpacity>
						:
							<>
								<Text style={s.label}>
									Укажите расстояние
								</Text>
								<Select
									value={selectedDistance}
									options={filteredOptions}
									style={{ marginBottom: 10 }}
									onChange={value => setSelectedDistance(value)}
								/>
								<Text style={s.label}>
									Установите цену
								</Text>
								<InputComponent
									value={inputPrice}
									keyboardType="numeric"
									onChangeText={setInputPrice}
									style={{
										marginBottom: 20,
									}}
									inputStyle={{
										height: theme.normalize(38),
										padding: 0,
									}}
								/>
								<View style={[s.row, { marginBottom: 20 }]}>
									<TouchableOpacity
										onPress={() => {
											setIsAddPackageVisible(false);
											resetSelectAndInput();
										}}
									>
										<Text
											style={[
												s.deliveryRadiusText,
												{ marginRight: 10 },
											]}
										>
											Отмена
										</Text>
									</TouchableOpacity>
									<TouchableOpacity
										onPress={() => {
											onAddPackage(
												selectedDistance,
												inputPrice
											);
											setIsAddPackageVisible(false);
											resetSelectAndInput();
										}}
										disabled={isSaveBtnDisabled}
									>
										<Text
											style={[
												s.deliveryRadiusBlueBtn,
												isSaveBtnDisabled && {
													color: theme.colors.darkGrey,
												},
											]}
										>
											Сохранить
										</Text>
									</TouchableOpacity>
								</View>
							</>
					}
				</View>
		);
	};

	const DiscountInput = ({
		name,
		title,
		value,
		placeholder,
		setFieldValue,
	}) => {

		return (
			<View style={s.discount}>
				<Input
					name={name}
					value={value}
					title={title}
					keyboardType="numeric"
					style={{ width: '94%' }}
					placeholder={placeholder}
					onChangeText={value => setFieldValue(name, value)}
				/>
				<TouchableOpacity
					style={{ width: '6%' }}
					onPress={() => {
						setFieldValue(name, null);
					}}
				>
					<Text
						style={[
							theme.styles.H4R,
							s.discountDeleteBtn,
							s.deliveryRadiusDeleteBtn,
						]}
					>
						x
					</Text>
				</TouchableOpacity>
			</View>
		);
	};

	const isEditDataLoading = Object.keys(carEditData).length === 0 || carId !== carEditData.uuid;

	return (
		<SafeAreaView style={[theme.styles.paper, theme.styles.flex]}>
			{isEditDataLoading ? (
				<Waiter />
			) : (
				<>
					<Header
						title={
							<View style={s.header}>
								<View>
									<Text style={s.headerTitle}>
										{carEditData.brand} {carEditData.model}
									</Text>
									<View style={s.status}>
										<View
											style={[
												s.statusIcon,
												{
													backgroundColor:
														colors[
															carEditData.status
														],
												},
											]}
										/>
										<Text style={theme.styles.src.P3R}>
											{status.text}
										</Text>
									</View>
								</View>
								{
									carEditData.status !== 'NOT_VERIFIED'
									&&
										<View style={s.switch}>
											<Switch
												value={status.active}
												onChange={value =>
													handleChangeOnSearch(value, carId)
												}
												disabled={
													!includes(carEditData.status, [
														STASHED,
														PUBLISHED,
													])
												}
											/>
										</View>
								}
							</View>
						}
						onPressBack={onPressBack}
					/>
					<Formik
						enableReinitialize
						initialValues={carEditData}
						validationSchema={carEditValidationSchema}
						onSubmit={values => {

							const data = {
								...values,
								twoDaysDiscount: values.twoDaysDiscount || 0,
								threeDaysDiscount: values.threeDaysDiscount || 0,
								fiveDaysDiscount: values.fiveDaysDiscount || 0,
								weekDiscount: values.weekDiscount || 0,
								twoWeeksDiscount: values.twoWeeksDiscount || 0,
								monthDiscount: values.monthDiscount || 0,
								distancePackages: values.distancePackages.filter(
									(distancePackage) => distancePackage.price !== ''
								),
								driversAge: Number(values.driversAge),
								rentPricePerDay: Number(values.rentPricePerDay),
								driversMaxTerm: Number(values.driversMaxTerm),
								blockedDates,
								delivery: {
									...values.delivery,
									popularPlaces:
										values.delivery.popularPlaces.filter(
											vl => vl.name !== ''
										),
								},
							};

							const sendData = (actionType) => {
								
								switch (actionType) {

									case 'save':
										dispatch(
											actions.postEditData(carId, data)
										);
										break;

									case 'verificate':
										dispatch(
											actions.startVerification(
												carId,
												data
											)
										);
										break;

									default:
										console.log(
											`${actionType} not in submit scope`
										);
								}
							};
							
							sendData(values.action);
						}}
					>
						{({
							values,
							handleSubmit,
							setFieldValue,
							setFieldError,
						}) => (
							<>
								<HorizontalFilter
									style={s.filter}
									onPress={setTab}
									errors={errorTabs}
									activeFilter={tab}
									contentContainerStyle={s.filterContent}
									{...{ filters: tabs }}
								/>
								<KeyboardAvoidingView
									style={{ flex: 1 }}
									behavior={
										Platform.OS === 'ios'
											? 'padding'
											: 'height'
									}
								>
									{
										tab.value === EDIT_SECTIONS.PRICES_AND_DISCOUNTS 
										&&
											<ScrollView
												style={s.content}
												ref={pricesScrollViewRef}
											>
												<View style={s.section}>
													<Text style={s.title}>
														Установите длительность
														аренды
													</Text>
													<Text style={s.helpText}>
														Определите максимальную и
														минимальную длительность
														аренды машины
													</Text>
													<Text
														style={[
															s.label,
															{ marginBottom: theme.spacing(2) },
														]}
													>
														Минимальная длительность
													</Text>
													<FormikSelect
														type="select"
														style={s.select}
														name="minRentDays"
														value={carDurations.minRent[values.minRentDays]}
														options={Object.keys(carDurations.minRent).map(obj => ({
															label: carDurations.minRent[obj].label,
															value: carDurations.minRent[obj].value,
														}))}
													/>
													<Text
														style={[
															s.label,
															{ marginBottom: theme.spacing(2) },
														]}
													>
														Максимальная длительность
													</Text>
													<FormikSelect
														type="select"
														style={s.select}
														name="maxRentDays"
														value={carDurations.maxRent[values.maxRentDays]}
														options={Object.keys(carDurations.maxRent)
															.filter(
																(obj) => (
																	carDurations.maxRent[obj]?.weight > 
																	carDurations.minRent[values.minRentDays]?.weight
																)
															)
															.map(obj => ({
																label: carDurations.maxRent[obj].label,
																value: carDurations.maxRent[obj].value,
															}))}
													/>
												</View>
												<View style={s.section}>
													<Text style={s.title}>
														Установите ваши цены и
														скидки
													</Text>
													<Text style={s.helpText}>
														Комиссия сервиса - 10%
														Прочитайте инструкцию
														<TextButton
															title=" как установить цену за аренду"
															onPress={() =>
																Linking.openURL(
																	'https://help.getarent.ru/knowledge-bases/2/articles/96-kakuyu-tsenu-ustanovit-za-arendu?utm_source=redaktirovanie&utm_medium=kak-ustanovit-cenu-za-arendu'
																)
															}
														/>
													</Text>
													<InputComponent
														name="rentPricePerDay"
														keyboardType="numeric"
														placeholder="Например, 2500"
														style={{ marginBottom: 15 }}
														inputStyle={s.inputComponent}
														error={isRentPricePerDayError}
														label="Стоимость аренды в сутки, ₽ *"
														value={values.rentPricePerDay?.toString()}
														labelStyle={[
															s.label,
															{ marginBottom: 8 },
														]}
														onChangeText={(value) => {
															setFieldValue(
																'rentPricePerDay',
																value
															);
															setIsRentPricePerDayError(
																''
															);
														}}
														onBlur={() => {

															if (errorTabs['PRICES_AND_DISCOUNTS']) {

																const isPricesAndDiscountsError =
																	!values.rentPricePerDay ||
																	!values.dailyMilageLimit ||
																	!values.weeklyMilageLimit ||
																	!values.monthlyMilageLimit;

																!isPricesAndDiscountsError &&
																	setErrorTabs({
																		...errorTabs,
																		PRICES_AND_DISCOUNTS: false,
																	});
															}
														}}
													/>
													{
														values.twoDaysDiscount !== null 
														&&
															<DiscountInput
																name="twoDaysDiscount"
																placeholder="Например, 7"
																title="Скидка при аренде на 2 дня, %"
																value={values.twoDaysDiscount?.toString()}
																setFieldValue={(
																	name,
																	value
																) =>
																	setFieldValue(
																		name,
																		value
																	)
																}
															/>
													}
													{
														values.threeDaysDiscount !== null 
														&&
															<DiscountInput
																name="threeDaysDiscount"
																placeholder="Например, 10"
																title="Скидка при аренде на 3 дня, %"
																value={values.threeDaysDiscount?.toString()}
																setFieldValue={(
																	name,
																	value
																) =>
																	setFieldValue(
																		name,
																		value
																	)
																}
															/>
													}
													{
														values.fiveDaysDiscount !== null 
														&&
															<DiscountInput
																name="fiveDaysDiscount"
																placeholder="Например, 12"
																title="Скидка при аренде на 5 дней, %"
																value={values.fiveDaysDiscount?.toString()}
																setFieldValue={(
																	name,
																	value
																) =>
																	setFieldValue(
																		name,
																		value
																	)
																}
															/>
													}
													{
														values.weekDiscount !== null 
														&&
															<DiscountInput
																name="weekDiscount"
																placeholder="Например, 15"
																title="Скидка при аренде на неделю, %"
																value={values.weekDiscount?.toString()}
																setFieldValue={(
																	name,
																	value
																) =>
																	setFieldValue(
																		name,
																		value
																	)
																}
															/>
													}
													{
														values.twoWeeksDiscount !== null 
														&&
															<DiscountInput
																name="twoWeeksDiscount"
																placeholder="Например, 20"
																title="Скидка при аренде на 2 недели, %"
																value={values.twoWeeksDiscount?.toString()}
																setFieldValue={(
																	name,
																	value
																) =>
																	setFieldValue(
																		name,
																		value
																	)
																}
															/>
													}
													{
														values.monthDiscount !== null 
														&&
															<DiscountInput
																name="monthDiscount"
																placeholder="Например, 25"
																title="Скидка при аренде на месяц, %"
																value={values.monthDiscount?.toString()}
																setFieldValue={(
																	name,
																	value
																) =>
																	setFieldValue(
																		name,
																		value
																	)
																}
															/>
													}
													<AddDaysDiscounts
														values={values}
														onAddDiscount={(
															selectedPeriod,
															discount
														) => {
															setFieldValue(
																selectedPeriod,
																discount
															);
														}}
													/>
												</View>
												<View style={s.section}>
													<Text style={s.title}>
														Ограничения по пробегу
													</Text>
													<Text style={s.helpText}>
														Установите ограничения по
														пробегу
													</Text>
													<InputComponent
														label="В день, км: *"
														keyboardType="numeric"
														name="dailyMilageLimit"
														placeholder="Например, 50"
														notice="Для поездок до 6 дней"
														error={isDailyMilageLimitError}
														value={values.dailyMilageLimit?.toString()}
														style={{ marginBottom: 10 }}
														labelStyle={[
															s.label,
															{ marginBottom: -10 },
														]}
														onChangeText={(value) => {
															
															setFieldValue(
																'dailyMilageLimit',
																value
															);

															setIsDailyMilageLimitError(
																''
															);
														}}
														onBlur={() => {

															if (errorTabs['PRICES_AND_DISCOUNTS']) {

																const isPricesAndDiscountsError =
																	!values.rentPricePerDay ||
																	!values.dailyMilageLimit ||
																	!values.weeklyMilageLimit ||
																	!values.monthlyMilageLimit;

																!isPricesAndDiscountsError &&
																	setErrorTabs({
																		...errorTabs,
																		PRICES_AND_DISCOUNTS: false,
																	});
															}
														}}
													/>
													<InputComponent
														label="В неделю, км: *"
														keyboardType="numeric"
														name="weeklyMilageLimit"
														placeholder="Например, 500"
														error={isWeeklyMilageLimitError}
														notice="Для поездок от 7 до 29 дней"
														value={values.weeklyMilageLimit?.toString()}
														style={{ marginBottom: 10 }}
														labelStyle={[
															s.label,
															{ marginBottom: -10 },
														]}
														onChangeText={value => {
															setFieldValue('weeklyMilageLimit',value);
															setIsWeeklyMilageLimitError('');
														}}
														onBlur={() => {

															if (errorTabs['PRICES_AND_DISCOUNTS']) {

																const isPricesAndDiscountsError =
																	!values.rentPricePerDay ||
																	!values.dailyMilageLimit ||
																	!values.weeklyMilageLimit ||
																	!values.monthlyMilageLimit;

																!isPricesAndDiscountsError &&
																	setErrorTabs({
																		...errorTabs,
																		PRICES_AND_DISCOUNTS: false,
																	});
															}
														}}
													/>
													<InputComponent
														label="В месяц, км: *"
														keyboardType="numeric"
														name="monthlyMilageLimit"
														placeholder="Например, 1000"
														notice="Для поездок от 30 дней"
														error={isMonthlyMilageLimitError}
														value={values.monthlyMilageLimit?.toString()}
														labelStyle={[
															s.label,
															{ marginBottom: -10 },
														]}
														onChangeText={(value) => {
															setFieldValue('monthlyMilageLimit',value);
															setIsMonthlyMilageLimitError('');
														}}
														onBlur={() => {

															if (errorTabs['PRICES_AND_DISCOUNTS']) {

																const isPricesAndDiscountsError =
																	!values.rentPricePerDay ||
																	!values.dailyMilageLimit ||
																	!values.weeklyMilageLimit ||
																	!values.monthlyMilageLimit;

																!isPricesAndDiscountsError &&
																	setErrorTabs({
																		...errorTabs,
																		PRICES_AND_DISCOUNTS: false,
																	});
															}
														}}
													/>
												</View>
												<View style={s.section}>
													<Text style={s.title}>
														Дополнительные километры
													</Text>
													<Text style={s.helpText}>
														Установите дополнительные
														пакеты километров. Комиссия
														сервиса с продажи пакетов
														километров - 10%
													</Text>
													{
														Object.keys(distancePackagesData).map((constDistancePackage) => {

															const constPackage = distancePackagesData[constDistancePackage];

															const findedPackage = values.distancePackages?.find((distancePackage) => (
																distancePackage.kmQuantity.toString() ===
																constDistancePackage
															));

															return (
																findedPackage 
																&&
																	<>
																		<Text
																			style={[
																				s.label,
																				{ marginBottom: theme.spacing(2) },
																			]}
																		>
																			{constPackage.label}
																		</Text>
																		<View 
																			style={s.discount}
																		>
																			<InputComponent
																				borderColor="#979797"
																				keyboardType="numeric"
																				key={constPackage.key}
																				style={{ width: '94%' }}
																				placeholder={constPackage.placeholder}
																				value={findedPackage?.price.toString()}
																				onChangeText={value => {

																					setFieldValue(
																						'distancePackages',
																						[
																							...values.distancePackages.filter(
																								el =>
																									el.kmQuantity.toString() !==
																									constDistancePackage.toString()
																							),
																							{
																								kmQuantity: constDistancePackage === 'infinity'
																									? 'infinity'
																									: Number(constDistancePackage),
																								price: value.replace(
																									/[^\d]/g,
																									''
																								),
																							},
																						]
																					);
																				}}
																			/>
																			<TouchableOpacity
																				style={{
																					width: '6%',
																				}}
																				onPress={() => {
																					setFieldValue(
																						'distancePackages',
																						[
																							...values.distancePackages.filter(
																								el =>
																									el.kmQuantity.toString() !==
																									constDistancePackage.toString()
																							),
																						]
																					);
																				}}
																			>
																				<Text
																					style={[
																						theme
																							.styles
																							.H4R,
																						s.deliveryRadiusDeleteBtn,
																					]}
																				>
																					x
																				</Text>
																			</TouchableOpacity>
																		</View>
																	</>
															);
														})
													}
													<AddDistancePackage
														distancePackages={
															values.distancePackages
														}
														onAddPackage={(
															selectedPackage,
															value
														) => {
															setFieldValue(
																'distancePackages',
																[
																	...values.distancePackages.filter(
																		el =>
																			el.kmQuantity.toString() !==
																			selectedPackage.toString()
																	),
																	{
																		kmQuantity:
																			selectedPackage ===
																			'infinity'
																				? 'infinity'
																				: Number(
																						selectedPackage
																				),
																		price: value.replace(
																			/[^\d]/g,
																			''
																		),
																	},
																]
															);
														}}
														pricesScrollViewRef={
															pricesScrollViewRef
														}
													/>
												</View>
											</ScrollView>
									}
									{
										tab.value === EDIT_SECTIONS.RENT_RULES 
										&&
											<ScrollView style={s.content}>
												<View style={s.section}>
													<Text style={s.title}>
														Установите требования к
														водителю
													</Text>
													<InputComponent
														name="driversAge"
														keyboardType="numeric"
														error={isDriversAgeError}
														placeholder="Например, 18"
														label="Минимальный возраст *"
														style={{ marginBottom: 10 }}
														value={values.driversAge?.toString()}
														labelStyle={[
															s.label,
															{ marginBottom: 5 },
														]}
														onChangeText={value => {
															setFieldValue(
																'driversAge',
																value
															);
															setIsDriversAgeError(
																false
															);
														}}
														onBlur={() => {
															if (
																errorTabs[
																	'RENT_RULES'
																]
															) {
																const isRentRulesError =
																	!values.driversAge ||
																	!values.drivingExperience ||
																	(
																		withPledge 
																		&&
																			(!values.pledgePrice || !values.pledgeMaxTerm)
																	);

																!isRentRulesError &&
																	setErrorTabs({
																		...errorTabs,
																		RENT_RULES: false,
																	});
															}
														}}
													/>
													<InputComponent
														keyboardType="numeric"
														name="drivingExperience"
														placeholder="Например, 2"
														label="Минимальный стаж *"
														error={isDrivingExperienceError}
														value={values.drivingExperience?.toString()}
														labelStyle={[
															s.label,
															{ marginBottom: 5 },
														]}
														onChangeText={(value) => {
															setFieldValue(
																'drivingExperience',
																value
															);
															setIssDrivingExperienceError(
																false
															);
														}}
														onBlur={() => {

															if (errorTabs['RENT_RULES']) {

																const isRentRulesError =
																	!values.driversAge ||
																	!values.drivingExperience ||
																	(
																		withPledge 
																		&&
																			(!values.pledgePrice || !values.pledgeMaxTerm)
																	);

																!isRentRulesError &&
																	setErrorTabs({
																		...errorTabs,
																		RENT_RULES: false,
																	});
															}
														}}
													/>
												</View>
												<View style={s.section}>
													<Text
														style={[
															s.title,
															{ marginBottom: theme.spacing(3) },
														]}
													>
														Настройка залогов
													</Text>
													<RadioButton
														checked={!withPledge}
														label="Работать без залога"
														labelStyle={s.radionBtnText}
														onPress={() => {
															setFieldValue(
																'pledgePrice',
																null
															);
															setFieldValue(
																'pledgeMaxTerm',
																null
															);
															setFieldValue(
																'pledgeNoRefundReason',
																null
															);

															setWithPledge(false);
														}}
													/>
													<RadioButton
														checked={withPledge}
														label="Получать залог"
														labelStyle={s.radionBtnText}
														onPress={() => {
															setWithPledge(true);
														}}
													/>
													{
														withPledge 
														&&
															<View
																style={{ marginTop: theme.spacing(3) }}
															>
																<Text
																	style={[
																		s.label,
																		{ marginBottom: theme.spacing(2) },
																	]}
																>
																	Установите размер
																	залога, ₽ *
																</Text>
																<InputComponent
																	name="pledgePrice"
																	keyboardType="numeric"
																	error={isPledgePriceError}
																	placeholder="Например, 2500"
																	inputStyle={s.inputComponent}
																	value={values.pledgePrice?.toString()}
																	onChangeText={value => {
																		setFieldValue(
																			'pledgePrice',
																			value
																		);
																		setIsPledgePriceError(
																			''
																		);
																	}}
																	onBlur={() => {

																		if (errorTabs['RENT_RULES']) {

																			const isRentRulesError =
																				!values.driversAge ||
																				!values.drivingExperience ||
																				(
																					withPledge 
																					&&
																						(!values.pledgePrice || !values.pledgeMaxTerm)
																				);

																			!isRentRulesError &&
																				setErrorTabs(
																					{
																						...errorTabs,
																						RENT_RULES: false,
																					}
																				);
																		}
																	}}
																/>
																<Text
																	style={[
																		s.label,
																		{
																			marginBottom: theme.spacing(2),
																			marginTop: 20,
																		},
																	]}
																>
																	Установите
																	максимальный срок
																	удержания залога,
																	дней *
																</Text>
																<InputComponent
																	name="pledgeMaxTerm"
																	keyboardType="numeric"
																	placeholder="Например, 10"
																	error={isPledgeMaxTermError}
																	inputStyle={s.inputComponent}
																	value={values.pledgeMaxTerm?.toString()}
																	onChangeText={(value) => {
																		setFieldValue(
																			'pledgeMaxTerm',
																			value
																		);
																		setIsPledgeMaxTermError(
																			''
																		);
																	}}
																	onBlur={() => {

																		if (errorTabs['RENT_RULES']) {

																			const isRentRulesError =
																				!values.driversAge ||
																				!values.drivingExperience ||
																				(
																					withPledge 
																					&&
																						(!values.pledgePrice || !values.pledgeMaxTerm)
																				);

																			!isRentRulesError &&
																				setErrorTabs(
																					{
																						...errorTabs,
																						RENT_RULES: false,
																					}
																				);
																		}
																	}}
																/>
																<Input
																	multiline
																	numberOfLines={5}
																	keyboardType="default"
																	name="pledgeNoRefundReason"
																	titleStyle={{ marginTop: 25 }}
																	title="Когда залог не возвращается полностью или частично"
																	notice={
																		<Text
																			style={{
																				lineHeight: 19,
																			}}
																		>
																			Если в
																			разделе
																			“Настройка
																			парка” вы
																			выбрали
																			работать по
																			договору -
																			оферте для
																			аренды
																			Getarent,
																			есть общие
																			правила, по
																			которым
																			залог не
																			возвращается
																			арендатору
																			полностью
																			или
																			частично.
																			Ознакомьтесь
																			с ними
																			<TextButton
																				title=" здесь."
																				onPress={() =>
																					Linking.openURL(
																						'https://help.getarent.ru/user/login?next=%2Fknowledge-bases%2F2%2Farticles%2F209-zalogi-pri-rabote-po-onlajn-dogovoram-getarent'
																					)
																				}
																			/>
																			{'\n'}
																			{'\n'}
																			Если вы
																			работаете по
																			собственному
																			договору,
																			перечислите
																			в поле ниже
																			случаи,
																			когда залог
																			может быть
																			не возвращен
																			арендатору
																		</Text>
																	}
																	value={values.pledgeNoRefundReason}
																	onChangeText={(value) => (

																		setFieldValue(
																			'pledgeNoRefundReason',
																			value.replace(/\s/g, '') === ''
																				? null
																				: value
																		)
																	)}
																/>
															</View>
													}
												</View>
												<View style={s.section}>
													<Text style={[s.title]}>
														География аренды
													</Text>
													<Text style={s.helpText}>
														Установите где можно
														использовать авто
													</Text>
													<RadioButton
														label="Только в городе"
														labelStyle={s.radionBtnText}
														checked={values.rentLocations === 'CITY'}
														onPress={() =>
															setFieldValue(
																'rentLocations',
																'CITY'
															)
														}
													/>
													<RadioButton
														labelStyle={s.radionBtnText}
														label="По региону и области (краю)"
														checked={values.rentLocations === 'COUNTRY'}
														onPress={() =>
															setFieldValue(
																'rentLocations',
																'COUNTRY'
															)
														}
													/>
													<RadioButton
														labelStyle={s.radionBtnText}
														checked={values.rentLocations === 'WORLD'}
														label="По всей стране (по согласованию региона)"
														onPress={() =>
															setFieldValue(
																'rentLocations',
																'WORLD'
															)
														}
													/>
												</View>
											</ScrollView>
									}
									{
										tab.value === EDIT_SECTIONS.DESCRIPTION 
										&&
											<ScrollView style={s.content}>
												<View
													style={[
														s.section,
														{ marginBottom: 30 },
													]}
												>
													<Text style={s.title}>
														Где находится машина? *
													</Text>
													<LocationBar
														place={address}
														invalid={isAddressError}
														placeholder="Введите адрес"
														style={[{ marginTop: 10 }]}
														placeholderOnlyAddress={true}
														onPress={() =>
															api.navigation.navigate(
																'Location',
																{
																	edit: true,
																	uuid: carId,
																	place: address,
																	location: values.location,
																	callback: (address) => {

																		setAddress(address);

																		setFieldValue(
																			'location',
																			{
																				...values.location,
																				address: address.address,
																				latitude: address.location.lat,
																				longitude: address.location.lon,
																				city: carEditData.location.city,
																			}
																		);

																		setIsAddressError(false);

																		setErrorTabs({
																			...errorTabs,
																			DESCRIPTION: false,
																		});
																	},
																},
																true
															)
														}
													/>
												</View>
												<View style={s.section}>
													<Text style={s.title}>
														Подробно опишите вашу машину
													</Text>
													<Text style={s.helpText}>
														Ознакомьтесь с
														рекомендациями
														<TextButton
															title=" как правильно составить описание"
															onPress={() =>
																Linking.openURL(
																	'https://help.getarent.ru/knowledge-bases/2/articles/94-kak-sostavit-opisanie-mashinyi?utm_source=redaktirovanie&utm_medium=kak-pravilno-sostavit-opisanie'
																)
															}
														/>
													</Text>
													<Input
														multiline
														numberOfLines={5}
														name="description"
														keyboardType="default"
														style={{ marginTop: -20 }}
														value={values.description}
														onChangeText={(value) =>
															setFieldValue(
																'description',
																value.replace(/\s/g, '') === ''
																	? null
																	: value
															)
														}
													/>
												</View>
												<View style={s.section}>
													<Text
														style={[
															s.title,
															{ marginBottom: 15 },
														]}
													>
														Что входит в комплектацию?
													</Text>
													<View style={s.checkboxes}>
														{
															Object.keys(carIncludedFeatures).map((feature, i) => (
																<BouncyCheckbox
																	key={i}
																	style={[s.checkbox]}
																	fillColor={theme.colors.blue}
																	text={carIncludedFeatures[feature]}
																	isChecked={values.includedFeatures.includes(feature)}
																	textStyle={[
																		theme.styles.P1_5,
																		{
																			marginLeft: -5,
																			textDecorationLine: 'none',
																		},
																	]}
																	onPress={() => {

																		if (values.includedFeatures.includes(feature)) {

																			setFieldValue(
																				'includedFeatures',
																				[
																					...values.includedFeatures.filter(
																						(includedFeature) =>
																							includedFeature !== feature
																					),
																				]
																			);
																		} else {
																			setFieldValue(
																				'includedFeatures',
																				[
																					...values.includedFeatures,
																					feature,
																				]
																			);
																		}
																	}}
																/>
															))
														}
													</View>
													<View style={s.warningBlock}>
														<Icon
															name="info"
															style={s.warningBlockIcon}
															size={theme.normalize(20)}
															color={theme.colors.yellow}
														/>
														<Text style={s.helpText}>
															Если вы не нашли в
															списке того, что входит
															в комплектацию вашей
															машины, добавьте это в
															поле “Описание машины”.
														</Text>
													</View>
												</View>
											</ScrollView>
									}
									{
										tab.value === EDIT_SECTIONS.KASKO 
										&&
											insurance && (
												<ScrollView style={s.content}>
													<View style={s.section}>
														<Text
															style={[
																s.label,
																{
																	fontSize: 15,
																	marginBottom: 15,
																},
															]}
														>
															Выберите вариант
															публикации машины
														</Text>
														<View
															style={{
																marginBottom: 15,
															}}
														>
															<RadioButton
																checked={
																	!withInsurance
																}
																label="Сдавать без страховки"
																onPress={() =>
																	toggleInsurance(
																		!withInsurance
																	)
																}
															/>
															<Text
																style={s.helpText}
															>
																Ваш автомобиль можно
																будет забронировать
																без страховки. При
																бронировании вашего
																автомобиля клиент
																сможет отдельно
																приобрести услугу
																“Страхование КАСКО
																мультидрайв с
																франшизой 20 000
																рублей”. Узнайте
																подробнее, как это
																будет работать,
																<TextButton
																	title=" здесь"
																	onPress={() =>
																		Linking.openURL(
																			'https://help.getarent.ru/knowledge-bases/2/articles/202-sdavat-avtomobili-bez-kasko'
																		)
																	}
																/>
															</Text>
														</View>
														<View
															style={{
																marginBottom: 15,
															}}
														>
															<RadioButton
																checked={
																	withInsurance
																}
																label="Сдавать только со страховкой"
																onPress={() =>
																	toggleInsurance(
																		!withInsurance
																	)
																}
															/>
															<Text
																style={s.helpText}
															>
																К вашей
																установленной
																стоимости аренды
																будет автоматически
																прибавляться сумма
																страховки КАСКО,
																пожалуйста, учтите
																это при назначении
																цены. Ваш автомобиль
																невозможно будет
																забронировать без
																КАСКО. Узнайте
																подробнее, как это
																будет работать
																<TextButton
																	title=" здесь"
																	onPress={() =>
																		Linking.openURL(
																			'https://help.getarent.ru/knowledge-bases/2/articles/201-sdavat-avtomobili-s-kasko'
																		)
																	}
																/>
															</Text>
														</View>
													</View>
												</ScrollView>
											)
									}
									{tab.value === EDIT_SECTIONS.SERVICES && (
										<ScrollView
											style={s.content}
											ref={servicesScrollViewRef}
											keyboardShouldPersistTaps="handled"
										>
											<View
												style={[
													s.section,
													{ marginBottom: 20 },
												]}
											>
												<Text style={s.title}>
													Предложите дополнительные
													услуги
												</Text>
												<Text style={s.helpText}>
													Прочитайте инструкцию
													<TextButton
														title=" как установить цену за услуги."
														onPress={() =>
															Linking.openURL(
																'https://help.getarent.ru/knowledge-bases/2/articles/97-kakuyu-tsenu-ustanovit-za-uslugi?utm_source=redaktirovanie&utm_medium=kak-ustanovit-cenu-za-uslugi'
															)
														}
													/>
												</Text>
												<Text
													style={[
														s.helpText,
														{ marginBottom: 15 },
													]}
												>
													Комиссия сервиса - 10%
												</Text>
												<DeliveryCheckbox
													place={{
														id: 1,
														name: 'Мойка после аренды',
														price: values.afterRentWashingPrice,
													}}
													onChangePrice={value =>
														setFieldValue(
															'afterRentWashingPrice',
															value === null ||
																value === ''
																? null
																: Number(value)
														)
													}
												/>
											</View>
											<View style={s.section}>
												<Text style={s.title}>
													Предложите доставку
												</Text>
												<Text style={s.helpText}>
													Узнайте подробнее об услуге
													<TextButton
														title=" доставка"
														onPress={() =>
															Linking.openURL(
																'https://help.getarent.ru/knowledge-bases/2/articles/37-dostavka-avtomobilya?utm_source=chekaut&utm_medium=dostavka'
															)
														}
													/>
												</Text>
												<View style={s.subSection}>
													<DeliveryRadiuses
														radiuses={
															values.delivery
																.radiuses
														}
														onDeleteRadius={radiusId =>
															setFieldValue(
																'delivery',
																{
																	popularPlaces:
																		values
																			.delivery
																			.popularPlaces,
																	radiuses:
																		values.delivery.radiuses.filter(
																			radius =>
																				radius.radius_id !==
																				radiusId
																		),
																}
															)
														}
														onAddRadius={(
															radiusId,
															price
														) =>
															setFieldValue(
																'delivery',
																{
																	popularPlaces:
																		values
																			.delivery
																			.popularPlaces,
																	radiuses: [
																		...values
																			.delivery
																			.radiuses,
																		{
																			radius_id:
																				radiusId,
																			price: Number(
																				price
																			),
																		},
																	],
																}
															)
														}
													/>
												</View>
											</View>
										</ScrollView>
									)}
									{tab.value === EDIT_SECTIONS.PHOTOS && (
										<ScrollView style={s.content}>
											<Text style={s.title}>
												Загрузите фотографии машины
											</Text>
											<Text
												style={[
													s.helpText,
													{ marginBottom: 20 },
												]}
											>
												Ознакомьтесь с рекомендациями
												<TextButton
													title=" как правильно сделать фотографии"
													onPress={() =>
														Linking.openURL(
															'https://help.getarent.ru/knowledge-bases/2/articles/1-fotografii-vashego-avtomobilya-trebovaniya-i-instruktsii?utm_source=redaktirovanie&utm_medium=kak-pravilno-sdelat-fotografii'
														)
													}
												/>
											</Text>
											<View style={s.photos}>
												<PhotoLoader
													name="photo"
													asFormData={true}
													style={s.thumbnail}
													error={noPhotosError}
													onSelectFormData={photo => {
														dispatch(
															actions.addCarPhoto(
																[photo],
																carEditData.uuid
															)
														);

														setNoPhotosError(false);

														setErrorTabs({
															...errorTabs,
															PHOTOS: false,
														});
													}}
												/>
												{carEditData.photos.map(
													(file, i) =>
														!!file && (
															<Thumbnail
																key={file.id}
																style={
																	s.thumbnail
																}
																resizeMode="cover"
																source={{
																	uri: file
																		.urls
																		.medium,
																}}
																onPressDelete={() =>
																	dispatch(
																		actions.deleteCarPhoto(
																			file.id,
																			carEditData.uuid
																		)
																	)
																}
															/>
														)
												)}
											</View>
										</ScrollView>
									)}
								</KeyboardAvoidingView>
								{carEditData.status === 'NOT_VERIFIED' ? (
									<View style={s.submit}>
										<SubmitBtn
											values={values}
											title="Отправить на проверку"
											actionType="verificate"
											handleSubmit={handleSubmit}
											setFieldValue={setFieldValue}
											setFieldError={setFieldError}
										/>
										{/* <TouchableOpacity style={s.deleteBtn}>
                                                    <TrashIcon width={24} height={24} />
                                                </TouchableOpacity> */}
									</View>
								) : (
									<View style={s.submit}>
										<SubmitBtn
											values={values}
											title="Сохранить"
											actionType="save"
											handleSubmit={handleSubmit}
											setFieldValue={setFieldValue}
											setFieldError={setFieldError}
										/>
									</View>
								)}
							</>
						)}
					</Formik>
				</>
			)}
			<Modalize
				ref={modalizeRef}
				snapPoint={HEIGHT / 1.8}
				modalHeight={HEIGHT / 1.2}
			>
				<View style={s.unavailableModal}>
					<Text style={[theme.styles.P2R, { marginBottom: 15 }]}>
						При бронировании вашей машины через маркетплейс Getarent
						вам не нужно следить за календарем, даты будут
						блокироваться автоматически. Ниже вы можете добавить
						вручную период недоступности машины, если автомобиль
						занят или проходит ТО. Для интеграции календаря Getarent
						с вашим собственным учетом доступности машин,
						пожалуйста, обратитесь в службу поддержки. Доступность
						машины обозначена разными цветами:
					</Text>
					<Text style={[theme.styles.P2R]}>
						1
						<Text style={theme.styles.P2R}>
							{'  '}- Доступна для бронирования
						</Text>
					</Text>
					<Text
						style={[
							theme.styles.P2R,
							{ color: theme.colors.green },
						]}
					>
						2<Text style={theme.styles.P2R}>{'  '}- В аренде</Text>
					</Text>
					<Text
						style={[
							theme.styles.P2R,
							{ color: theme.colors.darkYellow },
						]}
					>
						3
						<Text style={theme.styles.P2R}>
							{'  '}- Забронирована
						</Text>
					</Text>
					<Text
						style={[theme.styles.P2R, { color: theme.colors.red }]}
					>
						4
						<Text style={theme.styles.P2R}>{'  '}- Недоступна</Text>
					</Text>
				</View>
			</Modalize>
		</SafeAreaView>
	);
};

export default CarEdit;
