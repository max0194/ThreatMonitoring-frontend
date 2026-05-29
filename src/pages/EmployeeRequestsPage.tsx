import { useMemo, useState } from 'react'
import { Badge, Button, Card, Col, Form, Row, Spinner } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchRequests } from '../api/api'
import { RequestItem } from '../types'

export const EmployeeRequestsPage = () => {
  const [filter, setFilter] = useState('')
  const navigate = useNavigate()

  const { data: requests = [], isLoading } = useQuery<RequestItem[]>({
    queryKey: ['requests'],
    queryFn: fetchRequests,
    staleTime: 120000,
  })

  const filteredRequests = useMemo(() => {
    if (!requests || requests.length === 0) {
      return [];
    }

    const searchQuery = filter.toLowerCase();

    return requests.filter((item) => {
      const title = item.title ?? '';
      const description = item.description ?? '';

      return (
        title.toLowerCase().includes(searchQuery) ||
        description.toLowerCase().includes(searchQuery)
      );
    });
  }, [requests, filter]);

  return (
    <Row>
      <Col>
        <Card className="p-4 mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h2>Мои заявки</h2>
              <p>Список заявок сотрудника доступен сразу после создания учетной записи.</p>
            </div>
            <Button variant="outline-secondary" onClick={() => navigate('/employee/create')}>
              Новая заявка
            </Button>
          </div>
          <Form.Group className="mb-3" controlId="searchRequests">
            <Form.Label>Поиск по заявкам</Form.Label>
            <Form.Control placeholder="Название или описание" value={filter} onChange={(event) => setFilter(event.target.value)} />
          </Form.Group>
          {isLoading ? (
            <div className="text-center py-5">
              <Spinner animation="border" />
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="no-results">Нет открытых заявок для отображения.</div>
          ) : (
            <Row>
                {filteredRequests.map((item) => (
                  <Col key={item.id} md={6} lg={4} className="mb-4">
                  <Card className="h-100">
                    <Card.Body>
                      <Card.Title>{item.title}</Card.Title>
                      <Card.Subtitle>
                      <Badge 
                        bg={
                            item.status === 'draft' ? 'secondary' 
                            : item.status === 'awaiting' ? 'warning' 
                            : item.status === 'taken' ? 'info'
                            : 'success'
                            }>
                              {item.status === 'draft' ? 'Черновик'
                              : item.status === 'awaiting' ? 'Ожидает'
                              : item.status === 'taken' ? 'Принята'
                              : 'Закрыта'
                              } 
                      </Badge>
                      </Card.Subtitle>  
                      <Card.Text className="text-muted">
                        <p className="text-muted"><strong>Тип:</strong> {item.threat_type?.name || 'Не указано'}</p>
                        <p className="text-muted"><strong>Дата:</strong> {item.created_at.slice(0, 10)}</p>
                      </Card.Text>               
                      <Button variant="outline-primary" onClick={() => navigate(`/request/${item.id}`)}>
                        Просмотр
                      </Button>
                    </Card.Body>    
                  </Card>
                  </Col>
                ))}
            </Row>
          )}
        </Card>
      </Col>
    </Row>
  )
}
