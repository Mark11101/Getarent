import React from 'react';
import { useDispatch } from 'react-redux';
import { SafeAreaView, Text, View } from 'react-native';

import api from 'api';
import actions from 'actions';
import { Icon } from 'components';

import s from './styles';
import theme from 'theme';

const size = theme.normalize(20);

const RegCarSuccessScreen = ({ route: { params: { carId } = {} } }) => {

	const dispatch = useDispatch();

	React.useEffect(() => {

		dispatch(actions.resetCarRegistrationData());
		dispatch(actions.getCarsList());
		
		setTimeout(() => {
			api.navigation.navigate('MyCars');
			api.navigation.navigate(
				'CarEdit', 
				{ 
					carId, 
					onPressBack: () => (
						api.navigation.navigate(
							'MyCars', 
							{ onPressBack: () => api.navigation.navigate('Profile')}
						) 
					)
				}
			);
		}, 1500);

	}, []);

    return (
		<SafeAreaView style={s.container}>
			<View style={s.content}>
				<View style={s.circle}>
					<Icon
						name="checkmark"
						color={theme.colors.green}
						{...{ size }}
					/>
				</View>
				<Text style={s.title}>
                    Успешно!
                </Text>
			</View>
		</SafeAreaView>
    )
};

export default RegCarSuccessScreen;
