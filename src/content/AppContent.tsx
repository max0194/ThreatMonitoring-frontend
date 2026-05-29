import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { AppNavbar } from "../components/AppNavbar";
import { AppRoutes } from "../routes/AppRoutes";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { logout } from "../store/auth";
import { API_URL } from "../config";
import axios from "axios";

export function AppContent() {
  const dispatch = useAppDispatch();

  const user = useAppSelector((state) => state.auth.user);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logout());
    navigate("/login", { replace: true });
  };

  const [backendAvailable, setBackendAvailable] = useState(true);
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await axios.get(`${API_URL}/health`, {
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (response.status >= 200 && response.status < 300) {
          setBackendAvailable(true);
        } else {
          setBackendAvailable(false);
        }
      } catch (error) {
        console.error("Ошибка проверки запуска сервиса:", error);
        setBackendAvailable(false);
      }
    };

    checkBackend();
  }, [navigate]);

  return (
    <>
      <AppNavbar user={user} onLogout={handleLogout} />
      <Container className="app-shell py-4">
        <AppRoutes user={user} backendAvailable={backendAvailable} />
      </Container>
    </>
  );
}
