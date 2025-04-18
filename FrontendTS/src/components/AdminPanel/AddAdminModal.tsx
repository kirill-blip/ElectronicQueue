import { Button, Form, Modal } from "react-bootstrap";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import PasswordForm from "../PasswordForm";
import { useState } from "react";
import { Admin } from "../../models/Admin";

interface AddAdminModalProps {
  show: boolean;
  onHide: () => void;
}

function AddAdminModal({ show, onHide }: AddAdminModalProps) {
  const [admin, setAdmin] = useState<Admin>({
    FirstName: "",
    LastName: "",
    Login: "",
    Password: "",
    TableNumber: 0,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAdmin((prevAdminEntity) => ({
      ...prevAdminEntity,
      [name]: value,
    }));
  };

  const handleSumbit = async () => {
    console.log(admin);
    try {
      const response = await fetch(
        "http://localhost:8080/api/admin-registration",
        {
          method: "POST",
          body: JSON.stringify({
            first_name: admin.FirstName,
            last_name: admin.LastName,
            login: admin.Login,
            password: admin.Password,
            table_number: 2,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(response.statusText);
      } else {
        onHide();
      }
    } catch (error) {}
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Добавление администратора</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Имя</Form.Label>
            <Form.Control
              type="text"
              name="FirstName"
              placeholder="Имя"
              value={admin.FirstName}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Фамилия</Form.Label>
            <Form.Control
              type="text"
              name="LastName"
              placeholder="Фамилия"
              value={admin.LastName}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Логин</Form.Label>
            <Form.Control
              type="text"
              name="Login"
              placeholder="Логин"
              value={admin.Login}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Пароль</Form.Label>
            <PasswordForm
              handleInputChange={handleInputChange}
              password={admin.Password}
            />
          </Form.Group>
        </Form>
        {/* <Alert variant="danger" className="mt-3">
          Неверный логин или пароль
        </Alert> */}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Закрыть
        </Button>
        <Button variant="primary" onClick={handleSumbit}>
          Добавить
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AddAdminModal;
