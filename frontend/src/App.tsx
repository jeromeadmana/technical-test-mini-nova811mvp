import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import Login from "./pages/Login";
import Tickets from "./pages/Tickets";

function isTokenValid(token: string) {
  try {
    const decoded: any = jwtDecode(token);
    return decoded.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

function App() {
  const storedToken = localStorage.getItem("token");
  const [token, setToken] = useState(storedToken && isTokenValid(storedToken) ? storedToken : null);

  const handleLogin = (t: string) => {
    localStorage.setItem("token", t);
    setToken(t);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route
          path="/tickets"
          element={token ? <Tickets onLogout={handleLogout} /> : <Navigate to="/login" />}
        />
        <Route
          path="/"
          element={<Navigate to={token ? "/tickets" : "/login"} />}
        />
        <Route path="*" element={<div>Page not found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
