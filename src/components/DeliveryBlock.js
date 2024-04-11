import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import theme from 'theme';

const DeliveryBlock = (props) => {

	return (
		<View {...props}>
			{/* <Text style={styles.descriptionTitle}>Доставка</Text> */}
			<Text style={styles.description}>
				В стоимость доставки входит получение и{'\n'}
				возврат автомобиля по выбраному адресу
			</Text>
		</View>
	);
};

export default React.memo(DeliveryBlock);

const styles = StyleSheet.create({
	// descriptionTitle: {
	// 	...theme.styles.P2,
	// 	marginBottom: theme.spacing(1),
	// },
	description: {
		...theme.styles.P2R,
		marginBottom: theme.spacing(3),
		color: theme.colors.lightCyan,
	},
});
