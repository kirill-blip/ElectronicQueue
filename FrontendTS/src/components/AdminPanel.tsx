import axios from "axios";
import { useState } from "react";
import { AdminInfo } from "../models/Admin";
import { useNavigate } from "react-router-dom";

async function refreshToken(): Promise<boolean> {
  try {
    const response = await fetch("/api/refresh", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("refreshToken")}`,
      },
    });

    if (response.ok) {
      const data: { access_token: string; refresh_token: string } =
        await response.json();

      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);

      return true;
    }

    return false;
  } catch (error) {
    console.error("Error refreshing token:", error);
    return false;
  }
}

function AdminPanel() {
  const [admin, setAdmin] = useState<AdminInfo>({
    FirstName: "",
    LastName: "",
    TableNumber: 0,
  });

  const navigate = useNavigate()

  const getAdmin = () => {
    axios
      .get("http://localhost:8080/api/admin/get", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })
      .then(function (response) {
        setAdmin({
          FirstName: response.data.first_name,
          LastName: response.data.last_name,
          TableNumber: response.data.table_number,
        });
      })
      .catch(function (error) {
        if (error.response.status == 401) {
          refreshToken().then((success) => {
            if (success) {
              getAdmin()
            } else {
              navigate("/login")
            }
          });
        }
      });
  };

  getAdmin();

  return (
    <div>
      <h1>Панель администратора</h1>
      <p>
        Добро пожаловать, {admin.FirstName} {admin.LastName}! Ваш номер стола:{" "}
        {admin.TableNumber}
      </p>
      <button>Logout</button>
    </div>
  );
}

export default AdminPanel;
