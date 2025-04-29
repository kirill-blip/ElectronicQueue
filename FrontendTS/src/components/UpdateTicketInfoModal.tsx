import { Button, Form, Modal } from "react-bootstrap";
import { PhoneInput } from "react-international-phone";
import User from "../models/User";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface UpdateTicketInfoModalProps {
  show: boolean;
  initialUser: User;
  handleClose: () => void;
  setRefreshKey: React.Dispatch<React.SetStateAction<number>>;
}

function UpdateTicketInfoModal({
  show,
  initialUser,
  handleClose,
  setRefreshKey,
}: UpdateTicketInfoModalProps) {
  const { t } = useTranslation();

  const [user, setUser] = useState<User>(initialUser);
  const [errorMessage] = useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handlePhoneChange = (value: string) => {
    setUser((prevUser) => ({
      ...prevUser,
      PhoneNumber: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch("http://localhost:8080/api/user/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        number_phone: user.PhoneNumber,
        first_name: user.FirstName,
        last_name: user.LastName,
      }),
    });

    if (response.ok) {
      handleClose();
      setRefreshKey((prevKey) => prevKey + 1);
    } else {
      const data = await response.json();
      console.error(data);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{t('ticket-issue.update-client-info')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {errorMessage && <div className="text-danger mb-3">{errorMessage}</div>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>{t('login.first-name')}</Form.Label>
            <Form.Control
              type="text"
              name="FirstName"
              value={user.FirstName}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>{t('login.last-name')}</Form.Label>
            <Form.Control
              name="LastName"
              value={user.LastName}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>{t('ticket-issue.phone-number')}</Form.Label>
            <PhoneInput
              inputStyle={{ width: "100%" }}
              defaultCountry="kz"
              value={user.PhoneNumber}
              onChange={handlePhoneChange}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit">
          {t('buttons.update-client-info')}
          </Button>
          <Button variant="secondary" className="ms-2" onClick={handleClose}>
            {t('buttons.cancel-update-client-info')}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default UpdateTicketInfoModal;
