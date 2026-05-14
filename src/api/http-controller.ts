import { Api } from './api';
import { HttpClient } from './http-client';
import * as Types from '../types';

const httpClient = new HttpClient({
  baseURL: 'http://localhost:8080',
});

const api = new Api(httpClient);

export const authController = {
  async login(email: string, password: string): Promise<Types.User> {
    const data = { email, password};
    const response = await api.authLoginCreate({
      body: data,
    } as any);
    const res: Types.LoginResponse = response.data as any;
    return res.user;
  },

  async logout(): Promise<void> {
    await api.authLogoutCreate();
  },

  async register(data: Types.RegisterRequest): Promise<void> {
    await api.authRegisterCreate({
      body: data,
    } as any);
  },
};

export const requestsController = {
  async getRequests(query?: {
    status?: string;
    date_from?: string;
    date_to?: string;
  }): Promise<Types.RequestItem[]> {
    const response = await api.requestsList(query);
    const res: Types.RequestsListResponse = response.data as any;
    return res.requests;
  },

  async createRequest(data: Types.UpdateRequestRequest): Promise<void> {
    await api.requestsCreate({
      body: data,
    } as any);
  },

  async getRequest(id: number): Promise<Types.RequestItem> {
    const response = await api.requestsDetail(id);
    return (response.data as any).request;
  },

  async updateRequest(id: number, data: Types.UpdateRequestRequest): Promise<void> {
    await api.requestsUpdate(id, {
      body: data,
    } as any);
  },

  async takeRequest(id: number): Promise<void> {
    await api.requestsSubmitUpdate(id);
  },

  async deleteRequest(id: number): Promise<void> {
    await api.requestsDelete(id);
  },

  async closeRequest(id: number): Promise<void> {
    await api.requestsCompleteUpdate(id);
  },

  async getRequestFacts(id: number): Promise<Types.RequestFact[]> {
    const response = await api.requestsFactsList(id);
    const res: Types.RequestFactsResponse = response.data as any;
    return res.facts;
  },

  async createRequestFact(id: number, data: Types.CreateFactRequest): Promise<void> {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    if (data.screenshot) {
      formData.append('screenshot', data.screenshot);
    }
    await api.requestsFactsCreate(id, {
      body: formData,
      type: 'multipart/form-data',
    } as any);
  },
};
