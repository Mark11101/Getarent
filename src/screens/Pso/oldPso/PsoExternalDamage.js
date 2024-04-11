import React from 'react';
import { Text, View } from 'react-native';
import api from 'api';
import theme from 'theme';

import { PhotoLoader, PrimaryButton, Thumbnail } from 'components';

import { Formik } from 'formik';

import Layout from '../Layout';
import usePso from '../usePso';
import psoStyle from '../style';
import NavigationProgress from '../NavigationProgress';

export default function PsoExternalDamage({
	route: {
		params: { uuid, isStart, role },
	},
}) {
	const stepName = 'EXTERNAL_DEFECTS';

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
			api.navigation.navigate('PsoCondition', { uuid, isStart, role }),
	});

	const headerTitle = isStart
		? 'Перед тем как начать аренду, сфотографируйте автомобиль с разных сторон и в салоне'
		: 'Перед тем как завершить аренду, сфотографируйте автомобиль с разных сторон и в салоне';

	return (
		<Formik {...{ initialValues, onSubmit, enableReinitialize: true }}>
			{({ values, handleSubmit, setFieldValue }) => (
				<Layout waiter={waiter} goBack={goBack}>
					<View style={psoStyle.offset}>
						{role === 'GUEST' && (
							<Text style={psoStyle.headerTitle}>
								{headerTitle}
							</Text>
						)}
						<NavigationProgress {...{ role, stepName }} />
						<Text style={psoStyle.title}>
							Сфотографируйте наружные повреждения автомобиля
						</Text>
						<Text style={psoStyle.lightText}>
							Осмотрите автомобиль и сфотографируйте абсолютно все
							повреждения (крупно и общий план), которые вы
							заметите (включая стекла, зеркала и колеса)
						</Text>
						<View style={psoStyle.photos}>
							<PhotoLoader
								name="photo"
								onSelect={addPhoto(
									values?.photos,
									setFieldValue
								)}
								style={psoStyle.thumbnail}
								text="Добавить"
							/>

							{values?.photos &&
								values.photos.map(file => (
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
					</View>
					<View style={theme.styles.flex} />

					<View style={psoStyle.offset}>
						<PrimaryButton
							title="Следующий шаг"
							onPress={handleSubmit}
						/>
					</View>
				</Layout>
			)}
		</Formik>
	);
}
