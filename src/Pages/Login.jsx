import React, { useState, useContext } from "react";
import { Container, Row, Col, Form, FormGroup, Button } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Login.css";
import loginImg from "../assets/images/login.png";
import userIcon from "../assets/images/user.png";
import { AuthContext } from "../context/AuthContext";
import { BASE_URL } from "../utils/config";

// Translations
const translations = {
  en: {
    login: "Login",
    email: "Email",
    password: "Password",
    success: "Login successful!",
    error: "An error occurred while logging in. Please try again later.",
    noAccount: "Don't have an account?",
    register: "Register",
    toggleLabel: "عربي",
  },
  ar: {
    login: "تسجيل الدخول",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    success: "تم تسجيل الدخول بنجاح!",
    error: "حدث خطأ أثناء تسجيل الدخول. حاول مرة أخرى.",
    noAccount: "ليس لديك حساب؟",
    register: "سجّل الآن",
    toggleLabel: "English",
  },
};

const Login = () => {
  const [locale, setLocale] = useState("en");
  const t = translations[locale];

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setCredentials((prev) => ({ ...prev, [id]: value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    dispatch({ type: "LOGIN_START" });
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(credentials),
      });

      const result = await res.json();
      if (!res.ok) {
        setError(result.message);
        dispatch({ type: "LOGIN_FAILURE", payload: result.message });
      } else {
        dispatch({ type: "LOGIN_SUCCESS", payload: result });
        setSuccess(t.success);
        setTimeout(() => {
          if (result.role === "admin") {
            navigate("/admin");
          } else {
            navigate("/");
          }
        }, 1000);
      }
    } catch (err) {
      setError(t.error);
      dispatch({ type: "LOGIN_FAILURE", payload: err.message });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <section>
      {/* Language toggle button */}
      <button
        onClick={() => setLocale((l) => (l === "en" ? "ar" : "en"))}
        className="btn secondary__btn"
        style={{ position: "fixed", top: "20px", right: "20px", zIndex: 1000 }}
      >
        {t.toggleLabel}
      </button>

      <Container>
        <Row>
          <Col lg="8" className="m-auto">
            <div className="login__container d-flex justify-content-between">
              <div className="login__img">
                <img src={loginImg} alt="login visual" />
              </div>

              <div className="login__form">
                <div className="user">
                  <img src={userIcon} alt="user icon" />
                </div>
                <h2>{t.login}</h2>
                {error && <div className="alert alert-danger">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}
                <Form onSubmit={handleClick}>
                  <FormGroup>
                    <input
                      type="email"
                      placeholder={t.email}
                      required
                      autoComplete="on"
                      id="email"
                      onChange={handleChange}
                    />
                  </FormGroup>
                  <FormGroup>
                    <div className="password__input">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder={t.password}
                        required
                        autoComplete="on"
                        id="password"
                        onChange={handleChange}
                      />
                      <i
                        className={`ri-eye${showPassword ? "-off" : ""}-line`}
                        onClick={togglePasswordVisibility}
                      ></i>
                    </div>
                  </FormGroup>
                  <Button className="btn secondary__btn auth__btn" type="submit">
                    {t.login}
                  </Button>
                </Form>

                <p>
                  <Link to="/forgotpassword">{t.forgot}</Link>
                </p>
                <p>
                  {t.noAccount} <Link to="/register">{t.register}</Link>
                </p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Login;
