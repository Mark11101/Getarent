export default (obj) => {
    // Check if the parameter is an object and not null
    if (typeof obj === 'object' && obj !== null) {
        // Check if the object has any own properties
        return Object.keys(obj).length > 0;
    } else {
        // If the parameter is not an object or is null, return false
        return false;
    }
};
