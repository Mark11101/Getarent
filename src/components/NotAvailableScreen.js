import { SafeAreaView, View } from 'react-native';

import api from '../api';
import Empty from './Empty';
import PrimaryButton from './PrimaryButton';

const NotAvailableScreen = () => {

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<Empty
				text={'Произошла непредвиденная ошибка. Мы уже работаем над этой проблемой, пожалуйста, перезайдите в приложение'}
				style={{ flex: 1, justifyContent: 'center' }}
				bottomInterface={
					<View style={{ padding: 30 }}>
						<PrimaryButton
							outlined
							title="Зарегистрироваться"
							style={{ marginBottom: 13 }}
							onPress={() => api.navigation.deepNavigate('ProfileRoot', 'Auth', 'SignUp')}
						/>
						<PrimaryButton
							title="Войти"
							onPress={() => api.navigation.deepNavigate('ProfileRoot', 'Auth', 'SignIn')}
						/>
					</View>
				}
			/>
		</SafeAreaView>
	);
};

export default NotAvailableScreen;
