import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { Text, View, StyleSheet } from 'react-native';

import api from 'api';
import theme from 'theme';
import Layout from '../Layout';
import NavigationProgress from '../NavigationProgress';
import { MainPhotosForm } from '../MainPhotosForm';
import { NextStepBtn } from '../NextStepBtn';
import usePso, {useCachedPRIStorageKey} from '../usePso';
import { getPsoConfig } from '../config';
import psoStyle from '../style';

const styles = StyleSheet.create({
	nextStepBtn: {
		...psoStyle.nextStepBtn,
		marginTop: 35,
	},
});

export const GeneralStep = ({
	route: {
		params: { uuid, isStart, role, insured },
	},
}) => {
	const stepName = 'GENERAL';
	const { photos: stepPhotos, next: nextStep } = getPsoConfig(role, insured)[stepName];

	const { photos } = useSelector(({ pso }) => pso, shallowEqual);
	const { waiter, goBack, onSubmit } = usePso({
		role,
		uuid,
		stepName,
		isStart,
		insured,
		nextStep: () =>
			api.navigation.navigate(nextStep, {
				uuid,
				isStart,
				role,
				insured,
			}),
	});

	return (
		<Layout waiter={waiter} goBack={goBack}>
			<View style={psoStyle.stepView}>
				<Text style={psoStyle.title}>
					Сфотографируйте автомобиль с разных сторон
				</Text>
				<NavigationProgress {...{ role, stepName, insured }} />
				<MainPhotosForm
					stepName={stepName}
					stepPhotos={stepPhotos}
					style={psoStyle.mainPhotosForm}
				/>
				<View style={theme.styles.flex} />

				<NextStepBtn
					style={styles.nextStepBtn}
					onPress={onSubmit}
					disabled={photos.length !== stepPhotos.length}
				/>
			</View>
		</Layout>
	);
};
