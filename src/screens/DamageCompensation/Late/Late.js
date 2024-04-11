import { useDispatch } from 'react-redux';
import React, { useCallback } from 'react';
import { SafeAreaView, ScrollView, View, Text } from 'react-native';

import api from 'api';
import { Header, PrimaryButton, RentInProgressCountDown } from 'components';

import s from './styles';

const Late = ({ route: { params: { rentId, timeLeft, isInTime } = {} } }) => {

	const dispatch = useDispatch();

	const handleSubmit = useCallback(async () => {

		try {
			const res = await api.web.compensationDocuments(
				rentId,
				'DELAY',
				[],
				`Опоздание ${timeLeft.days}дн ${timeLeft.hours}ч ${timeLeft.minutes}мин`
			);

			if (res?.error) {
				throw res.error;
			} else {
				console.log(res);
			};

			api.navigation.navigate('CompleteCompensation');

		} catch (err) {

			console.error(err);
			
			dispatch(
				actions.error('Не удалось оформить заявку, попробуйте еще раз')
			);
		}
		
	}, [dispatch]);

	return (
		<SafeAreaView style={s.safeArea}>
			<ScrollView>
				<Header title="Опоздание" />
				<View style={s.container}>
					<Text style={s.text}>
						Мы рекомендуем не заявлять опоздание и проявить
						лояльность к клиенту, если данное опоздание не привело к
						реальным убыткам.
					</Text>
					<Text style={s.text}>
						Для отправки запроса на компенсацию нажмите на кнопку
						ниже
					</Text>
					{!isInTime && (
						<RentInProgressCountDown
							timeLeft={timeLeft}
							isInTime={isInTime}
							isRentFinished={true}
							role="HOST"
						/>
					)}
				</View>
			</ScrollView>
			{isInTime ? (
				<View style={s.progressBtn}>
					<RentInProgressCountDown
						timeLeft={timeLeft}
						isInTime={isInTime}
						isRentFinished={true}
						role="HOST"
						successMessage="Аренда завершена вовремя"
					/>
				</View>
			) : (
				<View style={s.resumeBtn}>
					<PrimaryButton
						title="Компенсировать опоздание"
						onPress={handleSubmit}
					/>
				</View>
			)}
		</SafeAreaView>
	);
};

export default Late;
