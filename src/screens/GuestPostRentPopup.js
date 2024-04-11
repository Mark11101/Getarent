import {
	Text,
	View,
	Image,
	StyleSheet,
	ScrollView,
	SafeAreaView,
} from 'react-native';
import React from 'react';

import { Header, PrimaryButton, OutlineCircle } from 'components';

import theme from 'theme';

const Popup = ({
	route: {
		params: { onRentFinish },
	},
}) => {

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
						Важное сообщение
					</Text>
					<View style={styles.box}>
						<OutlineCircle
							diameter={35}
							color={theme.colors.black}
							text="1"
						/>
						<View style={styles.textContainer}>
							<Text style={styles.title}>
								Пожалуйста, ответьте владельцу на следующие
								вопросы:
							</Text>
							<Text style={theme.styles.P2R}>
								{
									'Поездка прошла без происшествий? \nБыли ли какие-то повреждения / аварии?'
								}
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
								Спросите у владельца:
							</Text>
							<Text style={theme.styles.P2R}>
								Есть ли у него к вам какие-либо претензии по
								состоянию машины, ее чистоте, уровню топлива?
							</Text>
						</View>
					</View>
					<Text style={[theme.styles.P2R, styles.lastBlock]}>
						Если они есть, предложите оплату “на месте”. Если
						возникла конфликтная ситуация, прикрепите фотографии на
						следующем этапе. Мы поможем разобраться в ситуации.
					</Text>
				</View>
			</ScrollView>
			<PrimaryButton
				style={styles.button}
				title="Спасибо, всё понятно"
				onPress={onRentFinish}
			/>
		</SafeAreaView>
	);
};

export const GuestPostRentPopup = React.memo(Popup);

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
});
