import { useHistory } from "react-router-dom";
import * as api from "../../utils/api";

function FinishTable({ table_id, reservation_id }) {
  const history = useHistory();

  async function finishClickHandler(e) {
    e.preventDefault();
    const abortController = new AbortController();

    // Confirmation dialogue
    const cancelFinish = window.confirm(
      "\nIs this table ready to seat new guests? This cannot be undone."
    );

    // Returns to dashboard if 'cancel' is clicked
    if (!cancelFinish) return history.push("/dashboard");

    // Unseats a reservation from a table
    try {
      await api.unseatTable(table_id, abortController.signal);
      await api.updateReservationStatus({
        reservation_id: reservation_id,
        status: "finished"
      }, abortController.signal)
    } catch (error) {
      console.log(error.message);
    }

    history.push("/")
    // window.location.reload();
    
    return () => abortController.abort();
  }

  return (
    <button
      type="button"
      className="btn btn-secondary"
      data-table-id-finish={table_id}
      onClick={(e) => finishClickHandler(e)}
    >
      Finish
    </button>
  );
}

export default FinishTable