/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

import { ContentType, HttpClient, RequestParams } from "./http-client";

export class Api<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * @description Позволяет зайти за пользователя, используя его данные.
   *
   * @tags auth
   * @name AuthLoginCreate
   * @summary Зайти за пользователя
   * @request POST:/api/auth/login
   */
  authLoginCreate = (params: RequestParams = {}) =>
    this.http.request<void, void>({
      path: `/api/auth/login`,
      method: "POST",
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description Завершает текущую авторизованную сессию.
   *
   * @tags auth
   * @name AuthLogoutCreate
   * @summary Выход из системы
   * @request POST:/api/auth/logout
   * @secure
   */
  authLogoutCreate = (params: RequestParams = {}) =>
    this.http.request<void, void>({
      path: `/api/auth/logout`,
      method: "POST",
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description Позволяет зарегистрировать пользователя. Необходим вход за специалиста.
   *
   * @tags auth
   * @name AuthRegisterCreate
   * @summary Зарегистрировать пользователя
   * @request POST:/api/auth/register
   * @secure
   */
  authRegisterCreate = (params: RequestParams = {}) =>
    this.http.request<void, void>({
      path: `/api/auth/register`,
      method: "POST",
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description Возвращает список заявок. Доступно только после авторизации.
   *
   * @tags requests
   * @name RequestsList
   * @summary Получить список заявок
   * @request GET:/api/requests
   * @secure
   */
  requestsList = (
    query?: {
      /** Статус заявки */
      status?: string;
      /** Дата от (YYYY-MM-DD) */
      date_from?: string;
      /** Дата до (YYYY-MM-DD) */
      date_to?: string;
    },
    params: RequestParams = {},
  ) =>
    this.http.request<void, void>({
      path: `/api/requests`,
      method: "GET",
      query: query,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description Создает новую заявку для авторизованного пользователя.
   *
   * @tags requests
   * @name RequestsCreate
   * @summary Создать заявку
   * @request POST:/api/requests
   * @secure
   */
  requestsCreate = (params: RequestParams = {}) =>
    this.http.request<void, void>({
      path: `/api/requests`,
      method: "POST",
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description Возвращает заявку по ID. Доступно только после авторизации.
   *
   * @tags requests
   * @name RequestsDetail
   * @summary Получить заявку
   * @request GET:/api/requests/{id}
   * @secure
   */
  requestsDetail = (id: any, params: RequestParams = {}) =>
    this.http.request<void, void>({
      path: `/api/requests/${id}`,
      method: "GET",
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description Обновляет существующую заявку, если пользователь является её создателем.
   *
   * @tags requests
   * @name RequestsUpdate
   * @summary Обновить заявку
   * @request PUT:/api/requests/{id}
   * @secure
   */
  requestsUpdate = (id: any, params: RequestParams = {}) =>
    this.http.request<void, void>({
      path: `/api/requests/${id}`,
      method: "PUT",
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description Удаляет заявку, если у пользователя есть право на это.
   *
   * @tags requests
   * @name RequestsDelete
   * @summary Удалить заявку
   * @request DELETE:/api/requests/{id}
   * @secure
   */
  requestsDelete = (id: any, params: RequestParams = {}) =>
    this.http.request<void, void>({
      path: `/api/requests/${id}`,
      method: "DELETE",
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description Специалист завершает заявку со статусом closed или rejected.
   *
   * @tags requests
   * @name RequestsCompleteUpdate
   * @summary Завершить заявку
   * @request PUT:/api/requests/{id}/complete
   * @secure
   */
  requestsCompleteUpdate = (id: any, params: RequestParams = {}) =>
    this.http.request<void, void>({
      path: `/api/requests/${id}/complete`,
      method: "PUT",
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description Возвращает список фактов для заявки. Требуется авторизация.
   *
   * @tags requests
   * @name RequestsFactsList
   * @summary Получить факты заявки
   * @request GET:/api/requests/{id}/facts
   * @secure
   */
  requestsFactsList = (id: any, params: RequestParams = {}) =>
    this.http.request<void, void>({
      path: `/api/requests/${id}/facts`,
      method: "GET",
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description Создает новый факт для заявки. Требуется авторизация сотрудника.
   *
   * @tags requests
   * @name RequestsFactsCreate
   * @summary Добавить факт к заявке
   * @request POST:/api/requests/{id}/facts
   * @secure
   */
  requestsFactsCreate = (id: any, params: RequestParams = {}) =>
    this.http.request<void, void>({
      path: `/api/requests/${id}/facts`,
      method: "POST",
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description Специалист принимает заявку для обработки.
   *
   * @tags requests
   * @name RequestsSubmitUpdate
   * @summary Взять заявку в работу
   * @request PUT:/api/requests/{id}/submit
   * @secure
   */
  requestsSubmitUpdate = (id: any, params: RequestParams = {}) =>
    this.http.request<void, void>({
      path: `/api/requests/${id}/submit`,
      method: "PUT",
      secure: true,
      type: ContentType.Json,
      ...params,
    });
}
