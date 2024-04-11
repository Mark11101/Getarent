import React from 'react';
import { useDispatch } from 'react-redux';
import { View, Text } from 'react-native';

import actions from 'actions';
import { SafeAreaSpacingView, Icon, PrimaryButton } from 'components';

import s from './styles';
import theme from 'theme';
import api from '../../api';

const size = theme.normalize(20);

const AttachSuccess = ({
	route: {
		params: {
			title = 'Карта успешно привязана', callback,
			goBackOnContinue, rentId
		} = {}
	},
}) => {

	const dispatch = useDispatch();

    React.useEffect(() => {
        dispatch(actions.bankCardRequest());
    }, [])

	const _onPress = () => {
		if (goBackOnContinue) return api.navigation.goBack()
		if (rentId) api.navigation.navigate('RentRoom', { uuid: rentId })
		if (callback) return callback()
	}

	return (
		<SafeAreaSpacingView style={s.container}>
			<View style={s.content}>
				<View style={s.circle}>
					<Icon
						name="checkmark"
						color={theme.colors.green}
						{...{ size }}
					/>
				</View>
				<Text style={s.title}>
					{title}
				</Text>
			</View>
			<PrimaryButton
				outlined
				style={s.button}
				title="Продолжить"
				onPress={_onPress}
			/>
		</SafeAreaSpacingView>
	);
};

export default AttachSuccess;
