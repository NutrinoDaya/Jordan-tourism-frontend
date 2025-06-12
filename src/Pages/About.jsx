import React, { useState } from "react";
import { Container, Row, Col } from "reactstrap";
import Subtitle from "../Shared/Subtitle";
import '../styles/About.css';
import worldImg from "../assets/images/world.png";
import logo1 from "../assets/images/logo1.png";
import Contact from "./Contact";

const translations = {
  en: {
    subtitle: "About Us",
    title: "Traveling Opens The Door To Creating",
    highlight: "Memories",
    paragraph1:
      "Welcome to Jordan Tourism Explorer — a platform dedicated to showcasing the rich history, vibrant culture, and breathtaking nature of Jordan. Whether you're planning a visit to Petra, floating in the Dead Sea, or exploring the vast deserts of Wadi Rum, we’ve gathered everything you need to make your trip unforgettable.",
    paragraph2:
      "This website was built as a graduation project with the goal of promoting tourism in Jordan through technology and design. It serves not only as a travel guide, but also as a celebration of our heritage and a digital bridge connecting people around the world to our beautiful country.",
    toggle: "عربي",
  },
  ar: {
    subtitle: "معلومات عنا",
    title: "السفر يفتح الباب لإنشاء",
    highlight: "ذكريات",
    paragraph1:
      "مرحبًا بكم في مستكشف السياحة الأردنية — منصة مخصصة لعرض التاريخ الغني والثقافة النابضة بالحياة والطبيعة الخلابة في الأردن. سواء كنت تخطط لزيارة البتراء أو الطفو في البحر الميت أو استكشاف صحاري وادي رم، فقد جمعنا كل ما تحتاجه لجعل رحلتك لا تُنسى.",
    paragraph2:
      "تم إنشاء هذا الموقع كمشروع تخرج بهدف الترويج للسياحة في الأردن من خلال التكنولوجيا والتصميم. إنه لا يخدم فقط كدليل سياحي، بل يحتفل أيضًا بتراثنا ويعمل كجسر رقمي يربط الناس حول العالم ببلدنا الجميل.",
    toggle: "English",
  },
};

const About = () => {
  const [locale, setLocale] = useState("en");
  const t = translations[locale];

  return (
    <>
      {/* Language Toggle Button */}
      <button
        onClick={() => setLocale((prev) => (prev === "en" ? "ar" : "en"))}
        className="btn secondary__btn"
        style={{ position: "fixed", top: "20px", right: "20px", zIndex: 1000 }}
      >
        {t.toggle}
      </button>

      <section className="about" dir={locale === "ar" ? "rtl" : "ltr"}>
        <Container>
          <Row>
            <Col lg="6">
              <div className="hero__content">
                <div className="hero__subtitle d-flex align-items-center">
                  <Subtitle subtitle={t.subtitle} />
                  <img src={worldImg} alt="world icon" />
                </div>
                <h1>
                  {t.title} <span className="highlight">{t.highlight}</span>
                </h1>
                <p className="about__description">{t.paragraph1}</p>
                <p className="about__description">{t.paragraph2}</p>
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
