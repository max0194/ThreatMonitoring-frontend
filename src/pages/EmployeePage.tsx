import { FormEvent, useState } from 'react'
import { Alert, Button, Card, Col, Form, Row } from 'react-bootstrap'
import { requestsController } from '../api/http-controller'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { createRequest } from '../store/requests'

const threatTypes = [
  { id: 1, name: 'Атака на сеть' },
  { id: 2, name: 'Необычная активность' },
  { id: 3, name: 'Уязвимость' },
]

export const EmployeePage = () => {
  const dispatch = useAppDispatch()
  const { loading, error, success } = useAppSelector((state) => state.requests)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [threatTypeId, setThreatTypeId] = useState(1)
  const navigate = useNavigate()

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const result = await dispatch(
      createRequest({ title, description, threat_type_id: threatTypeId })
    )
    if (createRequest.fulfilled.match(result)) {
      setTitle('')
      setDescription('')
      setThreatTypeId(1)
    }
  }

  return (
    <Row>
      <Col>
        <Card className="p-4 mb-4">
          <h2>Создание заявки</h2>
          <p>Сотрудник сразу видит форму для создания новой заявки.</p>
          {success && <Alert variant="success">{success}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="requestTitle">
              <Form.Label>Название заявки</Form.Label>
              <Form.Control value={title} required onChange={(event) => setTitle(event.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="requestDescription">
              <Form.Label>Описание угрозы</Form.Label>
              <Form.Control as="textarea" rows={4} value={description} required onChange={(event) => setDescription(event.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="requestThreatType">
              <Form.Label>Категория угрозы</Form.Label>
              <Form.Select value={threatTypeId} onChange={(event) => setThreatTypeId(Number(event.target.value))}>
                {threatTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <div className="d-flex gap-2">
              <Button type="submit" disabled={loading}>
                {loading ? 'Сохраняем...' : 'Создать заявку'}
              </Button>
              <Button variant="outline-secondary" onClick={() => navigate('/employee/requests')}>
                Мои заявки
              </Button>
            </div>
          </Form>
        </Card>
      </Col>
    </Row>
  )
}
