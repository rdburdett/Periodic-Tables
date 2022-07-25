import React from "react";
import { Link } from "react-router-dom";

function NewCard() {
    return (
        <div className="card bg-dark border border-secondary my-3">
            {/* Card title */}
            <div className="btn-outline-secondary card-body text-secondary light">
                {/* Occupied/Free heading */}
                <Link className="btn py-4 text-secondary w-100" to="/reservations/new">
                    <h5 className="">New</h5>
                    <i className="card-img-top mr-2 oi oi-plus" />
                </Link>
            </div>
        </div>
    );
}

export default NewCard;
