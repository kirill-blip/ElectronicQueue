import { useEffect, useState } from "react";
import { Alert, Button, Modal } from "react-bootstrap";

interface CountEntriesModalProps {
  show: boolean;
  handleClose: () => void;
  refreshedCount: number;
}

function CountEntriesModal({
  show,
  handleClose,
  refreshedCount,
}: CountEntriesModalProps) {
  const [count, setCount] = useState<number>(0);

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
        <Modal.Title>Количество клиентов</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {count !== 0 ? (
          <p className="mb-0">Количество клиентов: {count}</p>
        ) : (
          <Alert variant="danger" className="mb-0">
            Ожидающих клиентов нет
          </Alert>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleClose}>
          Закрыть
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CountEntriesModal;
