import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import Paper from './Paper'
import Separator from './Separator'
import CarLocation from './CarLocation'
import CarIndicators from './CarIndicators'
import PrimaryButton from './PrimaryButton'

import api from 'api';
import { pluralize, formatPrice } from 'functions';

import theme from 'theme';

const CarRental = ({
	style,
	car,
	bill,
	user,
	startDate,
	endDate,
	rentDuration,
	carTransferLocation,
	distancePackage,
}) => {
	
	const {
		photo,
		brand,
		model,
		productionYear,
		rentsQty,
		reviewsQty,
		rating,
	} = { ...car };
	
	const allBillsTotal = bill
		? bill.reduce((sum, { total }) => {
				const newSum = sum + total;
				return newSum;
		  }, 0)
		: 0;

	return (
		<View style={style}>
			<Paper style={styles.paper}>
				<CarIndicators
					photo={photo}
					brand={brand}
					model={model}
					productionYear={productionYear}
					rentsQty={rentsQty}
					reviewsQty={reviewsQty}
					rating={rating}
					isRatingShowing={true}
				/>
				<Separator light style={styles.separator} />
				{!!carTransferLocation && (
					<CarLocation
						showMap
						address={
							carTransferLocation?.data?.address ||
							carTransferLocation?.data?.name ||
							null
						}
						lon={carTransferLocation?.data?.longitude || null}
						lat={carTransferLocation?.data?.latitude || null}
						startDate={startDate}
						endDate={endDate}
					/>
				)}
				<Separator light style={styles.separator} />
				<View style={[styles.spaceBetween, { marginBottom: theme.spacing(7) }]}>
					<Text style={[theme.styles.P1R, { fontWeight: '600'}]}>
						Итого х {rentDuration}{' '}
						{pluralize(rentDuration, 'день', 'дня', 'дней')} аренды
					</Text>
					<Text style={styles.price}>
						{formatPrice(allBillsTotal)}
					</Text>
				</View>
				<PrimaryButton
					// style={styles.button}
					outlined
					title="Подробнее"
					onPress={() =>
						api.navigation.navigate(
							'RentRoomBill',
							{
								car,
								user,
								bill,
								rentDuration,
								startDate,
								endDate,
								carTransferLocation,
								distancePackage,
							},
							true
						)
					}
				/>
			</Paper>
		</View>
	);
};

export default React.memo(CarRental);

const styles = StyleSheet.create({
	paper: {
		padding: theme.spacing(4),
	},
	separator: {
		marginVertical: theme.spacing(5),
	},
	spaceBetween: {
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	textButton: {
		...theme.styles.P2,
		color: theme.colors.blue,
		marginLeft: 'auto',
	},
	price: {
		fontSize: 21,
		fontWeight: '500',
	},
});
