import React, { useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import api from 'api';
import chroma from 'chroma-js';
import { SafeAreaSpacingView, Icon, PrimaryButton, Waiter } from 'components';

import theme from 'theme';

import actions from 'actions';

const size = theme.normalize(20);
const width = theme.normalize(86);

const PaymentSuccess = ({ route: { params: { uuid } = {} } }) => {

	const dispatch = useDispatch();

	const waiter = useSelector(st => st.payment.waiter);

	const onPress = useCallback(() => {
		
		api.navigation.reset(0, [{ name: 'RootTabs' }]);
		api.navigation.navigate('Trips');
		api.navigation.navigate('RentRoom', { uuid }, true);

		// update cars list on search
		dispatch(actions.searchRequest())
		dispatch(actions.searchRequest())
	}, [uuid]);

	return (
		<SafeAreaSpacingView style={styles.container}>
			<View style={styles.content}>
				<View style={styles.circle}>
					<Icon
						name="checkmark"
						color={theme.colors.green}
						{...{ size }}
					/>
				</View>
				<Text style={styles.title}>
					Успешно оплачено
				</Text>
			</View>
			<PrimaryButton
				outlined
				style={styles.button}
				title="Перейти к аренде"
				onPress={onPress}
			/>
			{waiter && <Waiter />}
		</SafeAreaSpacingView>
	);
};

export default PaymentSuccess;

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
		backgroundColor: chroma(theme.colors.green).alpha(0.15).css(),
	},
	title: {
		...theme.styles.H3,
		marginTop: theme.spacing(7.5),
	},
	button: {
		marginTop: theme.spacing(4),
	},
});
