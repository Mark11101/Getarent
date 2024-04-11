import React from 'react';
import chroma from 'chroma-js';
import { View, Text, StyleSheet } from 'react-native';

import { formatPrice } from '../functions';

import theme from 'theme';

const FormControlLabel = ({ style, label, price, unit, children, ...rest }) => {

	return (
		<View 
			style={[styles.container, style]} 
			{...rest}
		>
			<View style={styles.description}>
				<Text style={styles.title}>
					{label}
				</Text>
				{
					price !== null && price !== undefined 
					&&
						<Text style={styles.priceContainer}>
							<Text style={styles.price}>
								{formatPrice(price)}
							</Text>
							{
								!!unit
								&&
									<Text style={theme.styles.P2R}>
										/{unit}
									</Text>
							}
						</Text>
				}
			</View>
			<View style={styles.children}>
				{children}
			</View>
		</View>
	);
};

export default React.memo(FormControlLabel);

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: theme.spacing(2),
	},
	children: {
		width: '10%',
	},
	description: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		width: '90%',
	},
	priceContainer: {
		alignSelf: 'center',
		fontWeight: '400',
		backgroundColor: chroma(theme.colors.blue).alpha(0.1).css(),
		borderRadius: theme.normalize(4),
		marginRight: theme.spacing(5),
		paddingHorizontal: theme.spacing(2),
		paddingVertical: theme.spacing(1),
	},
	price: {
		fontWeight: '600',
		fontSize: 16,
	},
	title: {
		width: '60%',
		...theme.styles.P1R,
	},
});
