import { Navigate, Route, Routes } from 'react-router-dom'
import { LoginPage } from '../pages/LoginPage'
import { EmployeePage } from '../pages/EmployeePage'
import { EmployeeRequestsPage } from '../pages/EmployeeRequestsPage'
import { RequestDetailPage } from '../pages/RequestDetailPage'
import { SpecialistPage } from '../pages/SpecialistPage'
import { RegisterPage } from '../pages/RegisterPage'
import { User } from '../types'

export function AppRoutes({ user, backendAvailable }: { user: User | null; backendAvailable: boolean }) {
  if (!backendAvailable) {
    return (
      <Routes>
        <Route path="*"element={ <SpecialistPage /> } />
        <Route path="/specialist" element={ <SpecialistPage /> } />
        <Route path="/request/:id" element={ <RequestDetailPage user={user}/>} />
      </Routes>
    )
  }

  return (
    <Routes>
      <Route path="/login" element={ user ? <Navigate replace to={`/${user.user_type}`} /> : <LoginPage /> } />
      <Route path="/employee/create" element={user?.user_type === 'employee' ? <EmployeePage /> : <Navigate replace to="/login" />} />
      <Route path="/employee" element={user?.user_type === 'employee' ? <EmployeeRequestsPage /> : <Navigate replace to="/login" />} />
      <Route path="/request/:id" element={user ? <RequestDetailPage user={user} /> : <Navigate replace to="/login" />} />
      <Route path="/specialist" element={user?.user_type === 'specialist' ? <SpecialistPage /> : <Navigate replace to="/login" />} />
      <Route path="/specialist/register" element={user?.user_type === 'specialist' ? <RegisterPage /> : <Navigate replace to="/login" />} />
      <Route path="*" element={<Navigate replace to={user ? `/${user.user_type}` : '/login'} />} />
    </Routes>
  )
}
