/**
 * Create an object composed of the picked object properties
 * @param {Object} object
 * @param {string[]} keys
 * @returns {Object}
 */
const pick = (object, keys) => keys.reduce(
  (obj, key) => {
    if (object && object.hasOwnProperty(key)) {
      // eslint-disable-next-line no-param-reassign
      obj[key] = object[key];
    }
    return obj;
  },
  { isDeleted: false },
);

module.exports = pick;
