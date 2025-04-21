import React, { useState } from "react";
import "../styles/LoginForm.css";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import { Alert, Button, Card } from "react-bootstrap";
import PasswordForm from "../components/PasswordForm";

type AdminEntity = {
  Login: string;
  Password: string;
};

function LoginPage() {
  const [adminEntity, setAdminEntity] = useState<AdminEntity>({
    Login: "",
    Password: "",
  });

  const [error, setError] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleSumbit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/api/admin/login", {
        method: "POST",
        body: JSON.stringify({
          login: adminEntity.Login,
          password: adminEntity.Password,
        }),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      } else {
        navigate("/admin-panel");
      }

    } catch (error) {
      setError(true);
      console.error("Error during login:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (error) {
      setError(false);
    }

    const { name, value } = e.target;
    setAdminEntity((prevAdminEntity) => ({
      ...prevAdminEntity,
      [name]: value,
    }));
  };

  async function getData() {
    try {
      const response = await fetch("http://localhost:8080/api/admin/get", {
        method: "GET",
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error(response.statusText);
      }

      navigate("/admin-panel");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  getData();

  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ minHeight: "calc(95vh - 56px - 56px)" }}
    >
      <div className="col-12 col-md-8 col-lg-4">
        <Card className="p-4 shadow">
          <Form onSubmit={handleSumbit}>
            <Form.Group className="mb-3">
              <Form.Label>Логин</Form.Label>
              <Form.Control
                type="text"
                name="Login"
                value={adminEntity.Login}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Пароль</Form.Label>
              <PasswordForm handleInputChange={handleInputChange} password={adminEntity.Password} />
            </Form.Group>
            <Button type="submit" className="w-100">
              Войти
            </Button>
          </Form>
          {error && (
            <Alert variant="danger" className="mt-3">
              Неверный логин или пароль
            </Alert>
          )}
        </Card>
      </div>
    </div>
  );
}

export default LoginPage;
