/**
 * Sleeps for the specified amount of time.
 * @param {number} time is the amount to sleep in milliseconds
 * @returns a promise that will be fulfilled when the sleep is complete
 */
const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));

export default sleep;
