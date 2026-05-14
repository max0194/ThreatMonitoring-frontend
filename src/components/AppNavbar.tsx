import { FC } from 'react'
import { Container, Nav, Navbar, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { User } from '../types'

interface Props {
  user: User | null
  onLogout: () => void
}

export const AppNavbar: FC<Props> = ({ user, onLogout }) => (
  <Navbar bg="darkgrey" variant="dark" className="navbar-border" expand="lg">
    <Container>
      <Navbar.Brand as={Link} to="/">
        Система мониторинга IT-угроз
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="main-navbar" />
      <Navbar.Collapse id="main-navbar">
        <Nav className="me-auto">
          {!user && (
            <Nav.Link as={Link} to="/login">
              Вход
            </Nav.Link>
          )}
          {user?.user_type === 'employee' && (
            <>
              <Nav.Link as={Link} to="/employee">
                Создать заявку
              </Nav.Link>
              <Nav.Link as={Link} to="/employee/requests">
                Мои заявки
              </Nav.Link>
            </>
          )}
          {user?.user_type === 'specialist' && (
            <>
              <Nav.Link as={Link} to="/specialist">
                Заявки
              </Nav.Link>
              <Nav.Link as={Link} to="/specialist/register">
                Регистрация
              </Nav.Link>
            </>
          )}
        </Nav>
        {user && (
          <div className="d-flex align-items-center gap-3">
            <span className="white-text">{user.full_name}</span>
            <Button variant="outline-light" size="sm" onClick={onLogout}>
              Выход
            </Button>
          </div>
        )}
      </Navbar.Collapse>
    </Container>
  </Navbar>
)
