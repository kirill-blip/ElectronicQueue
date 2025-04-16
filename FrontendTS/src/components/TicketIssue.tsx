import { useState } from "react";
import User from "../models/User";
import "../models/Entry";
import "../styles/TicketIssue.css";
import axios from "axios";
import { Alert, Button, Card, Form } from "react-bootstrap";

function TicketIssue() {
  const [user, setUser] = useState<User>({
    FirstName: "",
    LastName: "",
    PhoneNumber: "",
  });

  const handleSumbit = (e: React.FormEvent) => {
    e.preventDefault();

    axios({
      method: "POST",
      url: "http://localhost:8080/api/ticket-issue",
      data: {
        firstName: user.FirstName,
        lastName: user.LastName,
        phoneNumber: user.PhoneNumber,
      },
    });

    console.log(
      `First Name: ${user.FirstName}\nLast Name: ${user.LastName}\nPhone Number: ${user.PhoneNumber}`
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ minHeight: "calc(95vh - 56px - 56px)" }}
    >
      <div className="col-12 col-md-8 col-lg-3">
        <Card className="p-4 shadow">
          <Card.Title as="h4" className="text-center">Получение талона</Card.Title>
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
      </div>
    </div>
  );
}

export default TicketIssue;
