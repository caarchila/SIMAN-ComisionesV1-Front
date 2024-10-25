// Helper function to format the date
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}/${month}/${day} ${hours}:${minutes}`;
};

// Helper function to know if two dates are in the same month
export function areDatesInSameMonth(date1, date2) {
  // Split the date strings to extract year and month
  const [year1, month1] = date1.split('-');
  const [year2, month2] = date2.split('-');

  // Compare year and month
  return year1 === year2 && month1 === month2;
}

// Example usage:
const date1 = '2024-09-01'; // September 1, 2024
const date2 = '2024-09-16'; // September 16, 2024

if (areDatesInSameMonth(date1, date2)) {
  console.log('Dates are in the same month.');
} else {
  console.log('Dates are NOT in the same month.');
}
