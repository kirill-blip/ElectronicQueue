import { Container, Spinner } from "react-bootstrap";
import { useTranslation } from "react-i18next";

function Loading() {
  const { t } = useTranslation();
  return (
    <Container
      style={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "calc(95vh - 56px - 56px)",
      }}
    >
      <h2 className="font-bold mb-3">{t('loading')}</h2>
      <Spinner animation="border" />
    </Container>
  );
}

export default Loading;
