// Helper function to format the date
export const formatDateHours = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}/${month}/${day} ${hours}:${minutes}`;
};

export const formatDateNoHours = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}/${month}/${day}`;
};

export function parseDateTimeLocal(dateTimeString) {
  // Split the string into date and time parts
  const [datePart, timePart] = dateTimeString.split("T");

  // Split date and time into individual components
  const [year, month, day] = datePart.split("-");
  const [hours, minutes] = timePart.split(":");

  // Create a new Date object with the parsed values
  const parsedDate = new Date(
    year,
    month - 1, // Months are zero-indexed in JavaScript Date
    day,
    hours,
    minutes
  );

  return parsedDate;
}

// Helper function to know if two dates are in the same month
export function areDatesInSameMonth(date1, date2) {
  // Split the date strings to extract year and month
  const [year1, month1] = date1.split('-');
  const [year2, month2] = date2.split('-');

  // Compare year and month
  return year1 === year2 && month1 === month2;
}

// Helper function to check if a date is in the future
export function isValidFutureDate(selectedDateTime) {
  // Convert the selectedDateTime (string) into a Date object
  const selectedDate = new Date(selectedDateTime);

  // Get the current date and time
  const now = new Date();

  // Check if the selected date is in the future
  return selectedDate > now;
}
