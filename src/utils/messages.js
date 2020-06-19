
const moment = require('moment');

const generateMessage = (text) => ({
  text,
  createdAt: moment(new Date().getTime()).format('H:mm'),
});


module.exports = generateMessage;