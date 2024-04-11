export default (date) => {

    if (!date) return null;

    // Sample date string
    var dateString = date;

    // Create a new Date object with the provided date string
    var date = new Date(dateString);

    // Extract day, month, and year
    var day = date.getUTCDate();
    var month = date.getUTCMonth() + 1; // Months are zero-indexed, so we add 1
    var year = date.getUTCFullYear();

    // Format day and month to have leading zeros if necessary
    day = (day < 10) ? '0' + day : day;
    month = (month < 10) ? '0' + month : month;

    // Formatted date string
    var formattedDate = `${day}.${month}.${year}`;

    return formattedDate
};
