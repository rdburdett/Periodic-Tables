import React from "react";
import Card from "./Card";

function TablesList({ tables = [] }) {  
  return tables.length > 0 ? (
    <div className="container">
      {tables.map((element, index) => (
        <Card key={index} tables={element} />
      ))}
    </div>
  ) : "No current tables."
}

export default TablesList