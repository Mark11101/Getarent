import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import api from 'api';
import RadioButton from './RadioButton';
import LocationBar from './LocationBar';

import theme from 'theme';

const DeliveryPlace = ({
	uuid,
	place,
	location,
	radiuses,
	setPlace,
	popularPlaces,
	...rest
}) => {

	const [deliveryByAddress, setDeliveryByAddress] = useState(
		place?.radiusId !== undefined
	);

	const [address, setAddress] = useState(
		place?.radiusId !== undefined ? place : false
	);
	
	const onChange = (place) => {
		
		setPlace(place);
		setDeliveryByAddress(false);
	};
	
	return (
		<View {...rest}>
			<RadioButton
				value={null}
				label="Забрать по адресу владельца"
				checked={!deliveryByAddress && place === null}
				onChange={onChange}
			>
				<Text style={theme.styles.XS}>
					{location?.address}
				</Text>
			</RadioButton>
			{/* {(!!radiuses.length || !!popularPlaces.length) && (
				<DeliveryBlock style={styles.deliveryBlock} />
			)} */}
			{!!popularPlaces && popularPlaces.map(({ id, name, price, type }) => (
				<RadioButton
					key={id}
					value={id}
					label={type === 'airport' ? `аэропорт ${name}` : name}
					addon={price}
					checked={!deliveryByAddress && place && place.id === id}
					onChange={() =>
						onChange({ id, name, price, type: 'POPULAR_LOCATION' })
					}
				/>
			))}
			{!!radiuses?.length && (
				<React.Fragment>
					<RadioButton
						label="Доставить по адресу"
						checked={deliveryByAddress}
						addon={address?.price}
						onChange={() => {
							setDeliveryByAddress(true);

							setPlace(address || null);
						}}
					/>
					{
						deliveryByAddress
						&&
							<LocationBar
								style={styles.locationBar}
								placeholder="Введите адрес доставки "
								onPress={() =>
									api.navigation.navigate(
										'Location',
										{
											uuid,
											place,
											delivery: true,
											callback: place => {
												setAddress(place);
												setPlace(place);
											},
											location,
										},
										true
									)
								}
								place={address}
							/>
					}
				</React.Fragment>
			)}
		</View>
	);
};

export default React.memo(DeliveryPlace);

const styles = StyleSheet.create({
	deliveryBlock: {
		marginVertical: theme.spacing(3),
	},
	locationBar: {
		marginTop: theme.spacing(3),
	},
});
