import { DateTime } from "luxon";

function validateEmail(email: string) {
  const atPos = email.indexOf("@");
  const dotPos = email.lastIndexOf(".");
  return (
    email.length > 0 &&
    atPos > 0 &&
    dotPos > atPos + 1 &&
    dotPos < email.length - 1
  );
}

function validatePassword(password: string) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(password);
}

function validateDates(startDate: string, endDate: string) {
  if (startDate.length <= 0 && endDate.length <= 0) return false;

  const start = DateTime.fromISO(startDate);
  const end = DateTime.fromISO(endDate);

  const startMonth = start.toFormat("MMMM");
  const startYear = start.toFormat("yyyy");

  const endMonth = end.toFormat("MMMM");
  const endYear = end.toFormat("yyyy");

  if (startYear !== endYear) {
    return false
  } else {
    if (startMonth === endMonth && start.day === end.day) {
      return `${start.day}-${startMonth.slice(0, 3)}-${startYear}`;
    } else if (startMonth === endMonth) {
      return `${endMonth} ${start.day}-${end.day}, ${startYear}`;
    } else {
      return `${startMonth}-${endMonth}, ${startYear}`;
    }
  }
}

export { validateEmail, validatePassword, validateDates };
