import React from "react";

function Card({ table }) {
  return (
    <div className="container">
      <h2>Table Card</h2>
      <h3>{table.name}, {table.table_id}</h3>
      <div>{table.capacity}</div>
    </div>
  )
}

export default Card