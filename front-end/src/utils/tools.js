import { formatAsTime, formatAsDate } from "./date-time";

export function generateAvatar({reservation_id, last_name}) {
    return `https://avatars.dicebear.com/api/personas/reservation${
        reservation_id * 135735 + last_name
    }.svg`;
}

export function groomPhone(phone) {
    const areaCode = phone.slice(0, 3);
    const localNumber = phone.slice(4);
    return `(${areaCode})${localNumber}`;
}

export function groomStatus(status) {
    return status && `${status.slice(0, 1).toUpperCase()}${status.slice(1)}`;
}

function formatTime(reservation) {
    reservation.reservation_time = formatAsTime(reservation.reservation_time);
    return reservation;
}

export function formatReservationTime(reservations) {
    return Array.isArray(reservations)
        ? reservations.map(formatTime)
        : formatTime(reservations);
}

function formatDate(reservation) {
    reservation.reservation_date = formatAsDate(reservation.reservation_date);
    return reservation;
}

export function formatReservationDate(reservations) {
    return Array.isArray(reservations)
        ? reservations.map(formatDate)
        : formatDate(reservations);
}

export function isNumericInput (event) {
    const key = event.keyCode;
    console.log("key", key);
    return (
        (key >= 48 && key <= 57) || // Allow number line
        (key >= 96 && key <= 105) // Allow number pad
    );
};

export function isModifierKey(event) {
    const key = event.keyCode;
    return (
        event.shiftKey === true ||
        key === 35 ||
        key === 36 || // Allow Shift, Home, End
        key === 8 ||
        key === 9 ||
        key === 13 ||
        key === 46 || // Allow Backspace, Tab, Enter, Delete
        (key > 36 && key < 41) || // Allow left, up, right, down
        // Allow Ctrl/Command + A,C,V,X,Z
        ((event.ctrlKey === true || event.metaKey === true) &&
            (key === 65 ||
                key === 67 ||
                key === 86 ||
                key === 88 ||
                key === 90))
    );
};

export function enforceFormat (event) {
    // Input must be of a valid number format or a modifier key, and not longer than ten digits
    if (!isNumericInput(event) && !isModifierKey(event)) {
        event.preventDefault();
    }
};

export function formatToPhone (event) {
    if (isModifierKey(event)) {
        return;
    }

    const input = event.target.value.replace(/\D/g, "").substring(0, 10); // First ten digits of input only
    const areaCode = input.substring(0, 3);
    const middle = input.substring(3, 6);
    const last = input.substring(6, 10);

    if (input.length > 6) {
        event.target.value = `${areaCode}-${middle}-${last}`;
    } else if (input.length > 3) {
        event.target.value = `${areaCode}-${middle}`;
    } else if (input.length > 0) {
        event.target.value = `${areaCode}`;
    }
};
