const dateFormat = /\d\d\d\d-\d\d-\d\d/;
const timeFormat = /\d\d:\d\d/;

// const date = useQuery().get("date")

/**
 * Formats a Date object as YYYY-MM-DD.
 *
 * This function is *not* exported because the UI should generally avoid working directly with Date instance.
 * You may export this function if you need it.
 *
 * @param date
 *  an instance of a date object
 * @returns {string}
 *  the specified Date formatted as YYYY-MM-DD
 */
function asDateString(date) {
  return `${date.getFullYear().toString(10)}-${(date.getMonth() + 1)
    .toString(10)
    .padStart(2, "0")}-${date.getDate().toString(10).padStart(2, "0")}`;
}

/**
 * Formats a Date object as HH:MM.
 *
 * This function is *not* exported because the UI should generally avoid working directly with Date instance.
 * You may export this function if you need it.
 *
 * @param date
 *  an instance of a date object
 * @returns {string}
 *  the specified Date formatted as HH:MM
 */
function asTimeString(date) {
  return `${date.toTimeString().slice(0,5)}`;
}


/**
 * Format a date string in ISO-8601 format (which is what is returned from PostgreSQL) as YYYY-MM-DD.
 * @param dateString
 *  ISO-8601 date string
 * @returns {*}
 *  the specified date string formatted as YYYY-MM-DD
 */
export function formatAsDate(dateString) {
  return dateString.match(dateFormat)[0];
}

/**
 * Format a time string in HH:MM:SS format (which is what is returned from PostgreSQL) as HH:MM.
 * @param timeString
 *  HH:MM:SS time string
 * @returns {*}
 *  the specified time string formatted as YHH:MM.
 */
export function formatAsTime(timeString) {
  return timeString.match(timeFormat)[0];
}

/**
 * Today's date as YYYY-MM-DD.
 * @returns {*}
 *  the today's date formatted as YYYY-MM-DD
 */
export function today(date) {
  return asDateString(new Date());
  // return asDateString(date);

}

/**
 * Current time as HH-MM.
 * @returns {*}
 *  Today's date formatted as HH-MM
 */
 export function now(date) {
   return asTimeString(new Date());
  //  return asTimeString(date);
}

/**
 * Subtracts one day to the specified date and return it in as YYYY-MM-DD.
 * @param currentDate
 *  a date string in YYYY-MM-DD format (this is also ISO-8601 format)
 * @returns {*}
 *  the date one day prior to currentDate, formatted as YYYY-MM-DD
 */
export function previous(currentDate) {
  let [ year, month, day ] = currentDate.split("-");
  month -= 1;
  const date = new Date(year, month, day);
  date.setMonth(date.getMonth());
  date.setDate(date.getDate() - 1);
  return asDateString(date);
}

/**
 * Adds one day to the specified date and return it in as YYYY-MM-DD.
 * @param currentDate
 *  a date string in YYYY-MM-DD format (this is also ISO-8601 format)
 * @returns {*}
 *  the date one day after currentDate, formatted as YYYY-MM-DD
 */
export function next(currentDate) {
  let [ year, month, day ] = currentDate.split("-");
  month -= 1;
  const date = new Date(year, month, day);
  date.setMonth(date.getMonth());
  date.setDate(date.getDate() + 1);
  return asDateString(date);
}
