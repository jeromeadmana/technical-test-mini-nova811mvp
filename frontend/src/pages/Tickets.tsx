import { useEffect, useState } from "react";
import api from "../services/api";
import CreateTicketModal from "../components/CreateTicketModal";
import ImportTicketModal from "../components/ImportTicketModal";
import { jwtDecode } from "jwt-decode";
import "./Tickets.css"; // 👈 add new CSS

// Ticket interface
interface Ticket {
  id: number;
  title: string;
  organization: string;
  status: string;
  createdDate: string;
  expirationDate: string;
  location?: string;
  notes?: string;
}

// User info extracted from JWT
interface User {
  id: number;
  role: string;
}

interface JwtPayload {
  id: number;
  role: string;
}

const Tickets: React.FC<{ onLogout?: () => void }> = ({ onLogout }) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [showImport, setShowImport] = useState(false);

  // Extract user info from token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        setUser(decoded);
      } catch (err) {
        console.error("Invalid token", err);
      }
    }
  }, []);

  const fetchTickets = async () => {
    try {
      const res = await api.get("/tickets");
      setTickets(res.data);
    } catch (err) {
      console.error("Error fetching tickets", err);
    }
  };

  const handleRenew = async (id: number) => {
    try {
      await api.post(`/tickets/${id}/renew`);
      fetchTickets();
    } catch (err) {
      console.error("Error renewing ticket", err);
    }
  };

  const handleClose = async (id: number) => {
    try {
      await api.post(`/tickets/${id}/close`);
      fetchTickets();
    } catch (err) {
      console.error("Error closing ticket", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    if (onLogout) onLogout();
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="tickets-container">
      <h2>Tickets</h2>
      <div className="button-bar">
        <button className="btn-bar btn-primary" onClick={() => setShowCreate(true)}>
          Create Ticket
        </button>
        <button
          className="btn-bar btn-primary"
          onClick={() => setShowImport(true)}
        >
          Import Tickets
        </button>
        <button className="btn-bar btn-secondary" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <table className="tickets-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Organization</th>
            <th>Status</th>
            <th>Created</th>
            <th>Expires</th>
            <th>Location</th>
            <th>Notes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr key={ticket.id}>
              <td>{ticket.title}</td>
              <td>{ticket.organization}</td>
              <td>{ticket.status}</td>
              <td>{new Date(ticket.createdDate).toLocaleString()}</td>
              <td>{new Date(ticket.expirationDate).toLocaleString()}</td>
              <td>{ticket.location}</td>
              <td>{ticket.notes}</td>
              <td>
                {ticket.status !== "closed" && (
                    <div className="action-buttons">
                    <button
                        className="btn btn-primary"
                        onClick={() => handleRenew(ticket.id)}
                    >
                      Renew
                    </button>                    
                      <button
                        className="btn btn-secondary"
                        onClick={() => handleClose(ticket.id)}
                      >
                        Close
                      </button>                    
                    </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showCreate && (
        <CreateTicketModal
          onClose={() => {
            setShowCreate(false);
            fetchTickets();
          }}
        />
      )}

      {showImport && (
        <ImportTicketModal
          onClose={() => {
            setShowImport(false);
            fetchTickets();
          }}
          userId={user.id} // dynamically pass logged-in user id
        />
      )}
    </div>
  );
};

export default Tickets;
