import React from 'react';
import { formatInTimeZone } from 'date-fns-tz';
import { ru } from 'date-fns/locale';
import { View, Text, StyleSheet } from 'react-native';

import { useTimeZone } from '../hooks/useTimeZone'
import api from 'api';
import Icon from './Icon';
import TextButton from './TextButton';

import theme from 'theme';

const CarLocation = ({
	style,
	address,
	startDate,
	endDate,
	lon,
	lat,
	showMap,
}) => {
	const timeZone = useTimeZone(lat, lon);

	return (
		<View style={[styles.location, style]}>
			<Text style={theme.styles.P1}>
				Место получения
			</Text>
			<View style={styles.spaceBetween}>
				<Text style={styles.addressText}>
					{address}
				</Text>
				{
					showMap && lon && lat 
					&&
						<TextButton
							style={styles.addressMap}
							title="Карта"
							onPress={() =>
								api.navigation.navigate(
									'PointMap',
									{ lon, lat },
									true
								)
							}
						/>
				}
			</View>
			<View style={styles.date}>
				<View>
					<Text style={theme.styles.P1}>
						Получение
					</Text>
					<Text style={theme.styles.P2R}>
						{formatInTimeZone(
							startDate,
							timeZone,
							'dd MMM, HH:mm',
							{
								locale: ru,
							}
						)}
					</Text>
				</View>
				<Icon
					name="arrow-right"
					color={theme.colors.black}
					style={styles.checkmark}
					size={theme.normalize(12)}
				/>
				<View>
					<Text style={theme.styles.P1}>
						Возврат
					</Text>
					<Text style={theme.styles.P2R}>
						{formatInTimeZone(endDate, timeZone, 'dd MMM, HH:mm', {
							locale: ru,
						})}
					</Text>
				</View>
			</View>
		</View>
	);
};

export default CarLocation;

const styles = StyleSheet.create({
	addressMap: {
		...theme.styles.P2,
		color: theme.colors.blue,
		textDecorationLine: 'underline',
		textDecorationStyle: 'solid',
	},
	addressText: {
		...theme.styles.P2R,
		width: '80%',
	},
	date: {
		flexDirection: 'row',
		alignItems: 'center',
		marginVertical: theme.normalize(12),
	},
	checkmark: {
		marginHorizontal: 34,
	},
	spaceBetween: {
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	checkmark: {
		marginHorizontal: theme.spacing(9)
	},
});
