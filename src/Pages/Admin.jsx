import React, { useEffect, useState } from "react";
import CommonSection from "../Shared/CommonSection";
import {
  Container,
  Row,
  Col,
  Card,
  Nav,
  NavItem,
  NavLink,
  Label,
  Input,
  Button,
  FormGroup,
  Spinner,
} from "reactstrap";
import classnames from "classnames";
import axios from "axios";
import { BASE_URL } from "../utils/config";
import useFetch from "../hooks/useFetch";
import AddUserModal from "../Modals/AddUserModal.jsx";
import AddTourModal from "../Modals/AddTourModal.jsx"; 
import AddBlogModal from "../Modals/AddBlogModal.jsx"; // NEW: import AddBlogModal
import "../styles/Admin.css";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [tours, setTours] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [blogComments, setBlogComments] = useState({});
  const [tourReviews, setTourReviews] = useState({});

  // Modal state
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showAddTourModal, setShowAddTourModal] = useState(false);
  const [showAddBlogModal, setShowAddBlogModal] = useState(false); // NEW: state for Add Blog modal

  // State for inline editing of tours
  const [editingTourId, setEditingTourId] = useState(null);
  const [editedTourData, setEditedTourData] = useState({});

  // Retrieve token from localStorage (if needed for update)
  const userInfo = JSON.parse(localStorage.getItem("user"));
  const token = userInfo?.token;

  // Custom hook fetches
  const { data: usersData, loading: usersLoading } = useFetch("users/getAllUsers");
  const { data: toursData, loading: toursLoading } = useFetch("tours/");
  const { data: blogsData, loading: blogsLoading } = useFetch("blogs/");
  const { data: bookingsData, loading: bookingsLoading } = useFetch("booking//getAllBookings/all");
  const { data: contactsData, loading: contactsLoading } = useFetch("contact/");

  useEffect(() => {
    if (usersData) {
      setUsers(usersData);
    }
  }, [usersData]);

  useEffect(() => {
    if (toursData) {
      setTours(toursData);
    }
  }, [toursData]);

  useEffect(() => {
    if (blogsData) {
      setBlogs(blogsData);
    }
  }, [blogsData]);

  useEffect(() => {
    if (bookingsData) {
      setBookings(bookingsData);
    }
  }, [bookingsData]);

  useEffect(() => {
    if (contactsData) {
      setContacts(contactsData);
    }
  }, [contactsData]);

  useEffect(() => {
    if (blogs.length > 0) {
      blogs.forEach((blog) => {
        axios
          .get(`${BASE_URL}/comment/blog/${blog._id}`) 
          .then((res) => {
            if (res.data && res.data.data) {
              setBlogComments((prev) => ({
                ...prev,
                [blog._id]: res.data.data,
              }));
            }
          })
          .catch((err) => {
            console.error(`Failed to fetch comments for blog ${blog._id}`, err);
          });
      });
    }
  }, [blogs]);
  
  // Fetch reviews for each tour
  useEffect(() => {
    if (tours.length > 0) {
      tours.forEach((tour) => {
        axios
          .get(`${BASE_URL}/review/${tour._id}`)
          .then((res) => {
            if (res.data && res.data.data) {
              setTourReviews((prev) => ({
                ...prev,
                [tour._id]: res.data.data,
              }));
            }
          })
          .catch((err) => {
            console.error(`Failed to fetch reviews for tour ${tour._id}`, err);
          });
      });
    }
  }, [tours]);

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      console.log("Deleting", type, "with id", id);
      await axios.delete(`${BASE_URL}/${type}/${id}`);
      switch (type) {
        case "users":
          setUsers((prev) => prev.filter((u) => u._id !== id));
          break;
        case "tours":
          setTours((prev) => prev.filter((t) => t._id !== id));
          break;
        case "blogs":
          setBlogs((prev) => prev.filter((b) => b._id !== id));
          break;
        case "booking":
          setBookings((prev) => prev.filter((b) => b._id !== id));
          break;
        case "contact":
          setContacts((prev) => prev.filter((c) => c._id !== id));
          break;
        default:
          break;
      }
  
      alert(`${type.slice(0, -1)} deleted successfully!`);
    } catch (err) {
      console.error(`Failed to delete ${type.slice(0, -1)}`, err);
      alert(`Failed to delete ${type.slice(0, -1)}.`);
    }
  };
  
  // --- Users Section ---
  const handleInputChange = (id, field, value) => {
    setUsers((prev) =>
      prev.map((user) =>
        user._id === id ? { ...user, [field]: value } : user
      )
    );
  };

  const updateUser = async (id, userData) => {
    try {
      await axios.put(`${BASE_URL}/users/${id}`, userData);
      alert("User updated!");
    } catch (err) {
      console.error("Update failed", err);
      alert("Failed to update user.");
    }
  };

  // --- Tours Section ---
  const startEditingTour = (tour) => {
    setEditingTourId(tour._id);
    setEditedTourData({ ...tour });
  };

  const cancelEditingTour = () => {
    setEditingTourId(null);
    setEditedTourData({});
  };

  const handleTourInputChange = (field, value) => {
    setEditedTourData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTourImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedTourData((prev) => ({
          ...prev,
          photo: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const updateTour = async (tourId) => {
    try {
      await axios.put(`${BASE_URL}/tours/${tourId}`, editedTourData);
      alert("Tour updated!");
      setTours((prev) =>
        prev.map((tour) =>
          tour._id === tourId ? { ...editedTourData } : tour
        )
      );
      cancelEditingTour();
    } catch (err) {
      console.error("Tour update failed", err);
      alert("Failed to update tour.");
    }
  };

  // Callback when a new user is added from the modal
  const handleUserAdded = (newUser) => {
    setUsers((prevUsers) => [...prevUsers, newUser]);
    setShowAddUserModal(false);
  };

  // Callback when a new tour is added from the modal
  const handleTourAdded = (newTour) => {
    setTours((prevTours) => [...prevTours, newTour]);
    setShowAddTourModal(false);
  };

  // NEW: Callback when a new blog is added from the modal
  const handleBlogAdded = (newBlog) => {
    setBlogs((prevBlogs) => [...prevBlogs, newBlog]);
    setShowAddBlogModal(false);
  };

  return (
    <div>
      <CommonSection title={"Admin Dashboard"} />
      <Container className="mt-4">
        <Nav tabs className="admin__tabs mb-4">
          {["users", "tours", "blogs", "bookings", "contacts"].map((tab) => (
            <NavItem key={tab}>
              <NavLink
                className={classnames({ active: activeTab === tab })}
                onClick={() => toggle(tab)}
                style={{ cursor: "pointer" }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </NavLink>
            </NavItem>
          ))}
        </Nav>

        {/* --- Users Tab --- */}
        {activeTab === "users" && (
          <Row>
            <Col lg="12">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4>Manage Users</h4>
                <Button color="primary" onClick={() => setShowAddUserModal(true)}>
                  Add User
                </Button>
              </div>
              {usersLoading ? (
                <Spinner />
              ) : users.length > 0 ? (
                users.map((user) => (
                  <Card key={user._id} className="mb-3 p-3">
                    <Row>
                      <Col md="3">
                        <FormGroup>
                          <label>Username</label>
                          <Input
                            value={user.username}
                            onChange={(e) =>
                              handleInputChange(user._id, "username", e.target.value)
                            }
                          />
                        </FormGroup>
                      </Col>
                      <Col md="3">
                        <FormGroup>
                          <label>Email</label>
                          <Input
                            value={user.email}
                            onChange={(e) =>
                              handleInputChange(user._id, "email", e.target.value)
                            }
                          />
                        </FormGroup>
                      </Col>
                      <Col md="3">
                        <FormGroup>
                          <label>Role</label>
                          <Input
                            value={user.role}
                            onChange={(e) =>
                              handleInputChange(user._id, "role", e.target.value)
                            }
                          />
                        </FormGroup>
                      </Col>
                      <Col md="3" className="d-flex align-items-end">
                      <div style={{ display: "flex", gap: "10px" }}>
                        <Button
                          color="success"
                          onClick={() =>
                            updateUser(user._id, {
                              username: user.username,
                              email: user.email,
                              role: user.role,
                            })
                          }
                        >
                          Update
                        </Button>
                        <Button
                          color="danger"
                          onClick={() => handleDelete("users", user._id)}
                        >
                          Delete
                        </Button>
                        </div>
                      </Col>
                    </Row>
                  </Card>
                ))
              ) : (
                <p>No users found.</p>
              )}
            </Col>
          </Row>
        )}

        {/* --- Tours Tab --- */}
        {activeTab === "tours" && (
          <Row>
            <Col lg="12">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4>Manage Tours</h4>
                <Button color="primary" onClick={() => setShowAddTourModal(true)}>
                  Add Tour
                </Button>
              </div>
              {toursLoading ? (
                <Spinner />
              ) : tours.length > 0 ? (
                tours.map((tour) => (
                  <Card key={tour._id} className="mb-3 p-3">
                    <Row>
                      <Col md="4">
                        {editingTourId === tour._id ? (
                          <>
                            <Input
                              type="text"
                              value={editedTourData.title || ""}
                              onChange={(e) =>
                                handleTourInputChange("title", e.target.value)
                              }
                              placeholder="Title"
                              className="mb-2"
                            />
                            <Input
                              type="file"
                              onChange={handleTourImageChange}
                              className="mb-2"
                            />
                            {editedTourData.photo && (
                              <img
                                src={editedTourData.photo}
                                alt="Uploaded"
                                style={{ width: "100%", height: "auto" }}
                                className="mb-2"
                              />
                            )}
                          </>
                        ) : (
                          <img
                            src={tour.photo}
                            alt={tour.title}
                            style={{ width: "100%", height: "auto" }}
                          />
                        )}
                      </Col>
                      <Col md="8">
                        {editingTourId === tour._id ? (
                          <>
                            <Input
                              type="text"
                              value={editedTourData.title || ""}
                              onChange={(e) =>
                                handleTourInputChange("title", e.target.value)
                              }
                              placeholder="Title"
                              className="mb-2"
                            />
                            <Input
                              type="textarea"
                              value={editedTourData.desc || ""}
                              onChange={(e) =>
                                handleTourInputChange("desc", e.target.value)
                              }
                              placeholder="Description"
                              className="mb-2"
                            />
                            <Row>
                              <Col md="4">
                                <Input
                                  type="text"
                                  value={editedTourData.city || ""}
                                  onChange={(e) =>
                                    handleTourInputChange("city", e.target.value)
                                  }
                                  placeholder="City"
                                  className="mb-2"
                                />
                              </Col>
                              <Col md="4">
                                <Input
                                  type="text"
                                  value={editedTourData.address || ""}
                                  onChange={(e) =>
                                    handleTourInputChange("address", e.target.value)
                                  }
                                  placeholder="Address"
                                  className="mb-2"
                                />
                              </Col>
                              <Col md="4">
                                <Input
                                  type="number"
                                  value={editedTourData.distance || ""}
                                  onChange={(e) =>
                                    handleTourInputChange("distance", e.target.value)
                                  }
                                  placeholder="Distance"
                                  className="mb-2"
                                />
                              </Col>
                            </Row>
                            <Row>
                              <Col md="4">
                                <Input
                                  type="number"
                                  value={editedTourData.maxGroupSize || ""}
                                  onChange={(e) =>
                                    handleTourInputChange("maxGroupSize", e.target.value)
                                  }
                                  placeholder="Max Group Size"
                                  className="mb-2"
                                />
                              </Col>
                              <Col md="4">
                                <Input
                                  type="number"
                                  value={editedTourData.price || ""}
                                  onChange={(e) =>
                                    handleTourInputChange("price", e.target.value)
                                  }
                                  placeholder="Price"
                                  className="mb-2"
                                />
                              </Col>
                              <Col md="4">
                                <Input
                                  type="checkbox"
                                  checked={editedTourData.featured || false}
                                  onChange={(e) =>
                                    handleTourInputChange("featured", e.target.checked)
                                  }
                                  className="mb-2"
                                />
                                <Label check>Featured</Label>
                              </Col>
                            </Row>
                            <Button
                              color="success"
                              onClick={() => updateTour(tour._id)}
                              className="mr-2"
                            >
                              Save
                            </Button>
                            <Button color="secondary" onClick={cancelEditingTour}>
                              Cancel
                            </Button>
                          </>
                        ) : (
                          <>
                            <h5>{tour.title}</h5>
                            <p>{tour.desc}</p>
                            <p>
                              <strong>City:</strong> {tour.city} <br />
                              <strong>Address:</strong> {tour.address} <br />
                              <strong>Distance:</strong> {tour.distance} km <br />
                              <strong>Max Group Size:</strong> {tour.maxGroupSize} <br />
                              <strong>Price:</strong> ${tour.price} <br />
                              <strong>Featured:</strong> {tour.featured ? "Yes" : "No"}
                            </p>
                            <h6>Tour Reviews:</h6>
                            {tourReviews[tour._id] ? (
                              tourReviews[tour._id].map((review) => (
                                <Card key={review._id} className="mb-2 p-2">
                                  <p>
                                    <strong>Rating:</strong>{" "}
                                    {review.rating || "N/A"}
                                  </p>
                                  <p>{review.comment || review.text || ""}</p>
                                </Card>
                              ))
                            ) : (
                              <p>No reviews found for this tour.</p>
                            )}
                            <div style={{ display: "flex", gap: "10px" }}>
                              <Button color="warning" onClick={() => startEditingTour(tour)}>
                                Edit
                              </Button>
                              <Button color="danger" onClick={() => handleDelete("tours", tour._id)}>
                                Delete
                              </Button>
                            </div>
                          </>
                        )}
                      </Col>
                    </Row>
                  </Card>
                ))
              ) : (
                <p>No tours found.</p>
              )}
            </Col>
          </Row>
        )}

        {/* --- Blogs Tab --- */}
        {activeTab === "blogs" && (
          <Row>
            <Col lg="12">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4>Manage Blogs</h4>
                <Button color="primary" onClick={() => setShowAddBlogModal(true)}>
                  Add Blog
                </Button>
              </div>
              {blogsLoading ? (
                <Spinner />
              ) : blogs.length > 0 ? (
                blogs.map((blog) => (
                  <Card key={blog._id} className="mb-3 p-3">
                    <Row>
                      <Col md="12">
                        {/* Title + Delete Button */}
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div>
                            <h5>{blog.title}</h5>
                            <p>
                              <strong>Author:</strong> {blog.author}
                            </p>
                          </div>
                          <Button
                            color="danger"
                            size="sm"
                            onClick={() => handleDelete("blogs", blog._id)}
                          >
                            Delete
                          </Button>
                        </div>
                        {blog.photo && (
                          <img
                            src={blog.photo}
                            alt={blog.title}
                            style={{
                              width: "50%",
                              maxHeight: "300px",
                              objectFit: "cover",
                              marginBottom: "10px",
                            }}
                          />
                        )}
                        <p>{blog.content}</p>
                        <h6>Comments:</h6>
                        {blogComments[blog._id] ? (
                          blogComments[blog._id].map((comment) => (
                            <Card key={comment._id} className="mb-2 p-2">
                              <p>
                                <strong>
                                  {comment.author ? comment.author + ":" : ""}
                                </strong>{" "}
                                {comment.text}
                              </p>
                            </Card>
                          ))
                        ) : (
                          <p>No comments found.</p>
                        )}
                      </Col>
                    </Row>
                  </Card>
                ))
              ) : (
                <p>No blogs found.</p>
              )}
            </Col>
          </Row>
        )}
        
      {/* --- Bookings Tab --- */}
      {activeTab === "bookings" && (
        <Row>
          <Col lg="12">
            <h4 className="mb-4">Manage Bookings</h4>
            {bookingsLoading ? (
              <Spinner />
            ) : bookings.length > 0 ? (
              bookings.map((booking) => (
                <Card key={booking._id} className="admin__card">
                  <Row>
                    <Col md="6" className="booking__details">
                      <p>
                        <strong>Booking ID:</strong> {booking._id}
                      </p>
                      <p>
                        <strong>Full Name:</strong> {booking.fullName || "N/A"}
                      </p>
                      <p>
                        <strong>Email:</strong> {booking.userEmail || "N/A"}
                      </p>
                      <p>
                        <strong>Phone:</strong> {booking.phone || "N/A"}
                      </p>
                    </Col>
                    <Col md="6" className="booking__details">
                      <p>
                        <strong>Tour Name:</strong> {booking.tourName || "N/A"}
                      </p>
                      <p>
                        <strong>Group Size:</strong> {booking.groupSize || "N/A"}
                      </p>
                      <p>
                        <strong>Booking Date:</strong>{" "}
                        {new Date(booking.bookAt).toLocaleDateString()}
                      </p>
                      <p>
                        <strong>Created At:</strong>{" "}
                        {new Date(booking.createdAt).toLocaleString()}
                      </p>
                      <p>
                        <strong>Updated At:</strong>{" "}
                        {new Date(booking.updatedAt).toLocaleString()}
                      </p>
                      <p>
                        <strong>User ID:</strong> {booking.userId || "N/A"}
                      </p>
                    </Col>
                  </Row>
                </Card>
              ))
            ) : (
              <p>No bookings found.</p>
            )}
          </Col>
        </Row>
      )}


        {/* --- Contacts Tab --- */}
        {activeTab === "contacts" && (
          <Row>
            <Col lg="12">
              <h4 className="mb-4">Manage Contacts</h4>
              {contactsLoading ? (
                <Spinner />
              ) : contacts.length > 0 ? (
                contacts.map((contact) => (
                  <Card key={contact._id} className="mb-3 p-3">
                    <Row>
                      <Col md="12">
                        <p>
                          <strong>Name:</strong> {contact.name}
                        </p>
                        <p>
                          <strong>Email:</strong> {contact.email}
                        </p>
                        <p>
                          <strong>Phone:</strong> {contact.phone}
                        </p>
                        <p>
                          <strong>Message:</strong> {contact.message}
                        </p>
                        <p>
                          <small>
                            Submitted on:{" "}
                            {new Date(contact.createdAt).toLocaleString()}
                          </small>
                        </p>
                        <Button
                          color="danger"
                          onClick={() => handleDelete("contact", contact._id)}
                        >
                          Delete
                        </Button>
                      </Col>
                    </Row>
                  </Card>
                ))
              ) : (
                <p>No contacts found.</p>
              )}
            </Col>
          </Row>
        )}

        {["users", "tours", "blogs", "bookings", "contacts"].indexOf(activeTab) === -1 && (
          <div className="text-center">
            <h5 className="text-muted">Coming soon: {activeTab}</h5>
          </div>
        )}
      </Container>

      {showAddUserModal && (
        <AddUserModal
          isOpen={showAddUserModal}
          toggle={() => setShowAddUserModal(false)}
          onUserAdded={handleUserAdded}
        />
      )}

      {showAddTourModal && (
        <AddTourModal
          isOpen={showAddTourModal}
          toggle={() => setShowAddTourModal(false)}
          onTourAdded={handleTourAdded}
        />
      )}

      {/* NEW: Render AddBlogModal */}
      {showAddBlogModal && (
        <AddBlogModal
          isOpen={showAddBlogModal}
          toggle={() => setShowAddBlogModal(false)}
          onBlogAdded={handleBlogAdded}
        />
      )}
    </div>
  );
};

export default Admin;
