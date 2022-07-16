import { useHistory } from "react-router-dom";
import { unseatTable } from "../../utils/api";

function FinishTable({ table_id }) {
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
      await unseatTable(table_id, abortController.signal);
    } catch (error) {
      console.log(error.message);
    }

    window.location.reload();
    
    return () => abortController.abort();
  }

  return (
    <button
      type="button"
      className="btn btn-dark"
      data-table-id-finish={table_id}
      onClick={(e) => finishClickHandler(e)}
    >
      Finish
    </button>
  );
}

export default FinishTable