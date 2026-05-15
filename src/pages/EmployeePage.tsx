import { FormEvent, useState } from 'react'
import { Alert, Button, Card, Col, Form, Row } from 'react-bootstrap'
import { createRequest } from '../api/api'
import { useNavigate } from 'react-router-dom'

const threatTypes = [
  { id: 1, name: 'Троян' },
  { id: 2, name: 'Рансомваре' },
  { id: 3, name: 'Email фишинг' },
  { id: 4, name: 'SMS фишинг' },
  { id: 5, name: 'HTTP Flood' },
]

export const EmployeePage = () => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [threatTypeId, setThreatTypeId] = useState(1)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      await createRequest(title, description, threatTypeId)
      setSuccess('Заявка успешно создана. Перейдите в раздел «Мои заявки».')
      setTitle('')
      setDescription('')
      setThreatTypeId(1)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
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
            </div>
          </Form>
        </Card>
      </Col>
    </Row>
  )
}
