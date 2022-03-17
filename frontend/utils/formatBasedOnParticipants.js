/**
 * Formats a string based on participants and the maxNumberOfParticipants
 * @param {[{...}]} participants
 * @param {number} maxNumberOfParticipants
 * @returns a formatted string based on participants
 */
const formatBasedOnParticipants = (participants, maxNumberOfParticipants) => {
  let formatted = "";

  if (maxNumberOfParticipants) {
    formatted += `${participants.length} / ${maxNumberOfParticipants} participants`;
  } else {
    formatted += `${participants.length}`;
    if (participants.length === 1) {
      formatted += " participant";
    } else {
      formatted += " participants";
    }
  }

  return formatted;
};

export default formatBasedOnParticipants;
