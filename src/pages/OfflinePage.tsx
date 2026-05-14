import { Button, Card, Col, Row } from 'react-bootstrap'

export const OfflinePage = () => {
  const handleReload = () => {
    window.location.reload()
  }

  return (
    <Card className="hero-card p-4 mb-4">
      <Row className="align-items-center">
        <Col>
          <h1 className="page-heading">Сервер недоступен</h1>
          <p>
            Связь с backend-сервисом отсутствует. Проверьте, запущен ли сервер, и обновите страницу.
            Пока backend недоступен, приложение работает в режиме ожидания.
          </p>
          <div className="d-flex gap-2 flex-wrap">
            <Button variant="primary" onClick={handleReload}>
              Обновить страницу
            </Button>
          </div>
        </Col>
      </Row>
    </Card>
  )
}
