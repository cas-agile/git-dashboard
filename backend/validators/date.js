function validateDate(date) {
    return String(date).match(/(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/);
}


module.exports = {
    validateDate
}