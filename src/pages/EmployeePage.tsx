import { FormEvent, useState } from "react";
import { Alert, Button, Card, Col, Form, Row } from "react-bootstrap";
import { requestsController } from "../api/http-controller";
import { useNavigate } from "react-router-dom";
import { queryClient } from "../main";

const categories = [
  { id: 1, name: "Программное обеспечение" },
  { id: 2, name: "Аппаратное обеспечение" },
  { id: 3, name: "Сетевая инфраструктура" },
];

const threatTypes = [
  { id: 1, categoryId: 1, name: "Сбой приложения" },
  { id: 2, categoryId: 1, name: "Зависание приложения" },
  { id: 3, categoryId: 1, name: "Некорректная работа приложения" },
  { id: 4, categoryId: 1, name: "Ошибка запуска приложения" },
  {
    id: 5,
    categoryId: 1,
    name: "Подозрительная активность программного обеспечения",
  },
  { id: 6, categoryId: 2, name: "Перегрев оборудования" },
  { id: 7, categoryId: 2, name: "Отказ периферийного устройства" },
  { id: 8, categoryId: 2, name: "Посторонний шум оборудования" },
  { id: 9, categoryId: 2, name: "Отсутствие изображения" },
  { id: 10, categoryId: 2, name: "Неисправность рабочего места" },
  { id: 11, categoryId: 3, name: "Отсутствие доступа к сети" },
  { id: 12, categoryId: 3, name: "Недоступность корпоративного сервиса" },
  { id: 13, categoryId: 3, name: "Низкая скорость передачи данных" },
  { id: 14, categoryId: 3, name: "Потеря сетевого ресурса" },
  { id: 15, categoryId: 3, name: "Подозрительная сетевая активность" },
];

export const EmployeePage = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [threatTypeId, setThreatTypeId] = useState(1);
  const [categoryId, setCategoryId] = useState(1);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const filteredThreatTypes = threatTypes.filter(
    (type) => type.categoryId === categoryId,
  );

  const handleCategoryChange = (newCategoryId: number) => {
    setCategoryId(newCategoryId);

    const firstThreatType = threatTypes.find(
      (type) => type.categoryId === newCategoryId,
    );

    if (firstThreatType) {
      setThreatTypeId(firstThreatType.id);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const result: any = await requestsController.createRequest({
        title,
        description,
        threat_type_id: threatTypeId,
      });
      setSuccess("Заявка успешно создана. Перейдите в раздел «Мои заявки».");
      setTitle("");
      setDescription("");
      setThreatTypeId(1);
      console.log(result);
      queryClient.invalidateQueries({
        queryKey: ["requests"],
      });
      navigate(`/request/${result.request.id}`);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Row>
      <Col>
        <Card className="p-4 mb-4">
          <h2>Создание заявки</h2>
          <p className="text-muted">
            Сотрудник сразу видит форму для создания новой заявки.
          </p>
          {success && <Alert variant="success">{success}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="requestTitle">
              <Form.Label>Название заявки</Form.Label>
              <Form.Control
                value={title}
                required
                onChange={(event) => setTitle(event.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="requestDescription">
              <Form.Label>Описание угрозы</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={description}
                required
                onChange={(event) => setDescription(event.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="requestCategory">
              <Form.Label>Категория угрозы</Form.Label>
              <Form.Select
                value={categoryId}
                onChange={(event) =>
                  handleCategoryChange(Number(event.target.value))
                }
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="requestThreatType">
              <Form.Label>Тип угрозы</Form.Label>
              <Form.Select
                value={threatTypeId}
                onChange={(event) =>
                  setThreatTypeId(Number(event.target.value))
                }
              >
                {filteredThreatTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <div className="d-flex gap-2">
              <Button type="submit" disabled={loading}>
                {loading ? "Сохраняем..." : "Создать заявку"}
              </Button>
            </div>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};
