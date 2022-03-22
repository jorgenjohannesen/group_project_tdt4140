const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
const parseDate = (input) => {
    const parsed = new Date(input);
    const date = parsed.getDate();
    const month = months[parsed.getMonth()];
    const year = parsed.getFullYear();

    return `${months.at(month - 1)} ${date}, ${year}`;
};

export default parseDate;