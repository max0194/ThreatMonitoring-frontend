import { RequestItem, RequestFact, User, UserType } from '../types'
import axios , { AxiosError } from 'axios'

interface ApiError {
  status: string
  message: string
}

export const api = axios.create({
  baseURL: "https://api.threatmonitoring.ru/api",
  withCredentials: true,
});

export const loginUser = async (email: string, password: string, userType: UserType): Promise<User> => {
  try {
    const response = await api.post(`/auth/login`, {
      email,
      password,
      user_type: userType,
    },
  );

    const body = response.data;
    if (body.status !== 'ok') {
      throw new Error(body.message || 'Ошибка входа');
    }
    return body.user as User
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const axiosError = err as AxiosError<ApiError>

      throw new Error(
        axiosError.response?.data?.message ||
        'Ошибка сервера'
      )
    }
    throw err
  }
}

export const logoutUser = async (): Promise<void> => {
  await api.post(`/auth/logout`, {})
}

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const response = await api.get(`/auth/profile`, {
      withCredentials: true,
    })
    const body = response.data
    if (body.status !== 'ok') {
      return null
    }
    return body.user as User
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const axiosError = err as AxiosError<ApiError>

      throw new Error(
        axiosError.response?.data?.message ||
        'Ошибка сервера'
      )
    }
    throw err
  }
}

export const fetchRequests = async (): Promise<RequestItem[]> => {
  try {
    const response = await api.get(`/requests`, {})
    const body = response.data
    if (body.status !== 'ok') {
      throw new Error(body.message || 'Ошибка загрузки заявок')
  }
  return body.requests as RequestItem[]
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const axiosError = err as AxiosError<ApiError>

      throw new Error(
        axiosError.response?.data?.message ||
        'Ошибка сервера'
      )
    }
    throw err
  }
}

export const createRequest = async (title: string, description: string, threatTypeId: number): Promise<void> => {
  try {
    const response = await api.post(`/requests`, {
      title, 
      description, 
      threat_type_id: threatTypeId,
    });
    const body = response.data
    if (body.status !== 'ok') {
      throw new Error(body.message || 'Ошибка загрузки заявок')
    }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const axiosError = err as AxiosError<ApiError>

      throw new Error(
        axiosError.response?.data?.message ||
        'Ошибка сервера'
      )
    }
    throw err
  }
}

export const registerUser = async (
  email: string,
  password: string,
  fullName: string,
  phone: string,
  userType: UserType,
): Promise<void> => {
  try {
    const response = await api.post(`/auth/register`,
      {
        email,
        password,
        full_name: fullName,
        phone,
        user_type: userType,
      })

    const body = response.data

    if (body.status !== 'ok') {
      throw new Error(body.message || 'Ошибка регистрации')
    }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const axiosError = err as AxiosError<ApiError>

      throw new Error(
        axiosError.response?.data?.message ||
        'Ошибка сервера'
      )
    }
    throw err
  }
}

export const fetchRequestById = async (id: number): Promise<RequestItem | null> => {
  try {
    const response = await api.get(`/requests/${id}`, {})
    const body = response.data
    if (body.status !== 'ok') {
      return null
  }
  return body.request
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const axiosError = err as AxiosError<ApiError>

      throw new Error(
        axiosError.response?.data?.message ||
        'Ошибка сервера'
      )
    }
    throw err
  }
}

export const updateRequestStatus = async (id: number, status: string): Promise<void> => {
  try {
    const response = await api.put(`/requests/${id}`, {
      status,
    });
    const body = response.data
    if (body.status !== 'ok') {
      throw new Error(body?.message || 'Ошибка обновления статуса')
    }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const axiosError = err as AxiosError<ApiError>

      throw new Error(
        axiosError.response?.data?.message ||
        'Ошибка сервера'
      )
    }
    throw err
  }
}

export const submitRequest = async (id: number): Promise<void> => {
  try {
    const response = await api.put(`/requests/${id}/submit`, {})
    const body = response.data
    if (body.status !== 'ok') {
      throw new Error(body?.message || 'Ошибка принятия заявки')
    }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const axiosError = err as AxiosError<ApiError>

      throw new Error(
        axiosError.response?.data?.message ||
        'Ошибка сервера'
      )
    }
    throw err
  }
}

export const completeRequest = async (id: number, status: string): Promise<void> => {
  try {
    const response = await api.put(`/requests/${id}/complete`, {
      status,
    });
    const body = response.data
    if (body.status !== 'ok') {
      throw new Error(body?.message || 'Ошибка завершения заявки')
    }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const axiosError = err as AxiosError<ApiError>

      throw new Error(
        axiosError.response?.data?.message ||
        'Ошибка сервера'
      )
    }
    throw err
  }
}

export const updateRequestContent = async (id: number, title: string, description: string): Promise<void> => {
  try {
    const response = await api.put(`/requests/${id}`, {
      title, 
      description,
    });
    const body = response.data
    if (body.status !== 'ok') {
      throw new Error(body?.message || 'Ошибка обновления заявки')
    }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const axiosError = err as AxiosError<ApiError>

      throw new Error(
        axiosError.response?.data?.message ||
        'Ошибка сервера'
      )
    }
    throw err
  }
}

export const deleteRequest = async (id: number): Promise<void> => {
  try {
    const response = await api.delete(`/requests/${id}`, {})
    const body = response.data
    if (body.status !== 'ok') {
      throw new Error(body?.message || 'Ошибка удаления заявки')
    }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const axiosError = err as AxiosError<ApiError>

      throw new Error(
        axiosError.response?.data?.message ||
        'Ошибка сервера'
      )
    }
    throw err
  }
}

export const fetchRequestFacts = async (requestId: number): Promise<RequestFact[]> => {
  try {
    const response = await api.get(`/requests/${requestId}/facts`, {})
    const body = response.data
    if (body.status !== 'ok') {
      throw new Error(body.message || 'Ошибка загрузки фактов')
    }
    return body.facts as RequestFact[]
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const axiosError = err as AxiosError<ApiError>

      throw new Error(
        axiosError.response?.data?.message ||
        'Ошибка сервера'
      )
    }
    throw err
  }
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
    const response = await api.post(
      `/requests/${requestId}/facts`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    const body = response.data;
    if (body.status !== 'ok') {
      throw new Error(body?.message || 'Ошибка создания факта');
    }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const axiosError = err as AxiosError<ApiError>

      throw new Error(
        axiosError.response?.data?.message ||
        'Ошибка сервера'
      )
    }
    throw err
  }
};
