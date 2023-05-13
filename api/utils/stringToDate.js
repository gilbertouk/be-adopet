function stringToDate(params) {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  const dateString = params;

  if (regex.test(dateString)) {
    const date = new Date(dateString);

    return date;
  }

  return 'invalid date';
}

export default stringToDate;
