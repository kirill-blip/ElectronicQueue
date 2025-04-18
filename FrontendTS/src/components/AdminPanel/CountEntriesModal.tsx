import { Button, Modal } from "react-bootstrap";

interface CountEntriesModalProps {
  show: boolean;
  handleClose: () => void;
}

function CountEntriesModal({show, handleClose}: CountEntriesModalProps) {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Количество клиентов</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="mb-0">Количество клиентов: 0</p>
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
