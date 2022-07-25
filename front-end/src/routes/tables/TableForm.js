import React from "react";

const TableForm = ({ formData, handleChange }) => {
  return (
    <div>
      <div className="form-group">
        <label>Table Name</label>
        <input
          className="form-control bg-secondary text-light border-secondary input-custom"
          id="table_name"
          type="text"
          name="table_name"
          placeholder={`ex. "Patio Table"`}
          onChange={handleChange}
          value={formData.table_name}
          required
        />
      </div>
      <div className="form-group">
        <label>Table Capacity</label>
        <input
          className="form-control bg-secondary text-light border-secondary input-custom"
          id="capacity"
          type="number"
          name="capacity"
          onChange={handleChange}
          value={Number(formData.capacity)}
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
