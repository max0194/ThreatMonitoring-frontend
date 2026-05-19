import { useMemo, useState } from 'react'
import { Badge, Button, Card, Col, Form, Row, Spinner } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchRequests } from '../api/api'
import { RequestItem } from '../types'

export const SpecialistPage = () => {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const { data: requests = [], isLoading } = useQuery<RequestItem[]>({
    queryKey: ['requests'],
    queryFn: fetchRequests,
    staleTime: 120000,
  })

  const requests_data = useMemo(() => {
    return (requests || [])
      .filter((data): data is RequestItem => data != null)
      .filter((data) =>
        data.status !== 'draft' &&
        data.status !== 'closed' &&
        data.status !== 'rejected'
      );
  }, [requests]);

  const filteredRequests = useMemo(() => {
    if (!requests_data || requests_data.length === 0) {
      return [];
    }

    const searchQuery = query.toLowerCase();

    return requests_data.filter((item) => {
      const title = item.title ?? '';
      const description = item.description ?? '';

      return (
        title.toLowerCase().includes(searchQuery) ||
        description.toLowerCase().includes(searchQuery)
      );
    });
  }, [requests_data, query]);

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
