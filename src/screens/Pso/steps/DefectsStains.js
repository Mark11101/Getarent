import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

import api from 'api';
import theme from 'theme';
import Layout from '../Layout';
import NavigationProgress from '../NavigationProgress';
import AdditionalPhotosForm from '../AdditionalPhotosForm/AdditionalPhotosForm';
import { NextStepBtn } from '../NextStepBtn';
import usePso from '../usePso';
import { getPsoConfig } from '../config';
import psoStyle from '../style';

const styles = StyleSheet.create({
	nextStepBtn: {
		...psoStyle.nextStepBtn,
		marginTop: 20,
	},
	nextStepBtnTitle: {
		...theme.styles.shrink,
		paddingTop: 2,
		paddingLeft: 15,
		paddingRight: 15,
		lineHeight: 16,
		textAlign: 'center',
	},
	text: {
		...theme.getFontProps('regular', 13, 22),
		marginTop: 10,
		marginBottom: 22,
	},
});

export const DefectsStainsStep = ({
	route: {
		params: { uuid, isStart, role, insured },
	},
}) => {
	const stepName = 'DEFECTS_AND_STAINS';
	const { next: nextStep } = getPsoConfig(role, insured)[stepName];

	const { waiter, goBack, onSubmit } = usePso({
		role,
		uuid,
		stepName,
		isStart,
		insured,
		nextStep: async () => {
			return api.navigation.navigate(nextStep, {
				uuid,
				isStart,
				role,
				insured
			});
		},
	});
	const nextStepBtnTitle =
		role === 'GUEST'
			? 'Продолжить'
			: 'Завершить осмотр и подписать акт передачи';

	return (
		<Layout waiter={waiter} goBack={goBack}>
			<View style={psoStyle.stepView}>
				<Text style={psoStyle.title}>
					Сфотографируйте все наружные повреждения и загрязнения
					салона
				</Text>
				<NavigationProgress
					{...{ role, stepName: 'DEFECTS_AND_STAINS', insured }}
				/>
				<Text style={styles.text}>
					Осмотрите автомобиль и сфотографируйте абсолютно все
					повреждения (крупно и общий план), которые вы заметите
					(включая стекла, зеркала и колеса)
				</Text>
				<AdditionalPhotosForm />
				<View style={theme.styles.flex} />
				{/* TODO: add check for photos existence and disabled*/}
				<NextStepBtn
					style={styles.nextStepBtn}
					titleStyle={styles.nextStepBtnTitle}
					title={nextStepBtnTitle}
					onPress={onSubmit}
				/>
			</View>
		</Layout>
	);
};
