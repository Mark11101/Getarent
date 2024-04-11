import React, { useCallback } from 'react';
import { Text, View, StyleSheet } from 'react-native';

import api from 'api';
import theme from 'theme';
import Layout from '../Layout';
import AdditionalPhotosForm from '../AdditionalPhotosForm/AdditionalPhotosForm';
import { NextStepBtn } from '../NextStepBtn';
import usePso from '../usePso';
import psoStyle from '../style';
import {useDispatch} from "react-redux";
import actions from "actions";

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
	title: {
		marginBottom: 25,
	},
	text: {
		...theme.getFontProps('regular', 13, 22),
		marginTop: 25,
		marginBottom: 22,
	},
});

export const PostInspection = ({
	route: {
		params: { uuid, isStart, role, insured, },
	},
}) => {
	const stepName = 'GENERAL';
	const dispatch = useDispatch();

	const { waiter, finish, onSubmit } = usePso({
		role,
		uuid,
		stepName,
		isStart,
		insured,
		nextStep: async () => {
			await api.web.psoFinish(uuid, role, isStart);
			dispatch(actions.rentRoomRequest(uuid, role));
			api.navigation.navigate(finish ? 'RentRoom' : 'PsoWait', {
				uuid,
				isStart,
				role,
				insured,
			});
		},
	});
	const goBack = useCallback(
		() =>
			api.navigation.navigate('RentRoom', {
				uuid,
				isStart,
				role,
				insured,
			}),
		[uuid, isStart, role]
	);

	return (
		<Layout waiter={waiter} goBack={goBack}>
			<View style={psoStyle.stepView}>
				<Text style={{ ...psoStyle.title, ...styles.title }}>
					{role === 'GUEST'
						? 'Сфотографируйте состояние кузова, салона и показатели одометра, чтобы избежать конфликтных ситуаций'
						: 'Сфотографируйте состояние кузова, салона и показатели одометра, чтобы запросить компенсацию'}
				</Text>
				<AdditionalPhotosForm />
				<Text style={styles.text}>
					{role === 'GUEST'
						? 'Завершите аренду без фотографий, если автомобиль возвращен в том же виде, в котором был получен, и Владелец подтверждает, что условия возврата выполены в полном объеме'
						: 'Завершите аренду без фотографий, если автомобиль возвращен в том же виде, в котором был передан и ваши условия возврата соблюдены в полном объеме'}
				</Text>
				<View style={theme.styles.flex} />
				{/* TODO: add check for photos existence and disabled*/}
				<NextStepBtn
					style={styles.nextStepBtn}
					titleStyle={styles.nextStepBtnTitle}
					title="Подписать акт возврата автомобиля и завершить аренду"
					onPress={onSubmit}
				/>
			</View>
		</Layout>
	);
};
