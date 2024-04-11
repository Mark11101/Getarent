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

export default function PsoCondition({
	route: {
		params: { uuid, isStart, role },
	},
}) {
	const stepName = 'INTERIOR_AND_TRUNK';

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
			api.navigation.navigate('PsoMeasuring', { uuid, isStart, role }),
	});

	return (
		<Formik {...{ initialValues, onSubmit, enableReinitialize: true }}>
			{({ values, handleSubmit, setFieldValue }) => (
				<Layout waiter={waiter} goBack={goBack}>
					<View style={psoStyle.offset}>
						<NavigationProgress {...{ role, stepName }} />
						<Text style={psoStyle.title}>
							Сфотографируйте состояние салона и багажника
						</Text>
						<Text style={psoStyle.lightText}>
							Особое внимание обратите на повреждения обивки,
							пластика и грязные пятна. Не забудьте про потолок и
							пороги
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

					<View style={psoStyle.offset} elevation={0}>
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
