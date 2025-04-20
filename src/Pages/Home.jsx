import React from 'react';
import "../styles/Home.css";
import { Container, Row, Col } from 'reactstrap';

// Updated hero images/video to Jordan themed assets (update paths or images as needed)
import Jarash from "../assets/images/Jarash.webp";
import Citadel from "../assets/images/Citadel.png";
import petra from "../assets/images/petra.mp4";
import Subtitle from '../Shared/Subtitle';
import worldImg from "../assets/images/world.png";
// Import the tourism banner image
import BannerImage from "../assets/images/tourism_banner.jpg"; 
// import experienceImage from "../assets/images/experience.jpg";
import SearchBar from '../Shared/SearchBar';
import ServiceList from '../Services/ServiceList';
import FeaturedToursList from '../Components/FeaturedTours/FeaturedToursList';
import MasonryImagesGallery from '../Components/Image-gallery/MasonryImagesGallery';
import Testimonials from '../Components/Testimonials/Testimonials';
import Contact from './Contact';
import FeaturedBlogsList from '../Components/FeaturedBlogs.jsx/FeaturedBlogsList';

const Home = () => {
  return (
    <>
      {/* Tourism Banner Section - Displayed under the navbar */}
      <section className="tourism-banner">
        <img src={BannerImage} alt="Tourism Banner" />
        <div className="banner-text">
          <h2>Tourism In Jordan</h2>
          <p>Extraordinary Growth And Unparalleled Potential</p>
        </div>
      </section>

      {/* Hero Section */}
      <section className="hero-section">
        <Container>
          <Row>
            <Col lg="6">
              <div className="hero__content">
                <div className="hero__subtitle d-flex align-items-center">
                  <Subtitle subtitle={"Explore Jordan"} />
                  <img src={worldImg} alt="World Icon" />
                </div>
                <h1>
                  Discover Jordan and Create <span className="highlight">Unforgettable Memories</span>
                </h1>
                <p>
                  From the ancient allure of Petra and the vast deserts of Wadi Rum to the bustling streets of Amman, embark on a journey rich in history, culture, and natural splendor.
                </p>
              </div>
            </Col>
            <Col lg="2">
              <div className="hero__img-box">
                <img src={Jarash} alt="Jordan Landscape" style={{ width: "300px", height: "600px", objectFit: "cover" }}  />
              </div>
            </Col>
            <Col lg="2">
              <div className="hero__img-box video-box mt-4">
              <video 
                src={petra} 
                autoPlay 
                loop 
                muted 
                style={{ width: "300px", height: "600px", objectFit: "cover" }} 
              />
              </div>
            </Col>
            <Col lg="2">
              <div className="hero__img-box mt-5">
                <img src={Citadel} alt="Jordan Experience" style={{ width: "300px", height: "600px", objectFit: "cover" }}  />
              </div>
            </Col>
            <SearchBar />
          </Row>
        </Container>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <Container>
          <Row>
            <Col lg="12">
              <h5 className="services__subtitle">Experience Jordan</h5>
              <h2 className="services__title">
                Expert Travel Services Crafted for Your Jordan Adventure
              </h2>
            </Col>
          </Row>
          <ServiceList />
        </Container>
      </section>

      {/* Featured Tours Section */}
      <section className="featured-tours-section">
        <Container>
          <Row>
            <Col lg="12" className="mb-5">
              <Subtitle subtitle={"Explore"} />
              <h2 className="featured__tour-title">
                Discover Our Most Popular Jordan Tours
              </h2>
            </Col>
            <FeaturedToursList />
          </Row>
        </Container>
      </section>

      {/* Experience Section */}
      
      {/* Gallery Section */}
      <section className="gallery-section">
        <Container>
          <Row>
            <Col lg="12">
              <Subtitle subtitle={"Gallery"} />
              <h2 className="gallery__title">
                Moments Captured from the Heart of Jordan
              </h2>
            </Col>
            <Col lg="12">
              <MasonryImagesGallery />
            </Col>
          </Row>
        </Container>
      </section>

      {/* Featured Blogs Section */}
      <section className="featured-blogs-section">
        <Container>
          <div className="title">
            <Subtitle subtitle={"From Our Blog"} />
          </div>
          <Row>
            <FeaturedBlogsList lg={4} md={6} sm={6} />
          </Row>
        </Container>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <Container>
          <Row>
            <Col lg="12">
              <Subtitle subtitle={"Testimonials"} />
              <h2 className="testmonials__title">
                Hear What Our Travelers Say About Jordan
              </h2>
            </Col>
            <Testimonials />
          </Row>
        </Container>
      </section>

      <Contact />
    </>
  );
};

export default Home;
