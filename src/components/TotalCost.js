import React from 'react';
import DeviceInfo from 'react-native-device-info';
import { View, StyleSheet, Text } from 'react-native';

import PrimaryButton from './PrimaryButton';
import { formatPrice, getDaysDeclention } from 'functions';

import theme from 'theme';

const TotalCost = ({
	style,
	dayPrice,
	discountPrice,
	rentDuration,
	insurance,
	selectedDistantPackage,
	onPress,
	disabled,
	...rest
}) => {
	
	return (
		<View style={[styles.totalCost, style]} {...rest}>
			{
				discountPrice
				?
					<View style={styles.priceView}>
						<View style={styles.row}>
							<Text style={styles.rentDiscount}>
								{formatPrice(
									(
										discountPrice + 
										(selectedDistantPackage?.price || 0) + 
										(insurance?.alreadyInsured ? insurance?.price : 0)
									) * rentDuration
								)}
							</Text>
							<Text style={[styles.greyText, { fontSize: 12 }]}>
								{' '}/{' '}
								{rentDuration}
								{' ' + getDaysDeclention(rentDuration)}
							</Text>
						</View>
						<View style={styles.row}>
							<Text style={styles.greyText}>
								{formatPrice(
									discountPrice + 
									(selectedDistantPackage?.price || 0) + 
									(insurance?.alreadyInsured ? insurance?.price : 0)
								)}
							</Text>	
							<Text style={[styles.greyText, { fontSize: 10 }]}>
								{' '}/ день
							</Text>			
						</View>
					</View>
				:
					<Text style={theme.styles.P1}>
						{formatPrice(dayPrice + (selectedDistantPackage?.price || 0))} / день
					</Text>
			}
			<PrimaryButton
				style={styles.button}
				title="Продолжить"
				onPress={onPress}
				disabled={disabled}
			/>
		</View>
	);
};

export default React.memo(TotalCost);

const styles = StyleSheet.create({
	totalCost: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: theme.spacing(6),
		paddingTop: theme.spacing(4),
		paddingBottom: 
			/* DeviceInfo.hasNotch()  */false
			? theme.spacing(8)
			: theme.spacing(4),
		backgroundColor: 'white',
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 7,
		},
		shadowOpacity: 0.41,
		shadowRadius: 9.11,
		elevation: 14,
	},
	row: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
	},
	priceView: {
		alignItems: 'center'
	},
	rentDiscount: {
		fontSize: 22,
		fontWeight: '600',
	},
	greyText: {
		color: theme.colors.darkGrey,
	},
	button: {
		paddingHorizontal: theme.spacing(2.5),
		paddingVertical: theme.spacing(1),
	},
});
