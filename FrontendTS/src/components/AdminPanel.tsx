import "../styles/AdminPanel.css";
import { useEffect, useState } from "react";
import { AdminInfo } from "../models/Admin";
import { useNavigate } from "react-router-dom";
import { Alert, Button, Card, Container } from "react-bootstrap";
import User from "../models/User";

async function getAdmin(): Promise<AdminInfo> {
  let admin: AdminInfo = {
    FirstName: "",
    LastName: "",
    TableNumber: 0,
  };

  try {
    const response = await fetch("http://localhost:8080/api/admin/get", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (response.ok) {
      const json = await response.json();
      admin = {
        FirstName: json.first_name,
        LastName: json.last_name,
        TableNumber: json.table_number,
      };
    } else if (response.status === 401) {
      throw new Error("Unauthorized");
    }
  } catch (error) {}

  return admin;
}

function AdminPanel() {
  const [admin, setAdmin] = useState<AdminInfo>();

  const [client, setUser] = useState<User>({
    FirstName: "Кирилл",
    LastName: "Голубенко",
    PhoneNumber: "+79879267442",
  });

  const [hasClient, setHasClient] = useState<boolean>(false);
  const [noClient, setNoClient] = useState<boolean>(false);

  const navigate = useNavigate();

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

  const handleLogOut =async () => {
    try {
      const response = await fetch("http://localhost:8080/api/admin/logout", {
        method: "POST",
        credentials: "include",
      });
      
      if (response.ok) {
        const json = await response.json();
        console.log(json);
        navigate("/login");
      } else if (response.status === 401) {
        throw new Error("Unauthorized");
      }
    } catch (error) {}
  }

  useEffect(() => {
    if (!admin) {
      getAdmin().then((result) => {
        setAdmin(result);
      });
    }
  }, []);

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
                  <Card.Text as="h5">
                    Имя: {admin?.FirstName} {admin?.LastName}
                  </Card.Text>
                  <Card.Text as="h5">
                    Стол номер: {admin?.TableNumber}
                  </Card.Text>
                  <Button
                    variant="danger"
                    className="mt-2"
                    onClick={handleLogOut}
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
