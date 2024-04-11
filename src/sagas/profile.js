import { splitEvery } from 'ramda';
import { Alert, Linking } from 'react-native';
import { all, takeLatest, put, delay, select } from 'redux-saga/effects';

import api from 'api';
import actions from 'actions';
import * as actionTypes from 'actionTypes';
import { defaultError, carPhotosErrors } from 'constants/errors';

export default function* root() {
	yield all([
		takeLatest(actionTypes.SIGNUP_REQUEST, signupRequest),
		takeLatest(actionTypes.LOGOUT, logout),
		takeLatest(actionTypes.PROFILE_REQUEST, profileRequest),
		takeLatest(actionTypes.DELETE_ACCOUNT, deleteAccount),
		takeLatest(actionTypes.GET_CAR_EDIT_DATA, getCarEditData),
		takeLatest(actionTypes.START_VERIFICATION, verificationHandler),
		takeLatest(actionTypes.POST_EDIT_DATA, postEditDataHandler),
		takeLatest(actionTypes.GET_CARS_LIST, getCarsList),
		takeLatest(actionTypes.PUBLISH_CAR, publishCarHandler),
		takeLatest(actionTypes.UNPUBLISH_CAR, unpublishCarHandler),
		takeLatest(actionTypes.GET_INSURANCE, getInsuranceHandler),
		takeLatest(actionTypes.TOGGLE_INSURANCE, toggleInsuranceHandler),
		takeLatest(actionTypes.GET_CAR_PHOTOS_LIST, getCarPhotosListHandler),
		takeLatest(actionTypes.DELETE_CAR_PHOTO, deleteCarPhotoHandler),
		takeLatest(actionTypes.ADD_CAR_PHOTO, addCarPhotoHandler),
		takeLatest(actionTypes.SET_DRIVERS_LICENSE_FIRST_ISSUE_YEAR, setDriversLicenseFirstIssueYearHandler),
	]);
}

export function* signupRequest({ payload: { email, password } }) {
	const { accessToken, refreshToken, user, error } = yield api.web.signup(
		email,
		password
	);

	if (error) {
		yield put(actions.error(error));
	} else {
		yield api.auth.setToken(accessToken, refreshToken);
		yield api.storage.set('profile', user);

		yield put(actions.login(user));
	}
}

export function* logout() {
	yield api.auth.resetToken();
	yield api.storage.remove('profile');
}

export function* profileRequest() {
	const { error, ...profile } = yield api.web.profile();

	if (!error) {
		yield put(actions.setProfile(profile));
		yield api.storage.set('profile', profile);
	}
}

export function* deleteAccount() {
	yield api.web.deleteAccount();
	yield put(actions.deletionRequested());
}

export function* getCarEditData({ payload: { carId, withGoBack = false } }) {

	const { car, error } = yield api.web.getCarEditData(carId);

	if (error && withGoBack) {
		yield put(actions.error('Не удалось открыть настройки, попробуйте еще раз'));
		yield api.navigation.goBack();
	} else {
		yield put(actions.setCarEditData(car));
	}
}

export function* getCarsList() {
	try {
		const data = yield api.web.getCarsList();
		yield put(actions.setCarsList(data));
	} catch (error) {
		console.log(error);
		yield put(actions.setCarsList([]));
		yield put(actions.error('Не удалось получить список машин, попробуйте еще раз'));
		yield api.navigation.goBack();
	};
};

export function* verificationHandler(action) {
	const {
		payload: { id, data },
	} = action;
	try {
		// Check for documents completeness
		const { isValid } = yield api.web.checkValidationCompleteness(id);

		if (!isValid) {
			Alert.alert('Что-то пошло не так', 'попробуйте еще раз');
			yield put(actions.startVerificationFailure(errorMessage));
			throw res.error;
		}

		const res = yield api.web.postCarEditData(id, data);

		if (res?.error) {
			throw res.error;
		} else {
			
			const res = yield api.web.verifyCarEditData(id);
			
			if (res?.error) {
				Alert.alert('Что-то пошло не так', 'попробуйте еще раз');
				throw res.error;
			} else {

				yield put(actions.startVerificationSuccess());
				yield put(actions.getCarEditData(id, false));

				Alert.alert('👍', '\nМашина успешно отправлена на проверку. Обычно это занимает не больше одного дня. Если у вас есть вопросы или пожелания, напишите нам в чате с поддержкой. Желаем хорошего дня!');
			}
		};

	} catch (error) {
		yield put(actions.startVerificationFailure(error));
	}
}

export function* postEditDataHandler(action) {
  const {
    payload: { id, data },
  } = action;

  try {

	const res = yield api.web.postCarEditData(id, data);
	
	if (res?.error) {
		throw res.error;
	} else {
		yield put(actions.postEditDataSuccess());
		yield put(actions.getCarsList());
	}
  } catch (error) {
    yield put(actions.postEditDataFailure(error));
  }
}

export function* publishCarHandler(action) {

	const { payload: { carId } } = action;

	try {
		yield api.web.publishCar(carId);
		yield put(actions.getCarEditData(carId));
		yield put(actions.getCarsList());
	} catch (error) {
		yield put(actions.error('Произошла ошибка, попробуйте еще раз'));
	}
}

export function* unpublishCarHandler(action) {

	const { payload: { carId } } = action;

	try {
		yield api.web.unpublishCar(carId);
		yield put(actions.getCarEditData(carId));
		yield put(actions.getCarsList());
	} catch (error) {
		yield put(actions.error('Произошла ошибка, попробуйте еще раз'));
	}
}

export function* getInsuranceHandler(action) {

	const { payload: { carId } } = action;

	try {
		const data = yield api.web.getInsuranceData(carId);
		yield put(actions.setInsurance(data));
	} catch {
	}
}

export function* toggleInsuranceHandler(action) {

	const { payload: { carId, isInsured } } = action;

	yield api.web.toggleInsurance(carId, isInsured);
}

export function* getCarPhotosListHandler(action) {

	const { payload: { carId } } = action;

	try {
		const res = yield api.web.getCarPhotosList(carId);
		yield put(actions.setCarPhotosList(res));
	} catch {
	}
}

export function* deleteCarPhotoHandler(action) {

	const { payload: { photoId, carId } } = action;

	try {

		const res = yield api.web.deleteCarPhoto(photoId, carId);

		if (res?.error) {
			throw res.error;
		} else {
			yield put(actions.getCarPhotosList(carId));
		};
		
	} catch (error) {

		yield put(actions.removeCarEditLoading());

		error.statusCode === 400
		?
			yield put(actions.error('Нельзя удалить единственное фото', ''))
		
		:	yield put(actions.error('Не удалось удалить фото, попробуйте еще раз'));
	}
}

export function* addCarPhotoHandler(action) {

	const { payload: { photos, carId } } = action;

	try {

		// const { refresh } = yield api.auth.getToken();

		// yield api.web.refreshRequest(refresh)

		let resultArray = [];

		const currentPhotos = yield select(({ profile }) => profile.carEditData.photos);

		const photosFormData = photos.map(ph => {

			const formData = new FormData();

			const file = {
				uri: Platform.OS === 'ios' ? `file://${ph.path}` : ph.path,
				name: 'photo',
				type: ph.mime,
			};

			formData.append('file', file);
			
			return formData;
		});

		const [firstPhoto, ...restPhotos] = photosFormData;

		const splittedPhotosArray = currentPhotos.length
			? splitEvery(3, photosFormData)
			: [[firstPhoto], ...splitEvery(3, restPhotos)];
		
		for (let i = 0; i < splittedPhotosArray.length; i += 1) {

			const photosPromises = splittedPhotosArray[i].map(ph => (
				api.web.addCarPhoto(ph, carId)
			));
		  
			const resp = yield Promise.all(photosPromises);
			
			if (resp?.error) {
				throw resp.error;
			} else {

				resultArray = resultArray.concat(resp);
				yield delay(1000);	
			};
		};
	
		yield put(actions.addCarPhotoSuccess());
		yield put(actions.getCarPhotosList(carId));
	
	  } catch (error) {
		const message = error.response ? carPhotosErrors.add[error.response.status] : defaultError;
		yield put(actions.error(message));
		yield put(actions.addCarPhotoError());
	  }
}

export function* setDriversLicenseFirstIssueYearHandler(action) {

	const { payload: { date } } = action;

	try {
		yield api.web.setDriversLicenseFirstIssueYear(date);
		yield put(actions.profileRequest());
	} catch {
	}
}
