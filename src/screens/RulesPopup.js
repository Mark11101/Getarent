import {
	Text,
	View,
	Image,
	ScrollView,
	StyleSheet,
	SafeAreaView,
} from 'react-native';
import React, { useCallback } from 'react';

import api from 'api';
import { rulesPopupContent } from 'data';
import { Header, PrimaryButton, Icon } from 'components';

import theme from 'theme';

const Popup = ({ route: { params: { onPso, onCancel } = {} } }) => {

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
				<Header 
					title="" 
					onPressBack={() => api.navigation.navigate('RentRoom')}
				/>
				<View style={styles.content}>
					<Image
						style={styles.img}
						source={require('img/rules.png')}
					/>
					<Text style={[theme.styles.P2R, styles.firstBlock]}>
						В момент оплаты вы подписали договор аренды с владельцем
						автомобиля.
					</Text>
					<Text style={styles.header}>
						Это основные правила нашего Сообщества
					</Text>
					{rulesPopupContent.map(({ id, title, text }) => (
						<View key={id} style={styles.box}>
							<Icon
								name={'info'}
								size={theme.normalize(35)}
								color={theme.colors.red}
							/>
							<View style={styles.textContainer}>
								<Text style={styles.title}>
									{title}
								</Text>
								<Text style={theme.styles.P2R}>
									{text}
								</Text>
							</View>
						</View>
					))}
					<Text style={[theme.styles.P2R, styles.lastBlock]}>
						Мы строим безопасное сообщество, где нет места
						недобросовестным водителям. Эта машина - большая
						ценность для владельца. Пожалуйста, относитесь к ней как
						к собственной.
					</Text>
				</View>
			</ScrollView>
			<PrimaryButton
				style={styles.button}
				title="Я надёжный водитель, всё в порядке"
				onPress={onPress}
			/>
			<PrimaryButton
				style={styles.button}
				outlined
				title="Отказаться от аренды"
				onPress={onCancel}
			/>
		</SafeAreaView>
	);
};

export const RulesPopup = React.memo(Popup);

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
		marginHorizontal: theme.spacing(4),
		marginVertical: theme.spacing(2),
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
