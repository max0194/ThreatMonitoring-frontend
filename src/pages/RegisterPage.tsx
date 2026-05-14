import { FormEvent, useState } from 'react'
import { Alert, Button, Card, Col, Form, Row } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { registerUser } from '../api/api'
import { UserType } from '../types'

export const RegisterPage = () => {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [userType, setUserType] = useState<UserType>('employee')
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
      await registerUser(email, password, fullName, phone, userType)
      setSuccess('Пользователь успешно зарегистрирован.')
      setEmail('')
      setPassword('')
      setFullName('')
      setPhone('')
      setUserType('employee')
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Row className="justify-content-center">
      <Col md={8} lg={6}>
        <Card className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h2>Регистрация нового пользователя</h2>
              <p>Специалист может зарегистрировать сотрудника или другого специалиста.</p>
            </div>
            <Button variant="outline-secondary" onClick={() => navigate('/specialist')}>
              Назад
            </Button>
          </div>
          {success && <Alert variant="success">{success}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="registerFullName">
              <Form.Label>ФИО</Form.Label>
              <Form.Control value={fullName} required onChange={(event) => setFullName(event.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="registerEmail">
              <Form.Label>Корпоративный Email</Form.Label>
              <Form.Control type="email" value={email} required onChange={(event) => setEmail(event.target.value)} />
              <Form.Text className="text-muted">Требуется email домена @company.com</Form.Text>
            </Form.Group>
            <Form.Group className="mb-3" controlId="registerPhone">
              <Form.Label>Телефон</Form.Label>
              <Form.Control value={phone} required onChange={(event) => setPhone(event.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="registerPassword">
              <Form.Label>Пароль</Form.Label>
              <Form.Control type="password" value={password} required onChange={(event) => setPassword(event.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="registerUserType">
              <Form.Label>Роль</Form.Label>
              <Form.Select value={userType} onChange={(event) => setUserType(event.target.value as UserType)}>
                <option value="employee">Сотрудник</option>
                <option value="specialist">Специалист</option>
              </Form.Select>
            </Form.Group>
            <div className="d-grid gap-2">
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? 'Регистрируем...' : 'Зарегистрировать'}
              </Button>
            </div>
          </Form>
        </Card>
      </Col>
    </Row>
  )
}
