import { Alert, Button, Card, Form } from "react-bootstrap";
import User from "../models/User";
import { PhoneInput } from "react-international-phone";

interface TicketIssueFormProps {
  user: User;
  errorMessage: string;
  handleSumbit: (e: React.FormEvent) => Promise<void>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handlePhoneChange: (value: string) => void
}

function TicketIssueForm({ user, errorMessage, handleSumbit, handleInputChange, handlePhoneChange }: TicketIssueFormProps) {
  return (
    <div className="col-12 col-md-8 col-lg-4">
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
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Фамилия</Form.Label>
            <Form.Control
              name="LastName"
              value={user.LastName}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Номер телефона</Form.Label>
            <PhoneInput
              inputStyle={{ width: "100%" }}
              defaultCountry="kz"
              value={user.PhoneNumber}
              onChange={handlePhoneChange}
              required
            />
          </Form.Group>
          <Button type="submit" className="w-100">
            Получить талон
          </Button>

          {errorMessage !== "" && (
            <Alert variant="danger" className="mt-3">
              {errorMessage}
            </Alert>
          )}
        </Form>
      </Card>
    </div>
  );
}

export default TicketIssueForm;
