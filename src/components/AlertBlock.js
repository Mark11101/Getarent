import React from 'react';
import { View, Text, Linking, StyleSheet } from 'react-native';

import api from '../api';
import Paper from './Paper';
import PrimaryButton from './PrimaryButton';
import TextButton from './TextButton';
import Icon from './Icon'
import theme from 'theme';

const AlertBlock = ({
	style,
	status,
	role,
	rentId,
	hasReviewed,
	openImportantMessageModal, 
	onReviewed,
	...rest
}) => {

	const STATUSES = {
		AWAITS_INITIAL_PAYMENT: {
			GUEST: {
				title: '',
				text: '',
			},
			HOST: {
				title: '',
				text: '',
			},
		},
		AWAITS_UPDATE_PAYMENT: {
			GUEST: {
				title: '',
				text: '',
			},
			HOST: {
				title: '',
				text: '',
			},
		},
		AWAITS_GUEST_SCORING_COMPLETION: {
			GUEST: {
				title: 'Ваши документы находятся на проверке',
				text:
					'Обычно это занимает несколько минут. При необходимости, мы свяжемся с вами по телефону',
			},
			HOST: {
				title: '',
				text: '',
			},
		},
		AWAITS_HOST_APPROVAL: {
			GUEST: {
				title: 'Ожидаем ответ от владельца',
				text:
					'Необходимо получить подтверждение. Обычно, это занимает пару минут. Ниже вам доступен контактный номер владельца',
			},
			HOST: {
				title: 'Водитель ожидает вашего ответа',
				text: 'Подтвердите аренду как можно быстрее. Ниже вам доступны данные о водителе для вашей службы безопасности. Мы рекомендуем связаться с водителем по телефону и обсудить детали передачи машины',
			},
		},
		APPROVED_BY_HOST: {
			GUEST: {
				title: 'Бронирование подтверждено!',
				text: (
					<Text>
						Позвоните владельцу и обсудите детали. Не забудьте взять с собой паспорт и права, принять автомобиль можете только вы.
						Обязательно ознакомьтесь с
						<TextButton
							title=" инструкцией по приему и возврату автомобиля"
							style={styles.descriptionLink}
							onPress={() =>
								Linking.openURL(
									'https://help.getarent.ru/knowledge-bases/2/articles/40-priyom-i-vozvrat-avtomobilya?utm_source=arenda-gost&utm_medium=priem-vozvrat-avto'
								)
							}
						/>
					</Text>
				),
			},
			HOST: {
				title: 'Бронирование подтверждено!',
				text: (
					<Text>
						Позвоните водителю и расскажите детали получения автомобиля. Он будет рад вашему звонку. Так вы окажете сервис лучшего качества!
						Обязательно ознакомьтесь с
						<TextButton
							title=" инструкцией по приему и возврату автомобиля"
							style={styles.descriptionLink}
							onPress={() =>
								Linking.openURL(
									'https://help.getarent.ru/knowledge-bases/2/articles/40-priyom-i-vozvrat-avtomobilya?utm_source=arenda-gost&utm_medium=priem-vozvrat-avto'
								)
							}
						/>
					</Text>
				),
			},
		},
		IN_PROGRESS: {
			GUEST: {
				title: 'При повреждении, ДТП, аварии или угоне обязательно сообщите в полицию!',
				text: (
					<TextButton
						title="Важная информация о страховании, ремонтах и возмещениях по данной поездке"
						style={styles.descriptionLink}
						onPress={openImportantMessageModal}
					/>
				),
			},
			HOST: {
				title: 'При повреждении, ДТП, аварии или угоне обязательно сообщите в полицию!',
				text: (
					<Text>
						<TextButton
							title="Важная информация о страховании, ремонтах и возмещениях по данной поездке"
							style={styles.descriptionLink}
							onPress={openImportantMessageModal}
						/>
					</Text>
				),
			},
		},
		FINISHED: {
			GUEST: {
				title: 'Ваша аренда успешно завершена!',
				text:
					'Благодарим что воспользовались нашим сервисом.',
				button: (
					<>
						{
							!hasReviewed
							&&
								<PrimaryButton
									style={styles.button}
									outlined
									title="Оставить отзыв"
									onPress={() => {
										api.navigation.navigate('Review', { role, rentId, callback: onReviewed });
									}}
								/>
						}
					</>
				),
			},
			HOST: {
				title: 'Ваша аренда успешно завершена!',
				text: '',
				button: (
					<>
						{
							!hasReviewed
							&&
								<PrimaryButton
									style={styles.button}
									outlined
									title="Оставить отзыв"
									onPress={() => {
										api.navigation.navigate('Review', { role, rentId, callback: onReviewed });
									}}
								/>
						}
					</>
				),
			},
		},
		DECLINED_AUTOMATICALLY: {
			GUEST: {
				title: '',
				text: '',
			},
			HOST: {
				title: '',
				text: '',
			},
		},
		DECLINED_BY_HOST: {
			GUEST: {
				title: 'Аренда отменена владельцем',
				text:
					'Нам очень жаль, что владелец отменил аренду. Мы обязательно выясним, почему это произошло, и рассмотрим его дальнейшую работу на сервисе. Мы оформили возврат денег на вашу карту. Пожалуйста, выберите другую машину или обратитесь в службу поддержки',
			},
			HOST: {
				title: 'Аренда отменена владельцем',
				text: '',
			},
		},
		DECLINED_BY_GUEST: {
			GUEST: {
				title: 'Аренда отменена водителем',
				text: (
					<Text>
						<Text style={styles.description}>
							Деньги будут возвращены на вашу карту согласно
						</Text>
						<TextButton
							title=" Политике отмены "
							style={styles.descriptionLink}
							onPress={() =>
								Linking.openURL(
									'https://help.getarent.ru/ru/knowledge-bases/2/articles/78-politika-otmenyi-arendyi?utm_source=arenda-gost&utm_medium=politika-otmenyi'
								)
							}
						/>
						сервиса
					</Text>
				),
			},
			HOST: {
				title: 'Аренда отменена водителем',
				text: (
					<Text>
						<Text style={styles.description}>
							Нам очень жаль, что водитель отменил аренду. Мы
							обязательно выясним, почему это произошло. Если
							отмена поездки произошла менее чем за 24 часа до ее
							начала, то вы получите компенсацию.
						</Text>
						<TextButton
							title=" Узнать подробнее"
							style={styles.descriptionLink}
							onPress={() =>
								Linking.openURL(
									'https://help.getarent.ru/ru/knowledge-bases/2/articles/19-otmena-bronirovaniya-arendatorom?utm_source=arenda-host&utm_medium=otmena-arendatorom'
								)
							}
						/>
					</Text>
				),
			},
		},
	};

	const text = !!(status && role) && STATUSES[status][role].text;

	return (
		<Paper style={[styles.container, style]} elevation={1} {...rest}>
			<View style={styles.info}>
				<Icon
					name="info"
					color={theme.colors.yellow}
					style={styles.icon}
					size={theme.normalize(20)}
				/>
				<View style={styles.block}>
					<Text style={[theme.styles.P1, styles.title]}>
						{!!(status && role) && STATUSES[status][role].title}
					</Text>
					{
						!!text
						&&
							<Text style={styles.description}>
								{text}
							</Text>
					}
				</View>
			</View>
			{!!(status && role) && STATUSES[status][role].button}
		</Paper>
	);
};

export default React.memo(AlertBlock);

const styles = StyleSheet.create({
	container: {
		borderColor: theme.colors.yellow,
		borderRadius: theme.normalize(4),
		borderWidth: theme.normalize(1),
		flexDirection: 'column',
		padding: theme.spacing(3),
	},
	info: {
		flexDirection: 'row',
	},
	icon: {
		marginVertical: theme.spacing(0.5),
		width: theme.normalize(30),
	},
	block: {
		flex: 1,
	},
	title: {
	},
	description: {
		...theme.styles.P2R,
		color: theme.colors.darkGrey,
		lineHeight: theme.normalize(20),
		marginTop: theme.spacing(2.5),
	},
	descriptionLink: {
		...theme.styles.P2R,
		lineHeight: theme.normalize(20),
		color: theme.colors.blue,
	},
	descriptionBold: {
		...theme.styles.P2,
		lineHeight: theme.normalize(20),
	},
	button: {
		marginBottom: theme.spacing(3),
		marginTop: theme.spacing(6),
		marginHorizontal: theme.spacing(3),
	},
});
