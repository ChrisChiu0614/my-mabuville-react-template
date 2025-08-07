import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Container from "react-bootstrap/Container";

const Header = () => {
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="#home">
          <img
            src="https://www.mabuville.com/wp-content/uploads/2024/02/logo.svg"
            alt="MabuVille Logo"
            height="60"
            className="d-inline-block align-top"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#AboutMabu">
              關於麻布
              <br />
              AboutMabu
            </Nav.Link>
            <Nav.Link href="#link">
              入園須知
              <br />
              Notice
            </Nav.Link>
            <Nav.Link href="#link">
              自然教育
              <br />
              Education
            </Nav.Link>
            <Nav.Link href="#link">
              山林學習
              <br />
              Learning
            </Nav.Link>
            <Nav.Link href="#link">
              山林饗宴
              <br />
              Fooding
            </Nav.Link>

            <NavDropdown
              title={
                <div >
                  <div>山林旅遊</div>
                  <div>Playing</div>
                </div>
              }
              id="basic-nav-dropdown"
            >
              <NavDropdown.Item href="#action/3.1">麻布景點
                <br />
                Mabu Spots
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">周邊景點
                <br />
                Seeing
              </NavDropdown.Item>
            </NavDropdown>

            <Nav.Link href="#link">
              最新消息
              <br />
              News
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
