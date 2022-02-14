/**
 * Capitalizes a string.
 *
 * @param {string} string is the string to capitalize.
 * @returns {string} the capitalized string.
 */
const capitalize = (string) =>
  `${string.substring(0, 1).toUpperCase()}${string.substring(1).toLowerCase()}`;

export default capitalize;
