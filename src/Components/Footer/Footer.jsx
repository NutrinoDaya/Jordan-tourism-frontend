import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const quickLinks1 = [
  { path: "/", display: "Home" },
  { path: "/about", display: "About" },
  { path: "/tours", display: "Tours" },
];

const quickLinks2 = [
  { path: "/gallery", display: "Gallery" },
  { path: "/login", display: "Login" },
  { path: "/register", display: "Register" },
];

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__grid">
          <div className="logo">
            <div className="social__links">
              <span><Link to="https://youtube.com"><i className="ri-youtube-fill"></i></Link></span>
              <span><Link to="https://facebook.com"><i className="ri-facebook-circle-line"></i></Link></span>
              <span><Link to="https://instagram.com"><i className="ri-instagram-line"></i></Link></span>
              <span><Link to="https://twitter.com"><i className="ri-twitter-line"></i></Link></span>
            </div>
          </div>

          <div>
            <h5 className="footer__link-title">Discover</h5>
            <ul className="footer__quick-links">
              {quickLinks1.map((item, idx) => (
                <li key={idx}><Link to={item.path}>{item.display}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="footer__link-title">Quick Links</h5>
            <ul className="footer__quick-links">
              {quickLinks2.map((item, idx) => (
                <li key={idx}><Link to={item.path}>{item.display}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="footer__link-title">Contact</h5>
            <ul className="footer__quick-links">
              <li className="d-flex">
                <i className="ri-mail-line"></i>
                <div>
                  <h6>Email:</h6>
                  <p><a href="mailto:support@travelworld.com" className="color-text">support@travelworld.com</a></p>
                </div>
              </li>
              <li className="d-flex">
                <i className="ri-phone-fill"></i>
                <div>
                  <h6>Phone:</h6>
                  <p><a href="tel:+9876543210" className="color-text">+9876543210</a></p>
                </div>
              </li>
              <li className="d-flex">
                <i className="ri-map-pin-line"></i>
                <div>
                  <h6>Address:</h6>
                  <p>123 Travel Street, Amman, Jordan</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          &copy; {year} . All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
