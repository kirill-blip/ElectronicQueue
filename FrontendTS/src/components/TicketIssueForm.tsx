import { Alert, Button, Card, Form } from "react-bootstrap";
import User from "../models/User";
import { PhoneInput } from "react-international-phone";
import { useTranslation } from "react-i18next";

export interface TicketIssueFormProps {
  user: User;
  errorMessage: string;
  handleSumbit: (e: React.FormEvent) => Promise<void>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePhoneChange: (value: string) => void;
}

function TicketIssueForm({
  user,
  errorMessage,
  handleSumbit,
  handleInputChange,
  handlePhoneChange,
}: TicketIssueFormProps) {
  const { t } = useTranslation();

  return (
    <div className="col-12 col-md-8 col-lg-4">
      <Card className="p-3 shadow-sm">
        <Card.Title as="h5" className="text-center">
          {t("ticket-issue.getting-ticket")}
        </Card.Title>
        <Form onSubmit={handleSumbit}>
          <Form.Group className="mb-2">
            <Form.Label className="small">{t("login.first-name")}</Form.Label>
            <Form.Control
              type="text"
              name="FirstName"
              value={user.FirstName}
              onChange={handleInputChange}
              required
              size="sm"
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label className="small">{t("login.last-name")}</Form.Label>
            <Form.Control
              name="LastName"
              value={user.LastName}
              onChange={handleInputChange}
              required
              size="sm"
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label className="small">
              {t("ticket-issue.phone-number")}
            </Form.Label>
            <PhoneInput
              inputStyle={{ width: "100%", fontSize: "0.875rem" }}
              defaultCountry="kz"
              value={user.PhoneNumber}
              onChange={handlePhoneChange}
              required
            />
          </Form.Group>
          <Button type="submit" className="w-100 btn-sm">
            {t("buttons.get-ticket")}
          </Button>

          {errorMessage !== "" && (
            <Alert variant="danger" className="mt-2 small">
              {errorMessage}
            </Alert>
          )}
        </Form>
      </Card>
    </div>
  );
}

export default TicketIssueForm;
