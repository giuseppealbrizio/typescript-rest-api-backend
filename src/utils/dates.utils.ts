/**
 * Generates an array of dates between the start and end dates
 * @param startDate
 * @param endDate
 * @returns
 */
const generateDateRangeArray = (startDate: Date, endDate: Date) => {
  let dates: Date[] = [];

  if (!startDate || !endDate) {
    return dates;
  }

  // to avoid modifying the original date
  const currentDate = new Date(startDate);

  while (currentDate < new Date(endDate)) {
    dates = [...dates, new Date(currentDate)];
    currentDate.setDate(currentDate.getDate() + 1);
  }
  dates = [...dates, new Date(endDate)];
  return dates;
};

/**
 * Returns the number of days in a month
 * @param month
 * @param year
 * @returns
 */
const getMonthDaysCount = (month: number, year: number): number => {
  return new Date(year, month, 0).getDate();
};

/**
 * Returns the number of days between two dates
 * @param startDateObj
 * @param endDateObj
 * @returns
 */
const getDaysCountBetweenDates = (startDateObj: Date, endDateObj: Date) => {
  const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;
  const startDate = new Date(startDateObj).setHours(0, 0, 0, 0);
  const endDate = new Date(endDateObj).setHours(0, 0, 0, 0);

  const timeDiff = Math.abs(startDate - endDate);
  const daysDiff = Math.ceil(timeDiff / MILLISECONDS_PER_DAY);

  return daysDiff;
};

/**
 * Returns the number of months between two dates
 * @param date1
 * @param date2
 * @returns
 */
const getMonthsCountBetweenDates = (startDateObj: Date, endDateObj: Date) => {
  const startDate = new Date(startDateObj);
  const endDate = new Date(endDateObj);

  const startYear = startDate.getFullYear();
  const startMonth = startDate.getMonth();

  const endYear = endDate.getFullYear();
  const endMonth = endDate.getMonth();

  const monthsDiff = (endYear - startYear) * 12 + (endMonth - startMonth);

  return Math.abs(monthsDiff);
};

/**
 * Returns the number of months between two dates
 * @param date
 * @returns
 */
const formatDateToITLocale = (date: Date) => {
  return new Intl.DateTimeFormat('it-IT', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
};

/**
 * Checks if a date is today
 * @param date
 * @returns
 */
const isDateToday = (date: Date) => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

const getFormattedDate = (date: Date, format = 'yyyy-MM-dd') => {
  if (isNaN(date.getTime())) {
    return '';
  }

  const dateFormatter = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const formattedDate = dateFormatter.format(date);

  const formattedDateParts = formattedDate.split('/');
  const year = formattedDateParts[2];
  const month = formattedDateParts[0];
  const day = formattedDateParts[1];

  return format
    .replace(/yyyy/g, year)
    .replace(/MM/g, month)
    .replace(/dd/g, day);
};

export {
  generateDateRangeArray,
  getMonthDaysCount,
  getDaysCountBetweenDates,
  getMonthsCountBetweenDates,
  formatDateToITLocale,
  isDateToday,
  getFormattedDate,
};
