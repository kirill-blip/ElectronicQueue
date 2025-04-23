import "../styles/AdminPanel.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Container } from "react-bootstrap";
import Unauthorized from "../components/Unauthorized";
import Loading from "../components/Loading";
import CallClientPanel from "../components/AdminPanel/CallClientPanel";
import AddAdminModal from "../components/AdminPanel/AddAdminModal";
import CountEntriesModal from "../components/AdminPanel/CountEntriesModal";
import { useLogout } from "../hooks/useLogout";
import { useAdmin } from "../hooks/useGetAdmin";
import { EntryInfo } from "../models/Entry";
import { convertTicketNumber } from "../utils/converters";

function AdminPanel() {
  const [refreshKey, setRefreshKey] = useState(0);

  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [showCountEntriesModal, setShowCountEntriesModal] = useState(false);

  const { admin, error, loading } = useAdmin();

  const handleCloseAdminModal = () => setShowAddAdminModal(false);
  const handleShowAdminModal = () => {
    setRefreshKey((prevKey) => prevKey + 1);
    setShowAddAdminModal(true);
  };

  const handleCloseCountEntriesModal = () => setShowCountEntriesModal(false);
  const handleShowCountEntriesModal = () => setShowCountEntriesModal(true);

  const [isAuth, setIsAuth] = useState<boolean>(false);

  const [entry, setUser] = useState<EntryInfo>({
    EntryId: 0,
    UserId: 0,
    User: {
      FirstName: "",
      LastName: "",
      PhoneNumber: "",
    },
  });

  const [hasClient, setHasClient] = useState<boolean>(false);
  const [noClient, setNoClient] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleCallClient = async () => {
    const response = await fetch("http://localhost:8080/api/entry/get-entry", {
      method: "GET",
      credentials: "include",
    });

    if (response.ok) {
      const data = await response.json();
      setUser({
        EntryId: data.entry_id,
        UserId: data.user_id,
        User: {
          FirstName: data.first_name,
          LastName: data.last_name,
          PhoneNumber: data.number_phone,
        },
      });

      localStorage.setItem("Entry", JSON.stringify(data));

      setHasClient(true);
    } else {
      const errorData = await response.json();
      console.error("Error fetching entry data:", errorData);
      setNoClient(true);
    }
  };

  const handleAcceptClient = async () => {
    localStorage.removeItem("Entry");

    const status = 'accept';

    console.log(status)
    console.log(entry.EntryId);

    const response = await fetch(`http://localhost:8080/api/entry/${status}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        entry_id: entry.EntryId,
      }),
      credentials: "include"
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Client accepted:", data);
      setHasClient(false);
    } else {
      const errorData = await response.json();
      console.error("Error accepting client:", errorData);
    }
  };

  const handleRejectClient = () => {
    localStorage.removeItem("Entry");
    setHasClient(false);
  };

  const handleLogout = useLogout();

  if (loading) {
    return <Loading />;
  }

  if (admin.FirstName !== "" && !isAuth) {
    setIsAuth(true);
  }

  if (localStorage.getItem("Entry") !== null && !hasClient) {
    const entryData = localStorage.getItem("Entry");

    if (entryData) {
      const data = JSON.parse(entryData);
      setUser({
        EntryId: data.entry_id,
        UserId: data.user_id,
        User: {
          FirstName: data.first_name,
          LastName: data.last_name,
          PhoneNumber: data.number_phone,
        },
      });
      setHasClient(true);
    }
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
                        <strong>Талон №{convertTicketNumber(entry.EntryId)}</strong>
                      </Card.Text>
                      <Card.Text className="mb-0">
                        Имя клиента: {entry.User.FirstName}{" "}
                        {entry.User.LastName}
                      </Card.Text>
                      <Card.Text>
                        Номер телефона: {entry.User.PhoneNumber}
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
            refreshedCount={refreshKey}
          />
        </Container>
      )}
    </div>
  );
}

export default AdminPanel;
