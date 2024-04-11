import {
	View,
	Image,
	Text,
	Platform,
	StyleSheet,
	TouchableOpacity,
} from 'react-native';
import React from 'react';

import Paper from './Paper';
import Icon from './Icon';
import { formatPrice, formatRating } from 'functions';

import theme from 'theme';

const iconSize = theme.normalize(13);

const ProfileCar = ({
	style,
	photo,
	brand,
	model,
	price,
	rating,
	rentsQty,
	onPress,
	onLayout,
}) => {

	return (
		<TouchableOpacity
			style={[styles.container, style]}
			{...{ onPress, onLayout }}
		>
			<Paper elevation={10}>
				<Image style={styles.img} source={{ uri: photo }} />
				<Paper style={styles.pricePaper} elevation={10}>
					<Text
						style={
							Platform.OS === 'android' && styles.androidPriceFix
						}
					>
						<Text style={theme.styles.H3}>
							{formatPrice(price)}
						</Text>
						<Text style={theme.styles.XS}>
							/сутки
						</Text>
					</Text>
				</Paper>
				<View style={styles.content}>
					<View style={styles.column}>
						<Text style={theme.styles.P1}>
							{brand} {model}
						</Text>
						<Text style={styles.trips}>
							Поездки: {rentsQty}
						</Text>
					</View>
					<View style={styles.column2}>
						<View style={styles.rating}>
							<Text style={theme.styles.P2R}>
								{formatRating(rating)}{' '}
							</Text>
							<Icon
								style={styles.icon}
								name="star"
								size={iconSize}
								color={theme.colors.yellow}
							/>
						</View>
					</View>
				</View>
			</Paper>
		</TouchableOpacity>
	);
};

export default React.memo(ProfileCar);

const styles = StyleSheet.create({
	container: {
		marginHorizontal: theme.spacing(4),
		marginVertical: theme.spacing(2),
	},
	img: {
		...theme.styles.src.round,
		flex: 1,
		height: theme.normalize(216),
		width: '100%',
	},
	pricePaper: {
		position: 'absolute',
		right: theme.normalize(16),
		top: theme.normalize(152),
		width: theme.normalize(120),
		height: theme.normalize(40),
		justifyContent: 'center',
		alignItems: 'center',
	},
	androidPriceFix: {
		marginBottom: -theme.spacing(2),
	},
	content: {
		flexDirection: 'row',
		alignItems: 'stretch',
		padding: theme.spacing(4),
	},
	column: {
		flex: 1,
		marginRight: theme.spacing(2),
	},
	column2: {
		justifyContent: 'space-between',
		alignItems: 'flex-end',
	},
	trips: {
		...theme.styles.src.P2R,
		color: theme.colors.darkGrey,
	},
	rating: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		alignItems: 'center',
	},
	icon: {
		marginBottom: theme.spacing(0.5),
	},
});
