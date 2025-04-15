import React, { useState } from "react";
import "../styles/LoginForm.css";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import TokenResponse from "../models/TokenResponse";
import axios from "axios";

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

  const handleSumbit = (e: React.FormEvent) => {
    e.preventDefault();
    
    axios
      .post("http://localhost:8080/api/admin/login", {
        login: adminEntity.Login,
        password: adminEntity.Password,
      })
      .then(function (response) {
        let tokenResponse: TokenResponse = {
          AccessToken: response.data.access_token,
          RefreshToken: response.data.refresh_token,
        };

        localStorage.setItem("access_token", tokenResponse.AccessToken);
        localStorage.setItem("refresh_token", tokenResponse.RefreshToken);

        navigate("/admin-panel");

        console.log("Success");
      })
      .catch(function () {
        setError(true);
        console.log("Error");
      });
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
    <div className="login-form">
      <form className="form" onSubmit={handleSumbit}>
        <h3 className="form-header">Вход</h3>
        <p className="label">Логин</p>
        <input
          name="Login"
          className="input"
          value={adminEntity.Login}
          onChange={handleInputChange}
        />
        <p className="label">Пароль</p>
        <div className="password-container">
          <input
            type={isPasswordVisible ? "text" : "password"}
            id="password-input"
            name="Password"
            value={adminEntity.Password}
            onChange={handleInputChange}
            className="input"
          />
          <span className="visibility-icon" onClick={togglePasswordVisibility}>
            {isPasswordVisible ? <MdVisibilityOff /> : <MdVisibility />}
          </span>
        </div>
        <button type="submit" className="button">
          Войти
        </button>

        {error ? (
          <p className="error-message">Логин или пароль неверный</p>
        ) : null}
      </form>
    </div>
  );
}

export default LoginForm;
