// src/components/Home.jsx
import React, { useState } from 'react';
import "../styles/Home.css";
import { Container, Row, Col } from 'reactstrap';
import Jarash from "../assets/images/Jarash.webp";
import Citadel from "../assets/images/Citadel.png";
import petra from "../assets/images/petra.mp4";
import Subtitle from '../Shared/Subtitle';
import worldImg from "../assets/images/world.png";
import BannerImage from "../assets/images/tourism_banner.jpg";
import SearchBar from '../Shared/SearchBar';
import ServiceList from '../Services/ServiceList';
import FeaturedToursList from '../Components/FeaturedTours/FeaturedToursList';
import MasonryImagesGallery from '../Components/Image-gallery/MasonryImagesGallery';
import Testimonials from '../Components/Testimonials/Testimonials';
import Contact from './Contact';
import FeaturedBlogsList from '../Components/FeaturedBlogs.jsx/FeaturedBlogsList';
import { FaComments, FaTimes } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { NGROK } from '../utils/config.js';

const translations = {
  en: {
    tourismTitle: "Tourism In Jordan",
    tourismSubtitle: "Extraordinary Growth And Unparalleled Potential",
    heroSubtitle: "Explore Jordan",
    heroTitle: "Discover Jordan and Create",
    heroHighlight: "Unforgettable Memories",
    heroDesc:
      "From the ancient allure of Petra and the vast deserts of Wadi Rum to the bustling streets of Amman, embark on a journey rich in history, culture, and natural splendor.",
    servicesSubtitle: "Experience Jordan",
    servicesTitle: "Expert Travel Services Crafted for Your Jordan Adventure",
    featuredSubtitle: "Explore",
    featuredTitle: "Discover Our Most Popular Jordan Tours",
    gallerySubtitle: "Gallery",
    galleryTitle: "Moments Captured from the Heart of Jordan",
    blogSubtitle: "From Our Blog",
    testimonialsSubtitle: "Testimonials",
    testimonialsTitle: "Hear What Our Travelers Say About Jordan",
    coachBot: "Chat Bot",
    chatPlaceholder: "Ask anything...",
    offlineMsg: "Sorry, I'm offline.",
    errorMsg: "Sorry, I can't respond right now.",
    toggleLabel: "عربي",
  },
  ar: {
    tourismTitle: "السياحة في الأردن",
    tourismSubtitle: "نمو غير مسبوق وفرص لا مثيل لها",
    heroSubtitle: "اكتشف الأردن",
    heroTitle: "اكتشف الأردن واصنع",
    heroHighlight: "ذكريات لا تُنسى",
    heroDesc:
      "من سحر البتراء العريق وصحاري وادي رم الواسعة إلى شوارع عمّان النابضة بالحياة، انطلق في رحلة غنية بالتاريخ والثقافة والجمال الطبيعي.",
    servicesSubtitle: "اكتشف الأردن",
    servicesTitle: "خدمات سفر احترافية مصممة لمغامرتك في الأردن",
    featuredSubtitle: "استكشف",
    featuredTitle: "اكتشف أكثر جولاتنا شهرة في الأردن",
    gallerySubtitle: "المعرض",
    galleryTitle: "لحظات موثقة من قلب الأردن",
    blogSubtitle: "من مدونتنا",
    testimonialsSubtitle: "آراء المسافرين",
    testimonialsTitle: "استمع إلى ما يقوله مسافرونا عن الأردن",
    coachBot: "تشات",
    chatPlaceholder: "اسأل أي شيء...",
    offlineMsg: "عذرًا، أنا غير متصل.",
    errorMsg: "عذرًا، لا أستطيع الرد الآن.",
    toggleLabel: "English",
  },
};

// Chatbot component
function Chatbot({ t }) {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState("");

  // Open the chat window
  const openChat = () => setOpen(true);

  // Close the chat window and clear messages
  const closeChat = () => {
    setOpen(false);
    setMsgs([]);
  };

  const send = async e => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = input;
    setMsgs(m => [...m, { from: 'user', text: userMsg }]);
    setInput('');
    try {
      const res = await fetch(`${NGROK}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userMsg }),
      });
      const data = await res.json();
      setMsgs(m => [...m, { from: 'bot', text: data.response || t.errorMsg }]);
    } catch {
      setMsgs(m => [...m, { from: 'bot', text: t.offlineMsg }]);
    }
  };

  return (
    <>
      {open && (
        <motion.div
          className="chat-window"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="chat-header">
            <span>{t.coachBot}</span>
            <button onClick={closeChat}><FaTimes /></button>
          </div>
          <div className="chat-body">
            {msgs.map((m, i) => (
              <div key={i} className={`chat-msg ${m.from}`}>{m.text}</div>
            ))}
          </div>
          <form className="chat-input" onSubmit={send}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={t.chatPlaceholder}
            />
            <button type="submit">▶</button>
          </form>
        </motion.div>
      )}
      <button className="chat-toggle" onClick={openChat}>
        <FaComments />
      </button>
    </>
  );
}

const Home = () => {
  const [locale, setLocale] = useState("en");
  const t = translations[locale];

  return (
    <div className="home-page" dir={locale === "ar" ? "rtl" : "ltr"}>
      <button
        onClick={() => setLocale(l => l === 'en' ? 'ar' : 'en')}
        className="lang-toggle btn secondary"
        style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 1000 }}
      >
        {t.toggleLabel}
      </button>

      <section className="tourism-banner">
        <img src={BannerImage} alt="Tourism Banner" />
        <div className="banner-text">
          <h2>{t.tourismTitle}</h2>
          <p>{t.tourismSubtitle}</p>
        </div>
      </section>

      <section className="hero-section">
        <Container>
          <Row>
            <Col lg="6">
              <div className="hero__content">
                <div className="hero__subtitle d-flex align-items-center">
                  <Subtitle subtitle={t.heroSubtitle} />
                  <img src={worldImg} alt="World Icon" />
                </div>
                <h1>
                  {t.heroTitle} <span className="highlight">{t.heroHighlight}</span>
                </h1>
                <p>{t.heroDesc}</p>
              </div>
            </Col>
            <Col lg="2">
              <div className="hero__img-box">
                <img src={Jarash} alt="Jordan Landscape" />
              </div>
            </Col>
            <Col lg="2">
              <div className="hero__img-box video-box mt-4">
                <video src={petra} autoPlay loop muted />
              </div>
            </Col>
            <Col lg="2">
              <div className="hero__img-box mt-5">
                <img src={Citadel} alt="Jordan Experience" />
              </div>
            </Col>
            <SearchBar />
          </Row>
        </Container>
      </section>

      <section className="services-section">
        <Container>
          <Row>
            <Col lg="12">
              <h5 className="services__subtitle">{t.servicesSubtitle}</h5>
              <h2 className="services__title">{t.servicesTitle}</h2>
            </Col>
          </Row>
          <ServiceList />
        </Container>
      </section>

      <section className="featured-tours-section">
        <Container>
          <Row>
            <Col lg="12" className="mb-5">
              <Subtitle subtitle={t.featuredSubtitle} />
              <h2 className="featured__tour-title">{t.featuredTitle}</h2>
            </Col>
            <FeaturedToursList />
          </Row>
        </Container>
      </section>

      <section className="gallery-section">
        <Container>
          <Row>
            <Col lg="12">
              <Subtitle subtitle={t.gallerySubtitle} />
              <h2 className="gallery__title">{t.galleryTitle}</h2>
            </Col>
            <Col lg="12">
              <MasonryImagesGallery />
            </Col>
          </Row>
        </Container>
      </section>

      <section className="featured-blogs-section">
        <Container>
          <div className="title">
            <Subtitle subtitle={t.blogSubtitle} />
          </div>
          <Row>
            <FeaturedBlogsList lg={4} md={6} sm={6} />
          </Row>
        </Container>
      </section>

      <section className="testimonials-section">
        <Container>
          <Row>
            <Col lg="12">
              <Subtitle subtitle={t.testimonialsSubtitle} />
              <h2 className="testmonials__title">{t.testimonialsTitle}</h2>
            </Col>
            <Testimonials />
          </Row>
        </Container>
      </section>

      <Contact />

      {/* Chatbot */}
      <Chatbot t={t} />
    </div>
  );
};

export default Home;
