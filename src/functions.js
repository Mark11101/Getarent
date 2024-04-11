import {
	check,
	request,
	RESULTS,
	PERMISSIONS,
	openSettings,
} from 'react-native-permissions';
import {
	set,
	add,
	sub,
	parse,
	isAfter,
	addDays,
	addHours,
	isBefore,
	subHours,
	isSameDay,
	getMinutes,
	differenceInHours,
} from 'date-fns';
import { ru } from 'date-fns/locale';
import { formatInTimeZone } from 'date-fns-tz';
import { Platform, Alert, Linking } from 'react-native';
import Geolocation from '@react-native-community/geolocation';

const mskHours = 3;

const errorsMap = {
	NETWORK_ERROR: 'Нет интернета',
	SERVER_ERROR: 'Ошибка сервера',
	CLIENT_ERROR: 'Ошибка приложения',
	CONNECTION_ERROR: 'Ошибка соединения с сервером',
	TIMEOUT_ERROR: 'Превышен лимит ожидания ответа сервера',
};

const locationPermission = Platform.OS === 'ios'
	? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
	: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

const locationErrors = {
	denied: 'Отказано в доступе',
	blocked: 'Доступ заблокирован',
	unavalible: 'Сервис геолокации недоступен на вашем устройстве',
};

export const DAYS = [
	{ key: 0, label: 'ПН' },
	{ key: 1, label: 'ВТ' },
	{ key: 2, label: 'СР' },
	{ key: 3, label: 'ЧТ' },
	{ key: 4, label: 'ПТ' },
	{ key: 5, label: 'СБ' },
	{ key: 6, label: 'ВСК'},
];

export function extractErrorMessage(error) {
	
	if (typeof error === 'string') {
		return error;
	}

	const { message, problem } = error || {};

	return String(
		message ||
		errorsMap[problem] ||
		(error ? JSON.stringify(error) : 'Попробуйте еще раз')
	);
}

export function getStartDate() {

	const now = new Date();
	const isNowMoreThanThirtyMins = getMinutes(now) > 30;

	return add(set(now, { minutes: isNowMoreThanThirtyMins ? 0 : 30 }), {
		hours: isNowMoreThanThirtyMins ? 4 : 3,
	});
}

export function fromUTCToLocalDate(utcDate) {

	let parsedDate = parse(
		utcDate.slice(0, -5),
		"yyyy-MM-dd'T'HH:mm:ss",
		new Date()
	);

	return addHours(parsedDate, mskHours);
}

export function parseDate(str) {

	const date = new Date(str);
	const offset = date.getTimezoneOffset();

	if (offset === 0) {
		return date;
	}

	if (offset < 0) {
		return add(date, { minutes: -offset });
	} else {
		return sub(date, { minutes: offset });
	}
}

export function forEachDayOfPeriod(start, end, callback) {

	start = start instanceof Date ? start : new Date(start);
	end = end instanceof Date ? end : new Date(end);

	if (!isSameDay(end, start) && !isAfter(end, start)) {
		return __DEV__
			? console.error('End date should be after start date.')
			: undefined;
	}

	let current = start;

	while (!isSameDay(end, current)) {

		const res = callback(current);

		if (res !== undefined) {
			return res;
		}

		current = addDays(current, 1);
	}
}

export function checkIfPeriodsOverlap(start, end, start2, end2) {

	return (
		isBefore(new Date(start), new Date(end2)) &&
		isAfter(new Date(end), new Date(start2))
	);
}

export const checkIfDateIsAvalible = (
	dateStart,
	dateEnd,
	unavailabilityDates
) => {

	if (!unavailabilityDates || !dateStart || !dateEnd) {
		return true;
	}

	return !Object.values(unavailabilityDates).some(({ startDate, endDate }) =>
		checkIfPeriodsOverlap(dateStart, dateEnd, startDate, endDate)
	);
};

export function extractLocationErrorMessage(error) {

	if (typeof error === 'string') {

		return error;
	
	} else if (typeof error === 'object') {
	
		return extractLocationErrorMessage(error.message);
	
	} else {
		return 'Ошибка';
	}
}

export function getCurrentPosition(options = { timeout: 5000 }) {

	return new Promise((resolve, reject) => {
	
		check(locationPermission).then(result => {
	
			const _getCurrentPosition = () => Geolocation.getCurrentPosition(resolve, reject, options);

			switch (result) {

				case RESULTS.UNAVAILABLE:
					return reject('unavalible');

				case RESULTS.DENIED:
					return request(locationPermission).then(res => {
						if (res !== RESULTS.GRANTED) {
							return reject(res);
						}

						_getCurrentPosition();
					});

				case RESULTS.GRANTED:
					return _getCurrentPosition();

				case RESULTS.BLOCKED: {

					const onPress = () =>
						openSettings()
							.then(() => resolve('settings'))
							.catch(() =>
								reject(
									'Произошла ошибка при попытке открыть настройки'
								)
							);

					return Alert.alert(
						'Доступ к геолокации заблокирован',
						'Перейти в настройки, чтобы включить?',
						[
							{
								text: 'Отмена',
								onPress: () => resolve('settings'),
							},
							{ text: 'Перейти', onPress },
						]
					);
				}
			}
		});
	}).catch(error => {

		const text = locationErrors[error] || extractLocationErrorMessage(error);

		Alert.alert('Ошибка', text);

		return 'error';
	});
}

export function pluralize(number, one, two, five) {

	let n = Math.abs(number);

	n %= 100;

	if (n >= 5 && n <= 20) {
		return five;
	}

	n %= 10;

	if (n === 1) {
		return one;
	}

	if (n >= 2 && n <= 4) {
		return two;
	}

	return five;
}

export function formatPrice(price, unit = '₽') {
	return (
		String(Math.round(price) || '0').replace(/(.)(?=(\d{3})+$)/g, '$1 ') +
		' ' +
		unit
	);
}

export function formatRating(rating) {
	return parseFloat(rating || 0).toFixed(1);
}

/**
 *
 * ```
 * filterTime(1) => 01
 * filterTime(9) => 09
 * filterTime(10) => 10
 * filterTime(59) => 59
 * ```
 * @param number time
 *
 * @return string
 */
export function filterTime(time) {

	if (time < 10) {
		return `0${time}`;
	}

	return time;
}

export function capitalize(str) {
	return str.charAt(0).toUpperCase() + str.substring(1);
}

export const calculateDiscountPrice = ({
	rentDuration,
	rentPricePerDay,
	twoDaysDiscount,
	threeDaysDiscount,
	fiveDaysDiscount,
	weekDiscount,
	twoWeeksDiscount,
	monthDiscount,
}) => {

	let discount = 0;

	if (rentDuration > 1) {
		discount = twoDaysDiscount || discount;
	}

	if (rentDuration >= 3) {
		discount = threeDaysDiscount || discount;
	}

	if (rentDuration >= 5) {
		discount = fiveDaysDiscount || discount;
	}

	if (rentDuration >= 7) {
		discount = weekDiscount || discount;
	}

	if (rentDuration >= 14) {
		discount = twoWeeksDiscount || discount;
	}

	if (rentDuration >= 30) {
		discount = monthDiscount || discount;
	}

	return {
		rentPricePerDay: Math.floor(
			rentPricePerDay - (rentPricePerDay * discount) / 100
		),
		discountPercentage: discount,
	};
};

export function calculateMileageLimit(
	rentDuration,
	dailyMilageLimit,
	weeklyMilageLimit,
	monthlyMilageLimit
) {

	if (!dailyMilageLimit && !weeklyMilageLimit && !monthlyMilageLimit) {
		return null;
	}

	switch (true) {
		case rentDuration < 7:
			return Math.ceil(rentDuration * dailyMilageLimit);
		case rentDuration >= 7 && rentDuration < 30:
			return Math.ceil(rentDuration * (weeklyMilageLimit / 7));
		case rentDuration >= 30:
			return Math.ceil(rentDuration * (monthlyMilageLimit / 30));
		default:
			return null;
	}
}

export const formatPhoneNumber = (s, plus = true) => {

	const startsWith = plus ? '+7' : '8';

	let phone = s.replace(/[^0-9]/g, '');

	if (phone.startsWith('7') && plus) {
		phone = phone.substr(1);
	}

	if (phone.startsWith('8')) {
		phone = phone.substr(1);
	}

	return phone.replace(
		/(\d{3})(\d{3})(\d{2})(\d{2})/g,
		`${startsWith} $1 $2 $3 $4`
	);
};

export const getWorkingHoursText = ({ days, startTime, endTime }) => {

	let minDay = 7;
	let maxDay = 0;

	const setRange = (minDay, maxDay) => {
		return (
			DAYS.find(day => day.key === minDay).label +
			'-' +
			DAYS.find(day => day.key === maxDay).label
		);
	};

	const allDays = days.sort().reduce((res, curr, i) => {
		const prev = days[i - 1];
		const isLastIndex = i === days.length - 1;

		if (curr - prev === 1) {
			minDay = prev < minDay ? prev : minDay;
			maxDay = curr;

			if (isLastIndex) {
				return res + setRange(minDay, maxDay);
			} else {
				return res;
			}
		} else {
			const divider = !isLastIndex ? ', ' : '';

			if (minDay === 7 && maxDay === 0) {
				if (days[i + 1] - curr !== 1) {
					return (
						res + DAYS.find(day => day.key === curr).label + divider
					);
				} else {
					return res;
				}
			} else {
				const range = res + setRange(minDay, maxDay) + divider;

				minDay = 7;
				maxDay = 0;

				if (isLastIndex) {
					return (
						range + ', ' + DAYS.find(day => day.key === curr).label
					);
				} else if (days[i + 1] - curr !== 1) {
					return (
						range + DAYS.find(day => day.key === curr).label + ', '
					);
				} else {
					return range;
				}
			}
		}
	}, '');

	return `* Рабочий график ${allDays} с ${startTime} до ${endTime}`;
};

export const showLoadPhotoError = (message) => {

	if (message === 'User did not grant library permission.') {

		Alert.alert('Разрешите доступ к фото', '', [
			{
				text: 'Отмена',
				style: 'cancel',
			},
			{
				text: 'Открыть настройки',
				onPress: () => Linking.openSettings(),
			},
		]);

	} else if (message === 'User did not grant camera permission.') {

		Alert.alert('Разрешите доступ к камере', '', [
			{
				text: 'Отмена',
				style: 'cancel',
			},
			{
				text: 'Открыть настройки',
				onPress: () => Linking.openSettings(),
			},
		]);

	} else if (message === 'User cancelled image selection') {
		return null;
	} else {
		Alert.alert('Ошибка', 'попробуйте еще раз');
	}
};

export const convertToBounds = (longitude, latitude) => ({
	southWest: [longitude + 0.025, latitude + 0.02],
	northEast: [longitude - 0.025, latitude - 0.02],
});

export const setCancellationDateTime = (dateStart, timeZone) => {

	let diffInHours = differenceInHours(dateStart, new Date());

	return formatInTimeZone(
		subHours(dateStart, diffInHours >= 24 ? 24 : 1),
		timeZone,
		'HH:mm dd MMM yyyy',
		{
			locale: ru,
		}
	);
};

export const getDaysDeclention = (days) => 
	days === 1 
	? 
		'день' 
	: 
		days <= 4 ? 'дня' : 'дней';

const convertMsToDays = (ms) => {

	const msInOneSecond = 1000;
	const secondsInOneMinute = 60;
	const minutesInOneHour = 60;
	const hoursInOneDay = 24;

	const minutesInOneDay = hoursInOneDay * minutesInOneHour;
	const secondsInOneDay = secondsInOneMinute * minutesInOneDay;
	const msInOneDay = msInOneSecond * secondsInOneDay;

	return Math.ceil(ms / msInOneDay);
};

export const getDaysBetweenDates = (dateOne, dateTwo) => {

	let differenceInMs = dateTwo.getTime() - dateOne.getTime();

	if (differenceInMs < 0) {
		differenceInMs = dateOne.getTime() - dateTwo.getTime();
	}

	return convertMsToDays(differenceInMs);
};

export const convertNumberWithDeclension = (
	number,
	firstDeclension,
	secondDeclension,
	thirdDeclension
) => {

	const word = number === 1 || (number > 20 && number % 10 === 1)
		? firstDeclension
		: 
			(number >= 2 && number <= 4) ||
			(number > 20 && (number % 10 === 2 || number % 10 === 3 || number % 10 === 4))
				? secondDeclension
				: thirdDeclension;

	return `${number + ' ' + word}`;
};

export const parseNumberValue = (value) => value !== '' ? parseInt(value, 10) : null;

// https://talkjs.com/docs/Reference/Concepts/Users/
// https://talkjs.com/docs/Reference/React_Native_SDK/Object_Types/User/
export const userToChatUser = user => {
	return {
		id: user.uuid,
		name: user.firstName,
		email: user.email,
		// email: contactDetails?.email ?? null,
		// phone: contactDetails?.phone ?? null, // E.164 standard
		photoUrl: user.avatar ?? null,
		role: 'default',
		// locale: null,
		// welcomeMessage: null,
		// custom: null,
	};
};

export const callNotifAlert = () => {
	
	Alert.alert(
		'Пожалуйста, включите уведомления', 
		'Это обязательно. С помощью пуш-уведомлений мы сообщаем о новых арендах и о других событиях на сервисе.',
		[
			{
				text: 'Открыть настройки',
				onPress: () => {
					Linking.openSettings();
				},
			},
		]
	)
};

export const calcAge = (date) => {

	// Split the date string into day, month, and year components
	const dateComponents = date?.split(".");
	const day = parseInt(dateComponents[0], 10);
	const month = parseInt(dateComponents[1], 10) - 1; // Subtract 1 from the month since months are zero-indexed
	const year = parseInt(dateComponents[2], 10);

	// Create a Date object from the parsed components
	const birthDate = new Date(year, month, day);

	// Get the current date
	const currentDate = new Date();

	// Calculate the age by finding the difference in years
	let age = currentDate.getFullYear() - birthDate.getFullYear();

	// Check if the birthday for this year has already occurred
	if (
	currentDate.getMonth() < birthDate.getMonth() ||
	(currentDate.getMonth() === birthDate.getMonth() &&
		currentDate.getDate() < birthDate.getDate())
	) {
	age--; // Subtract 1 if the birthday hasn't occurred yet this year
	}

	return age;
};

export const validateEmail = (email) => email.length === 0 || /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email);
export const validatePassword = (password) => password.length === 0 || password.length >= 5;

export const checkIfWhitespaceString = str => !!str && typeof str === 'string' && !str.replace(/\s/g, '').length;