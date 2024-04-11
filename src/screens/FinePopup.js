import React from 'react';
import { SafeAreaView, Text, StyleSheet, View, ScrollView } from 'react-native';

import api from 'api';
import { Header, PrimaryButton } from 'components';

import theme from 'theme';

const compensationTextHost1 = `Если арендатор не успевает вовремя вернуть автомобиль, он должен запросить продление. Запрос на продление аренды возможно отправить не позднее 12 часов до её окончания.`;
const compensationTextGuest1 = `Если вы не успеваете вовремя вернуть автомобиль,
запросите продление аренды. Запрос на продление аренды
возможно отправить не позднее 12 часов до её окончания.`;
const compensationTextHost2 = `Владелец может отказать в продлении аренды, тогда водителю придётся вернуть автомобиль в назначенное время. Если водитель не продлит аренду и не вернёт автомобиль в назначенное время, вы получите компенсацию.`;
const compensationTextGuest2 = `Владелец может отказать в продлении аренды, тогда вам
придётся вернуть автомобиль в назначенное время. Если вы
не продлите аренду и не вернёте автомобиль в назначенное
время, на вас будет наложен штраф.`;

const Popup = ({ route: { params } }) => {

	const { role } = params;
	
	return (
		<SafeAreaView style={[theme.styles.paper, theme.styles.flex]}>
			<ScrollView>
				<Header
					title={
						role === 'GUEST'
							? 'Штрафы за опоздание'
							: 'Компенсация за опоздание'
					}
				/>
				<View style={styles.list}>
					<Text style={styles.description}>
						{role === 'GUEST'
							? compensationTextGuest1
							: compensationTextHost1}
					</Text>
					<Text style={styles.description}>
						{role === 'GUEST'
							? compensationTextGuest2
							: compensationTextHost2}
					</Text>
					<Text style={[styles.description, styles.textMargin]}>
						1. Опоздание до 30 минут - бесплатно
					</Text>
					<Text style={styles.description}>
						2. Опоздание от 30 минут до 1 часа 59 минут - штраф 50%
						от стоимости поездки за 1 день
						{role === 'HOST' && (
							<Text>
								{' '}
								с арендатора, выплата владельцу согласно
								выбранному тарифу
							</Text>
						)}
					</Text>
					<Text style={styles.description}>
						3. Опоздание от 2 часов или более - 2 стоимости поездки
						1 дня (и за каждый последующий день)
						{role === 'HOST' && (
							<Text>
								{', '}
								выплата владельцу согласно выбранному тарифу
							</Text>
						)}
					</Text>
					<PrimaryButton 
						title='Спасибо, понятно'
						style={styles.submitBtn}
						onPress={() => api.navigation.goBack()}
					/>
				</View>					
			</ScrollView>
		</SafeAreaView>
	);
};

export const FinePopup = React.memo(Popup);

const styles = StyleSheet.create({
	description: {
		...theme.styles.P1R,
	},
	textMargin: {
		marginTop: theme.spacing(8),
	},
	list: {
		paddingLeft: theme.spacing(6),
		paddingRight: theme.spacing(12),
	},
	submitBtn: {
		marginVertical: theme.spacing(10),
	},
});
