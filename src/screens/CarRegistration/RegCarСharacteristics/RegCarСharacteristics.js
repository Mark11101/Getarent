import {
	View,
	Text,
	ScrollView,
	SafeAreaView,
	KeyboardAvoidingView,
} from 'react-native';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import api from 'api';
import actions from 'actions';
import bodyTypes from '../constants/bodyTypes';
import engineTypes from '../constants/engineTypes';
import InputComponent from '../components/Input/Input';
import SelectComponent from '../components/Select/Select';
import RegCarHeader from '../components/Header/RegCarHeader';
import displacementTypes from '../constants/displacementTypes';
import transmissionTypes from '../constants/transmissionTypes';
import transmissionBoxTypes from '../constants/transmissionBoxTypes';
import NavigationButtons from '../components/NavigationButtons/NavigationButtons';

import s from './styles';

const RegCarСharacteristics = () => {
    
	const dispatch = useDispatch();

	const {
		bodyType,
		engineType,
		enginePower,
		displacementType,
		transmissionType,
		transmissionBoxType,
		seatsNumber,
	} = useSelector(st => st.carRegistration);

	const [inputBodyType, setInputBodyType] = useState(bodyType);
	const [inputEngineType, setInputEngineType] = useState(engineType);
	const [inputEnginePower, setInputEnginePower] = useState(enginePower);
	const [inputDisplacementType, setInputDisplacementType] = useState(displacementType);
	const [inputTransmissionType, setInputTransmissionType] = useState(transmissionType);
	const [inputTransmissionBoxType, setInputTransmissionBoxType] = useState(transmissionBoxType);
	const [inputSeatsNumber, setInputSeatsNumber] = useState(seatsNumber);

	const saveData = () => {

		dispatch(
			actions.updateCarRegistrationData({
				bodyType: inputBodyType,
				engineType: inputEngineType,
				enginePower: inputEnginePower,
				displacementType: inputDisplacementType,
				transmissionType: inputTransmissionType,
				transmissionBoxType: inputTransmissionBoxType,
				seatsNumber: inputSeatsNumber,
			})
		);
	};

	const handlePressResume = () => {

		api.navigation.navigate('RegCarСheckScreen');
		saveData();
	};

	return (
		<SafeAreaView style={s.safeArea}>
			<KeyboardAvoidingView
				style={{ flex: 1 }}
				behavior={Platform.OS === 'ios' ? 'padding' : null}
			>
				<ScrollView style={s.container}>
					<RegCarHeader 
						title='Последний этап 🏁'
						screenNumber={5}
					/>
					<Text style={s.subTitle}>
						Укажите основные параметры машины
					</Text>
					<View style={s.inputs}>
						<SelectComponent
							label="Кузов"
							value={inputBodyType}
							options={bodyTypes.map(bodyType => ({
								label: bodyType.label,
								value: bodyType.value,
							}))}
							onChange={setInputBodyType}
						/>
						<SelectComponent
							label="Тип двигателя"
							value={inputEngineType}
							options={engineTypes.map(engineType => ({
								label: engineType.label,
								value: engineType.value,
							}))}
							onChange={setInputEngineType}
						/>
						<InputComponent
							borderRadius={15}
							placeholder="л.с."
							keyboardType="numeric"
							value={inputEnginePower}
							inputStyle={s.inputStyle}
							labelStyle={s.inputLabel}
							label="Мощность двигателя (л.с.)"
							onChange={e => {
								setInputEnginePower(e.nativeEvent.text);
							}}
						/>
						<SelectComponent
							label="Объем двигателя"
							value={inputDisplacementType}
							options={displacementTypes.map(
								displacementType => ({
									label: displacementType.label,
									value: displacementType.value,
								})
							)}
							onChange={setInputDisplacementType}
						/>
						<SelectComponent
							label="Привод"
							value={inputTransmissionBoxType}
							options={transmissionBoxTypes.map(
								transmissionBoxType => ({
									label: transmissionBoxType.label,
									value: transmissionBoxType.value,
								})
							)}
							onChange={setInputTransmissionBoxType}
						/>
						<SelectComponent
							label="Коробка передач"
							value={inputTransmissionType}
							options={transmissionTypes.map(
								transmissionType => ({
									label: transmissionType.label,
									value: transmissionType.value,
								})
							)}
							onChange={setInputTransmissionType}
						/>
						<InputComponent
							borderRadius={15}
							keyboardType="numeric"
							value={inputSeatsNumber}
							inputStyle={s.inputStyle}
							labelStyle={s.inputLabel}
							label="Количество мест (с водителем)"
							onChange={e => {
								e.nativeEvent.text < 10
								&&
									setInputSeatsNumber(e.nativeEvent.text);
							}}
						/>
					</View>
					<NavigationButtons
						onPressResume={handlePressResume}
						onPressBack={saveData}
						disabledResume={
							!inputBodyType ||
							!inputEngineType ||
							!inputEnginePower ||
							!inputDisplacementType ||
							!inputTransmissionType ||
							!inputTransmissionBoxType ||
							!inputSeatsNumber
						}
					/>
				</ScrollView>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
};

export default RegCarСharacteristics;
