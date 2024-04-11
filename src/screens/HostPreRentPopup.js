import {
	Text,
	View,
	Image,
	StyleSheet,
	ScrollView,
	SafeAreaView,
} from 'react-native';
import React, { useCallback } from 'react';

import { Header, PrimaryButton, OutlineCircle } from 'components';

import theme from 'theme';

const Popup = ({
	route: {
		params: { onPso },
	},
}) => {
	
	const onPress = useCallback(() => {
		onPso(true);
	}, [onPso]);

	return (
		<SafeAreaView style={[theme.styles.paper, theme.styles.flex]}>
			<ScrollView
				keyboardShouldPersistTaps="handled"
				showsVerticalScrollIndicator={false}
				style={theme.styles.container}
			>
				<Header title="" />
				<View style={styles.content}>
					<Image
						style={styles.img}
						source={require('img/rules.png')}
					/>
					<Text style={[theme.styles.P2R, styles.firstBlock]}>
						В момент подтверждения поездки вы подписали договор
						аренды с водителем
					</Text>
					<Text style={styles.header}>
						Пожалуйста, перед тем как передать ключи:
					</Text>
					<View style={styles.box}>
						<OutlineCircle
							diameter={35}
							color={theme.colors.black}
							text="1"
						/>
						<View style={styles.textContainer}>
							<Text style={styles.title}>
								Спросите у водителя цель поездки
							</Text>
							<Text style={theme.styles.P2R}>
								Попросите его в случае изменения планов
								предупредить вас об этом
							</Text>
						</View>
					</View>
					<View style={styles.box}>
						<OutlineCircle
							diameter={35}
							color={theme.colors.black}
							text="2"
						/>
						<View style={styles.textContainer}>
							<Text style={styles.title}>
								Спросите у водителя “есть ли другие водители”?
							</Text>
							<Text style={theme.styles.P2R}>
								Попросите других водителей зарегистрироваться в
								Getarent.
							</Text>
						</View>
					</View>
					<View style={styles.box}>
						<OutlineCircle
							diameter={35}
							color={theme.colors.black}
							text="3"
						/>
						<View style={styles.textContainer}>
							<Text style={styles.title}>
								Проверьте паспорт и права и сравните с данными,
								которые указаны в поездке
							</Text>
							<Text style={theme.styles.P2R}>
								Нужно сверить ФИО и дату рождения
							</Text>
						</View>
					</View>
					<View style={styles.box}>
						<OutlineCircle
							diameter={35}
							color={theme.colors.black}
							text="4"
						/>
						<View style={styles.textContainer}>
							<Text style={styles.title}>
								Сообщите водителю, что в случае опоздания,
								необходимо продлить поездку через службу
								поддержки
							</Text>
							<Text style={theme.styles.P2R}>
								Getarent использует эти данные, чтобы продлить
								страхование вашей машины.
							</Text>
						</View>
					</View>
					<Text style={[theme.styles.P2R, styles.lastBlock]}>
						Мы сообщили водителю о его ответственности за курение,
						нарушение ПДД, передачу руля третьим лицам, езду по
						бездорожью и многое другое. Напомнить ему об этом будет
						не лишним
					</Text>
				</View>
			</ScrollView>
			<PrimaryButton
				style={styles.button}
				title="Спасибо, всё понятно"
				onPress={onPress}
			/>
		</SafeAreaView>
	);
};

export const HostPreRentPopup = React.memo(Popup);

const styles = StyleSheet.create({
	header: {
		...theme.styles.H2,
		fontWeight: '700',
		marginBottom: theme.spacing(10),
		lineHeight: theme.normalize(34),
	},
	title: {
		...theme.styles.H4,
		fontWeight: '700',
		marginBottom: theme.spacing(4),
	},
	img: {
		alignSelf: 'center',
		resizeMode: 'contain',
		width: theme.normalize(200),
		height: theme.normalize(170),
		marginBottom: theme.spacing(6),
	},
	content: {
		paddingHorizontal: theme.spacing(6),
	},
	button: {
		margin: theme.spacing(4),
	},
	box: {
		flexDirection: 'row',
		marginBottom: theme.spacing(6),
	},
	textContainer: {
		flex: 1,
		marginLeft: theme.spacing(5),
	},
	lastBlock: {
		marginTop: theme.spacing(4),
		marginBottom: theme.spacing(10),
	},
	firstBlock: {
		marginBottom: theme.spacing(10),
	},
});
