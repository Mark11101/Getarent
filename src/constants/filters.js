import { searchFiltersCars, searchFiltersBody } from 'data';

const sections = [
		{
			type: 'section',
			items: [
				{
					type: 'switch',
					label: 'Встреча в аэропорту',
					name: 'deliveryPlace',
				},
				{
					type: 'switch',
					label: 'Доставка по городу',
					name: 'deliveryRadius',
				},
			],
		},
		// {
		// 	type: 'section',
		// 	label: 'Цена',
		// 	items: [
		// 		{
		// 			type: 'range',
		// 			label: 'Минимальная, в сутки',
		// 			placeholder: '-',
		// 			name: 'priceMin',
		// 			label2: 'Максимальная, в сутки',
		// 			placeholder2: '-',
		// 			name2: 'priceMax',
		// 		},
		// 	],
		// },
		{
			type: 'section',
			label: 'Показать',
			items: [
				{
					type: 'switch',
					label: 'Без ограничений пробега',
					name: 'noMilLim',
				},
				{
					type: 'slider',
					label: 'Включенные километры',
					name: 'distance',
					value: 0,
					min: 0,
					max: 1000,
				},
			],
		},
		{
			type: 'section',
			items: [
				{
					type: 'radioGroup',
					label: 'Использование',
					name: 'area',
					value: 'CITY',
					options: [
						{ label: 'Только в городе', value: 'CITY' },
						{
							label: 'По региону и области (краю)',
							value: 'COUNTRY',
						},
						{
							label: 'По всей стране (по согласованию региона)',
							value: 'WORLD',
						},
					],
				},

				{
					type: 'select',
					label: 'Количество мест (с учетом водителя)',
					name: 'seats',
					value: '',
					placeholder: 'Выберите число',
					options: [1, 2, 3, 4, 5, 6, 7, 8, 9].map(value => ({
						label: value,
						value,
					})),
				},
			],
		},
		{
			type: 'section',
			items: [
				{
					type: 'select',
					search: 'Начните вводить название марки',
					label: 'Марка',
					name: 'brand',
					placeholder: 'Выберите марку',
					options: searchFiltersCars.options,
				},
				{
					type: 'select',
					label: 'Год',
					name: 'prodYear',
					value: '',
					placeholder: 'Выберите год',
					options: [...Array(22).keys()].map(k => ({
						label: 2021 - k,
						value: 2021 - k,
					})),
				},
				{
					type: 'select',
					label: 'Тип Кузова',
					name: 'bodyType',
					placeholder: 'Выберите тип кузова',
					options: searchFiltersBody.options,
				},
			],
		},
		{
			type: 'section',
			label: 'Коробка передач',
			noSeparator: true,
			name: 'trType',
			items: [
				{ type: 'switch', label: 'Механическая', name: 'MANUAL' },
				{ type: 'switch', label: 'Автомат', name: 'AUTOMATIC' },
			],
		},
		{
			type: 'section',
			label: 'Привод',
			noSeparator: true,
			name: 'trLayout',
			items: [
				{ type: 'switch', label: 'Передний', name: 'FRONT_WHEEL' },
				{ type: 'switch', label: 'Задний', name: 'REAR_WHEEL' },
				{ type: 'switch', label: 'Полный', name: 'FOUR_WHEEL' },
			],
		},
		{
			type: 'section',
			label: 'Тип двигателя',
			noSeparator: true,
			name: 'engType',
			items: [
				{ type: 'switch', label: 'Бензин', name: 'GASOLINE' },
				{ type: 'switch', label: 'Дизель', name: 'DIESEL' },
				{ type: 'switch', label: 'Электро/Гибрид', name: 'ELECTRO' },
			],
		},
		{
			type: 'section',
			label: 'Дополнительно',
			noSeparator: true,
			name: 'features',
			items: [
				{ type: 'switch', name: 'CHILD_SEAT', label: 'Детское кресло' },
				{ type: 'switch', name: 'NAVIGATOR', label: 'Навигатор' },
				{ type: 'switch', name: 'REGISTRATOR', label: 'Регистратор' },
				{
					type: 'switch',
					name: 'ROOF_RACK',
					label: 'Багажник на крыше',
				},
				{
					type: 'switch',
					name: 'FRIDGE',
					label: 'Холодильник в салон',
				},
				{
					type: 'switch',
					name: 'BIKE_RACK',
					label: 'Крепление для велосипеда',
				},
				{
					type: 'switch',
					name: 'SNOWBOARD_RACK',
					label: 'Крепление для сноуборда',
				},
				{
					type: 'switch',
					name: 'SKIING_RACK',
					label: 'Крепление для лыж',
				},
				// { type: 'switch', name: 'TRAILER', label: 'Прицеп' },
				// { type: 'switch', name: 'SIGNALING', label: 'Сигнализация' },
				// { type: 'switch', name: 'WINCH', label: 'Лебедка' },
				{ type: 'switch', name: 'RADAR_DETECTOR', label: 'Антирадар' },
			],
		},
		{
			type: 'section',
			label: 'Дополнительные услуги',
			noSeparator: true,
			name: 'services',
			items: [
				{
					type: 'switch',
					label: 'Мойка после аренды',
					name: 'afterRentWashingPrice',
				},
				{
					type: 'switch',
					label: 'Возврат с пустым баком',
					name: 'fuelLiterCompensationPrice',
				},
			],
		},
	],
	itemReducer = (res, sectionName, item) => {
		const { type, name, value = type === 'switch' ? false : '' } = item;

		if (sectionName) {
			(res[sectionName] = res[sectionName] || {})[name] = value;
		} else {
			res[name] = value;
		}

		if (type === 'range') {
			const { name2: name, value2: value } = item;

			res = itemReducer(res, sectionName, {
				type: 'number',
				name,
				value,
			});
		}

		return res;
	},
	initialValues = sections.reduce(
		(res, { name: sectionName, items }) =>
			items.reduce(
				(res, item) => itemReducer(res, sectionName, item),
				res
			),
		{}
	);

export default {
	sections,
	initialValues,
};
