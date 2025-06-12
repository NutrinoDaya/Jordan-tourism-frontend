import React from 'react';
import Slider from 'react-slick';
import ava01 from "../../assets/images/ava-1.jpg";
import ava02 from "../../assets/images/ava-2.jpg";
import ava03 from "../../assets/images/ava-3.jpg";

const Testimonials = () => {
  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    speed: 1000,
    swipeToSlide: true,
    autoplaySpeed: 2000,
    slidesToShow: 3,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
          slideToScroll: 1,
          dots: true,
          infinite: true,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
          slideToScroll: 2,
        },
      },
    ],
  };

  // Hard-coded testimonials data
  const testimonialsData = [
    {
      id: 1,
      name: "John Doe",
      role: "Customer",
      image: ava01,
      message: "The service was exceptional, and my trip was unforgettable!",
    },
    {
      id: 2,
      name: "Lia Frank",
      role: "Customer",
      image: ava02,
      message: "A truly wonderful experience. I will definitely book again!",
    },
    {
      id: 3,
      name: "Stefan Hawking",
      role: "Customer",
      image: ava03,
      message: "Highly professional and knowledgeable. Everything was perfect!",
    },
    {
      id: 4,
      name: "Jane Smith",
      role: "Customer",
      image: ava02,
      message: "The best tour I have ever experienced. Very impressed!",
    },
    {
      id: 5,
      name: "Michael Brown",
      role: "Customer",
      image: ava03,
      message: "Amazing tours! Highly recommended for anyone looking to explore.",
    },
  ];

  return (
    <Slider {...settings}>
      {testimonialsData.map((testimonial) => (
        <div key={testimonial.id} className="testimonials py-4 px-3">
          <div className="d-flex align-items-center gap-4 mt-3">
            <img
              src={testimonial.image}
              className="w-25 h-25 rounded-2"
              alt={testimonial.name}
            />
            <div>
              <h6 className="mb-0 mt-3">{testimonial.name}</h6>
              <p>{testimonial.role}</p>
              {testimonial.message && <p>{testimonial.message}</p>}
            </div>
          </div>
        </div>
      ))}
    </Slider>
  );
};

export default Testimonials;
