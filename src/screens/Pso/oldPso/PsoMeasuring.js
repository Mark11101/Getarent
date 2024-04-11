import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import theme from 'theme';
import api from 'api';

import { PhotoLoader, PrimaryButton, Thumbnail } from 'components';
import { Formik } from 'formik';

import Layout from '../Layout';
import usePso from '../usePso';
import psoStyle from '../style';
import NavigationProgress from '../NavigationProgress';

export default function PsoMeasuring({
	route: {
		params: { uuid, isStart, role },
	},
}) {
	const stepName = 'MILAGE_AND_FUEL';

	const {
		waiter,
		initialValues,
		finish,
		goBack,
		onSubmit,
		addPhoto,
		removePhoto,
	} = usePso({
		role,
		uuid,
		stepName,
		isStart,
		nextStep: async () => {
			await api.web.psoFinish(uuid, role, isStart);
			api.navigation.navigate(finish ? 'RentRoom' : 'PsoWait', {
				uuid,
				isStart,
				role,
			});
		},
	});

	const titleButton =
		role === 'GUEST'
			? isStart
				? 'Подписать акт приема \nи начать аренду'
				: 'Подписать акт приема \nи завершить аренду'
			: isStart
			? 'Подписать акт передачи \nи передать ключи'
			: 'Подписать акт приема \nи завершить аренду';

	return (
		<Formik {...{ initialValues, onSubmit, enableReinitialize: true }}>
			{({ values, handleSubmit, setFieldValue }) => (
				<Layout waiter={waiter} goBack={goBack}>
					<View style={psoStyle.offset}>
						<NavigationProgress {...{ role, stepName }} />
						<Text style={psoStyle.title}>
							Сфотографируйте пробег и уровень топлива{' '}
						</Text>
						<Text style={psoStyle.lightText}>
							Сфотографируйте бортовой компьютер автомобиля
						</Text>
						{values?.photos && (
							<View style={psoStyle.photos}>
								<PhotoLoader
									name="photo"
									onSelect={addPhoto(
										values.photos,
										setFieldValue
									)}
									style={psoStyle.thumbnail}
									text="Добавить"
								/>

								{values.photos.map(file => (
									<Thumbnail
										key={file.key}
										style={psoStyle.thumbnail}
										resizeMode="cover"
										source={{
											uri: file.path,
										}}
										onPressDelete={() =>
											removePhoto(
												file,
												values.photos,
												setFieldValue
											)
										}
									/>
								))}
							</View>
						)}
					</View>
					<View style={theme.styles.flex} />

					<View style={psoStyle.offset}>
						<PrimaryButton
							style={styles.button}
							titleStyle={styles.buttonText}
							title={titleButton}
							onPress={handleSubmit}
						/>
						{isStart && (
							<PrimaryButton
								outlined
								title="Отказаться и отменить аренду"
								onPress={() =>
									api.navigation.navigate(
										'ReasonCancellation',
										{
											uuid,
											role: 'GUEST',
										}
									)
								}
							/>
						)}
					</View>
				</Layout>
			)}
		</Formik>
	);
}

const styles = StyleSheet.create({
	button: {
		marginBottom: theme.spacing(4),
		height: 70,
	},
	buttonText: {
		textAlign: 'center',
	},
});
