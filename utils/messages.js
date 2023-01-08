const moment = require('moment');
function formatMessage(username, msgText) {
 return {
    username,
    msgText,
    time: moment().format('h:mm a')
 }
}

module.exports = formatMessage;