import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button, Card, Col, Form, Row, Spinner, Alert, Badge } from 'react-bootstrap'
import { RequestItem, RequestFact, User } from '../types'
import { mockRequests, mockRequestsFacts } from './mockData'
import Url1 from '../assets/1.png'
import Url2 from '../assets/2.jpg'
import Url3 from '../assets/3.png'

const url1: string = Url1
const url2: string = Url2
const url3: string = Url3

export const MockRequestDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const requestId = id ? parseInt(id) : 0

  const [request, setRequest] = useState<RequestItem | null>(null)
  const [facts, setFacts] = useState<RequestFact[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const req = mockRequests.find((item) => item.id === requestId)
        if (!req) {
          setError('Заявка не найдена')
          setLoading(false)
          return
        }
        setRequest(req)

        const factsList = mockRequestsFacts.filter((fact) => fact.request_id === requestId)
        setFacts(factsList)
      } catch (err) {
        setError((err as Error).message)
      } finally {
        setLoading(false)
      }
    }

    if (requestId > 0) {
      load()
    }
  }, [requestId])

  if (loading) {
    return (
      <Row className="justify-content-center">
        <Col md={8} className="text-center py-5">
          <Spinner animation="border" />
        </Col>
      </Row>
    )
  }

  if (!request) {
    return (
      <Row className="justify-content-center">
        <Col>
          <Alert variant="danger">Заявка не найдена</Alert>
          <Button onClick={() => navigate(-1)}>← Назад</Button>
        </Col>
      </Row>
    )
  }

  return (
    <Row>
      <Col>
        <Button variant="outline-secondary" size="sm" onClick={() => navigate(-1)} className="mb-3">
          ← Назад к списку
        </Button>
        <Card className="p-4 mb-4">
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div>
              <h2>Заявка #{request.id}</h2>
              <Badge
                bg={
                  request.status === 'draft'
                    ? 'secondary'
                    : request.status === 'awaiting'
                      ? 'warning'
                      : request.status === 'taken'
                        ? 'info'
                        : 'success'
                }
              >
                {request.status === 'draft'
                  ? 'Черновик'
                  : request.status === 'awaiting'
                    ? 'Ожидает'
                    : request.status === 'taken'
                      ? 'Принята'
                      : 'Закрыта'}
              </Badge>
            </div>
          </div>

          {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
          {success && <Alert variant="success" onClose={() => setSuccess('')} dismissible>{success}</Alert>}

          <Row className="mb-4">
            <Col md={6}>
              <div className="mb-3">
                <label className="text-muted small">Сотрудник</label>
                <p className="fw-bold text-muted">{request.creator?.full_name || 'Неизвестно'}</p>
              </div>
            </Col>
            <Col md={6}>
              <div className="mb-3">
                <label className="text-muted small">Email</label>
                <p className="fw-bold text-muted">{request.creator?.email || 'Неизвестно'}</p>
              </div>
            </Col>
          </Row>

          <div className="mb-3">
            <label className="text-muted small">Дата создания</label>
            <p className="fw-bold text-muted">{new Date(request.created_at).toLocaleDateString('ru-RU')}</p>
          </div>

          <div className="mb-3">
            <label className="text-muted small">Тип угрозы</label>
            <p className="fw-bold text-muted">
              {request.threat_type?.name}
              {request.threat_type?.category && ` (${request.threat_type.category.name})`}
            </p>
          </div>

          <div className="mb-3">
            <label className="text-muted small">Название</label>
            <p className="fw-bold text-muted">{request.title}</p>
          </div>

          <div>
            <label className="text-muted small">Описание</label>
            <p className="text-muted text-muted">{request.description}</p>
          </div>
        </Card>

        <Card className="p-4">
          <h4>Факты и доказательства ({facts.length})</h4>

          {facts.length === 0 ? (
            <div className="text-muted text-center py-5">
              <p>Факты пока не добавлены</p>
            </div>
          ) : (
            <div className="facts-list">
              {facts.map((fact) => (
                <div key={fact.id} className="mb-4 pb-4 border-bottom">
                  <h5 className="mb-2">{fact.title}</h5>
                  <p className="text-muted small mb-2">
                    Добавлено: {new Date(fact.created_at).toLocaleDateString('ru-RU')}
                  </p>
                  <p className="mb-3">{fact.description}</p>
                    <img
                      src={fact.screenshot_url === "1" ? url1 : fact.screenshot_url === "2" ? url2 : url3}
                      alt={fact.title}
                      className="img-fluid rounded"
                      style={{ maxWidth: '100%', maxHeight: 400 }}
                    />
                </div>
              ))}
            </div>
          )}
        </Card>
      </Col>
    </Row>
  )
}
