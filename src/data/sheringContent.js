import React from 'react';

import HowItWorksIcon from 'img/sharing/how-it-works.svg';
import SafeIcon from 'img/sharing/safe.svg';
import SupportIcon from 'img/sharing/support.svg';

const WIDTH = 60;
const HEIGHT = 60;

export default [
	{
		id: 'how-it-work',
		image: () => { return <HowItWorksIcon width={WIDTH} height={HEIGHT} /> },
		title: 'Как это работает?',
		text:
			'Зарегистрируйте свою машину бесплатно, установите собственные цены, правила и настройте, когда ваша машина будет доступна для бронирований. Передавайте машину без залогов и бумажных договоров и получайте выплаты на карту',
		popupKey: 'SheringHowItWork',
	},
	{
		id: 'safe',
		image: () => { return <SafeIcon width={WIDTH} height={HEIGHT} /> },
		title: 'Вы надежно защищены',
		text:
			'Getarent застрахует ваш автомобиль от повреждений и угона на полную стоимость автомобиля, а также, в случае необходимости, возместит топливо, мойку, штрафы ГИБДД и любой пробег сверх вашего лимита.',
		popupKey: 'SheringSafe',
	},
	{
		id: 'support',
		image: () => { return <SupportIcon width={WIDTH} height={HEIGHT} /> },
		title: 'Мы прикроем вашу спину',
		text:
			'Getarent заранее проверяет путешественников, оказывает круглосуточную поддержку клиентов 24 / 7, техническую помощь на дорогах, чтобы вы сохраняли ваше душевное спокойствие во время любой поездки',
		popupKey: 'SheringSupport',
	},
];
