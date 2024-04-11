import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import BarBody from './BarBody';

import theme from 'theme';

const defaultIconProps = {
	iconSize: theme.normalize(20),
	iconColor: theme.colors.lightCyan,
};

const building = {
	...defaultIconProps,
	icon: 'building',
	iconSize: theme.normalize(16.5),
};

const iconProps = {
	empty: {
		...defaultIconProps,
		icon: 'map',
		iconSize: theme.normalize(18),
	},
	MY_LOCATION: {
		icon: 'aim',
		iconSize: theme.normalize(24),
	},
	station: {
		...defaultIconProps,
		icon: 'station',
	},
	'station.stop': {
		...defaultIconProps,
		icon: 'station',
	},
	'station.metro': {
		...defaultIconProps,
		icon: 'metro',
	},
	street: {
		...defaultIconProps,
		icon: 'street',
	},
	building,
	org: building,
	branch: building,
	other: {
		...defaultIconProps,
		icon: 'pin',
	},
};

const Place = ({
	id,
	type,
	name,
	address,
	invalid,
	location,
	placeholderOnlyAddress,
	placeholder = 'Выберите город',
	...rest
}) => {

	return (
		<BarBody {...(iconProps[type] || iconProps.other)} {...rest}>
			{
				type === 'empty' 
				?
					<Text style={[
						styles.placeholder,
						invalid && { color: theme.colors.red }
					]}>
						{placeholder}
					</Text>
			 	: 
					type === 'MY_LOCATION' || type === 'MAP' 
				?
					<Text style={styles.geolocation}>
						{name}
					</Text>
				:
					<>
						{
							placeholderOnlyAddress
							?
								<View style={styles.container}>
									<Text style={styles.name} numberOfLines={1}>
										{address}
									</Text>
								</View>
							:
								<View style={styles.container}>
									{
										name
										&&
											<Text style={styles.name} numberOfLines={1}>
												{name}
											</Text>
									}
									<Text 
										style={[
											styles.address,
											{ color: name ? theme.colors.lightCyan : theme.colors.black}
										]} 
										numberOfLines={1}
									>
										{address}
									</Text>
								</View>
						}
					</>
			}
		</BarBody>
	);
};

export default React.memo(Place);

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'space-around',
	},
	placeholder: {
		...theme.styles.src.P2R,
	},
	geolocation: {
		...theme.styles.src.P2,
		color: theme.colors.blue,
	},
	name: {
		...theme.styles.src.P2R,
		lineHeight: undefined,
		marginBottom: theme.spacing(0.5),
	},
	address: {
		...theme.styles.src.XS,
		lineHeight: undefined,
	},
});
