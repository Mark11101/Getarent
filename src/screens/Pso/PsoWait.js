import React from 'react';
import { SafeAreaView, Text, StyleSheet, View } from 'react-native';
import theme from 'theme';
import api from 'api';
import { PrimaryButton, Icon } from 'components';

import psoStyle from './style';

export default function PsoWait({
	route: {
		params: { uuid, isStart, role },
	},
}) {
	const textWait =
		role === 'GUEST'
			? 'Ожидаем осмотр автомобиля от владельца'
			: 'Ожидаем осмотр автомобиля от водителя';

	return (
		<SafeAreaView style={psoStyle.container}>
			<View style={[psoStyle.offset, styles.mainContainer]}>
				<View>
					<Icon
						name="sandglass"
						style={styles.icon}
						color={theme.colors.lightCyan}
						size={theme.normalize(80)}
					/>
					<Text style={styles.lightText}>{textWait}</Text>
				</View>
			</View>
			<View style={psoStyle.offset}>
				{isStart ? (
					<>
						<PrimaryButton
							outlined
							style={styles.button}
							title="Вернуться к аренде"
							onPress={() => api.navigation.navigate('RentRoom', {
								uuid,
								role,
							})}
						/>
						<PrimaryButton
							titleStyle={{
								color: theme.colors.blue,
							}}
							style={{
								...styles.button,
								backgroundColor: theme.colors.white,
							}}
							title="Отказаться и отменить аренду"
							onPress={() => api.navigation.navigate('RentRoom', {
								uuid,
								role,
							})}
						/>
					</>
				) : (
					<PrimaryButton
						outlined
						style={styles.button}
						title="Вернуться к аренде"
						onPress={() => api.navigation.navigate('Trips')}
					/>
				)}
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	lightText: {
		...theme.getFontProps('semibold', 14, 18),
		paddingHorizontal: theme.spacing(10),
		textAlign: 'center',
		color: theme.colors.lightCyan,
	},
	button: {
		marginBottom: theme.spacing(4),
	},
	icon: {
		textAlign: 'center',
		marginVertical: theme.spacing(10),
	},
	mainContainer: {
		flexGrow: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
});
