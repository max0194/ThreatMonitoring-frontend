import { Button, Card, Col, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { User } from '../types'

interface Props {
  user: User | null
}

export const HomePage = ({ user }: Props) => (
  <Card className="hero-card p-4 mb-4">
    <Row className="align-items-center">
      <Col>
        <h1 className="page-heading">Система мониторинга IT-угроз</h1>
        <p>
          Добро пожаловать в систему внутреннего мониторинга ИТ-угроз. Чтобы начать работу,
          войдите в систему с вашей корпоративной учетной записью.
        </p>
        <div className="d-flex gap-2">
          {user ? (
            <Link to={`/${user.user_type}`}>
              <Button variant="primary">
                Перейти к профилю
              </Button>
            </Link>
          ) : (
            <Link to="/login">
              <Button variant="primary">
                Войти
              </Button>
            </Link>
          )}
        </div>
      </Col>
    </Row>
  </Card>
)
