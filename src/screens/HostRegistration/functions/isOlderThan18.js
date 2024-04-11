export default (birthdate) => {

	const mmddyyyyDate = birthdate.split(".");

	// Parse the birthdate string into a Date object
	const birthDateObject = new Date(+mmddyyyyDate[2], mmddyyyyDate[1] - 1, +mmddyyyyDate[0]);
  
	// Calculate the current date
	const currentDate = new Date();
  
	// Calculate the age by subtracting the birth year from the current year
	const age = currentDate.getFullYear() - birthDateObject.getFullYear();
  
	// Check if the birthday has occurred for this year
	const hasBirthdayOccurred = (
	  currentDate.getMonth() > birthDateObject.getMonth() ||
	  (currentDate.getMonth() === birthDateObject.getMonth() && currentDate.getDate() >= birthDateObject.getDate())
	);
  
	// Check if the person is at least 18 years old
	return age > 18 || (age === 18 && hasBirthdayOccurred);
};
