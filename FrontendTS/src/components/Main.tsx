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
      <Container className="p-4 mb-4 mt-4 rounded">
        <h2 className="section-header">Добро пожаловать, абитуриент!</h2>
        <p className="section-text">Получите талон на посещение</p>
        <Button onClick={handleTicketIssue}>Получить талон</Button>
      </Container>
      <Container className="p-4 mt-4">
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
          <Accordion.Item eventKey="2">
            <Accordion.Header>Стоимость обучения</Accordion.Header>
            <Accordion.Body>
              <p>
                Стоимость обучения составляет <strong>1 500 000 тенге</strong>{" "}
                за весь срок обучения.
              </p>
              <strong>Вы можете разделить оплату на 3 транша:</strong>
              <p>
                <ul>
                  <li>1 транш 30% до 25 августа</li>
                  <li>2 транш 35% до конца 1</li>
                  <li>семестра 3 транш 35% до конца 2 семестра</li>
                </ul>
              </p>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Container>
      <Container className="p-4 rounded">
        <h2 className="section-header mb-2">Галерея</h2>
        <Carousel fade data-bs-theme="light">
          <Carousel.Item>
            <img
              className="image d-block"
              src="/Galery/DSC01511-scaled.jpg"
              alt="Firs slide"
            />
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="image d-block"
              src="/Galery/Library_Astana_IT_University.jpg"
              alt="Second slide"
            />
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="image d-block"
              src="/Galery/_Astana_IT_Univerist.jpg"
              alt="Third slide"
            />
          </Carousel.Item>
        </Carousel>
      </Container>
    </div>
  );
}

export default Main;
