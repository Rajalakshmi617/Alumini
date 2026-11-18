import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";

import Register from "./pages/Register";
import Directory from "./pages/Directory";
import Dashboard from "./pages/Dashboard";
import Calls from "./pages/Calls";
import Call from "./pages/Call";

function Protected({ children }) {
  return localStorage.getItem("token") ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <Protected>
              <Directory />
            </Protected>
          }
        />
        <Route
          path="/dashboard"
          element={
            <Protected>
              <Dashboard />
            </Protected>
          }
        />
        <Route
          path="/calls"
          element={
            <Protected>
              <Calls />
            </Protected>
          }
        />
        <Route
          path="/call/:room"
          element={
            <Protected>
              <Call />
            </Protected>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
