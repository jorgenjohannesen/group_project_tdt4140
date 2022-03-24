const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/**
 * Parses an ISO string to a string on the format YYYY-MM-DD.
 * @param {string} input is the input as an ISO string to parse as a date
 * @returns a formatted string on the format YYYY-MM-DD
 */
const parseDate = (input) => {
  const parsed = new Date(input);
  const date = parsed.getDate();
  const month = months[parsed.getMonth()];
  const year = parsed.getFullYear();

  return `${months.at(month - 1)} ${date}, ${year}`;
};

export default parseDate;
