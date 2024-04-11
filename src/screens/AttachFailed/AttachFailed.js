import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, Text, Alert, Linking } from 'react-native';

import {
	Icon,
	Header,
	Waiter,
	PrimaryButton,
	SafeAreaSpacingView,
} from 'components';
import api from 'api';
import actions from 'actions';

import s from './styles';
import theme from 'theme';

const size = theme.normalize(20);

const AttachFailed = ({
	route: { params: { goBackTitle, stage, rentId, callback } = {} },
}) => {

	const dispatch = useDispatch();
	const [waiter, setWaiter] = useState(false);

	const { paymentCard } = useSelector(({ payment }) => payment);

	const startRent = (rentId) => {

		setWaiter(true);
		
		api.web.payForRent(rentId).then(({ error }) => {

			if (!error) {

				setWaiter(false);
				
				api.navigation.navigate('AttachSuccess', {
					title: 'Аренда успешно оплачена',
					callback: () => {
						api.navigation.navigate('RentRoom');
					},
				});
			};

			setWaiter(false);
		});
	};

	const attachNewCard = () => {
		
		Object.keys(paymentCard).length !== 0
			? startRent(rentId)
			: dispatch(actions.attachBankCard(stage, rentId));
	};

	const handleChangeCard = () => {
		Alert.alert(
			'',
			'Для замены карты необходимо обратиться в службу поддержки',
			[
				{
					text: 'Написать в чат',
					onPress: () => 
						api.navigation.navigate('Chats', { 
							screen: 'Support'
						}),
				},
				{ text: 'Отмена' },
			]
		);
	};

	if (waiter) {
		return <Waiter />;
	}

	return (
		<SafeAreaSpacingView style={s.container}>
			{
				goBackTitle
				&&
					<Header
						title={goBackTitle}
						style={s.header}
						onPressBack={callback}
					/>
			}
			<View style={s.content}>
				<View style={s.circle}>
					<Icon 
						name="cross" 
						color={theme.colors.red} 
						{...{ size }} 
					/>
				</View>
				<Text style={s.title}>
					Оплата не прошла
				</Text>
				<Text style={s.subtitle}>
					{
						Object.keys(paymentCard).length !== 0
						?
							'Проверьте достаточно ли денег на счете и повторите оплату или замените карту'
						:
							'Проверьте достаточно ли денег на счете и повторите попытку'
					}
				</Text>
			</View>
			<PrimaryButton
				style={s.button}
				title="Повторить"
				onPress={attachNewCard}
			/>
			{
				Object.keys(paymentCard).length !== 0 
				&&
					<PrimaryButton
						outlined
						style={s.button}
						title="Заменить карту"
						onPress={handleChangeCard}
					/>
			}
		</SafeAreaSpacingView>
	);
};

export default AttachFailed;
