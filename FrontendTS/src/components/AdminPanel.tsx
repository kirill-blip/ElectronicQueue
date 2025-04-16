import "../styles/AdminPanel.css";
import axios from "axios";
import { useState } from "react";
import { AdminInfo } from "../models/Admin";
import { useNavigate } from "react-router-dom";
import { Alert, Button, Card, Container } from "react-bootstrap";
import User from "../models/User";

async function refreshToken(): Promise<boolean> {
  try {
    const response = await fetch("/api/refresh", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("refreshToken")}`,
      },
    });

    if (response.ok) {
      const data: { access_token: string; refresh_token: string } =
        await response.json();

      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);

      return true;
    }

    return false;
  } catch (error) {
    console.error("Error refreshing token:", error);
    return false;
  }
}

function AdminPanel() {
  const [admin, setAdmin] = useState<AdminInfo>({
    FirstName: "",
    LastName: "",
    TableNumber: 0,
  });

  const [client, setUser] = useState<User>({
    FirstName: "Кирилл",
    LastName: "Голубенко",
    PhoneNumber: "+79879267442",
  });

  const [hasClient, setHasClient] = useState<boolean>(false);
  const [noClient, setNoClient] = useState<boolean>(false);

  const navigate = useNavigate();

  const getAdmin = () => {
    axios
      .get("http://localhost:8080/api/admin/get", {
        withCredentials: true,
      })
      .then(function (response) {
        setAdmin({
          FirstName: response.data.first_name,
          LastName: response.data.last_name,
          TableNumber: response.data.table_number,
        });
      })
      .catch(function (error) {
        if (error.response.status == 401) {
          refreshToken().then((success) => {
            if (success) {
              getAdmin();
            } else {
              navigate("/login");
            }
          });
        }
      });
  };

  getAdmin();

  const handleCallClient = () => {
    if (!noClient) {
      setHasClient(true);
    } else {
      setHasClient(false);
    }
  };

  const handleAcceptClient = () => {
    setHasClient(false);
  };

  const handleRejectClient = () => {
    setHasClient(false);
  };

  return (
    <div>
      <Container>
        <div className="row">
          <div className="col-8 mt-2">
            {hasClient ? (
              <Container>
                <Card>
                  <Card.Header as="h5">Информация о клиенте</Card.Header>
                  <Card.Body>
                    <Card.Text className="mb-0">
                      Имя клиента: {client.FirstName} {client.LastName}
                    </Card.Text>
                    <Card.Text>Номер телефона: {client.PhoneNumber}</Card.Text>

                    <Button
                      className="primary me-2"
                      onClick={handleRejectClient}
                    >
                      Отклонить
                    </Button>
                    <Button
                      className="primary me-2"
                      onClick={handleAcceptClient}
                    >
                      Принять
                    </Button>
                  </Card.Body>
                </Card>
              </Container>
            ) : (
              <Container className="mt-2">
                <Button className="primary me-2" onClick={handleCallClient}>
                  Вызвать клиента
                </Button>

                {noClient && (
                  <Alert variant="info" className="mt-2">
                    Клиентов больше нет
                  </Alert>
                )}
              </Container>
            )}
          </div>
          <div className="col-4 mt-2">
            <Container>
              <Card>
                <Card.Header as="h5">Информация о администраторе</Card.Header>
                <Card.Body>
                  <Card.Text as="h5">Имя: Кирилл Голубенко</Card.Text>
                  <Card.Text as="h5">Стол номер: 2</Card.Text>
                  <Button
                    variant="danger"
                    className="mt-2"
                    onClick={() => navigate("/login")}
                  >
                    Выйти
                  </Button>
                </Card.Body>
              </Card>

              <Card className="mt-2">
                <Card.Header as="h5">Функции</Card.Header>
                <Card.Body>
                  <Button style={{ width: "100%" }} variant="primary">
                    Добавить администратора
                  </Button>
                  <Button
                    style={{ width: "100%" }}
                    variant="primary"
                    className="mt-2"
                  >
                    Количество клиентов
                  </Button>
                </Card.Body>
              </Card>
            </Container>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default AdminPanel;
