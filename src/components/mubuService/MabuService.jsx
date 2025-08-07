import { Container, Row, Col, Card } from "react-bootstrap";
import "./MabuService.css";

const services = [
  {
    title: "山林學習",
    subtitle: "LEARNING",
    image: "https://www.mabuville.com/wp-content/uploads/2024/02/b02.jpg", // ✅ 替換為實際圖片路徑或網址
  },
  {
    title: "山林小舖",
    subtitle: "SHOPPING",
    image: "https://www.mabuville.com/wp-content/uploads/2024/12/mabu-shop.jpg",
  },
  {
    title: "山林饗宴",
    subtitle: "FOODING",
    image: "https://www.mabuville.com/wp-content/uploads/2024/02/b03.jpg",
  },
];

const MabuService = () => {
  return (
    <Container className="text-center my-5">
      <img
        src="https://www.mabuville.com/wp-content/uploads/2024/02/pit04.png"
        alt="squirrel"
        height="60%"
        className="mb-2"
      />
      <h1 style={{ color: "#558b2f", fontWeight: "bold" }}>MABU SERVICE</h1>
      <h4 style={{ color: "#a86b00", marginBottom: "2rem" }}>山林服務</h4>

      <Row>
        {services.map((item, index) => (
          <Col key={index} md={4} className="mb-4">
            <Card className="bg-dark text-white">
              <Card.Img
                src={item.image}
                alt={item.title}
                className="fixed-img"
              />
              <Card.ImgOverlay className="d-flex flex-column justify-content-center align-items-center">
                <h4>{item.title}</h4>
                <p>{item.subtitle}</p>
              </Card.ImgOverlay>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default MabuService;
