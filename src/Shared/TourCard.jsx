import React from "react";
import { Card, CardBody } from "reactstrap";
import { Link } from "react-router-dom";
import "./Tourcard.css";
import calculateAvgRating from "../utils/avgRating";
import { useEffect } from "react";

const TourCard = ({ tour }) => {
  // 1. Destructure the 'featured' property from the tour object
  const { _id, title, city, photo, price, featured, reviews } = tour;

  const { totalRating, avgRating } = calculateAvgRating(reviews);

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // This useEffect scrolls the window to the top whenever the component mounts.
  // This is generally good for page navigation but might be unexpected on a list page.
  // If this causes unwanted scrolling, you might consider removing it from this card component.
  useEffect(() => {
    // window.scrollTo(0, 0); // Kept as per original code
  }, []);

  return (
    <div className="tour__card">
      <Card>
        <div className="tour__img">
          <Link to={`/tours/${_id}`} onClick={handleScrollToTop}>
            <img src={photo} alt="tour" />
          </Link>
          
          {/* 2. Conditionally render the "Featured" span */}
          {featured && <span>Featured</span>}

        </div>
        <CardBody>
          <div className="card__top d-flex align-items-center justify-content-between">
            <span className="tour__location d-flex align-items-center gap-1">
              <i className="ri-map-pin-line"></i> {city} {/* Minor code cleanup for clarity */}
            </span>
            <span className="tour__rating d-flex align-items-center gap-1">
              <i className="ri-star-fill"></i>
              {avgRating === 0 ? null : avgRating}
              {totalRating === 0 ? (
                "Not Rated"
              ) : (
                <span>({reviews.length})</span>
              )}
            </span>
          </div>

          <h5 className="tour__title">
            <Link to={`/tours/${_id}`} onClick={handleScrollToTop}>
              {title}
            </Link>
          </h5>
          <div className="card__bottom d-flex align-items-center justify-content-between mt-3">
            <h5>
              ${price}
              <span> /Per Person</span>
            </h5>
            <button className="btn booking__btn">
              <Link to={`/tours/${_id}`} onClick={handleScrollToTop}>
                Book Now
              </Link>
            </button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default TourCard;