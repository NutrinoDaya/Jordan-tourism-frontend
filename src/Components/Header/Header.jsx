import React, { useRef, useEffect, useContext, useState } from "react";
import { Container, Row, Button } from "reactstrap";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./header.css";

const nav__links = [
  { path: "/", display: "Home" },
  { path: "/about", display: "About" },
  { path: "/tours", display: "Jordan Tours" },
  { path: "/blogs", display: "Blogs" }
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); 
  const headerRef = useRef(null);
  const { user, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const logout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/");
  };

  const isAdmin = user?.role === "admin";

  // Use a stable scroll handler to set or remove sticky class
  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current) {
        if (window.scrollY > 80) {
          headerRef.current.classList.add("sticky__header");
        } else {
          headerRef.current.classList.remove("sticky__header");
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(prev => !prev);

  return (
    <header className="header jordan-theme" ref={headerRef}>
      <Container>
        <Row>
          <div className="nav__wrapper d-flex align-items-center justify-content-between">

            {/* Navigation */}
            <nav className={`navigation ${isMenuOpen ? "show__menu" : ""}`}>
              <ul className="menu">
                {nav__links.map((item, index) => (
                  <li className="nav__item" key={index}>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        isActive ? "active__link" : ""
                      }
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.display}
                    </NavLink>
                  </li>
                ))}
                {isAdmin && (
                  <li className="nav__item">
                    <NavLink
                      to="/admin"
                      className={({ isActive }) =>
                        isActive ? "active__link" : ""
                      }
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin
                    </NavLink>
                  </li>
                )}
              </ul>
            </nav>

            {/* Right-side User & Mobile Menu Toggle */}
            <div className="nav__right">
              <div className="nav__btns">
                {user ? (
                  <>
                    <h5 className="logged__in_h5">
                      {user.username.charAt(0).toUpperCase() +
                        user.username.slice(1)}
                    </h5>
                    <Button className="btn btn-dark" onClick={logout}>
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button className="btn secondary__btn">
                      <Link to="/login">Login</Link>
                    </Button>
                    <Button className="btn primary__btn">
                      <Link to="/register">Register</Link>
                    </Button>
                  </>
                )}
              </div>
              <span className="mobile__menu" onClick={toggleMenu}>
                {isMenuOpen ? <i className="ri-close-line"></i> : <i className="ri-menu-line"></i>}
              </span>
            </div>
          </div>
        </Row>
      </Container>
    </header>
  );
};

export default Header;
