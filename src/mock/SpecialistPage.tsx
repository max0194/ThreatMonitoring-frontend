import { useEffect, useMemo, useState } from 'react'
import { Badge, Button, Card, Col, Form, Row, Spinner, Table } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { RequestItem } from '../types'

const mockRequests: RequestItem[] = [{
  id: 1,
  title: "Ошибка в системе",
  description: "Случайно поймал ошибку в системе",
  status: "awaiting",
  created_at: "2026-01-01",
  result_count: 1
},
{
  id: 2,
  title: "Возник вирус",
  description: "Скачался вирус, помогите",
  status: "complete",
  created_at: "2026-01-01",
  result_count: 1
},
{
  id: 3,
  title: "Пропали файлы",
  description: "В ходе работы пропали важные файлы",
  status: "taken",
  created_at: "2026-01-01",
  result_count: 1
},
]

export const MockSpecialistPage = () => {
  const [requests, setRequests] = useState<RequestItem[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const items = await mockRequests
        setRequests(items.filter((item) => item.status !== 'draft' && item.status !== 'closed' && item.status !== 'rejected'))
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filteredRequests = useMemo(
    () =>
      (requests || []).filter((item) =>
        item.title.toLowerCase().includes(query.toLowerCase()) || item.description.toLowerCase().includes(query.toLowerCase()),
      ),
    [requests, query],
  )

  return (
    <Row>
      <Col>
        <Card className="p-4 mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h2>Панель специалиста</h2>
              <p>Специалист видит все открытые заявки и может принимать их в работу.</p>
            </div>
            <div className="d-flex gap-2">
              <Button variant="outline-secondary" onClick={() => navigate('/specialist/register')}>
                Зарегистрировать пользователя
              </Button>
            </div>
          </div>
          <Form.Group className="mb-3" controlId="searchRequestsSpecialist">
            <Form.Label>Поиск по заявкам</Form.Label>
            <Form.Control placeholder="Название или описание" value={query} onChange={(event) => setQuery(event.target.value)} />
          </Form.Group>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" />
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="no-results">Нет открытых заявок для отображения.</div>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Заголовок</th>
                  <th>Категория</th>
                  <th>Дата</th>
                  <th>Статус</th>
                  <th>Действие</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.title}</td>
                    <td>{item.threat_type?.name || 'Не указано'}</td>
                    <td>{item.created_at.slice(0, 10)}</td>
                    <td>                      
                      <Badge 
                        bg={
                            item.status === 'draft'
                            ? 'secondary'
                            : item.status === 'awaiting'
                            ? 'warning'
                            : item.status === 'taken'
                            ? 'info'
                            : 'success'
                            }>
                              {item.status === 'draft'
                              ? 'Черновик'
                              : item.status === 'awaiting'
                              ? 'Ожидает'
                              : item.status === 'taken'
                              ? 'Принята'
                              : 'Закрыта'
                              } 
                      </Badge>   
                    </td>
                    <td>
                      <Button size="sm" variant="outline-primary" onClick={() => navigate(`/request/${item.id}`)}>
                        Просмотр
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card>
      </Col>
    </Row>
  )
}
