import { Button, Card, Col, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'

export const MockHomePage = () => (
  <Card className="hero-card p-4 mb-4">
    <Row className="align-items-center">
      <Col>
        <h1 className="page-heading">Система мониторинга IT-угроз</h1>
        <p>
          Добро пожаловать в систему внутреннего мониторинга ИТ-угроз.
        </p>
        <div className="d-flex gap-2">
          <Link to="/employee/requests">
            <Button variant="primary">
              Перейти к заявкам
            </Button>
          </Link>
        </div>
      </Col>
    </Row>
  </Card>
)
