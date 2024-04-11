import React from 'react';
import chroma from 'chroma-js';
import { View, Text, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import api from 'api';
import actions from 'actions';
import { SafeAreaSpacingView, Icon, PrimaryButton, Waiter } from 'components';

import theme from 'theme';

const size = theme.normalize(20);
const width = theme.normalize(86);

const PaymentFailed = () => {

	const dispatch = useDispatch();

	const waiter = useSelector(st => st.payment.waiter);

	return (
		<SafeAreaSpacingView style={styles.container}>
			<View style={styles.content}>
				<View style={styles.circle}>
					<Icon
						name="cross-bold"
						color={theme.colors.red}
						{...{ size }}
					/>
				</View>
				<Text style={styles.title}>
					Не удалось оплатить
				</Text>
			</View>
			<PrimaryButton
				title="Попробовать ещё раз"
				onPress={() => dispatch(actions.paymentRequest([], true))}
			/>
			<PrimaryButton
				outlined
				style={styles.button}
				title="Назад"
				onPress={() => api.navigation.goBack()}
			/>
			{waiter && <Waiter />}
		</SafeAreaSpacingView>
	);
};

export default PaymentFailed;

const styles = StyleSheet.create({
	container: {
		...theme.styles.container,
		justifyContent: 'space-between',
		paddingHorizontal: theme.spacing(6),
		paddingBottom: theme.spacing(6),
	},
	content: {
		...theme.styles.container,
		justifyContent: 'center',
		alignItems: 'center',
	},
	circle: {
		width,
		height: width,
		borderRadius: width / 2,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: chroma(theme.colors.red).alpha(0.15).css(),
	},
	title: {
		...theme.styles.H3,
		marginTop: theme.spacing(7.5),
	},
	button: {
		marginTop: theme.spacing(4),
	},
});
