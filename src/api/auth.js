import * as Keychain from 'react-native-keychain';

function setToken(access, refresh) {
	return Keychain.setInternetCredentials('getarent', access, refresh);
}

function getToken() {
	return Keychain.getInternetCredentials('getarent')
		.then(({ username: access, password: refresh }) => ({
			access,
			refresh,
		}))
		.catch(err => {
			return {};
		});
}

function resetToken() {
	return Keychain.resetInternetCredentials('getarent');
}

const auth = {
	setToken,
	getToken,
	resetToken
}

export default auth
