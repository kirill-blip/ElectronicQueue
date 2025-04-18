import { Accordion, Button, Carousel, Container } from "react-bootstrap";
import "../styles/MainPage.css";
import { useNavigate } from "react-router-dom";

function Main() {
  const navigate = useNavigate();

  const handleTicketIssue = () => {
    navigate("/ticket-issue");
  };

  return (
    <div>
      <Container className="p-5 mb-4 mt-4 rounded">
        <h2 className="section-header">Добро пожаловать, абитуриент!</h2>
        <p className="section-text">Получите талон на посещение</p>
        <Button onClick={handleTicketIssue}>Получить талон</Button>
      </Container>
      <Container className="p-5 mt-4 rounded">
        <h2 className="section-header mb-2">FAQ</h2>
        <Accordion defaultActiveKey="0">
          <Accordion.Item eventKey="0">
            <Accordion.Header>
              Какие есть специальности в колледже?
            </Accordion.Header>
            <Accordion.Body>
              <p>
                <strong>Программное обеспечение</strong> — создание веб,
                мобильных и цифровых приложений, работа с Python, React,
                Flutter, базами данных и Arduino.
              </p>
              <p>
                <strong>Вычислительная техника и информационные сети</strong> —
                настройка и сопровождение баз данных (PostgreSQL, SQL Server),
                серверов и сетей, работа с Django.
              </p>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="1">
            <Accordion.Header>Какой срок обучения?</Accordion.Header>
            <Accordion.Body>
              Срок обучения составляет <strong>2 года и 10 месяцев</strong>.
              Обучение проходит в очной форме.
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Container>
      <Container className="bg-body-tertiary p-5 mb-4 rounded">
        <h2 className="section-header mb-3">Галерея</h2>
        <Carousel fade data-bs-theme="light">
          <Carousel.Item>
            <img
              className="d-block"
              src="/Galery/DSC01511-scaled.jpg"
              alt="Firs slide"
              width="100%"
              height="400px"
              style={{ objectFit: "cover", borderRadius: "10px" }}
            />
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block"
              src="/Galery/Library_Astana_IT_University.jpg"
              width="100%"
              height="400px"
              style={{ objectFit: "cover", borderRadius: "10px" }}
              alt="Second slide"
            />
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block"
              src="/Galery/_Astana_IT_Univerist.jpg"
              width="100%"
              height="400px"
              style={{ objectFit: "cover", borderRadius: "10px" }}
              alt="Third slide"
            />
          </Carousel.Item>
        </Carousel>
      </Container>
    </div>
  );
}

export default Main;
