import {
	Text,
	View,
	Image,
	StyleSheet,
	ScrollView,
	SafeAreaView,
} from 'react-native';
import React from 'react';

import { Header } from 'components';

import theme from 'theme';

const Insurance = () => {

	return (
		<SafeAreaView style={[theme.styles.paper, theme.styles.flex]}>
			<ScrollView style={{ ...styles.container, ...theme.styles.grow }}>
				<Header title="Ваша поездка застрахована" />
				<View style={styles.list}>
					<View style={styles.listRow}>
						<View style={styles.block} />
						<Text style={styles.text}>
							<Text style={theme.styles.P1R}>
								от повреждений и угона автомобиля на полную его
								стоимость с франшизой
							</Text>
							<Text style={theme.styles.P1}> 20 000 рублей</Text>
						</Text>
					</View>
					<View style={styles.listRow}>
						<View style={styles.block} />
						<Text style={styles.text}>
							<Text style={theme.styles.P1R}>
								от причинения вреда имуществу третих лиц на
								сумму
							</Text>
							<Text style={theme.styles.P1}>
								{' '}
								до 400 000 рублей
							</Text>
						</Text>
					</View>
					<View style={styles.listRow}>
						<View style={styles.block} />
						<Text style={styles.text}>
							<Text style={theme.styles.P1R}>
								от причинения вреда здоровью третьим лицам на
								сумму
							</Text>
							<Text style={theme.styles.P1}>
								{' '}
								до 500 000 рублей
							</Text>
						</Text>
					</View>
					<View style={styles.listRow}>
						<View style={styles.block} />
						<Text style={styles.text}>
							<Text style={theme.styles.P1R}>
								от несчастных случаев на сумму{' '}
								<Text style={theme.styles.P1}>
									150 000 рублей
								</Text>{' '}
								для водителей и пассажиров
							</Text>
						</Text>
					</View>
				</View>
				<View style={{ ...styles.bottom }}>
					<Image
						style={styles.logo}
						source={require('img/ingosstrah.png')}
					/>
					<Text style={styles.insuranceText}>
						Страховой партнер
					</Text>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

export default Insurance;

const styles = StyleSheet.create({
	block: {
		backgroundColor: theme.colors.blue,
		height: theme.normalize(8),
		marginRight: theme.spacing(5),
		top: theme.normalize(10),
		width: theme.normalize(8),
	},
	bottom: {
		flex: 1,
		justifyContent: 'flex-end',
		marginHorizontal: theme.spacing(15),
	},
	container: {
		flex: 1,
	},
	insuranceText: {
		...theme.styles.P2R,
		flex: 1,
		marginBottom: theme.spacing(8),
		lineHeight: theme.normalize(22),
		textAlign: 'center',
	},
	list: {
		paddingLeft: theme.spacing(6),
		paddingRight: theme.spacing(38),
	},
	listRow: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		marginBottom: theme.spacing(6),
	},
	logo: {
		resizeMode: 'contain',
		width: '100%',
	},
});
