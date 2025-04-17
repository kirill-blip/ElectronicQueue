import { useState } from "react";
import User from "../models/User";
import "../models/Entry";
import "../styles/TicketIssue.css";
import { Alert, Button, Card, Form } from "react-bootstrap";
import InputMask from "react-input-mask-next";

function TicketIssue() {
  const [user, setUser] = useState<User>({
    FirstName: "",
    LastName: "",
    PhoneNumber: "",
  });

  const handleSumbit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/api/user/add", {
        method: "POST",
        body: JSON.stringify({
          number_phone: user.PhoneNumber,
          first_name: user.FirstName,
          last_name: user.LastName,
        }),
        credentials: "include",
      });

      if (response.ok) {
        console.log("Пользователь добавлен в базу данных");
      }
    } catch (error) {}

    console.log(
      `First Name: ${user.FirstName}\nLast Name: ${user.LastName}\nPhone Number: ${user.PhoneNumber}`
    );
  };

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, "");

    const match = cleaned.match(/^(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})$/);
    if (match) {
      return `+${match[1]} (${match[2]}) ${match[3]}-${match[4]}-${match[5]}`;
    }

    return cleaned;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: name === "PhoneNumber" ? formatPhoneNumber(value) : value,
    }));
  };

  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ minHeight: "calc(95vh - 56px - 56px)" }}
    >
      <div className="col-12 col-md-8 col-lg-3">
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
      </div>
    </div>
  );
}

export default TicketIssue;
