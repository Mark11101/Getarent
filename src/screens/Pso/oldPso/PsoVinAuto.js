import React from 'react';
import { Text, StyleSheet, View, Image } from 'react-native';
import auto_vin from 'img/auto_vin.jpg';
import theme from 'theme';
import api from 'api';

import { PhotoLoader, PrimaryButton, Thumbnail } from 'components';
import { Formik } from 'formik';

import Layout from '../Layout';
import usePso from '../usePso';
import NavigationProgress from '../NavigationProgress';
import psoStyle from '../style';

export default function PsoVinAuto({
	route: {
		params: { uuid, isStart, role },
	},
}) {
	const stepName = 'VIN';

	const {
		waiter,
		initialValues,
		goBack,
		onSubmit,
		addPhoto,
		removePhoto,
	} = usePso({
		role,
		uuid,
		stepName,
		isStart,
		nextStep: () =>
			api.navigation.navigate('PsoExternalDamage', {
				uuid,
				isStart,
				role,
			}),
	});

	return (
		<Formik {...{ initialValues, onSubmit, enableReinitialize: true }}>
			{({ values, handleSubmit, setFieldValue }) => (
				<Layout waiter={waiter} goBack={goBack}>
					<View style={psoStyle.offset}>
						<NavigationProgress {...{ role, stepName }} />
						<Text style={psoStyle.title}>
							Сфотографируйте VIN автомобиля
						</Text>
						<Text style={psoStyle.lightText}>
							Чаще всего он расположен на лобовом стекле, под
							капотом, под обшивкой пола около водительского
							сиденья или на стойке водительской двери.
						</Text>
						<Image style={styles.exampleImg} source={auto_vin} />
						{values?.photos && (
							<View style={psoStyle.photos}>
								{values.photos[0] ? (
									<Thumbnail
										style={psoStyle.thumbnail}
										resizeMode="cover"
										source={{
											uri: values.photos[0].path
										}}
										onPressDelete={() =>
											removePhoto(
												values.photos[0],
												values.photos,
												setFieldValue
											)
										}
									/>
								) : (
									<PhotoLoader
										name="photo"
										onSelect={addPhoto(
											values.photos,
											setFieldValue
										)}
										style={psoStyle.thumbnail}
										text="Добавить"
									/>
								)}
							</View>
						)}
					</View>
					<View style={theme.styles.flex} />

					<View style={psoStyle.offset}>
						{values?.photos && (
							<PrimaryButton
								disabled={!values.photos.length}
								title="Следующий шаг"
								onPress={handleSubmit}
							/>
						)}
					</View>
				</Layout>
			)}
		</Formik>
	);
}

const styles = StyleSheet.create({
	exampleImg: {
		width: '100%',
		height: theme.normalize(200),
		marginVertical: 20,
	},
});
