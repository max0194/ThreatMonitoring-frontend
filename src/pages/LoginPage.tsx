import { FormEvent, useState } from 'react'
import { Alert, Button, Card, Col, Form, Row } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { loginUser } from '../api/api'
import { User, UserType } from '../types'

interface Props {
  onLoginSuccess: (user: User) => void
}

export const LoginPage = ({ onLoginSuccess }: Props) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [userType, setUserType] = useState<UserType>('employee')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const user = await loginUser(email, password, userType)
      onLoginSuccess(user)
      navigate(`/${user.user_type}`, { replace: true })
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Row className="justify-content-center">
      <Col md={6} lg={5}>
        <Card className="p-4">
          <h2 className="mb-4">Вход в систему</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="loginEmail">
              <Form.Label>Корпоративный email</Form.Label>
              <Form.Control type="email" value={email} required onChange={(event) => setEmail(event.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="loginPassword">
              <Form.Label>Пароль</Form.Label>
              <Form.Control type="password" value={password} required onChange={(event) => setPassword(event.target.value)} />
            </Form.Group>
            <div className="d-grid gap-2">
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? 'Вход...' : 'Войти'}
              </Button>
            </div>
          </Form>
        </Card>
      </Col>
    </Row>
  )
}
