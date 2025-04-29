import { useEffect, useState } from "react";
import { Alert, Button, Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";

interface CountEntriesModalProps {
  show: boolean;
  handleClose: () => void;
  refreshedCount: number;
}

function CountEntriesModal({
  show,
  handleClose,
}: CountEntriesModalProps) {
  const [count, setCount] = useState<number>(0);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/entry/get-count",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log("Data Count: ", data.count);
        setCount(data.count);
      } catch (error) {
        console.error("Error fetching count:", error);
      }
    };

    fetchCount();
  });

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{t('admin-panel.clients-count')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {count !== 0 ? (
          <p className="mb-0">{t('admin-panel.clients-count')}: {count}</p>
        ) : (
          <Alert variant="danger" className="mb-0">
            {t('admin-panel.clients-0-count')}
          </Alert>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleClose}>
          {t('buttons.close')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CountEntriesModal;
