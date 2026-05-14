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
import { useAppDispatch, useAppSelector } from './store/hooks'
import { logout } from './store/auth'
import { User } from './types'
import axios from 'axios'

function AppRoutes({ user, backendAvailable }: { user: User | null; backendAvailable: boolean }) {
  if (!backendAvailable) {
    return (
      <Routes>
      <Route path="*" element={<MockHomePage/>} />
      <Route path="/employee/requests" element={ <MockSpecialistPage /> } />
      <Route path="/request/:id" element={ <MockRequestDetailPage user={user} />} />
      </Routes>
    )
  }

  return (
    <Routes>
      <Route path="/" element={<HomePage user={user} />} />
      <Route
        path="/login"
        element={
          user ? <Navigate replace to={`/${user.user_type}`} /> : <LoginPage />
        }
      />
      <Route path="/employee" element={user?.user_type === 'employee' ? <EmployeePage /> : <Navigate replace to="/login" />} />
      <Route path="/employee/requests" element={user?.user_type === 'employee' ? <EmployeeRequestsPage /> : <Navigate replace to="/login" />} />
      <Route path="/request/:id" element={user ? <RequestDetailPage user={user} /> : <Navigate replace to="/login" />} />
      <Route path="/specialist" element={user?.user_type === 'specialist' ? <SpecialistPage /> : <Navigate replace to="/login" />} />
      <Route path="/specialist/register" element={user?.user_type === 'specialist' ? <RegisterPage /> : <Navigate replace to="/login" />} />
      <Route path="*" element={<Navigate replace to={user ? `/${user.user_type}` : '/login'} />} />
    </Routes>
  )
}

function AppContent() {
  const dispatch = useAppDispatch()

  const user = useAppSelector(
    (state) => state.auth.user
  )
  const [backendAvailable, setBackendAvailable] = useState(true)
  const navigate = useNavigate()

  const handleLogout = async () => {
    await dispatch(logout())
    navigate('/login', { replace: true })
  }

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
  }, [navigate]);

  return (
    <>
      <AppNavbar user={user} onLogout={handleLogout} />
      <Container className="app-shell py-4">
        <AppRoutes user={user} backendAvailable={backendAvailable} />
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
