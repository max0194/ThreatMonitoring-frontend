import { Api } from "./api";
import { HttpClient } from "./http-client";
import * as Types from "../types";
import axios, { AxiosError } from "axios";
import { API_URL } from "../config";

const httpClient = new HttpClient({
  baseURL: `${API_URL}`,
});

const api = new Api(httpClient);

interface ApiError {
  status: string;
  message: string;
}

export const authController = {
  async loginUser(email: string, password: string): Promise<Types.User> {
    const data = { email, password };
    try {
      const response = await api.authLoginCreate({
        body: data,
      } as any);
      const res: Types.LoginResponse = response.data as any;
      return res.user;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<ApiError>;

        throw new Error(axiosError.response?.data?.message || "Ошибка сервера");
      }
      throw err;
    }
  },

  async logout(): Promise<void> {
    await api.authLogoutCreate();
  },

  async registerUser(data: Types.RegisterRequest): Promise<void> {
    try {
      await api.authRegisterCreate({
        body: data,
      } as any);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<ApiError>;

        throw new Error(axiosError.response?.data?.message || "Ошибка сервера");
      }
      throw err;
    }
  },
};

export const requestsController = {
  async fetchRequests(query?: {
    status?: string;
    date_from?: string;
    date_to?: string;
  }): Promise<Types.RequestItem[]> {
    try {
      const response = await api.requestsList(query);
      const res: Types.RequestsListResponse = response.data as any;
      return res.requests;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<ApiError>;

        throw new Error(axiosError.response?.data?.message || "Ошибка сервера");
      }
      throw err;
    }
  },

  async createRequest(data: Types.UpdateRequestRequest): Promise<void> {
    try {
      await api.requestsCreate({
        body: data,
      } as any);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<ApiError>;

        throw new Error(axiosError.response?.data?.message || "Ошибка сервера");
      }
      throw err;
    }
  },

  async fetchRequestById(id: number): Promise<Types.RequestItem> {
    try {
      const response = await api.requestsDetail(id);
      return (response.data as any).request;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<ApiError>;

        throw new Error(axiosError.response?.data?.message || "Ошибка сервера");
      }
      throw err;
    }
  },

  async updateRequest(
    id: number,
    data: Types.UpdateRequestRequest,
  ): Promise<void> {
    try {
      await api.requestsUpdate(id, {
        body: data,
      } as any);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<ApiError>;

        throw new Error(axiosError.response?.data?.message || "Ошибка сервера");
      }
      throw err;
    }
  },

  async submitRequest(id: number): Promise<void> {
    try {
      await api.requestsSubmitUpdate(id);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<ApiError>;

        throw new Error(axiosError.response?.data?.message || "Ошибка сервера");
      }
      throw err;
    }
  },

  async deleteRequest(id: number): Promise<void> {
    try {
      await api.requestsDelete(id);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<ApiError>;

        throw new Error(axiosError.response?.data?.message || "Ошибка сервера");
      }
      throw err;
    }
  },

  async completeRequest(id: number): Promise<void> {
    try {
      await api.requestsCompleteUpdate(id);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<ApiError>;

        throw new Error(axiosError.response?.data?.message || "Ошибка сервера");
      }
      throw err;
    }
  },

  async fetchRequestFacts(id: number): Promise<Types.RequestFact[]> {
    try {
      const response = await api.requestsFactsList(id);
      const res: Types.RequestFactsResponse = response.data as any;
      return res.facts;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<ApiError>;

        throw new Error(axiosError.response?.data?.message || "Ошибка сервера");
      }
      throw err;
    }
  },

  async createFact(
    id: number,
    title: string,
    description: string,
    file: File,
  ): Promise<void> {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("screenshot", file);

    try {
      await api.requestsFactsCreate(id, {
        body: formData,
        type: "multipart/form-data",
      } as any);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<ApiError>;

        throw new Error(axiosError.response?.data?.message || "Ошибка сервера");
      }
      throw err;
    }
  },
};
