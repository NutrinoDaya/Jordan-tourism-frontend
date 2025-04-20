import React from "react";
import { Container, Row, Col } from "reactstrap";
import Subtitle from "../Shared/Subtitle";
import '../styles/About.css';
import worldImg from "../assets/images/world.png"
import logo1 from "../assets/images/logo1.png"
import Contact from "./Contact";

const About = () => {
  return (
    <>
      <section className="about">
        <Container>
          <Row>
            <Col lg="6">
              <div className="hero__content">
                <div className="hero__subtitle d-flex align-items-center">
                  <Subtitle subtitle={"About Us"} />
                  <img src={worldImg} alt="world icon" />
                </div>
                <h1>
                  Traveling Opens The Door To Creating{" "}
                  <span className="highlight">Memories</span>
                </h1>
                <p className="about__description">
                  Welcome to <strong>Jordan Tourism Explorer</strong> — a platform dedicated to showcasing the rich history, vibrant culture, and breathtaking nature of Jordan. 
                  Whether you're planning a visit to Petra, floating in the Dead Sea, or exploring the vast deserts of Wadi Rum, we’ve gathered everything you need to make your trip unforgettable.
                </p>
                <p className="about__description">
                  This website was built as a <strong>graduation project</strong> with the goal of promoting tourism in Jordan through technology and design. 
                  It serves not only as a travel guide, but also as a celebration of our heritage and a digital bridge connecting people around the world to our beautiful country.
                </p>
              </div>
            </Col>
            <div className="about__image d-flex align-items-center">
              <img src={logo1} height={250} width={250} alt="site logo" />
            </div>
          </Row>
        </Container>
      </section>
      <Contact />
    </>
  );
};

export default About;
