import React, { useState, useContext } from "react";
import { Container, Row, Col, Form, FormGroup, Button } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Login.css";
import registerImg from "../assets/images/register.png";
import userIcon from "../assets/images/user.png";
import { AuthContext } from "../context/AuthContext";
import { BASE_URL } from "../utils/config";

const translations = {
  en: {
    register: "Register",
    username: "Username",
    email: "Email",
    password: "Password",
    success: "Registration successful!",
    error: "An error occurred while registering. Please try again later.",
    create: "Create Account",
    already: "Already have an account?",
    login: "Login",
    forgot: "Forgot Password?",
    invalidEmail: "Please enter a valid email address",
    invalidPassword: "Password must be at least 8 characters, include uppercase, lowercase, and a number",
    toggleLabel: "عربي",
  },
  ar: {
    register: "إنشاء حساب",
    username: "اسم المستخدم",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    success: "تم التسجيل بنجاح!",
    error: "حدث خطأ أثناء التسجيل. حاول مرة أخرى.",
    create: "إنشاء حساب",
    already: "لديك حساب بالفعل؟",
    login: "تسجيل الدخول",
    forgot: "نسيت كلمة المرور؟",
    invalidEmail: "يرجى إدخال بريد إلكتروني صالح",
    invalidPassword: "يجب أن تكون كلمة المرور 8 أحرف على الأقل وتحتوي على حرف كبير وحرف صغير ورقم",
    toggleLabel: "English",
  },
};

const Register = () => {
  const [locale, setLocale] = useState("en");
  const t = translations[locale];

  const [credentials, setCredentials] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setCredentials((prev) => ({ ...prev, [id]: value }));

    if (id === "password") {
      setIsPasswordValid(validatePassword(value));
    }
  };

  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  const validatePassword = (password) => {
    // Minimum 8 characters, at least one uppercase, one lowercase, and one number
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(password);
  };

  const handleEmailChange = (e) => {
    const { value } = e.target;
    setIsEmailValid(validateEmail(value));
    handleChange(e);
  };

  const handleClick = async (e) => {
    e.preventDefault();

    if (!isEmailValid || !isPasswordValid) return;

    dispatch({ type: "REGISTER_START" });
    setError(null);

    try {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(credentials),
      });

      const result = await res.json();
      if (!res.ok) {
        setError(result.message);
        dispatch({ type: "REGISTER_FAILURE", payload: result.message });
      } else {
        setSuccess(t.success);
        dispatch({ type: "REGISTER_SUCCESS", payload: result });
        setTimeout(() => navigate("/login"), 1000);
      }
    } catch (err) {
      setError(t.error);
      dispatch({ type: "REGISTER_FAILURE", payload: err.message });
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <section>
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
                <img src={registerImg} alt="register visual" />
              </div>

              <div className="login__form">
                <div className="user">
                  <img src={userIcon} alt="user icon" />
                </div>
                <h2>{t.register}</h2>
                {error && <div className="alert alert-danger">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}

                <Form onSubmit={handleClick}>
                  <FormGroup>
                    <input
                      type="text"
                      placeholder={t.username}
                      required
                      id="username"
                      onChange={handleChange}
                    />
                  </FormGroup>
                  <FormGroup>
                    <input
                      type="email"
                      placeholder={t.email}
                      required
                      autoComplete="on"
                      id="email"
                      onChange={handleEmailChange}
                    />
                    {!isEmailValid && (
                      <div className="alert alert-danger">{t.invalidEmail}</div>
                    )}
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
                    {!isPasswordValid && (
                      <div className="alert alert-danger">{t.invalidPassword}</div>
                    )}
                  </FormGroup>
                  <Button className="btn secondary__btn auth__btn" type="submit">
                    {t.create}
                  </Button>
                </Form>

                <p>
                  {t.already} <Link to="/login">{t.login}</Link>
                </p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Register;
