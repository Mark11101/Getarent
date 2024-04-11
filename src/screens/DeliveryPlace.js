import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';

import {
	Header,
	PrimaryButton,
	SafeAreaSpacingView,
	ScrollViewChangeContent,
	DeliveryPlace as DeliveryPlaceComponent,
} from 'components';
import api from 'api';

import theme from 'theme';

const DeliveryPlace = ({
	route: {
		params: {
			uuid,
			location = '',
			popularPlaces = [],
			radiuses = [],
			deliveryPlace,
			callback,
		} = {},
	},
}) => {

	const [place, setPlace] = useState(deliveryPlace);

	return (
		<View style={theme.styles.container}>
			<SafeAreaSpacingView style={styles.safeArea}>
				<Header title="Место получения" />
				<ScrollViewChangeContent style={styles.scrollView}>
					<DeliveryPlaceComponent
						{...{
							uuid,
							location,
							popularPlaces,
							radiuses,
							place,
							setPlace,
						}}
					/>
				</ScrollViewChangeContent>
				<PrimaryButton
					style={styles.button}
					title="Выбрать"
					onPress={() => {
						callback(place);
						api.navigation.goBack();
					}}
				/>
			</SafeAreaSpacingView>
		</View>
	);
};

export default DeliveryPlace;

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		marginTop: 0,
		marginBottom: theme.spacing(6),
	},
	scrollView: {
		...theme.styles.container,
		paddingHorizontal: theme.spacing(6),
	},
	button: {
		marginTop: theme.spacing(6),
		marginHorizontal: theme.spacing(6),
	},
});
