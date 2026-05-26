import { useMemo, useState } from "react";
import { Badge, Button, Card, Col, Form, Row, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { requestsController } from "../api/http-controller";
import { RequestItem } from "../types";
import { mockRequests } from "../mock/mockData";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setQuery } from "../store/filters";

export const SpecialistPage = () => {
  const navigate = useNavigate();

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ["requests"],
    queryFn: async (): Promise<any[]> => {
      try {
        return await requestsController.fetchRequests();
      } catch (error) {
        console.error("Failed to fetch requests, using mock data:", error);
        return mockRequests;
      }
    },
    staleTime: 120000,
  });

  const requests_data = useMemo(() => {
    return (requests || [])
      .filter((data): data is RequestItem => data != null)
      .filter(
        (data) =>
          data.status !== "draft" &&
          data.status !== "closed" &&
          data.status !== "rejected",
      );
  }, [requests]);

  const dispatch = useAppDispatch();

  const querySet = useAppSelector((state) => state.filters.query);

  const filteredRequests = useMemo(() => {
    if (!requests_data || requests_data.length === 0) {
      return [];
    }

    const searchQuery = querySet.toLowerCase();

    return requests_data.filter((item) => {
      const title = item.title ?? "";
      const description = item.description ?? "";

      return (
        title.toLowerCase().includes(searchQuery) ||
        description.toLowerCase().includes(searchQuery)
      );
    });
  }, [requests_data, querySet]);

  return (
    <Row>
      <Col>
        <Card className="p-4 mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h2>Панель специалиста</h2>
            </div>
          </div>
          <Form.Group className="mb-3" controlId="searchRequestsSpecialist">
            <Form.Label>Поиск по заявкам</Form.Label>
            <Form.Control
              placeholder="Название или описание"
              value={querySet}
              onChange={(event) => dispatch(setQuery(event.target.value))}
            />
          </Form.Group>
          {isLoading ? (
            <div className="text-center py-5">
              <Spinner animation="border" />
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="no-results">
              Нет открытых заявок для отображения.
            </div>
          ) : (
            <Row>
              {filteredRequests.map((item) => (
                <Col key={item.id} md={6} lg={4} className="mb-4">
                  <Card className="h-100">
                    <Card.Body>
                      <Card.Title>{item.title}</Card.Title>
                      <Card.Text>
                        <Badge
                          bg={
                            item.status === "draft"
                              ? "secondary"
                              : item.status === "awaiting"
                                ? "warning"
                                : item.status === "taken"
                                  ? "info"
                                  : "success"
                          }
                        >
                          {item.status === "draft"
                            ? "Черновик"
                            : item.status === "awaiting"
                              ? "Ожидает"
                              : item.status === "taken"
                                ? "Принята"
                                : "Закрыта"}
                        </Badge>
                      </Card.Text>
                      <Card.Text className="text-muted">
                        <strong>Тип:</strong>{" "}
                        {item.threat_type?.name || "Не указано"}
                      </Card.Text>
                      <Card.Text className="text-muted">
                        <strong>Дата:</strong> {item.created_at.slice(0, 10)}
                      </Card.Text>
                      <Card.Text className="text-muted">
                        <strong>Описание:</strong>{" "}
                        {item.description || "Не указано"}
                      </Card.Text>
                      <Button
                        variant="outline-primary"
                        onClick={() => navigate(`/request/${item.id}`)}
                      >
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
  );
};
