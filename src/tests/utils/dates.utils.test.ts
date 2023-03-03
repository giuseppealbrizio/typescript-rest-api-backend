import {
  formatDateToITLocale,
  generateDateRangeArray,
  getDaysCountBetweenDates,
  getFormattedDate,
  getMonthDaysCount,
  getMonthsCountBetweenDates,
  isDateToday,
} from '../../utils/dates.utils';

describe('Date Utilities Tests Suite', () => {
  describe('generateDateRangeArray', () => {
    it('should return an empty array when no start or end date is provided', () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const result = generateDateRangeArray(null, null);
      expect(result).toEqual([]);
    });

    it('should generate an array of dates between the start and end dates', () => {
      const startDate = new Date('2023-02-01');
      const endDate = new Date('2023-02-05');
      const result = generateDateRangeArray(startDate, endDate);
      expect(result.length).toEqual(5);
    });
  });

  describe('getMonthDaysCount', () => {
    it('should return the correct number of days in the specified month', () => {
      const result = getMonthDaysCount(2, 2023);
      expect(result).toEqual(28);
    });
  });

  describe('getDaysCountBetweenDates', () => {
    it('should return the correct number of days between two dates', () => {
      const startDate = new Date('2023-02-01');
      const endDate = new Date('2023-02-05');
      const result = getDaysCountBetweenDates(startDate, endDate);
      expect(result).toEqual(4);
    });
  });

  describe('getMonthsCountBetweenDates', () => {
    it('should return the correct number of months between two dates', () => {
      const startDate = new Date('2022-12-01');
      const endDate = new Date('2023-02-01');
      const result = getMonthsCountBetweenDates(startDate, endDate);
      expect(result).toEqual(2);
    });
  });

  describe('formatDateToITLocale', () => {
    it('should return a formatted date in Italian locale', () => {
      const date = new Date('2023-02-20');
      const result = formatDateToITLocale(date);
      expect(result).toEqual('20/02/2023');
    });
  });

  describe('isDateToday', () => {
    it('should return true when the date is today', () => {
      const date = new Date();
      const result = isDateToday(date);
      expect(result).toEqual(true);
    });

    it('should return false when the date is not today', () => {
      const today = new Date();
      const nonTodayDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - 1
      );
      const result = isDateToday(nonTodayDate);
      expect(result).toEqual(false);
    });
  });

  describe('getFormattedDate', () => {
    it('should return an empty string if the input date is not valid', () => {
      const invalidDate = new Date('invalid');
      const result = getFormattedDate(invalidDate);
      expect(result).toEqual('');
    });

    it('should return a formatted date in the specified format', () => {
      const date = new Date('2023-02-20');
      const result = getFormattedDate(date, 'dd/MM/yyyy');
      expect(result).toEqual('20/02/2023');
    });

    it('should return a formatted date in the default format if no format is specified', () => {
      const date = new Date('2023-02-20');
      const result = getFormattedDate(date);
      expect(result).toEqual('2023-02-20');
    });
  });
});
