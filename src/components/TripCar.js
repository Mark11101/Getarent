import React from 'react';
import { useSelector } from 'react-redux';
import { formatInTimeZone } from 'date-fns-tz';
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';

import Paper from './Paper';
import Icon from './Icon';
import StatusLine from './StatusLine';
import { formatPrice } from 'functions';

import theme from 'theme';

const TripCar = ({
	id,
	style,
	brand,
	model,
	photo,
	total,
	status,
	endDate,
	onPress,
	startDate,
	productionYear,
	registrationNumber,
	timeZone = 'UTC',
}) => {

	const { scoringStatus } = useSelector(st => st.profile);

	return (
		<TouchableOpacity
			disabled={scoringStatus === 'REJECTED'}
			style={[theme.styles.paper, styles.container, style]}
			onPress={() => onPress(id)}
		>
			<Paper elevation={10}>
				<View>
					{
						photo
						?
							<Image style={styles.img} source={{ uri: photo }} />
						:
							<View style={styles.errorImg}>
								<Icon
									name='car-error-2'
									size={theme.normalize(130)}
									color={theme.colors.white}
								/>
							</View>
					}
					<View style={styles.subInfo}>
						<Text style={styles.price}>
							{formatPrice(total)}
						</Text>
						<Text style={theme.styles.XS}>
							{formatInTimeZone(startDate, timeZone, 'dd.MM.yy')}{' '}
							- {formatInTimeZone(endDate, timeZone, 'dd.MM.yy')}
						</Text>
					</View>
				</View>
				<View style={styles.status}>
					<Text style={theme.styles.P1}>
						{brand} {model}, {productionYear} - {registrationNumber}
					</Text>
					<StatusLine status={status} />
				</View>
			</Paper>
		</TouchableOpacity>
	);
};

export default React.memo(TripCar);

const styles = StyleSheet.create({
	container: {
		marginBottom: theme.spacing(4),
	},
	img: {
		...theme.styles.src.round,
		flex: 1,
		height: theme.normalize(216),
		width: '100%',
		borderBottomLeftRadius: 0,
		borderBottomRightRadius: 0,
	},
	errorImg: {
		height: theme.normalize(216),
		width: '100%',
		justifyContent: 'center',
		alignItems: 'center',
		paddingBottom: 30,
		backgroundColor: '#e4e7ea',
	},
	status: {
		margin: theme.spacing(4),
	},
	price: {
		fontSize: 20,
		fontWeight: '600',
	},
	subInfo: {
		...theme.styles.src.round,
		alignItems: 'center',
		backgroundColor: theme.colors.white,
		bottom: theme.normalize(18),
		flexDirection: 'row',
		height: theme.normalize(40),
		justifyContent: 'space-between',
		left: 0,
		marginHorizontal: theme.spacing(4),
		paddingHorizontal: theme.spacing(4),
		position: 'absolute',
		width: '92%',
	},
});
