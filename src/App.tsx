import { useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import { AppNavbar } from './components/AppNavbar'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { EmployeePage } from './pages/EmployeePage'
import { EmployeeRequestsPage } from './pages/EmployeeRequestsPage'
import { RequestDetailPage } from './pages/RequestDetailPage'
import { SpecialistPage } from './pages/SpecialistPage'
import { RegisterPage } from './pages/RegisterPage'
import { MockHomePage } from './mock/HomePage'
import { MockSpecialistPage } from './mock/SpecialistPage'
import { MockRequestDetailPage } from './mock/RequestDetailPage'
import { logoutUser, getCurrentUser } from './api/api'
import { User } from './types'
import axios from "axios"

function AppRoutes({ user, onLoginSuccess, backendAvailable }: { user: User | null; onLoginSuccess: (user: User) => void; backendAvailable: boolean }) {
  if (!backendAvailable) {
    return (
      <Routes>
        <Route path="*" element={<MockHomePage />} />
        <Route path="/specialist" element={ <MockSpecialistPage /> } />
        <Route path="/request/:id" element={ <MockRequestDetailPage/>} />
      </Routes>
    )
  }

  return (
    <Routes>
      <Route path="/" element={<HomePage user={user} />} />
      <Route path="/login" element={ user ? <Navigate replace to={`/${user.user_type}`} /> : <LoginPage onLoginSuccess={onLoginSuccess} /> } />
      <Route path="/employee/create" element={user?.user_type === 'employee' ? <EmployeePage /> : <Navigate replace to="/login" />} />
      <Route path="/employee" element={user?.user_type === 'employee' ? <EmployeeRequestsPage /> : <Navigate replace to="/login" />} />
      <Route path="/request/:id" element={user ? <RequestDetailPage user={user} /> : <Navigate replace to="/login" />} />
      <Route path="/specialist" element={user?.user_type === 'specialist' ? <SpecialistPage /> : <Navigate replace to="/login" />} />
      <Route path="/specialist/register" element={user?.user_type === 'specialist' ? <RegisterPage /> : <Navigate replace to="/login" />} />
      <Route path="*" element={<Navigate replace to={user ? `/${user.user_type}` : '/login'} />} />
    </Routes>
  )
}

const saveUserToStorage = (user: User) => {
  localStorage.setItem('app_user', JSON.stringify(user));
};

const getUserFromStorage = (): User | null => {
  const userJson = localStorage.getItem('app_user');
  if (!userJson) return null;
  try {
    return JSON.parse(userJson);
  } catch {
    return null;
  }
};

const clearUserFromStorage = () => {
  localStorage.removeItem('app_user');
};


function AppContent() {
  const [user, setUser] = useState<User | null>(getUserFromStorage());
  const [backendAvailable, setBackendAvailable] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      const storedUser = getUserFromStorage();
      if (storedUser) {
        try {
          const currentUser = await getCurrentUser();
          setUser(currentUser);
        } catch (error) {
          setUser(null);
          clearUserFromStorage();
        }
      }
    };
    loadUser();
  }, []);

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await axios.get('http://localhost:8080', {
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (response.status >= 200 && response.status < 300) {
          setBackendAvailable(true);
        } else {
          setBackendAvailable(false);
        }
      } catch (error) {
        console.error('Backend check failed:', error);
        setBackendAvailable(false);
      }
    };

    checkBackend();
  }, []);

  useEffect(() => {
    if (user) {
      saveUserToStorage(user);
    } else {
      clearUserFromStorage();
    }
  }, [user]);
  
  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
    clearUserFromStorage();
    navigate('/login', { replace: true });
  };

  const handleLoginSuccess = (user: User) => {
    setUser(user);
    saveUserToStorage(user);
  };

  return (
    <>
      <AppNavbar user={user} onLogout={handleLogout}/>
      <Container className="app-shell py-4">
        <AppRoutes user={user} onLoginSuccess={handleLoginSuccess} backendAvailable={backendAvailable} />
      </Container>
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App
