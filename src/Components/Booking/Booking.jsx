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

const Booking = ({ tour, avgRating, totalRating, reviews }) => {
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
    toggle(); // Close the modal
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
    } catch (error) {
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
    toggle(); // Open modal
  };

  const currentDate = new Date().toISOString().split("T")[0];
  const taxes = (0.05 * price * (booking.groupSize || 1)).toFixed(2);
  const total = (price * (booking.groupSize || 1) * 1.05).toFixed(2);

  return (
    <div className="booking">
      {isBookingSuccessful && <Alert color="success">Booking Successful</Alert>}
      {isBookingFailed && <Alert color="danger">Failed to book. Please try again.</Alert>}
      {isLoginAlertVisible && <Alert color="warning">Please login to proceed with the booking.</Alert>}

      <div className="booking__top d-flex align-items-center justify-content-between">
        <h3>
          ${price} <span>/Per Person</span>
        </h3>
        <span className="tour__rating d-flex align-items-center gap-1">
          <i className="ri-star-fill"></i>
          {avgRating === 0 ? null : avgRating}
          {totalRating === 0 ? <span>Not Rated</span> : <span>({reviews.length || 0})</span>}
        </span>
      </div>

      <div className="booking__form">
        <h5>Information</h5>
        <Form className="booking__info-form" onSubmit={handleBookNow}>
          <FormGroup>
            <input type="text" placeholder="Full Name" id="fullName" required onChange={handleChange} value={booking.fullName} />
          </FormGroup>
          <FormGroup>
            <input type="number" placeholder="Phone" id="phone" required onChange={handleChange} value={booking.phone} />
          </FormGroup>
          <FormGroup className="d-flex align-items-center gap-3">
            <input type="date" placeholder="Date" id="bookAt" required onChange={handleChange} value={booking.bookAt} min={currentDate} />
            <input type="number" placeholder="Group Size" id="groupSize" required onChange={handleChange} value={booking.groupSize} />
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
            <h5>Taxes</h5>
            <span>${taxes}</span>
          </ListGroupItem>
          <ListGroupItem className="border-0 px-0 total">
            <h5>Total</h5>
            <span>${total}</span>
          </ListGroupItem>
        </ListGroup>
        <Button className="btn primary__btn w-100 mt-4" onClick={handleBookNow}>
          Book Now
        </Button>
      </div>

      {/* Modal for fake payment */}
      <Modal isOpen={modal} toggle={toggle} centered>
        <ModalHeader toggle={toggle}>Payment Information</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="cardName">Cardholder Name</Label>
              <Input id="cardName" placeholder="John Doe" />
            </FormGroup>
            <FormGroup>
              <Label for="cardNumber">Card Number</Label>
              <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
            </FormGroup>
            <FormGroup className="d-flex gap-2">
              <div style={{ flex: 1 }}>
                <Label for="expiry">Expiry</Label>
                <Input id="expiry" placeholder="MM/YY" />
              </div>
              <div style={{ flex: 1 }}>
                <Label for="cvc">CVC</Label>
                <Input id="cvc" placeholder="123" />
              </div>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="success" onClick={handleConfirmPayment}>
            Confirm Payment
          </Button>
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default Booking;
