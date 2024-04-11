export default (inputString) => {
    
    // Check if the input string already has dots

    if (!/\./.test(inputString)) {
        // If it doesn't have dots, add them in the appropriate positions
        const day = inputString.substr(0, 2);
        const month = inputString.substr(2, 2);
        const year = inputString.substr(4, 4);

        return `${day}.${month}.${year}`;
    } else {
        // If it already has dots, return the string as it is
        return inputString;
    }
};
