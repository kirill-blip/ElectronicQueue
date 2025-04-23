import { Accordion, Button, Carousel, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import "../styles/MainPage.css";
import { useTranslation } from "react-i18next";

function MainPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleTicketIssue = () => {
    navigate("/ticket-issue");
  };

  return (
    <div>
      <Container className="p-4 mb-4 mt-4 rounded">
        <h2 className="section-header">{t('main.greeting')}</h2>
        <p className="section-text">{t('main.greeting1')}</p>
        <Button onClick={handleTicketIssue}>{t('buttons.get-ticket')}</Button>
      </Container>
      <Container className="p-4 mt-4">
        <h2 className="section-header mb-2">{t('main.faq.title')}</h2>
        <Accordion>
          <Accordion.Item eventKey="0">
            <Accordion.Header>{t("main.faq.question1.question")}</Accordion.Header>
            <Accordion.Body>
              <p>
                <strong>{t("main.faq.question1.answer.first.title")}</strong> —{" "}
                {t("main.faq.question1.answer.first.description")}
              </p>
              <p>
                <strong>{t("main.faq.question1.answer.second.title")}</strong> —{" "}
                {t("main.faq.question1.answer.second.description")}
              </p>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="1">
            <Accordion.Header>{t('main.faq.question2.title')}</Accordion.Header>
            <Accordion.Body>
              {t('main.faq.question2.answer.part1')}{" "}
              <strong>{t('main.faq.question2.answer.part2')}</strong>.{" "}
              {t('main.faq.question2.answer.part3')}
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="2">
            <Accordion.Header>{t('main.faq.question3.title')}</Accordion.Header>
            <Accordion.Body>
              <p>
                {t('main.faq.question3.answer.part1')} <strong>{t('main.faq.question3.answer.price')}</strong> {t('main.faq.question3.answer.part2')}
              </p>
              <strong>{t('main.faq.question3.answer.part3')}</strong>
              <p>
                <ul>
                  <li>{t('main.faq.question3.answer.tranche.first')}</li>
                  <li>{t('main.faq.question3.answer.tranche.second')}</li>
                  <li>{t('main.faq.question3.answer.tranche.third')}</li>
                </ul>
              </p>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Container>
      <Container className="p-4 rounded">
        <h2 className="section-header mb-2">{t('main.gallery')}</h2>
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

export default MainPage;
