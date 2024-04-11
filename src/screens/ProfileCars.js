import React, { useCallback } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';

import api from 'api';
import { useListEmpty } from 'hooks';
import { SafeAreaView, Header, ProfileCar } from 'components';

import theme from 'theme';

const keyExtractor = o => o.uuid;

const emptyProps = {
	icon: 'car-error',
	iconSize: theme.normalize(112),
	text: 'У вас еще нет автомобилей.',
};

const ProfileCars = ({ route: { params: { cars } = {} } }) => {
	
	const listEmptyProps = useListEmpty(emptyProps);

	const renderItem = useCallback(
		({ item }) => (
			<ProfileCar
				{...item}
				onPress={() =>
					api.navigation.push(
						'Car',
						{
							uuid: item.uuid,
						},
						true
					)
				}
			/>
		),
		[cars]
	);

	return (
		<SafeAreaView top style={styles.container}>
			<Header title="Автопарк" />
			<View style={theme.styles.flex}>
				<FlatList
					style={theme.styles.flex}
					{...{
						data: cars,
						keyExtractor,
						renderItem,
					}}
					{...listEmptyProps}
				/>
			</View>
		</SafeAreaView>
	);
};

export default ProfileCars;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: theme.colors.white,
	},
});
