import React, { useState } from "react";
import "../styles/LoginForm.css";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import TokenResponse from "../models/TokenResponse";
import axios from "axios";
import Form from "react-bootstrap/Form";
import { Alert, Button, Card } from "react-bootstrap";
import { Cookies } from "react-cookie";

type AdminEntity = {
  Login: string;
  Password: string;
};

function LoginForm() {
  const [adminEntity, setAdminEntity] = useState<AdminEntity>({
    Login: "",
    Password: "",
  });

  const [error, setError] = useState<boolean>(false);

  const navigate = useNavigate();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

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

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
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
              <div className="password-container">
                <Form.Control
                  type={isPasswordVisible ? "text" : "password"}
                  id="password-input"
                  name="Password"
                  value={adminEntity.Password}
                  onChange={handleInputChange}
                />
                <span
                  className="visibility-icon"
                  onClick={togglePasswordVisibility}
                >
                  {isPasswordVisible ? <MdVisibilityOff /> : <MdVisibility />}
                </span>
              </div>
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

export default LoginForm;
