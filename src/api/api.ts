import { RequestItem, RequestFact, User, UserType } from '../types'
import axios from 'axios'

const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
}

export const loginUser = async (email: string, password: string, userType: UserType): Promise<User> => {
  const response = await axios.post('/api/auth/login', {
      email,
      password,
      user_type: userType,
      withCredentials: true
    });

    const body = response.data;

    if (body.status !== 'ok') {
      throw new Error(body.message || 'Ошибка входа');
    }

    return body.user as User;
}

export const logoutUser = async (): Promise<void> => {
  await axios.post('/api/auth/logout', {
    withCredentials: true,
  })
}

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const response = await axios.get('/api/auth/profile', {
      withCredentials: true,
    })
    const body = await response.data
    if (body.status !== 'ok') {
      return null
    }
    return body.user as User
  } catch {
    return null
  }
}

export const fetchRequests = async (): Promise<RequestItem[]> => {
  const response = await axios.get('/api/requests', {
    withCredentials: true,
  })
  const body = await response.data
  if (body.status !== 'ok') {
    throw new Error(body.message || 'Ошибка загрузки заявок')
  }
  return (body.requests || []) as RequestItem[]
}

export const createRequest = async (title: string, description: string, threatTypeId: number): Promise<void> => {
  const response = await axios.post('/api/requests', {
    title, 
    description, 
    threat_type_id: threatTypeId,
    withCredentials: true,
  })
  const body = await response.data
  if (body.status !== 'ok') {
    throw new Error(body.message || 'Ошибка загрузки заявок')
  }
}

export const registerUser = async (email: string, password: string, fullName: string, phone: string, userType: UserType): Promise<void> => {
  const response = await axios.post('/api/auth/register', {
    email, 
    password, 
    full_name: fullName, 
    phone, 
    user_type: userType,
    withCredentials: true,
  })
  const body = await response.data
  if (body.status !== 'ok') {
    throw new Error(body.message || 'Ошибка регистрации пользователя')
  }
}

export const fetchRequestById = async (id: number): Promise<RequestItem | null> => {
  const response = await axios.get(`/api/requests/${id}`, {
    withCredentials: true,
  })
  const body = await response.data
  if (body.status !== 'ok') {
    return null
  }
  return body.request as RequestItem
}

export const updateRequestStatus = async (id: number, status: string): Promise<void> => {
  const response = await axios.put(`/api/requests/${id}`, {
    status,
    withCredentials: true
  })
  const body = await response.data
  if (body.status !== 'ok') {
    throw new Error(body?.message || 'Ошибка обновления статуса')
  }
}

export const submitRequest = async (id: number): Promise<void> => {
  const response = await axios.put(`/api/requests/${id}/submit`, {
    withCredentials: true
  })
  const body = await response.data
  if (body.status !== 'ok') {
    throw new Error(body?.message || 'Ошибка принятия заявки')
  }
}

export const completeRequest = async (id: number, status: string): Promise<void> => {
  const response = await axios.put(`/api/requests/${id}/complete`, {
    status,
    withCredentials: true
  })
  const body = await response.data
  if (body.status !== 'ok') {
    throw new Error(body?.message || 'Ошибка завершения заявки')
  }
}

export const updateRequestContent = async (id: number, title: string, description: string): Promise<void> => {
  const response = await axios.put(`/api/requests/${id}`, {
    title, 
    description,
    withCredentials: true
  })
  const body = await response.data
  if (body.status !== 'ok') {
    throw new Error(body?.message || 'Ошибка обновления заявки')
  }
}

export const deleteRequest = async (id: number): Promise<void> => {
  const response = await axios.delete(`/api/requests/${id}`, {
    withCredentials: true
  })
  const body = await response.data
  if (body.status !== 'ok') {
    throw new Error(body?.message || 'Ошибка удаления заявки')
  }
}

export const fetchRequestFacts = async (requestId: number): Promise<RequestFact[]> => {
  const response = await axios.get(`/api/requests/${requestId}/facts`, {
    withCredentials: true
  })
  const body = await response.data
  if (body.status !== 'ok') {
    throw new Error(body.message || 'Ошибка загрузки фактов')
  }
  return body.facts as RequestFact[]
}

export const createFact = async (
  requestId: number,
  title: string,
  description: string,
  file: File
): Promise<void> => {
  const formData = new FormData();
  formData.append('title', title);
  formData.append('description', description);
  formData.append('screenshot', file);

  try {
    const response = await axios.post(
      `/api/requests/${requestId}/facts`,
      formData,
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    const body = response.data;
    if (body.status !== 'ok') {
      throw new Error(body?.message || 'Ошибка создания факта');
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        `HTTP ошибка: ${error.response?.status} - ${error.message}`
      );
    }
    throw error;
  }
};
