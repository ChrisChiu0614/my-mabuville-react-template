import { useState } from "react";
import Carousel from "react-bootstrap/Carousel";
import "../ExampleCarouselImage.css";

const Home = () => {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  return (
    <Carousel activeIndex={index} onSelect={handleSelect}>
      <Carousel.Item>
        <img
          src="https://www.mabuville.com/wp-content/uploads/2024/02/ix01.jpg"
          alt="First slide"
          style={{ width: "100%", height: "400px", objectFit: "cover" }}
        />
        <Carousel.Caption className="centered">
          <h3>麻布山林</h3>
          <h3>Mabuville</h3>
        </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item>
        <img
          src="https://www.mabuville.com/wp-content/uploads/2024/02/ix02.jpg"
          alt="Second slide"
          style={{ width: "100%", height: "400px", objectFit: "cover" }}
        />
        <Carousel.Caption className="centered">
          <h3>麻布山林</h3>
          <h3>Mabuville</h3>
        </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item>
        <img
          src="https://www.mabuville.com/wp-content/uploads/2024/02/ix03.jpg"
          alt="third slide"
          style={{ width: "100%", height: "400px", objectFit: "cover" }}
        />
        <Carousel.Caption className="centered">
          <h3>麻布山林</h3>
          <h3>Mabuville</h3>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
};

export default Home;
