import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createReservation } from "../../utils/api";
import ReservationForm from "./ReservationForm";

function NewReservation() {
  const abortController = new AbortController();
  // const { Reservation, setReservation } = useState("mock Reservation")

  const initialFormState = {
    first_name: "First Name",
    last_name: "Last Name",
    mobile_number: "123-456-7890",
    reservation_date: "",
    reservation_time: "",
    people: 1,
  };
  const [formData, setFormData] = useState({ ...initialFormState });
  const history = useHistory();

  // Submit
  const handleSubmit = (event) => {
    event.preventDefault();

    console.log("Form data: ", formData)
    async function apiCall() {
      try {
        await createReservation(formData, abortController.signal);
        history.push(`/dashboard`);
      } catch (error) {
        if (error.name === "AbortError") {
          // Ignore `AbortError`
          console.log("Aborted");
        } else {
          throw error;
        }
      }
    }
    apiCall();
    return () => {
      abortController.abort();
    };
  };
  const handleChange = ({ target }) => {
    let value = target.value;
    // if (target.name === "capacity" && target.value <= 0) {
    //   value = 1;
    // }
    
    setFormData({
      ...formData,
      [target.name]: target.name === "people" ? Number(value) : value,
    });

  };
  console.log("Form Data: ", formData, typeof(formData.people))
  
  return (
    <div className="container">
      <h2>New Reservation</h2>
      <h3>Create a New Reservation</h3>
      <div>
        <form onSubmit={handleSubmit}>
          <ReservationForm formData={formData} handleChange={handleChange} />
          <button
            type="button"
            onClick={() => history.goBack()}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Save
          </button>
        </form>
      </div>
      {/* <div>{reservation}</div> */}
      {/* <button>Cancel</button><button>Create</button> */}
    </div>
  )
}

export default NewReservation