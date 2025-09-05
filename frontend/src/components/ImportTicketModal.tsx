import React, { useState } from "react";
import api from "../services/api";

interface Props {
  onClose: () => void;
  userId: number;
}

const ImportTicketModal: React.FC<Props> = ({ onClose, userId }) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("file", file);

      await api.post("/tickets/import", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      onClose();
    } catch (err: any) {
      setError(err.message || "Upload failed");
      console.error(err);
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
        backgroundColor: "rgba(255,255,255,0.95)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          border: "1px solid black",
          padding: 20,
          width: 400,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h3>Import Tickets</h3>
        <input
          type="file"
          accept=".json"
          onChange={handleFileChange}
          style={{ marginBottom: 10 }}
        />
        {error && <p style={{ color: "red", marginBottom: 10 }}>{error}</p>}

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button
            onClick={onClose}
            disabled={loading}
            style={{
              border: "2px solid black",
              backgroundColor: "black",
              color: "white",
              fontWeight: "bold",
              padding: "6px 12px",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={loading}
            style={{
              border: "2px solid black",
              backgroundColor: "white",
              color: "black",
              fontWeight: "bold",
              padding: "6px 12px",
            }}
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportTicketModal;
