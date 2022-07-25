import React from "react";

const SearchForm = ({ formData, handleChange }) => {
  return (
    <div>
      {/* Mobile Number */}
      <div className="form-group">
        <label>Mobile Number</label> <br />
        <input
          className="form-control bg-secondary text-light border-secondary input-custom"
          id="mobile_number"
          type="text"
          name="mobile_number"
          maxLength={12}
          placeholder={`ex. "123-456-7890"`}
          // pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" // do not require pattern
          onChange={handleChange}
          value={formData.mobile_number}
          // required
        />
        <small id="phoneNumberHelp" className="form-text text-muted">
          Format: 123-456-7890
        </small>
      </div>
    </div>
  );
};
export default SearchForm;
