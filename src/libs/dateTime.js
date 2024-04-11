import { MONTH_MAP } from '../constants/dictionary'
import { WEEK_DAYS, WeekDaysEnum } from '../constants/dayTime'

export const timeObjectToString = ({ hours, minutes }) => `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`

export const timeStringToObject = (str = '10:00') => {
	const [ hours, minutes ] = str.split(':').map(Number)
	return { hours, minutes }
}

export const daysObjectToNumbersArray = (obj = {}) => {
	return Object.entries(obj)
		.filter(([ key, val ]) => val && Boolean(WeekDaysEnum[key] + 1))
		.map(([ key ]) => WeekDaysEnum[key])
}

export const dayNumbersArrayToObject = (arr = [], onlyPassed = false) => {
	const passed = arr.reduce((acc, d) => WeekDaysEnum[d] ? ({ ...acc, [WeekDaysEnum[d]]: true }) : acc , {})
	return onlyPassed ? passed : {
		...Object.keys(WEEK_DAYS).reduce((acc, d) => ({ ...acc, [d]: false }), {}),
		...passed
	}
}

export const dayNumbersArrayToStringArray = (arr = []) => {
	return arr.map(d => WeekDaysEnum[d]).filter(Boolean)
}

export const formatTime = (
	date,
	template = (h = '', m = '') => `${h.padStart(2, '0')}:${m.padStart(2, '0')}`
) => {
	if (!(date instanceof Date)) date = new Date()

	const [ hours, minutes ] = [ date.getHours(), date.getMinutes() ]

	return template(String(hours), String(minutes))
}

export const formatDate = (date, template = (m, d) => `${d} ${MONTH_MAP[m]}`) => {
	if (!(date instanceof Date)) date = new Date()

	const [ month, day ] = [ date.getMonth(), date.getDate() ]

	return template(String(month), String(day))
}

export const numbersToDaysString = (arr = []) => {
	const sorted = arr.map(Number)
		.filter(day => Boolean(WeekDaysEnum[day]))
		.sort((a, b) => a - b)

	if (!arr.length || arr.length === 7) return [ WEEK_DAYS[WeekDaysEnum[0]], WEEK_DAYS[WeekDaysEnum[6]] ].join(' - ')

	let titles = []

	let rangeOpen = false
	let streak = []

	const mapToString = num => WEEK_DAYS[WeekDaysEnum[num]]

	const recordStreak = () => {
		if (streak.length) {
			if (streak.length > 2) {
				titles.push([
					streak[0],
					streak[streak.length - 1]
				].map(mapToString).join(' - '))
			} else {
				titles.push(...streak.map(mapToString))
			}
		}
	}
	
	for (const num of sorted) {
		if (rangeOpen) {
			if (num - streak[streak.length - 1] > 1) {
				recordStreak()

				streak = [ num ]
				continue
			}
			streak.push(num)
			continue
		}
		rangeOpen = true
		streak.push(num)
	}
	recordStreak()

	return titles.join(', ')
}
