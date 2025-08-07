import { Container, Row, Col, Button } from "react-bootstrap";

const About = () => {
  return (
    <Container className="my-5">
      <Row className="align-items-center">
        <Col md={6}>
          <h1
            style={{
              fontWeight: "bold",
              color: "#b8860b",
              display: "flex",
              alignItems: "center",
              gap: "1rem", // 文字與圖片間距
            }}
          >
            麻布山林
            <img
              src="https://www.mabuville.com/wp-content/uploads/2024/02/pit02-2.png"
              alt="bird"
              style={{
                
                height: "10%", // 調整圖片高度
                width: "20%", // 調整圖片寬度
                
                verticalAlign: "middle", // 使圖片與文字對齊
                marginLeft: "200px", // 文字與圖片間距

              }}
            />
          </h1>
          <h1 style={{ fontWeight: "bold", color: "#558b2f", fontSize: "4rem" }}>
            About Mabuville
          </h1>
          <p className="mt-4">
            麻布山林為友達光電教育訓練中心，腹地廣達 33 公頃，其中 10
            公頃為已開發區域的可活動場域，23 公頃為原始山林保護區。
            <br />
            <br />自 2005
            年成立以來，始終堅持「低密度開發」與「山林復育」兩個經營原則，致力降低人為干擾……
          </p>
          <Button variant="success">VIEW MORE+</Button>
        </Col>
        <Col md={6}>
          <img
            src="https://www.mabuville.com/wp-content/uploads/2024/11/map-03.png"
            alt="Mabuville Map"
            className="img-fluid"
          />
        </Col>
      </Row>
    </Container>
  );
};

export default About;
