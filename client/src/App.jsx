import { useState } from "react";
import "./App.css";
const apiUrl = import.meta.env.VITE_API_URL;

function App() {
  const [rollNo, setRollNo] = useState("");
  const [bookId, setBookId] = useState("");
  const [action, setAction] = useState("checkin");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");

    try {
      // same as before but update request body key names
      const res = await fetch(`${apiUrl}/api/library`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patron_id: rollNo,
          barcode: bookId,
          action,
        }),
      });

      const data = await res.json();
      setStatus(data.message || "Success");
    } catch (err) {
      setStatus("Error sending request.");
    }
  };

  return (
    <div className="container">
      <h1>Library Check-In/Out</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Roll Number"
          value={rollNo}
          onChange={(e) => setRollNo(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Book ID"
          value={bookId}
          onChange={(e) => setBookId(e.target.value)}
          required
        />
        <div className="action-options">
          <label>
            <input
              type="radio"
              value="checkin"
              checked={action === "checkin"}
              onChange={() => setAction("checkin")}
            />
            Check-In
          </label>
          <label>
            <input
              type="radio"
              value="checkout"
              checked={action === "checkout"}
              onChange={() => setAction("checkout")}
            />
            Check-Out
          </label>
        </div>
        <button type="submit">Submit</button>
      </form>
      <p className="status">{status}</p>
    </div>
  );
}

export default App;
