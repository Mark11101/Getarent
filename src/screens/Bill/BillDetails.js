import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

import api from 'api';
import { carFeatures } from 'data';
import { Separator, PriceRow } from 'components';

import theme from 'theme';

const styles = StyleSheet.create({
	separator: {
		marginTop: theme.spacing(4),
	},
	extendedPriceRow: {
		width: '105%',
		left: '-2%',
	}
});

const BillDetails = ({
	bill,
	role,
	isOnlyOneBill,
	distancePackage,
}) => {

	const {
		details: { daily },
		purpose,
	} = bill;

	const insuranceFee = daily?.insuranceFee;
	const youngDriverFee = daily?.youngDriverFee;
	
	return (
		<View>
			{
				daily
				&&
					<View style={{ paddingLeft: 3 }}>
						{
							!isOnlyOneBill 
							&&
								<View style={{ marginBottom: 10 }}>
									{
										purpose === 'RENT_INITIAL'
										?
											<Text style={theme.styles.P1}>
												Основная аренда
											</Text>
										:
											<Text style={[
												theme.styles.P1,
												{ marginTop: 20 }
											]}>
												Продление аренды
											</Text>
									}
								</View>
						}
						{daily?.rentPrice !== undefined && (
							<PriceRow
								title="Стоимость аренды / день"
								price={daily.rentPrice}
								style={!!youngDriverFee && styles.extendedPriceRow}
							/>
						)}
						{daily?.discountedAmount !== undefined && (
							<PriceRow
								title="Скидка за аренду / день"
								price={'-' + daily.discountedAmount}
								style={!!youngDriverFee && styles.extendedPriceRow}
							/>
						)}
						{!!daily?.features &&
							Object.keys(daily.features).map(function (key) {
								return (
									<PriceRow
										key={key}
										price={daily.features[key]}
										title={carFeatures[key]?.label + ' / день'}
										style={!!youngDriverFee && styles.extendedPriceRow}
									/>
								);
							})
						}
						{daily?.distancePackage !== undefined && (
							<PriceRow
								title={
									distancePackage.kmQuantity === 'infinity'
									?
										"Неограниченный пробег / день"
									:
										`Доп. пакет ${distancePackage.kmQuantity} км / день`
								}
								price={daily.distancePackage}
								style={!!youngDriverFee && styles.extendedPriceRow}
							/>
						)}
						{(role === 'GUEST') && (insuranceFee !== undefined) && (
							<PriceRow
								price={insuranceFee}
								title="Страхование КАСКО / день"
								style={!!youngDriverFee && styles.extendedPriceRow}
								onPressPopup={() => api.navigation.navigate('InsurancePopup', { price: insuranceFee })}
							/>
						)}
						{(role === 'GUEST') && !!youngDriverFee && (
							<PriceRow
								price={youngDriverFee}
								title="Повышенный сбор КАСКО / день"
								style={!!youngDriverFee && styles.extendedPriceRow}
								textContainerStyle={{ maxWidth: null }}
								onPressPopup={() => api.navigation.navigate('IncreasedFeePopup')}
							/>
						)}
						<Separator 
							light 
							style={[styles.separator, { marginBottom: theme.spacing(4) }]} 
						/>
						{daily?.total !== undefined && (
							<PriceRow title="Итого / день" price={daily.total} />
						)}
						<Separator 
							light 
							style={styles.separator} 
						/>
					</View>
			}
		</View>
	);
};

export default BillDetails;
