import React from "react";

const TableForm = ({ formData, handleChange }) => {
  return (
    <div>
        <div className="form-group">
          <label>Table Name</label>
          <input
            className="form-control"
            id="table_name"
            type="text"
            name="table_name"
            placeholder={`ex. "Patio Table"`}
            onChange={handleChange}
            value={formData.table_name}
            style={{ width: "50%" }}
            required
          />
        </div>
        <div className="form-group">
          <label>Table Capacity</label>
          <input
            className="form-control"
            id="capacity"
            type="number"
            name="capacity"
            onChange={handleChange}
            value={Number(formData.capacity)}
            style={{ width: "50%" }}
            required
          />
          <small id="capacityHelp" className="form-text text-muted">
            Capacity must be at least 1.
          </small>
        </div>
    </div>
  );
};
export default TableForm;
