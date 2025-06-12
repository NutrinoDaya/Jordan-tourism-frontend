import React, { useState, useContext } from "react";
import "./Booking.css";
import {
  Form,
  FormGroup,
  ListGroup,
  Button,
  ListGroupItem,
  Alert,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Label,
} from "reactstrap";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { BASE_URL } from "../../utils/config";
import { FaUser, FaCreditCard, FaCalendarAlt, FaLock } from "react-icons/fa";

const translations = {
  en: {
    bookingSuccess: "Booking Successful",
    bookingFail: "Failed to book. Please try again.",
    loginAlert: "Please login to proceed with the booking.",
    information: "Information",
    fullName: "Full Name",
    phone: "Phone",
    date: "Date",
    groupSize: "Group Size",
    taxes: "Taxes",
    total: "Total",
    bookNow: "Book Now",
    paymentInfo: "Payment Information",
    cardName: "Cardholder Name",
    cardNumber: "Card Number",
    expiry: "Expiry",
    cvc: "CVC",
    confirm: "Confirm Payment",
    cancel: "Cancel",
    notRated: "Not Rated",
    perPerson: "per Person",
    toggleLabel: "عربي",
  },
  ar: {
    bookingSuccess: "تم الحجز بنجاح",
    bookingFail: "فشل في الحجز. حاول مرة أخرى.",
    loginAlert: "يرجى تسجيل الدخول للمتابعة.",
    information: "المعلومات",
    fullName: "الاسم الكامل",
    phone: "رقم الهاتف",
    date: "التاريخ",
    groupSize: "حجم المجموعة",
    taxes: "الضرائب",
    total: "الإجمالي",
    bookNow: "احجز الآن",
    paymentInfo: "معلومات الدفع",
    cardName: "اسم صاحب البطاقة",
    cardNumber: "رقم البطاقة",
    expiry: "تاريخ الانتهاء",
    cvc: "CVC",
    confirm: "تأكيد الدفع",
    cancel: "إلغاء",
    notRated: "لم يتم التقييم",
    perPerson: "للشخص",
    toggleLabel: "English",
  },
};

const Booking = ({ tour, avgRating, totalRating, reviews }) => {
  const [locale, setLocale] = useState("en");
  const t = translations[locale];
  const toggleLocale = () => setLocale((l) => (l === "en" ? "ar" : "en"));

  const { price, title } = tour;
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);

  const [booking, setBooking] = useState({
    userId: user && user.username,
    userEmail: user && user.email,
    tourName: title,
    fullName: "",
    phone: "",
    bookAt: "",
    groupSize: "",
  });

  const [isBookingSuccessful, setIsBookingSuccessful] = useState(false);
  const [isBookingFailed, setIsBookingFailed] = useState(false);
  const [isLoginAlertVisible, setIsLoginAlertVisible] = useState(false);

  const handleChange = (e) => {
    setBooking((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleConfirmPayment = async () => {
    toggle();
    try {
      const response = await fetch(`${BASE_URL}/booking`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(booking),
      });

      if (response.ok) {
        setIsBookingSuccessful(true);
        setIsBookingFailed(false);
        setBooking({ ...booking, fullName: "", phone: "", bookAt: "", groupSize: "" });
        setTimeout(() => navigate("/thank-you"), 1000);
      } else {
        setIsBookingSuccessful(false);
        setIsBookingFailed(true);
      }
    } catch {
      setIsBookingSuccessful(false);
      setIsBookingFailed(true);
    }
  };

  const handleBookNow = (e) => {
    e.preventDefault();
    if (!user) {
      setIsLoginAlertVisible(true);
      return;
    }
    toggle();
  };

  const currentDate = new Date().toISOString().split("T")[0];
  const taxes = (0.05 * price * (booking.groupSize || 1)).toFixed(2);
  const total = (price * (booking.groupSize || 1) * 1.05).toFixed(2);

  return (
    <div className="booking" style={{ position: "relative" }}>
      <button
        className="lang-toggle btn secondary"
        onClick={toggleLocale}
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          zIndex: 1000,
          padding: "6px 12px",
          borderRadius: "8px",
        }}
      >
        {t.toggleLabel}
      </button>

      {isBookingSuccessful && <Alert color="success">{t.bookingSuccess}</Alert>}
      {isBookingFailed && <Alert color="danger">{t.bookingFail}</Alert>}
      {isLoginAlertVisible && <Alert color="warning">{t.loginAlert}</Alert>}

      <div className="booking__top d-flex align-items-center justify-content-between">
        <h3>
          ${price} <span>/ {t.perPerson}</span>
        </h3>
        <span className="tour__rating d-flex align-items-center gap-1">
          <i className="ri-star-fill"></i>
          {avgRating === 0 ? null : avgRating}
          {totalRating === 0 ? <span>{t.notRated}</span> : <span>({reviews.length || 0})</span>}
        </span>
      </div>

      <div className="booking__form">
        <h5>{t.information}</h5>
        <Form className="booking__info-form" onSubmit={handleBookNow}>
          <FormGroup>
            <Input type="text" placeholder={t.fullName} id="fullName" required onChange={handleChange} value={booking.fullName} />
          </FormGroup>
          <FormGroup>
            <Input type="number" placeholder={t.phone} id="phone" required onChange={handleChange} value={booking.phone} />
          </FormGroup>
          <FormGroup className="d-flex align-items-center gap-3">
            <Input type="date" placeholder={t.date} id="bookAt" required onChange={handleChange} value={booking.bookAt} min={currentDate} />
            <Input type="number" placeholder={t.groupSize} id="groupSize" required onChange={handleChange} value={booking.groupSize} />
          </FormGroup>
        </Form>
      </div>

      <div className="booking__bottom">
        <ListGroup>
          <ListGroupItem className="border-0 px-0">
            <h5 className="d-flex align-items-center gap-1">
              ${price} <i className="ri-close-line"></i> {booking.groupSize || 1} Person
            </h5>
            <span>${price * (booking.groupSize || 1)}</span>
          </ListGroupItem>
          <ListGroupItem className="border-0 px-0">
            <h5>{t.taxes}</h5>
            <span>${taxes}</span>
          </ListGroupItem>
          <ListGroupItem className="border-0 px-0 total">
            <h5>{t.total}</h5>
            <span>${total}</span>
          </ListGroupItem>
        </ListGroup>
        <Button className="btn primary__btn w-100 mt-4" onClick={handleBookNow}>
          {t.bookNow}
        </Button>
      </div>

      <Modal isOpen={modal} toggle={toggle} centered>
        <ModalHeader toggle={toggle}>{t.paymentInfo}</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="cardName">
                <FaUser style={{ marginRight: "8px" }} />
                {t.cardName}
              </Label>
              <Input id="cardName" placeholder="John Doe" />
            </FormGroup>
            <FormGroup>
              <Label for="cardNumber">
                <FaCreditCard style={{ marginRight: "8px" }} />
                {t.cardNumber}
              </Label>
              <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
            </FormGroup>
            <FormGroup className="d-flex gap-2">
              <div style={{ flex: 1 }}>
                <Label for="expiry">
                  <FaCalendarAlt style={{ marginRight: "8px" }} />
                  {t.expiry}
                </Label>
                <Input id="expiry" placeholder="MM/YY" />
              </div>
              <div style={{ flex: 1 }}>
                <Label for="cvc">
                  <FaLock style={{ marginRight: "8px" }} />
                  {t.cvc}
                </Label>
                <Input id="cvc" placeholder="123" />
              </div>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="success" onClick={handleConfirmPayment}>
            {t.confirm}
          </Button>
          <Button color="secondary" onClick={toggle}>
            {t.cancel}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default Booking;
