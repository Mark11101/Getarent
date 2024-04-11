import { create } from 'apisauce';
import { Platform } from 'react-native';
import auth from './auth';

const normalizeBounds = ({ southWest, northEast }) =>
	southWest.concat(northEast).join(',');

const urls = {
	prod: 'https://api.getarent.ru/',
	dev: 'https://api.iew8iesh.k8s.getarent.ru/',
	// dev: "http://localhost:4000",
	strapiDev: 'https://cms.iew8iesh.k8s.getarent.ru/api/',
	strapiProd: 'https://cms.getarent.ru/api/',
};

const baseURL = urls.prod;

const _web = create({ baseURL });
const web = create({ baseURL });
const strapi = create({ baseURL: urls.strapi });

export function toggleBaseURL(dev) {

	const url = dev ? urls.dev : urls.prod;

	web.setBaseURL(url);
	_web.setBaseURL(url);

	const strapiUrl = dev ? urls.strapiDev : urls.strapiProd;

	strapi.setBaseURL(strapiUrl);
}

const responseTransform = response => {
	const { data, ok, problem, status } = response;

	if (!ok) {
		const normalizedData =
				typeof data === 'object' ? data : { message: data },
			error = { ...normalizedData, problem, status },
			{ errors } = error;

		response.error = error;

		if (errors) {
			Object.keys(errors).forEach(name => {
				if (Array.isArray(errors[name])) {
					errors[name] = errors[name].join(' ');
				}
			});
		}
	}
};

web.addResponseTransform(responseTransform);
_web.addResponseTransform(responseTransform);

// @todo
export const refreshRequest = async refreshToken =>
	await _web.post('mobile/auth/refresh', { refreshToken });

web.axiosInstance.interceptors.response.use(
	r => r,
	async error => {
		if (
			(error.response.status !== 401 && error.response.status !== 500) ||
			error.config.retry
		) {
			throw error;
		}

		try {
			const { refresh } = await auth.getToken();

			if (!refresh) {
				throw error;
			}

			const res = await refreshRequest(refresh);

			if (!res.ok) {
				throw res;
			}

			const {
				data: { accessToken, refreshToken },
			} = res;

			await auth.setToken(accessToken, refreshToken);
		} catch (error) {
			// store.dispatch(actions.logout(error));

			throw error;
		}

		const newRequest = {
			...error.config,
			retry: true,
		};

		return web.any(newRequest);
	}
);

web.addAsyncRequestTransform(request => async () => {
	const { access } = await auth.getToken();
	if (access) {
		request.headers.Authorization = `Bearer ${access}`;
	}
});

export function login(email, password) {
	return request(_web.post('mobile/auth/login', { email, password }));
}

export function signup(email, phone, password) {
	return request(
		web.post('/mobile/auth/signup', { email, phone, password }).then()
	);
}

export function logout() {
	return request(web.post('/mobile/auth/logout'));
}

export function setEmail(email) {
	return request(web.patch('/user/email', { email }).then());
}

export function setPhone(phone) {
	return request(web.patch('/user/phone', { phone }).then());
}

export function confirmEmail(confirmationCode) {
	return request(
		web.patch('/user/email/confirm', { confirmationCode }).then()
	);
}

export function confirmPhone(confirmationCode) {
	return request(
		web.patch('/user/phone/confirm', { confirmationCode }).then()
	);
}

export function recoverPassword(email) {
	return request(web.patch('/user/recover-password', { email }).then());
}

export function confirmRecoverPassword(user_uuid, confirmationCode) {
	return request(
		web
			.patch(`/user/recover-password/${user_uuid}/confirm`, {
				confirmationCode,
			})
			.then()
	);
}

export function resetPassword(userId, password) {
	return request(
		web.post('/mobile/auth/reset-password', { userId, password }).then()
	);
}

export function registrateGuest(userData, passport, driversLicense) {
	return request(
		web.post('guest/mobile', { userData, passport, driversLicense })
	);
}

export function userDocuments(photosKeys) {
	return request(web.post('/user/documents', { photosKeys }).then());
}

export function compensationDocuments(rentId, type, photoKeys, description) {
	return request(
		web
			.post(`/rent/${rentId}/compensation`, {
				type,
				photoKeys,
				description,
			})
			.then()
	);
}

export function getHistory() {
	return request(web.get('payments/history'));
}

export function carRentCheckout(
	carId,
	startDate,
	endDate,
	services,
	carTransferLocation,
	features,
	insurance
) {
	return request(
		web.post('checkout', {
			carId,
			startDate,
			endDate,
			services,
			carTransferLocation,
			features,
			insurance,
		})
	);
}

export function createRent(
	carId,
	startDate,
	endDate,
	services,
	carTransferLocation,
	features,
	guestsGreetingMessage,
	promocodeId,
	insurance
) {
	return request(
		web.post('rent', {
			carId,
			startDate,
			endDate,
			services,
			carTransferLocation,
			features,
			guestsGreetingMessage,
			promocodeId,
			insurance,
		})
	);
}

export function createRepeatedPayment(rentId, orderId) {
	return request(
		web.post(`payments/${rentId}/repeated-payment?orderId=${orderId}`)
	);
}

export function profile(uuid = null) {
	if (uuid) {
		return request(web.get(`user/profile/${uuid}`));
	}
	return request(web.get('user/profile'));
}

export function getBankCard() {
	return request(web.get('/payments/guest/card'));
}

export function attachBankCard(stage) {
	return request(web.post('/payments/guest/card', { stage }));
}

export function detachBankCard() {
	return request(web.delete('/payments/guest/card'));
}

export function userAvatar(avatar) {
	return request(web.patch('user/profile/avatar', { ...avatar }));
}

export function checkCompleteness() {
	return request(web.get('user/completeness'));
}

export function paymentMethods() {
	return request(web.get('payments/methods'));
}

export function paymentsAccount(values) {
	return request(web.post('/payments/payments-account', values).then());
}

export function card() {
	return request(web.post('payments/card'));
}

export function methodsDefault(type) {
	return request(web.patch('payments/methods/default', type));
}

export function search(dateStart, dateEnd, filters, location, bounds) {
	dateStart = dateStart.toISOString();
	dateEnd = dateEnd.toISOString();
	const params = {
		...filters,
		dateStart,
		dateEnd,
	};

	if (location) {
		const { lon, lat } = location;

		params.location = [lon, lat];
	}

	if (bounds) {
		params.bounds = normalizeBounds(bounds);
	}

	const query = new URLSearchParams(params);

	return request(web.get(`car-search?${query.toString()}`));
}

export function suggest(q, location) {
	location =
		typeof location === 'object'
			? `${location.lon},${location.lat}`
			: undefined;

	return request(web.get('car-search/suggest', { q, location }));
}

export function getCarCard(uuid) {
	return request(web.get(`car/${uuid}/card`));
}

export function getCarsList() {
	return request(web.get('car/list'));
}

export function getCarEditData(carId) {
	return request(web.get(`/car/management/${carId}`));
}

export function checkValidationCompleteness(carId) {
	return request(web.post(`/car/${carId}/docs/completeness`, {}));
}

export function postCarEditData(id, data) {
	return request(web.patch(`/car/management/${id}`, { ...data }));
}

/**
 * solution:
 *  - HOST_CANCEL
 *  - HOST_CONFIRM
 *  - GUEST_CANCEL
 * */
export async function resolveRentProlongationRequest({ rentId, solution, prolongationRequestId, solutionMessage }) {
	const response = await request(web.post(`/rent/${rentId}/prolongation/resolution-request`, {
		solution,
		solutionMessage,
		prolongationRequestId,
	}));

	if (response?.error?.status >= 400) {
		throw response;
	}

	return response;
}

export async function getUnavailableProlongationDates({ rentId }) {
	const response = await request(web.get(`/rent/${rentId}/prolongation/get-unavailable-dates`));
	if (response?.error?.status >= 400) {
		throw response;
	}

	return response;
}

export async function createRentProlongationRequest({ rentId, dateProlongationTo }) {
	const response = await request(web.post(`/rent/${rentId}/prolongation/create-request`, { dateProlongationTo }));
	if (response?.error?.status >= 400) {
		throw response;
	}

	return response;
}

export async function calculateRentProlongationRequest({ rentId, dateProlongationTo }) {
	const response = await request(web.post(`/rent/${rentId}/prolongation/calculate`, { dateProlongationTo }));
	if (response?.error?.status >= 400) {
		throw response;
	}

	return response;
}

export function verifyCarEditData(id) {
	return request(web.patch(`/car/management/${id}/verify`));
}

export function getCarDeliveryPrice(uuid, { lat, lon }) {
	return request(
		web.get(
			`car/${uuid}/delivery-to-point-price?latitude=${lat}&longitude=${lon}`
		)
	);
}

export function getRentRoom(uuid, role) {
	if (role === 'GUEST') {
		return request(web.get(`rent/room/${uuid}/guest`));
	}
	return request(web.get(`rent/room/${uuid}/host`));
}

export function rate(comment, rating, rentId, role) {
	if (role === 'GUEST') {
		return request(web.patch(`rating/host/${rentId}`, { comment, rating }));
	}
	return request(web.patch(`rating/guest/${rentId}`, { comment, rating }));
}

export function getTrips(role, status) {
	if (status) {
		return request(
			web.get(`rent/list/${role === 'GUEST' ? 'guest' : 'host'}`, {
				status,
			}),
			trips => ({ trips })
		);
	}
	return request(
		web.get(`rent/list/${role === 'GUEST' ? 'guest' : 'host'}`),
		trips => ({ trips })
	);
}

export function rentRoomApprove(uuid) {
	return request(web.put(`rent/${uuid}/approve`, {}));
}

export function getPsoEndpoint(role, rentId, step, isStart = true) {
	const inspection = isStart
		? 'pre-rental-inspection'
		: 'post-rental-inspection';
	const roleName = role === 'GUEST' ? 'guest' : 'host';

	return request(
		web.get(`/${inspection}/${roleName}`, {
			rentId,
			step,
		})
	);
}

export function getRentAdditionalPhotos(rentId) {
	return request(
		web.get(`/rent/${rentId}/additional-photos`)
	);
}

export function addRentAdditionalPhotos(rentId, formData) {
	return request(
		web.post(`/rent/${rentId}/additional-photos/add`, formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		})
	);
}

export function updatePsoEndpoint(
	role,
	rentId,
	step,
	saveTmpKeys = [],
	deleteIds = [],
	isStart = true
) {
	const inspection = isStart
		? 'pre-rental-inspection'
		: 'post-rental-inspection';
	const roleName = role === 'GUEST' ? 'guest' : 'host';
	return request(
		web.patch(`/${inspection}/${roleName}`, {
			rentId,
			step,
			data: {
				saveTmpKeys,
				deleteIds,
			},
		})
	);
}

export function psoFinish(rentId, role, isStart) {
	const inspection = isStart
		? 'pre-rental-inspection'
		: 'post-rental-inspection';
	const roleName = role === 'GUEST' ? 'guest' : 'host';

	return request(
		web.patch(`/${inspection}/finish/${roleName}`, {
			rentId,
		})
	);
}

export function rentRoomCancellation(uuid, role, comment, photoKeys = []) {
	if (role === 'GUEST') {
		return request(
			web.put(`rent/${uuid}/decline/guest`, {
				comment,
				photoKeys,
			})
		);
	}
	return request(
		web.put(`rent/${uuid}/decline/host`, {
			comment,
			photoKeys,
		})
	);
}

export function uploadAvatar(photo) {
	const formData = new FormData();
	const file = {
		uri: Platform.OS === 'ios' ? `file://${photo.path}` : photo.path,
		name: 'file',
		type: photo.mime,
	};
	formData.append('file', file);
	return request(
		web.patch('user/profile/avatar', formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		})
	);
}

export function getUploadUrl(ext, access) {
	return request(
		web.get(
			`uploader/get-upload-url?objectExtension=${ext}&access=${access}`
		)
	);
}

export function getBestReviews() {
	return request(web.get('rating/popular-hosts'));
}

export function applyPromocode(promocode) {
	return request(web.post('promocode/apply', { promocode }));
}

export function deleteAccount() {
	return request(web.delete('user'));
}

function request(promise, handleResult, handleError = error => ({ error })) {
	return promise.then(getResultHandler(handleResult)).catch(handleError);
}

// (fn|arr|str) => obj
function getResultHandler(fn = data => data) {
	return ({ data, error } = {}) => {
		if (error) {
			throw error;
		}

		if (typeof fn === 'string' || Array.isArray(fn)) {
			const props = [].concat(fn);

			fn = data =>
				props.reduce(
					(res, prop) => ({ ...res, [prop]: data[prop] }),
					{}
				);
		}

		const res = fn(data);

		if (res === false) {
			throw {};
		}

		return (typeof res === 'object' ? res : { result: res }) || {};
	};
}

export function getServiceStats() {
	return request(web.get('manuals/service-stats'));
}

export function getCities() {
	return request(web.get('manuals/cities'));
}

export function getAppVersions() {
	return request(web.get('manuals/mobile-versions'));
}

export function payForRent(rentId) {
	return request(web.post(`rent/${rentId}/payment`, {}));
}

export function checkDriver(guestId) {
	return request(web.get(`/guest/${guestId}/report`));
}

export function publishCar(carId) {
	return request(web.patch(`/car/management/${carId}/publish`, {}));
}

export function unpublishCar(carId) {
	return request(web.patch(`/car/management/${carId}/stash`, {}));
}

export function applyForSuperGuest() {
	return request(web.post(`/guest/request/super-guest`, {}));
}

export function getInsuranceData(carId) {
	return request(web.get(`/car/insurance/${carId}`));
}

export function toggleInsurance(carId, isInsured) {
	return request(
		web.patch(`/car/insurance/${carId}`, { insured: isInsured })
	);
}

export function getRadiuses() {
	return request(web.get('/manuals/radiuses'));
}

export function getCarPhotosList(carId) {
	return request(web.get(`/car/${carId}/photo/list`));
}

export function deleteCarPhoto(photoId, carId) {
	return request(web.delete(`/car/${carId}/photo/${photoId}`));
}

export function addCarPhoto(photo, carId) {
	return request(
		web.post(`/car/${carId}/photo`, photo, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		})
	);
}

export function registrateCar(carRegistrationData) {
	return request(
		web.post('/car/registration', carRegistrationData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		})
	);
}

export function setDriversLicenseFirstIssueYear(date) {
	return request(
		web.patch(`/user/drivers-license`, { firstLicenseIssueYear: date })
	);
}

export function getFcmToken() {
	return request(
		web.get('/user/firebase-token')
	);
}

export function postFcmToken(token) {
	return request(
		web.post('/user/firebase-token', { token })
	);
}

export function getHostMyCarInfo() {
	return request(
		strapi.get('/host-my-car?populate=*')
	);
}

export function getRentDetailPageInfo() {
	return request(
		strapi.get('/detail-rent-page?populate=deep')
	);
}

export function getHostMyCarVideos() {
	return request(
		strapi.get('/video-reviews?populate=videoReview&sort=sortIndex')
	);
}

export function getHostMyCarArticles(id) {
	return request(
		strapi.get(`/customer-section-pages?fields=title&fields=content&populate=deep&sort=sortIndex&filters[pageSection][id]=${id}`)
	);
}

export function getHostMyCarArticle(id) {
	return request(
		strapi.get(`/customer-section-pages/${id}?fields=title&fields=content&populate=deep`)
	);
}

export function getBeginningArticles() {
	return request(
		strapi.get(`/customer-section-pages?filters[pageSection][id]=1&fields=title&populate=previewImage,pageSection`)
	);
}

export function getEarnArticles() {
	return request(
		strapi.get(`/customer-section-pages?filters[pageSection][id]=5&fields=title&populate=previewImage,pageSection`)
	);
}

export function getInsuranceArticles() {
	return request(
		strapi.get(`/customer-section-pages?filters[pageSection][id]=2&fields=title&populate=previewImage,previewImageInList,pageSection,pageRubric,icon`)
	);
}

export function getServiceRulesArticles() {
	return request(
		strapi.get(`/customer-section-pages?filters[pageSection][id]=8&fields=title&populate=previewImage,pageSection,pageRubric,icon`)
	);
}

export function getHostRulesArticles() {
	return request(
		strapi.get(`/customer-section-pages?filters[pageSection][id]=7&fields=title&populate=previewImage,pageSection,pageRubric,icon`)
	);
}

export function getGuestRulesArticles() {
	return request(
		strapi.get(`/customer-section-pages?filters[pageSection][id]=6&fields=title&populate=previewImage,pageSection,pageRubric,icon`)
	);
}

export function getLegalArticles() {
	return request(
		strapi.get(`/customer-section-pages?filters[pageSection][id]=4&fields=title&populate=previewImage,pageSection,pageRubric,icon`)
	);
}

export function getHostMyCarSections() {
	return request(
		strapi.get(`/customer-page-sections?populate=*&sort=sortIndex`)
	);
}


export function getHostMyCarSearch(input) {
	return request(
		strapi.get(`/customer-section-pages?fields=title&populate=*&filters[title][$containsi]=${input}&sort=sortIndex`)
	);
}

export const user = {
	get: (uuid = null) => request(
		web.get([ 'user/profile', uuid ].filter(Boolean).join('/'))
	),
	update: body => request(
		web.patch('user/profile', body)
	)
}

export const guest = {
	updateUserData: body => request(
		web.patch('/user/data', body)
	),
	commitRegistration: () => request(
		web.post('/guest/commit-registration')
	),

	driversLicense: {
		get: () => request(
			web.get('/guest/drivers-license')
		),
		create: body => request(
			web.post('/guest/drivers-license', body)
		),
		update: body => request(
			web.patch('/guest/drivers-license', body)
		)
	},
	passport: {
		get: () => request(
			web.get('/guest/passport')
		),
		create: body => request(
			web.post('/guest/passport', body)
		),
		update: body => request(
			web.patch('/guest/passport', body)
		)
	}
}

export const host = {

	createCar: (registrationNumber) => request(
		web.post('/car/create', { registrationNumber })
	),

	getCar: () => request(
		web.get('/car/create/get-created')
	),

	sendCarParameters: (id, body) => request(
		web.patch(`/car/management/${id}`, body)
	),

	sendPTSData: (id, body) => request(
		web.post(`/car/${id}/docs/vehicle-passport`, body, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		})
	),

	sendSTSData: (id, body) => request(
		web.post(`/car/${id}/docs/registration-certificate`, body, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		})
	),

	getPTSData: (carId) => request(
		web.get(`/car/${carId}/docs/vehicle-passport`)
	),

	getSTSData: (carId) => request(
		web.get(`/car/${carId}/docs/registration-certificate`)
	),

	completeCarRegistration: (id) => request(
		web.post(`/car/create/complete`, { carId: id })
	),

	sendOwnerData: (id, body) => request(
		web.post(`/car/${id}/docs/owner-passport`, body, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		})
	),

	getOwnerData: (carId) => request(
		web.get(`/car/${carId}/docs/owner-passport`)
	),

	sendAvatar: (body) => request(
		web.patch(`/user/profile/avatar`, body, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		})
	),

	sendUserProfile: (body) => request(
		web.patch(`/user/profile`, body)
	),

	sendWorkingHours: (body) => request(
		web.patch(`/host/preferences`, { workingHours: body })
	),

	sendPaymentDetails: (body, isIndividual) => request(
		web.post(
			isIndividual
				? '/payments/card'
				: '/payments/payments-account',
			body
		)
	),

	updatePreferences: body => request(
		web.patch('/host/preferences', body)
	),

	getPreferences: () => request(
		web.get('/host')
	),

	getPaymentMethods: () => request(
		web.get('/payments/methods')
	),
}
