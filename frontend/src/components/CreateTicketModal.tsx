import { useState } from "react";
import api from "../services/api";

interface Props {
  onClose: () => void;
}

const CreateTicketModal: React.FC<Props> = ({ onClose }) => {
  const [title, setTitle] = useState("");
  const [organization, setOrganization] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [createdDate, setCreatedDate] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.post("/tickets", {
        title,
        organization,
        location,
        notes,
        createdDate,
        expirationDate,
      });
      onClose();
    } catch (err: any) {
      console.error("Error creating ticket:", err);
      setError(err?.response?.data?.error || "Failed to create ticket");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "white",
        color: "black",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          border: "1px solid black",
          padding: 20,
          display: "flex",
          flexDirection: "column",
          width: 400,
        }}
      >
        <h3>Create Ticket</h3>
        {error && <div style={{ color: "red", marginBottom: 10 }}>{error}</div>}

        <label>Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ border: "1px solid black", marginBottom: 10 }}
          required
        />

        <label>Organization</label>
        <input
          type="text"
          value={organization}
          onChange={(e) => setOrganization(e.target.value)}
          style={{ border: "1px solid black", marginBottom: 10 }}
          required
        />

        <label>Location</label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          style={{ border: "1px solid black", marginBottom: 10 }}
        />

        <label>Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          style={{ border: "1px solid black", marginBottom: 10 }}
        />

        <label>Created Date</label>
        <input
          type="date"
          value={createdDate}
          onChange={(e) => setCreatedDate(e.target.value)}
          style={{ border: "1px solid black", marginBottom: 10 }}
          required
        />

        <label>Expiration Date</label>
        <input
          type="date"
          value={expirationDate}
          onChange={(e) => setExpirationDate(e.target.value)}
          style={{ border: "1px solid black", marginBottom: 10 }}
          required
        />

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              border: "2px solid black",
              backgroundColor: "black",
              color: "white",
              fontWeight: "bold",
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            style={{
              border: "2px solid black",
              backgroundColor: "white",
              color: "black",
              fontWeight: "bold",
            }}
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTicketModal;
