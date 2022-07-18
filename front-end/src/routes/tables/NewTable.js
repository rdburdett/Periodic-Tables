import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createTable } from "../../utils/api";
import TableForm from "./TableForm";

function NewTable() {
  const abortController = new AbortController();

  const initialFormState = {
    table_name: "Table Name",
    capacity: 1,
    status: "Free",
  };
  const [formData, setFormData] = useState({ ...initialFormState });
  const history = useHistory();

  // Submit form
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Form data: ", formData)

    async function apiCall() {
      try {
        await createTable(formData, abortController.signal);
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

  // Update 
  const handleChange = ({ target }) => {
    let value = target.value;

    // Make sure capacity cannot be set below
    if (target.name === "capacity" && target.value <= 0) {
      value = 1;
    }
    
    setFormData({
      ...formData,
      // Ensure that the value of 'capacity' remains a number when setting form data
      [target.name]: target.name === "capacity" ? Number(value) : value,
    });

    // console.log("Form Data: ", formData, typeof(formData.capacity))
  };
  
  return (
    <div className="container">
      <h2>New Table</h2>
      <h3>Create a New Table</h3>
      <div>
        <form onSubmit={handleSubmit}>
          <TableForm formData={formData} handleChange={handleChange} />
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
    </div>
  )
}

export default NewTable