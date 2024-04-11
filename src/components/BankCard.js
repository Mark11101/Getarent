import { useDispatch } from 'react-redux';
import React, { useCallback } from 'react';
import { View, StyleSheet, Text } from 'react-native';

import api from '../api';
import actions from 'actions';
import RadioButton from './RadioButton';

import theme from 'theme';

const statuses = {
	IN_PROGRESS: {
		text: 'На проверке',
		color: theme.colors.darkYellow,
	},
	ATTACHED: {
		text: 'Активна',
		color: theme.colors.green,
	},
};

const BankCard = ({ style, status, isDefault, onChange, ...rest }) => {

	const dispatch = useDispatch();

	const onPress = useCallback(() => {

		api.web
			.methodsDefault({ type: 'CARD' })
			.then(async ({ error }) => {
				if (error) {
					throw error;
				}
				onChange();
			})
			.catch(() => {
				dispatch(actions.error('Попробуйте еще раз'));
			});

	}, [dispatch]);

	return (
		<View style={[styles.container, style]} {...rest}>
			<Text style={theme.styles.H3}>
				Карта
			</Text>
			<View style={styles.infoLine}>
				<View style={styles.labelContainer}>
					<Text style={styles.label}>
						Номер
					</Text>
				</View>
				<Text style={theme.styles.P1R}>
					Уточняйте в банке
				</Text>
			</View>
			<View style={styles.infoLine}>
				<View style={styles.labelContainer}>
					<Text style={styles.label}>
						Статус
					</Text>
				</View>
				<View style={styles.status}>
					<View
						style={[
							styles.dot,
							{
								backgroundColor: statuses[status]?.color,
							},
						]}
					/>
					<Text style={styles.statusText}>
						{statuses[status]?.text}
					</Text>
				</View>
			</View>
			<View style={styles.radioLine}>
				<Text style={theme.styles.P1}>
					Основной метод
				</Text>
				<RadioButton
					checked={isDefault}
					onChange={onPress}
					disabled={status === 'IN_PROGRESS'}
				/>
			</View>
		</View>
	);
};

export default React.memo(BankCard);

const styles = StyleSheet.create({
	container: {
		borderRadius: theme.normalize(4),
		borderColor: theme.colors.grey,
		borderWidth: theme.normalize(1),
		flexDirection: 'column',
		paddingVertical: theme.spacing(4),
		paddingHorizontal: theme.spacing(5.5),
		marginTop: theme.spacing(6),
	},
	infoLine: {
		marginTop: theme.spacing(3),
		flexDirection: 'row',
	},
	radioLine: {
		marginTop: theme.spacing(3),
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	label: {
		...theme.styles.P2,
	},
	labelContainer: {
		marginRight: theme.spacing(9),
	},
	dot: {
		height: theme.normalize(8),
		width: theme.normalize(8),
		borderRadius: theme.normalize(4),
	},
	status: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	statusText: {
		...theme.styles.P1R,
		paddingLeft: theme.spacing(2),
	},
});
