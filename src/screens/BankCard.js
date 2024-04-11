import {
	View,
	Text,
	Image,
	Linking,
	StyleSheet,
	SafeAreaView,
} from 'react-native';
import { useDispatch } from 'react-redux';
import React, { useCallback, useState } from 'react';

import {
	Header,
	Waiter,
	TextButton,
	PrimaryButton,
	SafeAreaSpacingView,
} from 'components';
import api from '../api';
import actions from '../actions';

import theme from 'theme';

const BankCard = () => {

	const dispatch = useDispatch();

	const [waiter, setWaiter] = useState(false);

	const onPress = useCallback(() => {

		setWaiter(true);
		
		api.web
			.card()
			.then(async ({ error }) => {

				if (error) {
					throw error;
				};

				api.navigation.navigate('ProfilePayments');
				
				setWaiter(false);
			})
			.catch(() => {

				dispatch(
					actions.error(
						'Не удалось отправить заявку, попробуйте еще раз'
					)
				);

				setWaiter(false);
			});
	}, [dispatch]);

	return (
		<SafeAreaView style={[theme.styles.paper, theme.styles.flex]}>
			<Header title="Платежные данные" />
			<SafeAreaSpacingView style={styles.content}>
				<View>
					<Text style={styles.descriptionText}>
						Получайте выплаты за аренду на банковскую карту Tinkoff
					</Text>
					<TextButton
						title="Узнать подробнее"
						style={styles.descriptionLink}
						onPress={() =>
							Linking.openURL(
								'https://help.getarent.ru/ru/knowledge-bases/2/articles/121-vyiplata-na-bankovskuyu-kartu?utm_source=akkaunt-host&utm_medium=pravila-bankovskaya-karta'
							)
						}
					/>
				</View>
				<Image
					style={styles.logo}
					source={require('img/tinkoff-logo.png')}
				/>
				<View>
					<PrimaryButton
						style={styles.button}
						title="Отправить заявку"
						onPress={onPress}
					/>
				</View>
			</SafeAreaSpacingView>
			{waiter && <Waiter />}
		</SafeAreaView>
	);
};

export default BankCard;

const styles = StyleSheet.create({
	content: {
		...theme.styles.container,
		justifyContent: 'space-between',
		paddingHorizontal: theme.spacing(6),
		paddingBottom: theme.spacing(6),
	},
	logo: {
		alignSelf: 'center',
		resizeMode: 'contain',
		width: '70%',
		paddingHorizontal: theme.spacing(20),
	},
	button: {
		marginTop: theme.spacing(5),
	},
	descriptionText: {
		...theme.styles.P2R,
	},
});
