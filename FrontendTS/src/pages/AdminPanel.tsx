import "../styles/AdminPanel.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Container } from "react-bootstrap";
import User from "../models/User";
import Unauthorized from "../components/Unauthorized";
import Loading from "../components/Loading";
import CallClientPanel from "../components/AdminPanel/CallClientPanel";
import AddAdminModal from "../components/AdminPanel/AddAdminModal";
import CountEntriesModal from "../components/AdminPanel/CountEntriesModal";
import { useLogout } from "../hooks/useLogout";
import { useAdmin } from "../hooks/useGetAdmin";

function AdminPanel() {
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [showCountEntriesModal, setShowCountEntriesModal] = useState(false);

  const { admin, error, loading } = useAdmin();

  const handleCloseAdminModal = () => setShowAddAdminModal(false);
  const handleShowAdminModal = () => setShowAddAdminModal(true);

  const handleCloseCountEntriesModal = () => setShowCountEntriesModal(false);
  const handleShowCountEntriesModal = () => setShowCountEntriesModal(true);

  const [isAuth, setIsAuth] = useState<boolean>(false);

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

  const handleLogout = useLogout();

  if (loading) {
    return <Loading />;
  }

  if (admin.FirstName !== "" && !isAuth) {
    setIsAuth(true);
  }

  return (
    <div>
      {!isAuth ? (
        <Unauthorized
          handler={() => {
            navigate("/login");
          }}
        />
      ) : (
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
                      <Card.Text>
                        Номер телефона: {client.PhoneNumber}
                      </Card.Text>

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
                <CallClientPanel
                  noClient={noClient}
                  handleCallClient={handleCallClient}
                />
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
                      onClick={handleLogout}
                    >
                      Выйти
                    </Button>
                  </Card.Body>
                </Card>

                <Card className="mt-2">
                  <Card.Header as="h5">Функции</Card.Header>
                  <Card.Body>
                    <Button
                      style={{ width: "100%" }}
                      variant="primary"
                      onClick={handleShowAdminModal}
                    >
                      Добавить администратора
                    </Button>
                    <Button
                      style={{ width: "100%" }}
                      variant="primary"
                      className="mt-2"
                      onClick={handleShowCountEntriesModal}
                    >
                      Количество клиентов
                    </Button>
                  </Card.Body>
                </Card>
              </Container>
            </div>
          </div>

          <AddAdminModal
            show={showAddAdminModal}
            onHide={handleCloseAdminModal}
          />
          <CountEntriesModal
            show={showCountEntriesModal}
            handleClose={handleCloseCountEntriesModal}
          />
        </Container>
      )}
    </div>
  );
}

export default AdminPanel;
