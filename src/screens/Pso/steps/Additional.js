import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
	Text,
	StyleSheet,
	View,
	ScrollView,
	RefreshControl,
} from 'react-native';

import theme from 'theme';
import api from 'api';
import actions from 'actions';
import { PrimaryButton, Icon, Header, Waiter } from 'components';
import usePso from '../usePso';
import AdditionalPhotosForm from '../AdditionalPhotosForm/AdditionalPhotosForm';

import psoStyle from '../style';

const styles = StyleSheet.create({
	container: {
		paddingTop: 20,
	},
	stepView: {
		...psoStyle.stepView,
		paddingBottom: 35,
	},
	lightText: {
		...theme.getFontProps('semibold', 16, 26),
		paddingHorizontal: theme.spacing(10),
		textAlign: 'center',
		color: theme.colors.lightCyan,
	},
	nextStepBtn: {
		...psoStyle.nextStepBtn,
		marginTop: 20,
	},
	icon: {
		textAlign: 'center',
		marginVertical: theme.spacing(10),
	},
	mainContainer: {
		flexGrow: 1,
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 60,
	},
	text: {
		...theme.getFontProps('regular', 13, 22),
		marginBottom: 22,
	},
});

export const AdditionalStep = ({
	route: {
		params: { uuid, isStart, role, insured },
	},
}) => {
	const stepName = 'ADDITIONAL';
	const textWait =
		'Идет проверка фотографий, обычно это занимает пару минут. Мы пришлем вам смс - уведомление';

	const dispatch = useDispatch();
	const [refreshing, setRefresh] = useState(false);
	const { finish, waiter, goBack, onSubmit } = usePso({
		role,
		uuid,
		stepName,
		isStart,
		insured,
		nextStep: () => {},
	});
	const onRefresh = useCallback(async () => {
		setRefresh(true);
		try {
			const {
				rent: { status } = {},
			} = await api.web.getPsoEndpoint(role, uuid, stepName, isStart);

			if (status === 'DECLINED_BY_ADMIN') {
				dispatch(
					actions.error(
						'Если у вас остались вопросы - свяжитесь с нами',
						'Ваше бронирование отменено нашей службой поддержки'
					)
				);
				return api.navigation.navigate('Trips', {
					uuid,
					isStart,
					role,
				});
			}

			api.navigation.navigate(finish ? 'RentRoom' : 'PsoWait', {
				uuid,
				isStart,
				role,
			});
		} catch (err) {
			console.log(err);
			dispatch(actions.error('Не удалось загрузить данные, попробуйте еще раз'));
		} finally {
			setRefresh(false);
		}
	}, [dispatch, finish, uuid, isStart, role]);
	
	return (
		<ScrollView
			style={{ ...psoStyle.container, ...styles.container }}
			contentContainerStyle={theme.styles.grow}
			scrollEnabled={!waiter}
			refreshControl={<RefreshControl {...{ refreshing, onRefresh }} />}
		>
			<Header onPressBack={goBack} big />
			<View style={[psoStyle.offset, styles.mainContainer]}>
				<View>
					<Icon
						name="sandglass"
						style={styles.icon}
						color={theme.colors.lightCyan}
						size={theme.normalize(80)}
					/>
					<Text style={styles.lightText}>{textWait}</Text>
				</View>
			</View>
			<View style={styles.stepView}>
				<Text style={styles.text}>
					Пожалуйста, ожидайте. Мы свяжемся с вами, если нам
					потребуются дополнительные фотографии
				</Text>
				<AdditionalPhotosForm />
				<PrimaryButton
					style={styles.nextStepBtn}
					title="Отправить фотографии"
					onPress={onSubmit}
				/>
			</View>
			{waiter && <Waiter />}
		</ScrollView>
	);
};
