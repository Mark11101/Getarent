import { useDispatch } from 'react-redux';
import React, { useCallback, useState } from 'react';
import { Text, TouchableOpacity, StyleSheet, View } from 'react-native';

import api from 'api';
import actions from 'actions';
import Icon from './Icon';
import Input from './Input';

import theme from 'theme';

const Promocode = ({ setWaiter, onSubmit }) => {

	const dispatch = useDispatch();
	
	const [promocode, setPromocode] = useState('');
	const [isPromocodeApplied, setPromocodeApplied] = useState(false);

	const onApply = useCallback(async () => {

		setWaiter(true);
		
		try {
			const res = await api.web.applyPromocode(
				promocode.replace(/ /, '')
			);

			if (res?.error) {
				throw res.error;
			}

			onSubmit(res);
			
			setPromocodeApplied(true);
			setWaiter(false);

		} catch (error) {
			
			setWaiter(false);

			if (error && error.status === 404) {
				dispatch(actions.error('Данный промокод не найден'));
			} else {
				dispatch(
					actions.error(
						'Что-то пошло не так. Обратитесь в поддержку или попробуйте позже'
					)
				);
			}
		}

	}, [dispatch, setWaiter, promocode]);

	return (
		<View style={styles.container}>
			<View style={styles.input}>
				<Input
					style={[
						styles.input,
						isPromocodeApplied && styles.inputApplied,
					]}
					maxLength={20}
					name="promocode"
					value={promocode}
					onSubmitEditing={onApply}
					editable={!isPromocodeApplied}
					placeholder={'Активируйте его здесь'}
					inputStyle={isPromocodeApplied && styles.inputApplied}
					onChangeText={value => {
						setPromocode(value.toUpperCase());
					}}
				/>
				<TouchableOpacity
					style={[
						styles.applyButton,
						isPromocodeApplied && styles.buttonApplied,
					]}
					onPress={onApply}
					disabled={!promocode || isPromocodeApplied}
				>
					<Icon
						name={isPromocodeApplied ? 'checkmark' : 'arrow-right'}
						style={styles.applyIcon}
					/>
				</TouchableOpacity>
			</View>
			{
				isPromocodeApplied 
				&&
					<Text style={styles.appliedText}>
						Промокод успешно применен
					</Text>
			}
		</View>
	);
};

export default React.memo(Promocode);

const styles = StyleSheet.create({
	container: {
		position: 'relative',
		alignItems: 'flex-start',
		marginBottom: 15,
	},
	input: {
		width: '100%',
		marginBottom: 0,
	},
	applyButton: {
		display: 'flex',
		justifyContent: 'center',
		position: 'absolute',
		top: 0,
		right: 0,
		height: '100%',
		paddingTop: 0,
		paddingBottom: 0,
		paddingLeft: 15,
		paddingRight: 15,
		backgroundColor: theme.colors.blue,
		// opacity: '0.5',
		borderRadius: 0,
		borderTopRightRadius: 4,
		borderBottomRightRadius: 4,
	},
	applyIcon: {
		color: theme.colors.white,
		fontSize: 16,
		fontWeight: 'bold',
	},
	appliedText: {
		...theme.styles.P2R,
		marginTop: theme.spacing(2),
		color: theme.colors.green,
	},
	buttonApplied: {
		backgroundColor: theme.colors.green,
	},
	inputApplied: {
		color: theme.colors.green,
	},
});
