import { useEffect, useState } from "react";
import axios from "axios";
import Home from "./pages/Home";
import Login from "./pages/Login";

const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const payloadBase64 = token.split('.')[1];
    const base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
    const decodedPayload = JSON.parse(atob(base64));
    return Date.now() >= decodedPayload.exp * 1000;
  } catch (error) {
    return true;
  }
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const access = localStorage.getItem("access");
      const refresh = localStorage.getItem("refresh");

      if (access && refresh) {
        if (isTokenExpired(refresh)) {
          // Both access and refresh tokens are expired/invalid
          localStorage.removeItem("access");
          localStorage.removeItem("refresh");
          setIsAuthenticated(false);
          setCheckingAuth(false);
        } else if (isTokenExpired(access)) {
          // Access token is expired, but refresh token is still valid -> attempt auto-refresh
          try {
            const response = await axios.post("http://127.0.0.1:8000/api/token/refresh/", {
              refresh: refresh,
            });
            localStorage.setItem("access", response.data.access);
            setIsAuthenticated(true);
          } catch (error) {
            // Refresh failed (e.g., backend is stopped or refresh token is blacklisted)
            console.error("Auto-refresh on startup failed:", error);
            localStorage.removeItem("access");
            localStorage.removeItem("refresh");
            setIsAuthenticated(false);
          }
          setCheckingAuth(false);
        } else {
          // Access token is still valid
          setIsAuthenticated(true);
          setCheckingAuth(false);
        }
      } else {
        setIsAuthenticated(false);
        setCheckingAuth(false);
      }
    };

    checkAuth();
  }, []);

  if (checkingAuth) {
    return (
      <div style={{ 
        color: "var(--text-secondary, #94a3b8)", 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "100vh",
        backgroundColor: "var(--bg-app, #0c0e17)"
      }}>
        Đang xác thực phiên làm việc...
      </div>
    );
  }

  return isAuthenticated ? <Home /> : <Login />;
}

export default App;