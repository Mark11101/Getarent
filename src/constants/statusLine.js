export const STATUS_LINE = {
	AWAITS_INITIAL_PAYMENT: {
		text: '',
		type: '',
	},
	AWAITS_UPDATE_PAYMENT: {
		text: '',
		type: '',
	},
	AWAITS_GUEST_SCORING_COMPLETION: {
		text: 'Проверка документов',
		type: 'error',
	},
	AWAITS_HOST_APPROVAL: {
		text: 'Ожидаем подтверждение',
		type: 'error',
	},
	APPROVED_BY_HOST: {
		text: 'Бронирование подтверждено',
		type: 'success',
	},
	IN_PROGRESS: {
		text: 'В аренде',
		type: 'success',
	},
	FINISHED: {
		text: 'Аренда завершена',
		type: 'default',
	},
	DECLINED_AUTOMATICALLY: {
		text: '',
		type: '',
	},
	DECLINED_BY_HOST: {
		text: 'Отменено владельцем',
		type: 'default',
	},
	DECLINED_BY_GUEST: {
		text: 'Отменено водителем',
		type: 'default',
	},
};
