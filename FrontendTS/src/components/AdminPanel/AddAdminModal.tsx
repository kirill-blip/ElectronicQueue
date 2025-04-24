import { Alert, Button, Form, Modal } from "react-bootstrap";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import PasswordForm from "../PasswordForm";
import { useState } from "react";
import { Admin } from "../../models/Admin";
import { useTranslation } from "react-i18next";

interface AddAdminModalProps {
  show: boolean;
  onHide: () => void;
}

function AddAdminModal({ show, onHide }: AddAdminModalProps) {
  const [errorMessage, setErrorMessage] = useState<string>("");

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
        const errorText = await response.json();

        if (errorText.error === "login already exist") {
          setErrorMessage(t("errors.login-error"));
        }

        if (errorText.error === "table already exist") {
          setErrorMessage(t("errors.table-number-error"));
        }

        if (errorText.error === "first name isn't valid") {
          setErrorMessage(t("errors.first-name-error"));
        }

        if (errorText.error === "last name isn't valid") {
          setErrorMessage(t("errors.last-name-error"));
        }
      } else {
        onHide();
      }
    } catch (error) {}
  };

  const { t } = useTranslation();

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{t("admin-panel.add-admin")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>{t("login.first-name")}</Form.Label>
            <Form.Control
              type="text"
              name="FirstName"
              placeholder={t("login.first-name")}
              value={admin.FirstName}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>{t("login.first-name")}</Form.Label>
            <Form.Control
              type="text"
              name="LastName"
              placeholder={t("login.last-name")}
              value={admin.LastName}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>{t("login.login")}</Form.Label>
            <Form.Control
              type="text"
              name="Login"
              placeholder={t("login.login")}
              value={admin.Login}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>{t("login.password")}</Form.Label>
            <PasswordForm
              handleInputChange={handleInputChange}
              password={admin.Password}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>{t("login.table-number")}</Form.Label>
            <Form.Control
              type="number"
              name="TableNumber"
              placeholder={t("login.table-number")}
              value={admin.TableNumber}
              onChange={handleInputChange}
            />
          </Form.Group>
        </Form>
        {errorMessage !== "" && (
          <Alert variant="danger" className="mt-3">
            {errorMessage}
          </Alert>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          {t("buttons.close")}
        </Button>
        <Button variant="primary" onClick={handleSumbit}>
          {t("buttons.add")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AddAdminModal;
