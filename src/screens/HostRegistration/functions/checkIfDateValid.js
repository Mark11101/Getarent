function isValidDayMonthYear(day, month, year) {
	
	const isValidNumber = (value, min, max) => parseInt(value, 10) >= min && parseInt(value, 10) <= max;
	const isValidDay = (d, m, y) => d >= 1 && d <= new Date(y, m, 0).getDate();
  
	return isValidNumber(day, 1, 31) && isValidNumber(month, 1, 12) && isValidNumber(year, 1000, 9999) && isValidDay(day, month, year);
};

export default function (dateString) {
	
	const dateRegex = /^(\d{2})\.(\d{2})\.(\d{4})$/;
	const match = dateString.match(dateRegex);
  
	return match && isValidDayMonthYear(match[1], match[2], match[3]);
};
