import React, { useState } from "react";

function NewTable() {
  const { table, setTable } = useState("mock table")

  return (
    <div className="container">
      <h2>New Table</h2>
      <h3>Create a New Table</h3>
      <div>Form here</div>
      <div>{table}</div>
      <button>Cancel</button><button>Create</button>
    </div>
  )
}

export default NewTable