import {
	View,
	Image,
	Text,
	Platform,
	StyleSheet,
	TouchableOpacity,
} from 'react-native';
import React, { useMemo } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { differenceInHours, addDays } from 'date-fns';

import {
	formatRating,
	getStartDate,
	calculateDiscountPrice,
} from 'functions';
import Paper from './Paper';
import Icon from './Icon';
import Separator from './Separator';

import theme from 'theme';

const iconSize = theme.normalize(13);

const tagMap = {
	IMMEDIATE_BOOKING: 'Мгновенное бронирование',
	DELIVERY_CITY: 'Доставка по городу',
	DELIVERY_AIRPORT: 'Встреча в аэропорту',
	UNLIMITED_MILAGE: 'Пробег неограничен',
	UNLIMITED_MILAGE_SERVICE: 'Пробег неограничен ₽',
	AUTOMATIC_TRANSMISSION: 'Автомат',
};

const ProfileCarItem = ({
	style,
	brand,
	model,
	rating,
	price,
	rentsQty,
	onPress,
	onLayout,
	cascoFee,
	tags = [],
	reviewsQty,
	labels = [],
	weekDiscount,
	monthDiscount,
	productionYear,
	rentPricePerDay,
	photoUrl: photo,
	twoDaysDiscount,
	fiveDaysDiscount,
	twoWeeksDiscount,
	threeDaysDiscount,
	owner: { labels: ownerLabels = [] } = {},
}) => {

	const isRatingShowing = Boolean(rating) || Boolean(rentsQty) || Boolean(reviewsQty);

	const { dateStart, dateEnd } = useSelector(st => st.car, shallowEqual);
	const period = useSelector(st => st.search.period);

	const resDateStart = dateStart || period.start || getStartDate();
	const resDateEnd = dateEnd || period.end || addDays(getStartDate(), 4);

	const rentDuration = useMemo(
		() =>
			(resDateStart &&
				resDateEnd &&
				Math.ceil(differenceInHours(resDateEnd, resDateStart) / 24)) ||
			0,
		[resDateStart, resDateEnd]
	);

	const rentDiscountPrice = useMemo(
		() =>
			calculateDiscountPrice({
				rentDuration,
				rentPricePerDay,
				twoDaysDiscount,
				threeDaysDiscount,
				fiveDaysDiscount,
				weekDiscount,
				twoWeeksDiscount,
				monthDiscount,
			}),
		[
			rentDuration,
			rentPricePerDay,
			twoDaysDiscount,
			threeDaysDiscount,
			fiveDaysDiscount,
			weekDiscount,
			twoWeeksDiscount,
			monthDiscount,
		]
	);

	const isSuperHost = ownerLabels.includes('SUPERHOST');
	const isSuperPrice = labels.includes('SUPERPRICE');
	
	return (
		<TouchableOpacity
			style={[styles.container, style]}
			{...{ onPress, onLayout }}
		>
			<Paper elevation={10}>
				<Image style={styles.img} source={{ uri: photo }} />
				{isSuperHost && (
					<Paper style={styles.pricePaper} elevation={10}>
						<View
							style={[
								styles.superhost,
								Platform.OS === 'android' &&
									styles.androidPriceFix,
							]}
						>
							<Icon
								name="user"
								style={styles.superhostIcon}
								color={theme.colors.mint}
								size={theme.normalize(14)}
							/>
							<Text
								style={[theme.styles.P2, styles.superhostIcon]}
							>
								Суперхозяин
							</Text>
						</View>
					</Paper>
				)}
				<View style={styles.content}>
					<View style={styles.column}>
						<Text style={theme.styles.P1}>
							{brand} {model}, {productionYear}
						</Text>
					</View>
					{isRatingShowing && (
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
							<Text style={styles.trips}>
								Поездки: {rentsQty}
							</Text>
							<Text style={theme.styles.P2R}>
								Отзывы: {reviewsQty}
							</Text>
						</View>
					)}
				</View>
				<View style={[styles.tags, !tags.length && styles.noTags]}>
					{tags.map((tag, i) =>
						tagMap[tag] ? (
							<Tag
								key={tag}
								text={tagMap[tag]}
								last={i === tags.length - 1}
							/>
						) : null
					)}
				</View>
				{
					(price || rentDiscountPrice.rentPricePerDay)
					&&
						<>
							<Separator light />
							<View style={styles.priceWrap}>
								{isSuperPrice && (
									<Text style={[theme.styles.P2, styles.superprice]}>
										Лучшая цена
									</Text>
								)}
								<Text style={styles.price}>
									{price || rentDiscountPrice.rentPricePerDay + cascoFee || 0}₽
								</Text>
								<Text style={[
									theme.styles.XS,
									{ top: 3 }
								]}>
									/сутки
								</Text>
							</View>
						</>
				}
			</Paper>
		</TouchableOpacity>
	);
};

export default React.memo(ProfileCarItem);

const Tag = ({ text, last }) => {

	return (
		<View style={[styles.tag, last && styles.lastTag]}>
			<Text style={styles.tagLabel}>
				{text}
			</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		margin: theme.spacing(4),
		marginTop: 0,
	},
	img: {
		...theme.styles.src.round,
		flex: 1,
		height: theme.normalize(216),
		width: '100%',
		borderBottomLeftRadius: 0,
		borderBottomRightRadius: 0,
	},
	price: {
		fontSize: 20,
		fontWeight: '500',
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
	priceWrap: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-end',
		padding: theme.spacing(2),
		paddingHorizontal: theme.normalize(16),
	},
	superprice: {
		marginRight: theme.normalize(10),
		color: theme.colors.darkYellow,
	},
	androidPriceFix: {
		marginBottom: -theme.spacing(2),
	},
	content: {
		flexDirection: 'column',
		alignItems: 'stretch',
		paddingHorizontal: theme.spacing(4),
		paddingTop: theme.spacing(4),
		paddingBottom: theme.spacing(2),
	},
	column: {
		flex: 1,
	},
	column2: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'flex-start',
		paddingTop: theme.spacing(1),
	},
	trips: {
		...theme.styles.src.P2R,
		color: theme.colors.darkGrey,
		marginRight: theme.spacing(3),
	},
	rating: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		alignItems: 'center',
		marginRight: theme.spacing(3),
	},
	icon: {
		marginBottom: theme.spacing(0.5),
	},
	tags: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		padding: theme.spacing(4),
		paddingTop: theme.spacing(1),
		paddingBottom: theme.spacing(2),
	},
	tag: {
		height: theme.normalize(24),
		borderRadius: theme.normalize(24),
		borderWidth: theme.normalize(1),
		borderColor: theme.colors.green,
		paddingHorizontal: theme.spacing(2),
		marginRight: theme.spacing(2),
		marginBottom: theme.spacing(2),
		justifyContent: 'center',
	},
	lastTag: {
		marginRight: 0,
	},
	tagLabel: {
		...theme.styles.src.XS,
		lineHeight: undefined,
	},
	noTags: {
		paddingBottom: theme.normalize(38),
	},
	superhost: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
	},
	superhostIcon: {
		marginRight: theme.normalize(4),
	},
});
