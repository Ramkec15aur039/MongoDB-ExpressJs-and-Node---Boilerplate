const logger = require('../config/logger');

const decodeBase64Image = async (dataString) => {
  try {
    console.log(dataString, 'from api');
    const matches = await dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    const response = {};
    console.log(matches, 'mathches');
    if (matches.length !== 3) {
      return new Error('Invalid input string');
    }

    response.type = matches[1];
    response.data = matches[2];

    return response;
  } catch (e) {
    logger.error(e);
  }
};

module.exports = decodeBase64Image;
