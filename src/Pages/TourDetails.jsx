import React, { useState, useRef, useEffect, useContext } from "react";
import { Container, Row, Col, Form, ListGroup, Alert } from "reactstrap";
import { useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import calculateAvgRating from "../utils/avgRating";
import avtar from "../assets/images/avatar.jpg";
import Booking from "../Components/Booking/Booking";
import "../styles/Tourdetails.css";
import axios from "axios";
import { BASE_URL } from "../utils/config";
import { AuthContext } from "../context/AuthContext";
import FAQ from "../Shared/FAQ";

const TourDetails = () => {
  const { id } = useParams();
  const reviewMsgRef = useRef("");
  const [tourRating, setTourRating] = useState(null);
  const [reviews, setReviews] = useState([]);
  const { user } = useContext(AuthContext);
  const [isReviewSuccess, setIsReviewSuccess] = useState(false);
  const [isReviewError, setIsReviewError] = useState(false);
  const [isLoginAlertVisible, setIsLoginAlertVisible] = useState(false);

  // Fetch tour data
  const {
    data: tour,
    loading: loadingTour,
    error: errorTour,
  } = useFetch(`tours/${id}`);

  // Fetch reviews for the tour
  const {
    data: fetchedReviews,
    loading: loadingReviews,
    error: errorReviews,
  } = useFetch(`review/${id}/`);

  // Set reviews from fetch
  useEffect(() => {
    if (fetchedReviews) {
      setReviews(fetchedReviews);
    }
  }, [fetchedReviews]);

  // Loading state
  if (loadingTour || loadingReviews) {
    return (
      <div className="loader-container">
        <div className="loader" />
        <div className="loading-text">Loading...</div>
      </div>
    );
  }

  // Error state
  if (errorTour || !tour || errorReviews) {
    return <div className="error__msg">Error loading tour details. Check your network</div>;
  }

  const { photo, title, desc, price, city, distance, address, maxGroupSize } =
    tour;
  const { totalRating, avgRating } = calculateAvgRating(reviews);
  const options = { day: "numeric", month: "long", year: "numeric" };

  // 🌟 FIX: Added the missing handleRatingClick function
  const handleRatingClick = (value) => {
    setTourRating(value);
  };

  // Handle review submission
  const submitHandler = async (e) => {
    e.preventDefault();

    if (!user) {
      setIsLoginAlertVisible(true);
      return;
    }

    const reviewMsg = reviewMsgRef.current.value;

    if (!reviewMsg || !tourRating) {
      alert("Please provide a rating and a review.");
      return;
    }

    const reviewData = {
      username: user.username,
      reviewText: reviewMsg,
      rating: tourRating,
    };

    try {
      const response = await axios.post(`${BASE_URL}/review/${id}`, reviewData);

      // Update reviews state with the new review from the server response
      setReviews([...reviews, response.data]);

      // Reset form
      setTourRating(null);
      reviewMsgRef.current.value = "";
      setIsReviewSuccess(true);

    } catch (error) {
      console.error("Failed to submit review:", error);
      setIsReviewError(true);
    }
  };

  return (
    <>
      <section>
        <Container>
          <Row>
            <Col lg="8">
              <div className="tour__content">
                <img src={photo} alt="" />

                <div className="tour__info">
                  <h2>{title}</h2>

                  <div className="d-flex align-items-center gap-5">
                    <span className="tour__rating d-flex align-items-center gap-1">
                      <i className="ri-star-fill"></i>
                      {avgRating === 0 ? "Not Rated" : avgRating}
                      {totalRating > 0 && <span>({reviews.length})</span>}
                    </span>

                    <span>
                      <i className="ri-map-pin-user-fill"></i> {address}
                    </span>
                  </div>

                  <div className="tour__extra-details">
                    <span><i className="ri-map-pin-2-line"></i> {city}</span>
                    <span><i className="ri-money-dollar-circle-line"></i> ${price} /per person</span>
                    <span><i className="ri-map-pin-line"></i> {distance} k/m</span>
                    <span><i className="ri-group-line"></i> {maxGroupSize} people</span>
                  </div>

                  <h5>Description</h5>
                  <p>{desc}</p>
                </div>

                <div className="tour__reviews mt-4">
                  <h4>Reviews ({reviews?.length || 0} reviews)</h4>

                  {isReviewSuccess && (
                    <Alert color="success" toggle={() => setIsReviewSuccess(false)}>
                      Review Submitted Successfully!
                    </Alert>
                  )}
                  {isReviewError && (
                    <Alert color="danger" toggle={() => setIsReviewError(false)}>
                      Failed to submit review. Please try again.
                    </Alert>
                  )}
                  {isLoginAlertVisible && (
                    <Alert color="warning" toggle={() => setIsLoginAlertVisible(false)}>
                      Please login to submit a review.
                    </Alert>
                  )}

                  <Form onSubmit={submitHandler}>
                    <div className="d-flex align-items-center gap-3 mb-4 rating__group">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <span
                          key={value}
                          onClick={() => handleRatingClick(value)}
                          className={tourRating >= value ? "active" : ""}
                        >
                          {value} <i className="ri-star-s-fill"></i>
                        </span>
                      ))}
                    </div>

                    <div className="review__input">
                      <input
                        type="text"
                        ref={reviewMsgRef}
                        placeholder="Share your thoughts"
                        required
                      />
                      <button className="primary__btn text-white" type="submit">
                        Submit
                      </button>
                    </div>
                  </Form>

                  <ListGroup className="user__reviews">
                    {reviews?.map((review) => (
                      <div className="review__item" key={review._id}>
                        <img src={avtar} alt="" />
                        <div className="w-100">
                          <div className="d-flex align-items-center justify-content-between">
                            <div>
                              <h5>{review.username}</h5>
                              <p>{new Date(review.createdAt).toLocaleDateString("en-US", options)}</p>
                            </div>
                            <span className="d-flex align-items-center">
                              {review.rating} <i className="ri-star-s-fill"></i>
                            </span>
                          </div>
                          <h6>{review.reviewText}</h6>
                        </div>
                      </div>
                    ))}
                  </ListGroup>
                </div>
              </div>
            </Col>
            <Col lg="4">
              <Booking tour={tour} avgRating={avgRating} reviews={reviews} />
            </Col>
          </Row>
        </Container>
      </section>
      <FAQ />
    </>
  );
};

export default TourDetails;