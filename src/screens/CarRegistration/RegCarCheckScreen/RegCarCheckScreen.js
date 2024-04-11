import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { SafeAreaView, Text, ScrollView, View, Alert } from 'react-native';

import api from 'api';
import actions from 'actions';
import { Waiter } from 'components';
import bodyTypes from '../constants/bodyTypes';
import engineTypes from '../constants/engineTypes';
import RegCarHeader from '../components/Header/RegCarHeader';
import transmissionTypes from '../constants/transmissionTypes';
import transmissionBoxTypes from '../constants/transmissionBoxTypes';
import NavigationButtons from '../components/NavigationButtons/NavigationButtons';

import s from './styles';

const RegCarСheckScreen = () => {
    
	const {
		name,
		surname,
		patronymic,
		passport,
		address,
		companyName,
		INN,
		companyAddress,
		isIndividual,
		frontSidePassport,
		registrationSidePassport,
		seriesEPTS,
		numberEPTS,
		seriesPTS,
		numberPTS,
		isEPTS,
		frontSidePTS,
		backSidePTS,
		frontSideSTS,
		backSideSTS,
		brand,
		model,
		year,
		price,
		city,
		registrationNumber,
		VINNumber,
		bodyType,
		engineType,
		enginePower,
		displacementType,
		transmissionType,
		transmissionBoxType,
		seatsNumber,
	} = useSelector(st => st.carRegistration);

	const dispatch = useDispatch();

	const [waiter, setWaiter] = React.useState(false);

	const assemblePhotoObject = (photo) => ({
		uri: Platform.OS === 'ios' ? `file://${photo.path}` : photo.path,
		name: photo.filename ?? 'photo',
		type: photo.mime,
	});

	const onSubmit = useCallback(async () => {

		setWaiter(true);

		const carRegistrationData = new FormData();

		carRegistrationData.append(
			'ownerPassport',
			JSON.stringify(
				isIndividual
					? {
							type: 'INDIVIDUAL',
							firstName: name,
							lastName: surname,
							midName: patronymic,
							serialNumber: passport.replace(/ /, ''),
							registrationAddress: address,
					  }
					: {
							type: 'LEGAL',
							companyName: companyName,
							inn: INN,
							companyAddress: companyAddress,
					  }
			)
		);

		carRegistrationData.append(
			'vehiclePassport',
			JSON.stringify({
				type: isEPTS ? 'ELECTRONIC' : 'MANUAL',
				series: isEPTS ? seriesEPTS : seriesPTS,
				number: isEPTS ? seriesPTS : numberPTS,
			})
		);

		carRegistrationData.append(
			'carRegistrationInfo',
			JSON.stringify({
				brand: brand,
				model: model,
				productionYear: year,
				city: { index: city?.value },
				carPrice: Number(price),
				registrationNumber: registrationNumber,
				vin: `${VINNumber.replace(/-/g, '')}`,
			})
		);

		carRegistrationData.append(
			'carMainInfo',
			JSON.stringify({
				bodyType: bodyType,
				engineType: engineType,
				enginePower: enginePower,
				engineDisplacement: displacementType,
				transmissionType: transmissionType,
				transmissionLayout: transmissionBoxType,
				seatsQuantity: Number(seatsNumber),
			})
		);

		carRegistrationData.append(
			'ownerPassFront',
			assemblePhotoObject(frontSidePassport)
		);

		carRegistrationData.append(
			'ownerPassRegistration',
			assemblePhotoObject(registrationSidePassport)
		);

		!isEPTS 
        &&
			carRegistrationData.append(
				'vehiclePassFront',
				assemblePhotoObject(frontSidePTS)
			);

		!isEPTS 
        &&
			carRegistrationData.append(
				'vehiclePassReverse',
				assemblePhotoObject(backSidePTS)
			);

		carRegistrationData.append(
			'regCertFront',
			assemblePhotoObject(frontSideSTS)
		);

		carRegistrationData.append(
			'regCertFrontReverse',
			assemblePhotoObject(backSideSTS)
		);

		try {
			const res = await api.web.registrateCar(carRegistrationData);

			if (res?.error) {
				throw res.error;
			} else {
				api.navigation.navigate('RegCarSuccessScreen', { carId: res?.car.id });
			};

		} catch (error) {

			console.log(error);

			error.statusCode === 409
			?
				Alert.alert('Ошибка', 'Такой гос. или VIN номер уже существует в системе, проверьте правильность введенных данных')
			:
				dispatch(actions.error('попробуйте еще раз'));

		} finally {
			setWaiter(false);
		};

	}, [dispatch]);

	return (
		<SafeAreaView style={s.safeArea}>
			<ScrollView style={s.container}>
				<RegCarHeader 
					title='Все верно?'
					screenNumber={6}
				/>
				<View style={{ marginBottom: 30 }}>
					{
                        isIndividual 
                        ?
                            <>
								<Text style={s.item}>Фамилия: {surname}</Text>
                                <Text style={s.item}>Имя: {name}</Text>
                                <Text style={s.item}>Отчество: {patronymic}</Text>
                                <Text style={s.item}>
                                    Серия и номер паспорта: {passport}
                                </Text>
                                <Text style={s.item}>
                                    Адрес регистрации: {address}
                                </Text>
                            </>
					    :
                            <>
                                <Text style={s.item}>
                                    Название компании: {companyName}
                                </Text>
                                <Text style={s.item}>ИНН: {INN}</Text>
                                <Text style={s.item}>
                                    Адрес компании: {companyAddress}
                                </Text>
                            </>
					}

					<View style={{ marginVertical: 5 }} />

					{
                        isEPTS 
                        ?
                            <>
                                <Text style={s.item}>Серия ЭПТС: {seriesEPTS}</Text>
                                <Text style={s.item}>Номер ЭПТС: {numberEPTS}</Text>
                            </>
					    :
                            <>
                                <Text style={s.item}>Серия ПТС: {seriesPTS}</Text>
                                <Text style={s.item}>Номер ПТС: {numberPTS}</Text>
                            </>
					}

					<View style={{ marginVertical: 5 }} />

					<Text style={s.item}>Марка: {brand}</Text>
					<Text style={s.item}>Модель: {model}</Text>
					<Text style={s.item}>Год: {year}</Text>
					<Text style={s.item}>Цена: {price}</Text>
					<Text style={s.item}>Город: {city?.label}</Text>
					<Text style={s.item}>Гос. номер: {registrationNumber}</Text>
					<Text style={s.item}>Vin-номер: {VINNumber}</Text>

					<View style={{ marginVertical: 5 }} />

					<Text style={s.item}>
						Кузов:{' '}
						{bodyTypes.find(type => type.value === bodyType)?.label}
					</Text>
					<Text style={s.item}>
						Тип двигателя:{' '}
						{engineTypes.find(type => type.value === engineType)?.label}
					</Text>
					<Text style={s.item}>
						Мощность двигателя: {enginePower} л.с.
					</Text>
					<Text style={s.item}>
						Объем двигателя: {displacementType}
					</Text>
					<Text style={s.item}>
						Привод:{' '}
						{transmissionBoxTypes.find(type => type.value === transmissionBoxType)?.label}
					</Text>
					<Text style={s.item}>
						Коробка передач:{' '}
						{transmissionTypes.find(type => type.value === transmissionType)?.label}
					</Text>
					<Text style={s.item}>
                        Количество мест: {seatsNumber}
                    </Text>
				</View>
				<NavigationButtons
					resumeTitle={waiter ? <Waiter /> : 'Да, зарегистрировать'}
					onPressResume={onSubmit}
				/>
			</ScrollView>
		</SafeAreaView>
	);
};

export default RegCarСheckScreen;
