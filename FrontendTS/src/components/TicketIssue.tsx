import { useEffect, useState } from "react";
import User from "../models/User";
import "../models/Entry";
import "../styles/TicketIssue.css";
import { Alert, Button, Card, Form } from "react-bootstrap";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { useGetTicketInfo } from "../hooks/useGetTicketInfo";
import { useTicketIssue } from "../hooks/useTicketIssue";
import Loading from "./Loading";

function TicketIssue() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  function convertTicketNumber(ticketNumber: number): string {
    const ticketString = ticketNumber.toString().padStart(3, "0");
    console.log(ticketNumber);
    return ticketString;
  }

  const [user, setUser] = useState<User>({
    FirstName: "",
    LastName: "",
    PhoneNumber: "",
  });

  const {
    ticketData: fetchedTicketData,
    user: fetchedUser,
    admin: fetchedAdmin,
  } = useGetTicketInfo(refreshKey);

  useEffect(() => {
    setIsLoading(true);
    const timeout = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timeout);
  }, [refreshKey]);

  const [errorMessage, setErrorMessage] = useState<string>("");

  const issueTicket = useTicketIssue();

  const handleSumbit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await issueTicket(user, setErrorMessage);
      setRefreshKey((prevKey) => prevKey + 1);
    } catch (error) {
      console.error("Error while issuing ticket:", error);
      setErrorMessage("Произошла ошибка при получении талона.");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));

    setErrorMessage("");
  };

  const handlePhoneChange = (value: string) => {
    setUser((prevUser) => ({
      ...prevUser,
      PhoneNumber: value,
    }));
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ minHeight: "calc(95vh - 56px - 56px)" }}
    >
      {fetchedTicketData.TicketNumber === 0 ? (
        <div className="col-12 col-md-8 col-lg-4">
          <Card className="p-4 shadow">
            <Card.Title as="h4" className="text-center">
              Получение талона
            </Card.Title>
            <Form onSubmit={handleSumbit}>
              <Form.Group className="mb-3">
                <Form.Label>Имя</Form.Label>
                <Form.Control
                  type="text"
                  name="FirstName"
                  value={user.FirstName}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Фамилия</Form.Label>
                <Form.Control
                  name="LastName"
                  value={user.LastName}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Номер телефона</Form.Label>
                <PhoneInput
                  inputStyle={{ width: "100%" }}
                  defaultCountry="kz"
                  value={user.PhoneNumber}
                  onChange={handlePhoneChange}
                  required
                />
              </Form.Group>
              <Button type="submit" className="w-100">
                Получить талон
              </Button>

              {errorMessage !== "" && (
                <Alert variant="danger" className="mt-3">
                  {errorMessage}
                </Alert>
              )}
            </Form>
          </Card>
        </div>
      ) : (
        <div className="col-12 col-md-8 col-lg-5">
          <Card className="p-3 shadow">
            <Card.Title as="h4" className="text-center">
              <strong>
                Талон №{convertTicketNumber(fetchedTicketData.TicketNumber)}
              </strong>
            </Card.Title>
            <Card.Body>
              <Card.Text>
                <strong>Имя:</strong> {fetchedUser.FirstName || user.FirstName}{" "}
                {fetchedUser.LastName || user.LastName}
              </Card.Text>
              <Card.Text>
                <strong>Номер телефона:</strong>{" "}
                {fetchedUser.PhoneNumber || user.PhoneNumber}
              </Card.Text>

              {fetchedAdmin.TableNumber !== 0 ? (
                <Alert variant="info" className="mt-0">
                  Пожалуйста, подойдите к{" "}
                  <strong>столику {fetchedAdmin.TableNumber}</strong>.
                </Alert>
              ) : (
                <div>
                  <Button variant="danger">Удалить талон</Button>
                  <Button variant="warning ms-2">Обновить талон</Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </div>
      )}
    </div>
  );
}

export default TicketIssue;
