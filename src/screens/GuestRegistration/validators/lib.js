import { parse, isValid as isValidDate, isToday } from 'date-fns'
import * as Yup from 'yup'

export const dateRegExp = /^[0-9]{2}\.[0-9]{2}\.[0-9]{4}$/
export const fioRegExp = /^[а-яА-ЯёЁ\s]+$/
export const tenDigitNumberExp = /^\d{10}$/

export const warns = {
	onlyRussionSymbols: 'Только русские буквы',
	enterCorrectDate: 'Введите корректную дату'
} 

Yup.addMethod(Yup.date, 'format', function (formats) {
	return this.transform(function (value, originalValue) {
		if (!dateRegExp.test(originalValue)) return originalValue

		if (this.isType(value) && isToday(value)) return value

		const formatedValue = parse(originalValue, formats, new Date())

		return isValidDate(parse(originalValue, formats, new Date()))
			? formatedValue
			: new Date('')
	})
})
