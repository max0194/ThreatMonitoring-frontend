import { useEffect, useMemo, useState } from 'react'
import { Badge, Button, Card, Col, Form, Row, Spinner, Table } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { fetchRequests } from '../api/api'
import { RequestItem } from '../types'

export const EmployeeRequestsPage = () => {
  const [requests, setRequests] = useState<RequestItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const items = await fetchRequests()
        setRequests(items)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filteredRequests = useMemo(
    () =>
      (requests || []).filter((item) =>
        item.title.toLowerCase().includes(filter.toLowerCase()) || item.description.toLowerCase().includes(filter.toLowerCase()),
      ),
    [requests, filter],
  )

  return (
    <Row>
      <Col>
        <Card className="p-4 mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h2>Мои заявки</h2>
              <p>Список заявок сотрудника доступен сразу после создания учетной записи.</p>
            </div>
            <Button variant="outline-secondary" onClick={() => navigate('/employee')}>
              Новая заявка
            </Button>
          </div>
          <Form.Group className="mb-3" controlId="searchRequests">
            <Form.Label>Поиск по заявкам</Form.Label>
            <Form.Control placeholder="Название или описание" value={filter} onChange={(event) => setFilter(event.target.value)} />
          </Form.Group>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" />
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="no-results">Заявок пока нет или ничего не найдено.</div>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Заголовок</th>
                  <th>Дата</th>
                  <th>Статус</th>
                  <th>Факты</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.title}</td>
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
                    <td>{item.result_count}</td>
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
