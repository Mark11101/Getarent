import { formatInTimeZone } from 'date-fns-tz';
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native';

import { Icon, Paper, RatingReviewsBar } from 'components';

import theme from 'theme';

export const ITEM_WIDTH = Dimensions.get('window').width * 0.87;

const ReviewWithCar = ({ style, review, openReview, ...rest }) => {

	const { reviewer, car } = review;

	const rating = useMemo(() => {

		return [...new Array(5)].map((v, i) =>
			review.rating > i ? (
				<Icon
					name="star"
					key={'icon-' + i}
					style={styles.icon}
					size={theme.normalize(14)}
					color={theme.colors.yellow}
				/>
			) : (
				<Icon
					name="star"
					key={'icon-' + i}
					style={styles.icon}
					size={theme.normalize(14)}
					color={theme.colors.grey}
				/>
			)
		);
	}, [review]);

	return (
		<TouchableOpacity onPress={() => openReview(review)}>
			<Paper
				collapsable={false}
				style={[styles.container, style]}
				{...rest}
			>
				<View style={styles.review}>
					{
						car
						&&
							<View style={{ flexDirection: 'row', marginBottom: theme.normalize(24) }}>
								{
									car.photo
									&&
										<Image style={styles.img} source={{ uri: car.photo }} />
								}
								<View style={styles.carInfo}>
									<View>
										{
											car.brand
											&&
												<Text numberOfLines={1} style={styles.carName}>
													{`${car.brand} ${car.model || ''}${car.productionYear ? (', ' + car.productionYear) : ''}`}
												</Text>
										}
										{
											car.city
											&&
												<Text style={styles.cityName}>
													{car.city}
												</Text>
										}
									</View>
									<View style={{
										flexDirection: 'row',
										alignItems: 'center',
										justifyContent: 'space-between',
									}}>
										<View>
											{
												car.rentsQty
												&&
													<Text style={[styles.rentInfo]}>
														{`поездки: ${car.rentsQty}`}
													</Text>
											}
											{
												car.reviewsQty
												&&
													<Text style={styles.rentInfo}>
														{`отзывы: ${car.reviewsQty}`}
													</Text>
											}
										</View>
										<View>
											<RatingReviewsBar
												{...{ rating: car.rating }}
											/>
										</View>
									</View>
								</View>
							</View>
					}
					<View style={styles.bodyContent}>
						<View>
							<Text
								style={[theme.fonts.P1, styles.name]}
							>
								{`${reviewer.firstName} ${reviewer.lastName}`}
							</Text>
							<View style={styles.rating}>{rating}</View>
							<Text
								numberOfLines={3}
								style={styles.comment}
							>
								{review.comment.trim()}
							</Text>
						</View>
						<Text style={styles.reviewDate}>
							{formatInTimeZone(
								review.createdAt, "UTC",
								"dd.MM.yyyy"
							)}
						</Text>
					</View>
                </View>
			</Paper>
		</TouchableOpacity>
	);
};

export default React.memo(ReviewWithCar);

const styles = StyleSheet.create({
	img: {
		width: 100,
		height: 80,
		marginRight: theme.spacing(4),
        borderRadius: 3,
	},
	carInfo: {
		flex: 1,
		justifyContent: 'space-between',
	},
    carName: {
        color: theme.colors.black,
		fontSize: theme.normalize(14),
		fontWeight: '700',
    },
    cityName: {
        color: '#303133',
		fontSize: theme.normalize(13),
		fontWeight: '500',
    },
    rentInfo: {
        color: '#303133',
		fontSize: theme.normalize(11),
		fontWeight: '400',
    },
	avatarContainer: {
		marginRight: theme.spacing(4),
	},
	container: {
		width: ITEM_WIDTH,
		height: 320,
		left: -10,
		top: 10,
        paddingHorizontal: theme.normalize(16),
        paddingVertical: theme.normalize(20),
		borderRadius: 8,
		shadowColor: 'rgb(36, 93, 150)',
		shadowOffset: {
			width: 0,
			height: 4,
		},
		shadowOpacity: 0.2,
		shadowRadius: 8,
		elevation: 6,
	},
	comment: {
		...theme.styles.P2R,
		fontSize: 14,
		lineHeight: 21,
	},
	review: {
	},
	name: {
		color: theme.colors.black,
		fontSize: theme.normalize(16),
		fontWeight: '700',
		marginBottom: theme.normalize(16),
	},
	rating: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: theme.normalize(8),
	},
	column: {
		flex: 1,
		flexDirection: 'column',
	},
	icon: {
		paddingLeft: theme.spacing(0.5),
	},
	reviewDate: {
		...theme.styles.P4,
		fontSize: 11,
		fontWeight: '400',
		color: '#303133',
	},
	bodyContent: {
		height: 170,
		justifyContent: 'space-between',
	}
});
