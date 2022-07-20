/**
 * Defines the base URL for the API.
 * The default values is overridden by the `API_BASE_URL` environment variable.
 */
import formatReservationDate from "./format-reservation-date";
import formatReservationTime from "./format-reservation-date";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5001";

/**
 * Defines the default headers for these functions to work with `json-server`
 */
const headers = new Headers();
headers.append("Content-Type", "application/json");

/**
 * Fetch `json` from the specified URL and handle error status codes and ignore `AbortError`s
 *
 * This function is NOT exported because it is not needed outside of this file.
 *
 * @param url
 *  the url for the requst.
 * @param options
 *  any options for fetch
 * @param onCancel
 *  value to return if fetch call is aborted. Default value is undefined.
 * @returns {Promise<Error|any>}
 *  a promise that resolves to the `json` data or an error.
 *  If the response is not in the 200 - 399 range the promise is rejected.
 */

async function fetchJson(url, options, onCancel) {
  try {
    const response = await fetch(url, options);

    if (response.status === 204) {
      return null;
    }

    const payload = await response.json();

    if (payload.error) {
      return Promise.reject({ message: payload.error });
    }
    return payload.data;
  } catch (error) {
    if (error.name !== "AbortError") {
      console.error(error.stack);
      throw error;
    }
    return Promise.resolve(onCancel);
  }
}

///////// RESERVATIONS /////////

// GET /reservations
/**
 * Retrieves all existing reservations.
 * @returns {Promise<[reservation]>}
 *  a promise that resolves to a possibly empty array of reservation saved in the database.
 */
export async function listReservations(params, signal) {
  const url = new URL(`${API_BASE_URL}/reservations`);
  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.append(key, value.toString())
  );
  return await fetchJson(url, { headers, signal }, [])
    .then(formatReservationDate)
    .then(formatReservationTime);
}

// Search by 'mobile_number'
/**
 * @param mobile_number
 * the mobile number used to search for and return matching reservations
 * @param signal
 *  optional AbortController.signal
 * @returns {Promise<[reservation]>}
 *  a promise that resolves to a possibly empty array of reservation saved in the database.
 */
export async function searchByMobileNumber(mobile_number, signal) {
  const url = `${API_BASE_URL}/reservations?mobile_number=${mobile_number}`;
  return await fetchJson(url, { signal })
    .then(formatReservationDate)
    .then(formatReservationTime);
}

/**
 * Retrieves all reservations of a certain date.
 * @param reservation_date
 * A date in YYYY-MM-DD format
 * @param signal
 * An optional abort signal
 * @returns {Promise<[reservation]>}
 *  a promise that resolves to a possibly empty array of reservation saved in the database.
 */

 export async function readByDate(date, signal) {
  const url = `${API_BASE_URL}/reservations?date=${date}`;
  return await fetchJson(url, { signal })
    .then(formatReservationDate)
    .then(formatReservationTime);
}

// POST /reservations
/**
 * Saves reservation to the database.
 * @param reservation
 *  the reservation to save, which must not have an `reservation_id` property
 *  must have first_name, last_name", mobile_number, reservation_date, reservation_time and people properties
 * @param signal
 *  optional AbortController.signal
 * @returns {Promise<reservation>}
 *  a promise that resolves the saved reservation, which will now have a `reservation_id` and `status` property. `status` will have a default value "booked".
 */
 export async function createReservation(reservation, signal) {
  const url = `${API_BASE_URL}/reservations`;
  const options = {
    method: "POST",
    headers,
    body: JSON.stringify({ data: reservation }),
    signal,
  };
  return await fetchJson(url, options, {});
}

// GET /reservations/:reservationId
/**
 * Retrieves the reservation with the specified `reservation_id`
 * @param reservation_id
 *  the `reservation_id` property matching the desired reservation.
 * @param signal
 *  optional AbortController.signal
 * @returns {Promise<Error|*>}
 *  a promise that resolves to a possible error, if the reservation does not exists.
 */
 export async function readReservation(reservation_id, signal) {
  const url = `${API_BASE_URL}/reservations/${reservation_id}`;
  return await fetchJson(url, { signal }, {});
}

// PUT /reservations/:reservationId
/**
 * Updates an existing reservation
 * @param updatedReservation
 *  the reservation to save, which must have a `reservation_id` property.
 * @param signal
 *  optional AbortController.signal
 * @returns {Promise<Error|*>}
 *  a promise that resolves to the updated reservation.
 */
export async function updateReservation(updatedReservation, signal) {
  const url = `${API_BASE_URL}/reservations/${updatedReservation.reservation_id}`;
  const options = {
    method: "PUT",
    headers,
    body: JSON.stringify({ data: updatedReservation }),
    signal,
  };
  return await fetchJson(url, options, updatedReservation);
}

// DELETE /reservations/:reservationId
/**
 * Deletes an existing reservation
 * @param reservationId
 *  the reservation to delete
 * @param signal
 *  optional AbortController.signal
 * @returns {Promise<Error|*>}
 *  a promise that resolves to the deleted status of a reservation.
 */
// DELETE /reservations/:reservationId
export async function deleteReservation(reservationId, signal) {
  const url = `${API_BASE_URL}/reservations/${reservationId}`;
  const options = {
    method: "DELETE",
    headers,
    signal
  }
  return await fetchJson(url, options);
}

// PUT /reservations/:reservationId/status
/**
 * Updates the status of an existing reservation
 * @param updatedReservation
 *  the reservation to save, which must have a `status` property.
 * @param signal
 *  optional AbortController.signal
 * @returns {Promise<Error|*>}
 *  a promise that resolves to the updated status of a reservation.
 */
export async function updateReservationStatus(updatedReservation, signal) {
  const url = `${API_BASE_URL}/reservations/${updatedReservation.reservation_id}/status`;
  const options = {
    method: "PUT",
    headers,
    body: JSON.stringify({ data: updatedReservation }),
    signal,
  };
  return await fetchJson(url, options, updatedReservation);
}

///////// TABLES /////////

// List all tables
// GET /tables
/**
 * List all tables.
 * @param signal
 * An optional abort signal
 * @returns {Promise<[tables]>}
 *  a promise that resolves to a possibly empty array of all tables from the database
 */
export async function listTables(signal) {
  const url = new URL(`${API_BASE_URL}/tables/`);
  return await fetchJson(url, { headers, signal }, []);
}

// PUT /tables
/**
 * Add a new table to the database.
 * @param newTable
 * An object containing the data of the new table
 * @param signal
 * An optional abort signal
 * @returns {Promise<[tables]>}
 *  a promise that resolves to a possibly empty array of all tables from the database
 */

 export async function createTable(newTable, signal) {
  const url = `${API_BASE_URL}/tables/`;
  const options = {
    method: "POST",
    headers,
    body: JSON.stringify({ data: newTable }),
    signal,
  };
  console.log("post attempt:", url, options);
  return await fetchJson(url, options);
 }

// Seat a reservation and assign it to a table
// PUT `/tables/:tableId/seat`
/**
 *
 * @param table_id
 * the id of the table
 * @param reservation_id
 * the id of the reservation to be updated
 * @param signal
 * AbortController.signal
 * @returns {Promise<[table]>}
 *  a promise that resolves to a possibly empty array of tables saved in the database
 */
export async function seatTable(table_id, reservation_id, signal) {
  const url = `${API_BASE_URL}/tables/${table_id}/seat`;
  const options = {
    method: "PUT",
    headers,
    body: JSON.stringify({ data: { reservation_id } }),
    signal,
  };
  return await fetchJson(url, options);
}

// Unseat a reservation from a table
// DELETE `/tables/:tableId/seat`
/**
 * Deletes the `reservation_id` of the specified `table_id`.
 * @param table_id
 *  the id of the table to update
 * @param signal
 *  optional AbortController.signal
 * @returns {Promise<Error|*>}
 *  a promise that resolves to an object with a 'null' `reservation_id`.
 */
export async function unseatTable(table_id, signal) {
  const url = `${API_BASE_URL}/tables/${table_id}/seat`;
  const options = { method: "DELETE", signal };
  return await fetchJson(url, options);
}


