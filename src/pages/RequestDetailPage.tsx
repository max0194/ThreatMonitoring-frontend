import { FormEvent, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button, Card, Col, Form, Row, Spinner, Alert, Badge } from 'react-bootstrap'
import { fetchRequestById, updateRequestStatus, deleteRequest, fetchRequestFacts, createFact, submitRequest, completeRequest } from '../api/api'
import { RequestItem, RequestFact, User } from '../types'

interface Props {
  user: User | null
}

export const RequestDetailPage = ({ user }: Props) => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const requestId = id ? parseInt(id) : 0

  const [request, setRequest] = useState<RequestItem | null>(null)
  const [facts, setFacts] = useState<RequestFact[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [factTitle, setFactTitle] = useState('')
  const [factDescription, setFactDescription] = useState('')
  const [factFile, setFactFile] = useState<File | null>(null)
  const [addingFact, setAddingFact] = useState(false)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const req = await fetchRequestById(requestId)
        if (!req) {
          setError('Заявка не найдена')
          setLoading(false)
          return
        }
        setRequest(req)

        const factsList = await fetchRequestFacts(requestId)
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

  const canAddFact = user?.user_type === 'employee' && request?.status !== 'closed'
  const canTakeRequest = user?.user_type === 'specialist' && request?.status === 'awaiting'
  const canCloseRequest =
    user?.user_type === 'specialist' && request?.status === 'taken'
  const canDeleteRequest = user?.user_type === 'specialist' || user?.user_type === 'employee'

  const handleAddFact = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!factFile || !factTitle || !factDescription) {
      setError('Заполните все поля')
      return
    }

    setAddingFact(true)
    setError('')
    try {
      await createFact(requestId, factTitle, factDescription, factFile)
      setSuccess('Факт успешно добавлен')
      setFactTitle('')
      setFactDescription('')
      setFactFile(null)

      const updatedFacts = await fetchRequestFacts(requestId)
      setFacts(updatedFacts)

      const updatedRequest = await fetchRequestById(requestId)
      if (updatedRequest) {
        setRequest(updatedRequest)
      }
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setAddingFact(false)
    }
  }

  const handleTakeRequest = async () => {
    setActionLoading(true)
    setError('')
    try {
      await submitRequest(requestId)
      setSuccess('Заявка успешно принята')
      const updated = await fetchRequestById(requestId)
      if (updated) setRequest(updated)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setActionLoading(false)
    }
  }

  const handleCloseRequest = async () => {
    setActionLoading(true)
    setError('')
    try {
      if (user?.user_type === 'specialist') {
        await completeRequest(requestId, 'closed')
      } else {
        await updateRequestStatus(requestId, 'closed')
      }
      setSuccess('Заявка успешно закрыта')
      const updated = await fetchRequestById(requestId)
      if (updated) setRequest(updated)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setActionLoading(false)
    }
  }

  const handleDeleteRequest = async () => {
    if (!window.confirm('Вы уверены, что хотите удалить эту заявку?')) {
      return
    }

    setActionLoading(true)
    setError('')
    try {
      await deleteRequest(requestId)
      setSuccess('Заявка успешно удалена')
      setTimeout(() => {
        navigate(user?.user_type === 'employee' ? '/employee/requests' : '/specialist')
      }, 1000)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setActionLoading(false)
    }
  }

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
            <div className="d-flex gap-2">
              {canTakeRequest && (
                <Button variant="success" onClick={handleTakeRequest} disabled={actionLoading}>
                  {actionLoading ? 'Принимаем...' : 'Принять заявку'}
                </Button>
              )}
              {canCloseRequest && (
                <Button variant="warning" onClick={handleCloseRequest} disabled={actionLoading}>
                  {actionLoading ? 'Закрываем...' : 'Закрыть заявку'}
                </Button>
              )}
              {canDeleteRequest && (
                <Button variant="danger" onClick={handleDeleteRequest} disabled={actionLoading}>
                  {actionLoading ? 'Удаляем...' : 'Удалить'}
                </Button>
              )}
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

        {canAddFact && (
          <Card className="p-4 mb-4 bg-light">
            <h4>Добавить новый факт</h4>
            <Form onSubmit={handleAddFact}>
              <Form.Group className="mb-3" controlId="factTitle">
                <Form.Label>Название факта</Form.Label>
                <Form.Control
                  value={factTitle}
                  onChange={(e) => setFactTitle(e.target.value)}
                  placeholder="Например: Скриншот вирусного окна"
                  disabled={addingFact}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="factDescription">
                <Form.Label>Описание факта</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={factDescription}
                  onChange={(e) => setFactDescription(e.target.value)}
                  placeholder="Подробное описание факта..."
                  disabled={addingFact}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="factScreenshot">
                <Form.Label>Скриншот</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const input = e.currentTarget as HTMLInputElement
                    setFactFile(input.files?.[0] || null)
                  }}
                  disabled={addingFact}
                />
                <Form.Text className="text-muted">Поддерживаются форматы: JPG, PNG, GIF</Form.Text>
              </Form.Group>

              <Button type="submit" variant="primary" disabled={addingFact || !factFile || !factTitle || !factDescription}>
                {addingFact ? 'Добавляем факт...' : '📤 Добавить факт'}
              </Button>
            </Form>
          </Card>
        )}

        <Card className="p-4">
          <h4>Факты и доказательства ({facts.length})</h4>

          {facts.length === 0 ? (
            <div className="text-muted text-center py-5">
              <p>Факты пока не добавлены</p>
              {canAddFact && <p className="small">Добавьте первый факт выше!</p>}
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
                  {fact.screenshot_url && (
                    <img
                      src={fact.screenshot_url}
                      alt={fact.title}
                      className="img-fluid rounded"
                      style={{ maxWidth: '100%', maxHeight: 400 }}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
      </Col>
    </Row>
  )
}
