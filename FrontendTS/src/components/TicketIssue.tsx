import { useEffect, useState } from "react";
import User from "../models/User";
import "../models/Entry";
import "../styles/TicketIssue.css";
import { Button, Card, Form } from "react-bootstrap";
import Entry from "../models/Entry";

function TicketIssue() {
  const [user, setUser] = useState<User>({
    FirstName: "",
    LastName: "",
    PhoneNumber: "",
  });

  const [ticketData, setTicketData] = useState<Entry>({
    user_id: 0,
    admin_id: 0,
    ticketNumber: 0,
  });

  const handleSumbit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let response = await fetch("http://localhost:8080/api/user/add", {
        method: "POST",
        body: JSON.stringify({
          number_phone: user.PhoneNumber,
          first_name: user.FirstName,
          last_name: user.LastName,
        }),
        credentials: "include",
      });

      if (response.ok) {
        const ticketResponse = await fetch(
          "http://localhost:8080/api/entry/generate",
          {
            method: "POST",
            credentials: "include",
          }
        );

        if (ticketResponse.ok) {
          const entryData = await ticketResponse.json();
          console.log(entryData);

          setTicketData({
            user_id: entryData.user_id,
            admin_id: entryData.admin_id,
            ticketNumber: entryData.ticket_number,
          });

          console.log(ticketData);
        }

        console.log("Пользователь добавлен в базу данных");
      } else {
        throw new Error("Invalid value");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const getTicketInfo = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/entry/get", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setTicketData({
          user_id: data.user_id,
          admin_id: data.admin_id,
          ticketNumber: data.ticket_number,
        });
      } else {
        throw new Error("Failed to fetch ticket info");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getTicketInfo();
  }, []);

  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ minHeight: "calc(95vh - 56px - 56px)" }}
    >
      <div className="col-12 col-md-8 col-lg-3">
        {ticketData.ticketNumber === 0 ? (
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
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Фамилия</Form.Label>
                <Form.Control
                  name="LastName"
                  value={user.LastName}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Номер телефона</Form.Label>
                <Form.Control
                  type="tel"
                  name="PhoneNumber"
                  value={user.PhoneNumber}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Button type="submit" className="w-100">
                Получить талон
              </Button>
            </Form>
          </Card>
        ) : (
          <Card className="p-4 shadow">
            <Card.Title as="h4" className="text-center">
              Талон {ticketData.ticketNumber}
            </Card.Title>
          </Card>
        )}
      </div>
    </div>
  );
}

export default TicketIssue;
