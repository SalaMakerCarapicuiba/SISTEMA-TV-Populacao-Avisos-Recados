export const formatDateFromAPI = (dateString: string): Date => {
  const date = new Date(dateString);
  date.setUTCDate(date.getUTCDate() + 1);
  date.setUTCHours(0, 0, 0, 0);
  return date;
};
