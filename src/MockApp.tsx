import { useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes} from 'react-router-dom'
import { Container } from 'react-bootstrap'
import { AppNavbar } from './components/AppNavbar'
import { HomePage } from './mock/HomePage'
import { SpecialistPage } from './mock/SpecialistPage'
import { RequestDetailPage } from './mock/RequestDetailPage'
import { User } from './types'

const user: User = {
  id: 1,
  email: "test@company.com",
  full_name: "Тест",
  user_type: "specialist"
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage user={user} />} />
      <Route path="/employee/requests" element={ <SpecialistPage /> } />
      <Route path="/request/:id" element={ <RequestDetailPage user={user} />} />
    </Routes>
  )
}

function AppContent() {
  const [user] = useState<User | null>(null)

  const handleLogout = async () => {
  }

  return (
    <>
      <AppNavbar user={user} onLogout={handleLogout}/>
      <Container className="app-shell py-4">
        <AppRoutes/>
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
