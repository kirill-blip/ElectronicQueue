import { Button, Container } from "react-bootstrap";
import { useTranslation } from "react-i18next";

interface UnauthorizedProps {
  handler: () => void;
}

function Unauthorized({ handler }: UnauthorizedProps) {
  const { t } = useTranslation();

  return (
    <Container
      className="d-flex flex-column justify-content-center align-items-center text-center"
      style={{ minHeight: "calc(95vh - 56px - 56px)" }}
    >
      <h2 className="text-4xl font-bold text-danger">{t('errors.no-permission')}</h2>
      <p className="mt-4 text-lg">
        {t("errors.unauthorized")}
      </p>
      <Button variant="primary" onClick={handler}>
        {t("buttons.to-login")}
      </Button>
    </Container>
  );
}

export default Unauthorized;
