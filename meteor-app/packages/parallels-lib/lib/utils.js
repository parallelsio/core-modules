/**
 * The global namespace for Parallels utils.
 * @namespace Parallels.utils
 */
Parallels.utils = {};

/**
 * Convert a string to a Boolean
 * @param {String} string
 */
Parallels.utils.stringToBoolean = function (string) {
  if (typeof string === 'string') {
    var s = string.trim().toLowerCase();
    return s === 'true' || s === 'yes' || s === 'on' || s === '1';
  } else
    return string === true || string === 1;
};
