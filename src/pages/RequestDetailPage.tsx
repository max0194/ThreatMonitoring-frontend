import { FormEvent, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button, Card, Col, Form, Row, Spinner, Alert, Badge } from 'react-bootstrap'
import { useQuery } from '@tanstack/react-query'
import { queryClient } from '../main'
import { requestsController } from '../api/http-controller'
import { RequestItem, RequestFact, User, SimilarRequest } from '../types'
import { cosineSimilarity, getOrCreateEmbedding } from '../utils/embeddings'
import { mockRequests, mockRequestsFacts } from '../mock/mockData'

interface Props {
  user: User | null
}

export const RequestDetailPage = ({ user }: Props) => {
  const [similarRequests, setSimilarRequests] = useState<SimilarRequest[]>([])
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const requestId = id ? parseInt(id) : 0

  const [actionLoading, setActionLoading] = useState(false)
  const [similarLoading, setSimilarLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [factTitle, setFactTitle] = useState('')
  const [factDescription, setFactDescription] = useState('')
  const [factFile, setFactFile] = useState<File | null>(null)
  const [addingFact, setAddingFact] = useState(false)

  const {
    data: request,
    isLoading: requestLoading,
    } = useQuery<RequestItem | null>({
      queryKey: ['request', requestId],
    queryFn: async (): Promise<RequestItem | null> => {
      try {
        return await requestsController.fetchRequestById(requestId);
      } catch (error) {
        console.error('Failed to fetch request, using mock data:', error);
        return mockRequests[requestId-1] || null;
      }
    },
      enabled: requestId > 0,
      staleTime: 120000,
  })

  const {
    data: facts = [],
    isLoading: factsLoading,
    } = useQuery<RequestFact[]>({
      queryKey: ['requestfacts', requestId],
      queryFn: async (): Promise<RequestFact[]> => {
        try {
          return await requestsController.fetchRequestFacts(requestId);
        } catch (error) {
          console.error('Failed to fetch facts, using mock data:', error);
          return mockRequestsFacts.filter((facts: any) => facts.request_id === requestId);
        }
      },
      enabled: requestId > 0,
      staleTime: 120000,
  })

  const { data: requests = [] } = useQuery({
    queryKey: ['requests'],
    queryFn: async (): Promise<any[]> => {
      try {
        return await requestsController.fetchRequests();
      } catch (error) {
        console.error('Failed to fetch requests, using mock data:', error);
        return mockRequests;
      }
    },
    staleTime: 120000,
  })

  useEffect(() => {
    let active = true

    async function calculateSimilarity() {
      if (!request) {
        return
      }

      setSimilarLoading(true)

      try {
        const candidateRequests =
          requests.filter(
            (r) =>
              r.id !== request.id &&
              r.threat_type?.id === request.threat_type?.id,
          )

        if (
          candidateRequests.length === 0
        ) {
          setSimilarRequests([])
          return
        }

        const currentEmbedding =
          await getOrCreateEmbedding(request)

        const scored =
          await Promise.all(
            candidateRequests.map(
              async (r) => {
                const embedding =
                  await getOrCreateEmbedding(r)
                return {
                  ...r,
                  similarity:
                    cosineSimilarity(currentEmbedding, embedding),
                }
              },
            ),
          )

        if (!active) {
          return
        }

        const similar = scored
          .filter(
            (x) =>
              x.similarity > 0.3,
          )
          .sort(
            (a, b) =>
              b.similarity - a.similarity,
          )
          .slice(0, 5)

        setSimilarRequests(similar)
      } catch (err) {
        console.error(
          'Similarity error:',
          err,
        )
      } finally {
        if (active) {
          setSimilarLoading(false)
        }
      }
    }

    calculateSimilarity()

    return () => {
      active = false
    }
  }, [request, requests])

  const loading = requestLoading || factsLoading

  const canAddFact = user?.user_type === 'employee' && request?.status !== 'closed'
  const canTakeRequest = user?.user_type === 'specialist' && request?.status === 'awaiting'
  const canCloseRequest = user?.user_type === 'specialist' && request?.status === 'taken'
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
      await requestsController.createFact(requestId, factTitle, factDescription, factFile)
      setSuccess('Факт успешно добавлен')
      setFactTitle('')
      setFactDescription('')
      setFactFile(null)

      setSuccess('Заявка успешно принята')
      queryClient.invalidateQueries({
        queryKey: ['request', requestId],
      })
      queryClient.invalidateQueries({
        queryKey: ['requests'],
      })
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
      await requestsController.submitRequest(requestId)
      setSuccess('Заявка успешно принята')
      queryClient.invalidateQueries({
        queryKey: ['request', requestId],
      })
      queryClient.invalidateQueries({
        queryKey: ['requests'],
      })
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
        await requestsController.completeRequest(requestId)
      }
      setSuccess('Заявка успешно закрыта')
      queryClient.removeQueries({
        queryKey: ['request', requestId],
      })
      queryClient.invalidateQueries({
        queryKey: ['requests'],
      })
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
      await requestsController.deleteRequest(requestId)
      setSuccess('Заявка успешно удалена')
      setTimeout(() => {
        navigate(user?.user_type === 'employee' ? '/employee/requests' : '/specialist')
      }, 1000)
      queryClient.removeQueries({
        queryKey: ['request', requestId],
      })
      queryClient.invalidateQueries({
        queryKey: ['requests'],
      })
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
                <label className="fw-bold text-muted">Сотрудник</label>
                <p className="text-muted">{request.creator?.full_name || 'Неизвестно'}</p>
              </div>
            </Col>
            <Col md={6}>
              <div className="mb-3">
                <label className="fw-bold text-muted">Email</label>
                <p className="text-muted">{request.creator?.email || 'Неизвестно'}</p>
              </div>
            </Col>
          </Row>

          <div className="mb-3">
            <label className="fw-bold text-muted">Дата создания</label>
            <p className="text-muted">{new Date(request.created_at).toLocaleDateString('ru-RU')}</p>
          </div>

          <div className="mb-3">
            <label className="fw-bold text-muted">Тип угрозы</label>
            <p className="text-muted">
              {request.threat_type?.name}
              {request.threat_type?.category && ` (${request.threat_type.category.name})`}
            </p>
          </div>

          <div className="mb-3">
            <label className="fw-bold text-muted">Название</label>
            <p className="text-muted">{request.title}</p>
          </div>

          <div>
            <label className="fw-bold text-muted">Описание</label>
            <p className="text-muted">{request.description}</p>
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
                  <p className="text-muted mb-3">{fact.description}</p>
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
        {user?.user_type === 'specialist' && (
          <Card className="p-4 mt-4">
            <h4>Похожие заявки</h4>

          {similarLoading ? (
            <Spinner animation="border" />
          ) : similarRequests.length === 0 ? (
            <p className="text-muted">
              Похожие заявки не найдены
            </p>
          ) : (
            similarRequests.map((r) => (
              <Card key={r.id}>
                <Card.Body>
                  <Card.Title className="mb-2">{r.title}</Card.Title>
                  <Card.Text className="text-muted small mb-2"> Дата: {new Date(r.created_at).toLocaleDateString('ru-RU')}</Card.Text>
                  <Card.Text><Badge bg="secondary">{r.threat_type?.name}</Badge></Card.Text>
                  <Card.Footer></Card.Footer>
                  <Button variant="outline-primary" className="small" onClick={() => navigate(`/request/${r.id}`)}>Просмотр</Button>
                </Card.Body>
              </Card>
            ))
          )}
        </Card>)}
      </Col>
    </Row>
  )
}
