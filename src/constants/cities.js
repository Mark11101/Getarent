import api from 'api';

export const cities = [
	{
		id: 1,
		bounds: {
			southWest: [38.268128, 56.319508],
			northEast: [36.992051, 55.192321],
			// старые southWest: [37.860716, 55.909024],
			// northEast: [37.365403, 55.568058],
		},
		name: 'Москва',
		type: 'MAP',
		timeZone: 'Europe/Moscow',
	},
	{
		id: 2,
		bounds: {
			southWest: [30.816692, 60.243252],
			northEast: [29.37864, 59.655621],
		},
		name: 'Санкт-Петербург',
		type: 'MAP',
		timeZone: 'Europe/Moscow',
	},
	{
		id: 3,
		bounds: {
			southWest: [83.204563, 55.118185],
			northEast: [82.695175, 54.806745],
		},
		name: 'Новосибирск',
		type: 'MAP',
		timeZone: 'Asia/Novosibirsk',
	},
	{
		id: 4,
		bounds: {
			southWest: [60.924668, 56.952682],
			northEast: [60.286898, 56.690583],
		},
		name: 'Екатеринбург',
		type: 'MAP',
		timeZone: 'Asia/Yekaterinburg',
	},
	{
		id: 5,
		bounds: {
			southWest: [49.260235, 55.857121],
			northEast: [49.006192, 55.725065],
		},
		name: 'Казань',
		type: 'MAP',
		timeZone: 'Europe/Moscow',
	},
	{
		id: 6,
		bounds: {
			southWest: [44.192782, 56.392651],
			northEast: [43.829387, 56.253712],
		},
		name: 'Нижний Новгород',
		type: 'MAP',
		timeZone: 'Europe/Moscow',
	},
	{
		id: 7,
		bounds: {
			southWest: [62.128505, 55.45932],
			northEast: [60.766297, 54.923516],
		},
		name: 'Челябинск',
		type: 'MAP',
		timeZone: 'Asia/Yekaterinburg',
	},
	{
		id: 8,
		bounds: {
			southWest: [93.161277, 56.108772],
			northEast: [92.670805, 55.930112],
		},
		name: 'Красноярск',
		type: 'MAP',
		timeZone: 'Asia/Krasnoyarsk',
	},
	{
		id: 9,
		bounds: {
			southWest: [50.332249, 53.269904],
			northEast: [50.034862, 53.143501],
		},
		name: 'Самара',
		type: 'MAP',
		timeZone: 'Europe/Samara',
	},
	{
		id: 10,
		bounds: {
			southWest: [56.141151, 54.825941],
			northEast: [55.880974, 54.703862],
		},
		name: 'Уфа',
		type: 'MAP',
		timeZone: 'Asia/Yekaterinburg',
	},
	{
		id: 11,
		bounds: {
			southWest: [39.838178, 47.298412],
			northEast: [39.599591, 47.168282],
		},
		name: 'Ростов-на-Дону',
		type: 'MAP',
		timeZone: 'Europe/Moscow',
	},
	{
		id: 12,
		bounds: {
			southWest: [39.193275, 45.158535],
			northEast: [38.80827, 44.968692],
		},
		name: 'Краснодар',
		type: 'MAP',
		timeZone: 'Europe/Moscow',
	},
	{
		id: 13,
		bounds: {
			southWest: [39.299082, 51.727756],
			northEast: [39.107162, 51.616671],
		},
		name: 'Воронеж',
		type: 'MAP',
		timeZone: 'Europe/Moscow',
	},
	{
		id: 14,
		bounds: {
			southWest: [56.334849, 58.041673],
			northEast: [56.12611, 57.952099],
		},
		name: 'Пермь',
		type: 'MAP',
		timeZone: 'Asia/Yekaterinburg',
	},
	{
		id: 15,
		bounds: {
			southWest: [65.722742, 57.228837],
			northEast: [65.404825, 57.071285],
		},
		name: 'Тюмень',
		type: 'MAP',
		timeZone: 'Asia/Yekaterinburg',
	},
	{
		id: 16,
		bounds: {
			southWest: [132.032604, 43.169345],
			northEast: [131.812333, 43.066855],
		},
		name: 'Владивосток',
		type: 'MAP',
		timeZone: 'Asia/Vladivostok',
	},
	{
		id: 17,
		bounds: {
			southWest: [21.043638582301714, 55.36229173523583],
			northEast: [19.86078141773221, 54.04873070830888],
		},
		name: 'Калининград',
		type: 'MAP',
		timeZone: 'Europe/Kaliningrad',
	},
	{
		id: 18,
		bounds: {
			southWest: [40.37687715806164, 44.06036955587499],
			northEast: [39.486315109227895, 42.91462870099871],
		},
		name: 'Сочи',
		type: 'MAP',
		timeZone: 'Europe/Moscow',
	},
	{
		id: 19,
		bounds: {
			southWest: [37.832529, 44.779996],
			northEast: [37.712376, 44.615823],
		},
		name: 'Новороссийск',
		type: 'MAP',
		timeZone: 'Europe/Moscow',
	},
	{
		id: 20,
		bounds: {
			southWest: [37.403413, 44.991547],
			northEast: [37.21852, 44.823405],
		},
		name: 'Анапа',
		type: 'MAP',
		timeZone: 'Europe/Moscow',
	},
	{
		id: 21,
		bounds: {
			southWest: [38.15435, 44.628296],
			northEast: [37.976461, 44.526617],
		},
		name: 'Геленджик',
		type: 'MAP',
		timeZone: 'Europe/Moscow',
	},
	{
		id: 22,
		bounds: {
			southWest: [42.618446, 43.850507],
			northEast: [43.267931, 44.209005],
		},
		name: 'Пятигорск',
		type: 'MAP',
		timeZone: 'Europe/Moscow',
	},
	{
		id: 23,
		bounds: {
			southWest: [42.618446, 43.850507],
			northEast: [43.267931, 44.209005],
		},
		name: 'Кисловодск',
		type: 'MAP',
		timeZone: 'Europe/Moscow',
	},
	{
		id: 24,
		bounds: {
			southWest: [42.618446, 43.850507],
			northEast: [43.267931, 44.209005],
		},
		name: 'Минеральные воды',
		type: 'MAP',
		timeZone: 'Europe/Moscow',
	},
	{
		id: 25,
		bounds: {
			southWest: [42.618446, 43.850507],
			northEast: [43.267931, 44.209005],
		},
		name: 'Железноводск',
		type: 'MAP',
		timeZone: 'Europe/Moscow',
	},
	{
		id: 26,
		bounds: {
			southWest: [42.618446, 43.850507],
			northEast: [43.267931, 44.209005],
		},
		name: 'Ессентуки',
		type: 'MAP',
		timeZone: 'Europe/Moscow',
	},
	{
		id: 27,
		bounds: {
			southWest: [41.738503, 45.389406],
			northEast: [41.677939, 45.35259],
		},
		name: 'Изобильный',
		type: 'MAP',
		timeZone: 'Europe/Moscow',
	},
	{
		id: 28,
		bounds: {
			southWest: [42.618446, 43.850507],
			northEast: [43.267931, 44.209005],
		},
		name: 'Лермонотов',
		type: 'MAP',
		timeZone: 'Europe/Moscow',
	},
];

export const setCity = async (id) => {
	await api.storage.set('cityId', id.toString());
};

export const getCity = async () => {

	const { cityId } = await api.storage.get('cityId');
	return cities.find((city) => city.id === Number(cityId))
};
