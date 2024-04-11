import {
	Text,
	View,
	Image,
	ScrollView,
	StyleSheet,
	SafeAreaView,
} from 'react-native';
import React from 'react';

import api from 'api';
import { Header, PrimaryButton, OutlineCircle } from 'components';

import theme from 'theme';

const Popup = () => {
	
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
						source={require('img/referal.png')}
					/>
					<Text style={styles.header}>
						Расскажите о Getarent своим друзьям
					</Text>
					<View style={styles.box}>
						<OutlineCircle
							diameter={35}
							color={theme.colors.black}
							text="1"
						/>
						<View style={styles.textContainer}>
							<Text style={styles.title}>
								Получите 3 000 ₽ за каждую новую машину
							</Text>
							<Text style={theme.styles.P2R}>
								Если по вашей рекомендации зарегистрируется
								новая машина, вы получите вознаграждение в 3 000
								рублей: 1 500₽ после регистрации и 1 500₽ после
								первой аренды.
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
								Получите 1 000 ₽ за каждого нового
								путешественника
							</Text>
							<Text style={theme.styles.P2R}>
								Если по вашей рекомендации новый путешественник
								забронирует машину
							</Text>
						</View>
					</View>
					<Text style={[theme.styles.P2R, styles.lastBlock]}>
						Владельцы машин получат вознаграждение в виде выплаты, а
						путешественники - в виде скидок на поездки. Новому
						пользователю при регистрации достаточно сообщить ваш
						телефон
					</Text>
				</View>
			</ScrollView>
			<PrimaryButton
				style={styles.button}
				title="Спасибо, всё понятно"
				onPress={() => api.navigation.goBack()}
			/>
		</SafeAreaView>
	);
};

export const ReferalPopup = React.memo(Popup);

const styles = StyleSheet.create({
	header: {
		...theme.styles.H2,
		fontWeight: '700',
		marginBottom: theme.spacing(6),
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
});
