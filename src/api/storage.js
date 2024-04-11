import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const instance = new Storage({
	storageBackend: AsyncStorage,
	defaultExpires: null,
	enableCache: true,
});

function set(key, data) {
	return instance.save({ key, data });
}

function get(key) {
	return instance
		.load({ key })
		.then(data => ({ [key]: data }))
		.catch(error => ({ error }));
}

function getWithoutErrorHandling(key) {
	return instance.load({ key });
}

function remove(key) {
	return instance.remove({ key });
}

const storage = {
	get,
	set,
	getWithoutErrorHandling,
	remove
}

export default storage
