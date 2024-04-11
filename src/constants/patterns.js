export const BASE_PATTERNS = Object.freeze({
	ONLY_NUMBERS: /^\d*$/,
	ONLY_RUSSIAN: /^[а-яА-ЯёЁ\s]+$/
})

export const PAYMENT_PATTERNS = Object.freeze({
	INN: /^(\d{12}|\d{10}|0{1})$/,
	KPP: /^(\d{9})$/,
	BIK: /^(\d{9})$/,
	CORR_ACCOUNT_NUMBER: /^(\d{20})$/,
	ACCOUNT_NUMBER: /^(\d{20}|\d{22})$/,
})
