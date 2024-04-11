import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

import Icon from './Icon';
import { formatRating } from '../functions';

import theme from 'theme';

const CarIndicators = ({
	style,
	photo,
	brand,
	model,
	productionYear,
	rentsQty,
	reviewsQty,
	rating,
	isRatingShowing,
}) => {

	return (
		<View style={[styles.container, style]}>
			{
				photo
				?
					<Image style={styles.img} source={{ uri: photo }} />
				:
					<View style={[styles.img, styles.errorImg]}>
						<Icon 
							name='car-error-2' 
							size={theme.normalize(70)}
							color={theme.colors.white} 
						/>
					</View>
			}
			<View style={[styles.carInfo, style]}>
				<Text style={[theme.styles.P1, styles.title]}>
					{brand} {model}{`${productionYear ? ', ' + productionYear : ''}`}
				</Text>
				{
					isRatingShowing 
					&&
						<View style={[styles.spaceBetween, styles.indicators]}>
							<View>
								<Text style={styles.indicator}>
									поездки: {rentsQty}
								</Text>
								<Text style={styles.indicator}>
									отзывы: {reviewsQty}
								</Text>
							</View>
							<View style={styles.rating}>
								<Text style={theme.styles.P1R}>
									{formatRating(rating)}
								</Text>
								<Icon
									name="star"
									color={theme.colors.yellow}
									style={styles.icon}
									size={theme.spacing(3.5)}
								/>
							</View>
						</View>
				}
			</View>
		</View>
	);
};

export default React.memo(CarIndicators);

const styles = StyleSheet.create({
	carInfo: {
		flex: 1,
		height: theme.normalize(80),
		justifyContent: 'space-between',
		marginLeft: theme.spacing(4),
	},
	container: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
	},
	icon: {
		marginHorizontal: theme.spacing(1),
		marginVertical: theme.spacing(1.5),
	},
	img: {
		...theme.styles.src.round,
		height: theme.normalize(80),
		width: theme.normalize(112),
	},
	errorImg: {
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: theme.colors.grey,
	},
	indicator: {
		...theme.styles.P2R,
		lineHeight: theme.normalize(18),
	},
	indicators: {
		marginTop: theme.spacing(1),
	},
	rating: {
		borderColor: theme.colors.yellow,
		borderRadius: theme.normalize(16),
		borderWidth: theme.normalize(1),
		flexDirection: 'row',
		height: theme.normalize(32),
		justifyContent: 'center',
		marginTop: theme.spacing(1),
		width: theme.normalize(65),
	},
	spaceBetween: {
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	title: {
		lineHeight: theme.normalize(20),
	},
});
