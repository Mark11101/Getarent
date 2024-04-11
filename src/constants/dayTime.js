export var WeekDaysEnum
((Enum) => {
	Enum[Enum["mon"] = 0] = "mon"
	Enum[Enum["tue"] = 1] = "tue"
	Enum[Enum["wed"] = 2] = "wed"
	Enum[Enum["thu"] = 3] = "thu"
	Enum[Enum["fri"] = 4] = "fri"
	Enum[Enum["sat"] = 5] = "sat"
	Enum[Enum["sun"] = 6] = "sun"
})(WeekDaysEnum || (WeekDaysEnum = {}))

export const WEEK_DAYS_SHORT = {
	[WeekDaysEnum[0]]: 'Пн',
	[WeekDaysEnum[1]]: 'Вт',
	[WeekDaysEnum[2]]: 'Ср',
	[WeekDaysEnum[3]]: 'Чт',
	[WeekDaysEnum[4]]: 'Пт',
	[WeekDaysEnum[5]]: 'Сб',
	[WeekDaysEnum[6]]: 'Вс'
}

export const WEEK_DAYS = {
	[WeekDaysEnum[0]]: 'Понедельник',
	[WeekDaysEnum[1]]: 'Вториник',
	[WeekDaysEnum[2]]: 'Среда',
	[WeekDaysEnum[3]]: 'Четверг',
	[WeekDaysEnum[4]]: 'Пятница',
	[WeekDaysEnum[5]]: 'Суббота',
	[WeekDaysEnum[6]]: 'Воскресенье'
}
