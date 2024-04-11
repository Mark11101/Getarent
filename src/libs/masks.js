export const phoneMask = (phone, defaultValue = ' - ') => {
	if (![ 'string', 'number' ].includes(typeof phone)) return defaultValue
	return phone.split('').filter(char => !!+char || char === '0').join('').replace(
		/(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})/,
		(_, a, aaa, bbb, cc, dd) => '+' + a + ' ' + aaa + ' ' + bbb + ' ' + cc + ' ' + dd
	)
}

export const serialNumberMask = (num, defaultValue = ' - ') => {
	if (![ 'string', 'number' ].includes(typeof num)) return defaultValue
	return num.replace(/(\d{4})(\d{6})/, (_, series, number) => [ series, number ].join(' '))
}

export const partialCardNumberMask = (card, defaultValue = ' - ') => {
	if (![ 'string', 'number' ].includes(typeof card)) return defaultValue
	return card.slice(0, 6) + ' ' + '*'.repeat(6) + card.slice(-4)
}
