import {
	Text,
	View,
	Image,
	ScrollView,
	StyleSheet,
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
						source={require('img/checklist.png')}
					/>
					<Text style={styles.header}>
						Давайте пройдемся по списку:
					</Text>
					<View style={styles.box}>
						<OutlineCircle
							diameter={35}
							color={theme.colors.black}
							text="1"
						/>
						<View style={styles.textContainer}>
							<Text style={styles.title}>
								Есть ли повреждения у автомобиля?
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
								Кузов и салон чистые? А багажник?
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
								Топлива столько же, сколько было при передаче?
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
								Диски и колеса не повреждены?
							</Text>
						</View>
					</View>
					<View style={styles.box}>
						<OutlineCircle
							diameter={35}
							color={theme.colors.black}
							text="5"
						/>
						<View style={styles.textContainer}>
							<Text style={styles.title}>
								Машина возвращена вовремя?
							</Text>
						</View>
					</View>
					<Text style={[theme.styles.P2R, styles.lastBlock]}>
						Имеете ли вы какие-либо претензии к водителю в данный
						момент? Если да, обязательно сообщите ему об этом.
						Предложите ему оплатить ущерб “на месте”. Если возникнет
						конфликтная ситуация, прикрепите фотографии на следующем
						этапе и сделайте запрос на возмещение через Getarent.
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

export const HostPostRentPopup = React.memo(Popup);

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
