

const ExampleCarouselImage = ({ text }) => {
  return (
    <div
      style={{
        width: "100%",
        height: "400px",
        backgroundColor: "#777",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "2rem",
      }}
    >
      {text}
    </div>
  );
};

export default ExampleCarouselImage;
