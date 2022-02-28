const DaysBetweenDates = (date1, date2) => {
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.round((date2.getTime() - date1.getTime()) / (oneDay));
};
const DatesBetweenTwoDates = (startDate, endDate) => {
  const dates = [];
  const currentDate = new Date(startDate);
  while (currentDate <= new Date(endDate)) {
    dates.push(new Date(currentDate).toLocaleDateString('en-ZA', { year: 'numeric', month: 'numeric', day: 'numeric' }));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
};

module.exports = {
  DaysBetweenDates,
  DatesBetweenTwoDates,
};
