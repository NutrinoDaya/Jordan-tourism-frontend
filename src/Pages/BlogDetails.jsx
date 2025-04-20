import React, { useContext, useEffect, useRef, useState } from "react";
import { Container, Row, Col, Form, ListGroup, Alert } from "reactstrap";
import avtar from "../assets/images/avatar.jpg";
import "../styles/Blogdetails.css";
import useFetch from "../hooks/useFetch";
import { useParams } from "react-router-dom";
import FeaturedBlogsList from "../Components/FeaturedBlogs.jsx/FeaturedBlogsList";
import Subtitle from "../Shared/Subtitle";
import axios from "axios";
import { BASE_URL } from "../utils/config";
import { AuthContext } from "../context/AuthContext";

const BlogDetails = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const commentMsgRef = useRef("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);
  const [comments, setComments] = useState([]);
  const [commentStatus, setCommentStatus] = useState(null);
  const [isLoginAlertVisible, setIsLoginAlertVisible] = useState(false);

  // Get current user from localStorage to check for admin role
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const isAdmin = currentUser?.role === "admin";

  // Fetch blog details
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/blogs/${id}`);
        console.log("Blog data: ", response.data);
        setBlog(response.data);
        // Use blog comments from the blog data if available
        setComments(response.data.comments || []);
        setLoading(false);
      } catch (err) {
        console.log("Error: ", err);
        setError("Error loading blog details.");
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  // Fetch comments with custom hook (if the API returns additional comments)
  const { data: fetchedComments, loading: loadingComments, error: errorComments } = useFetch(`comment/blog/${id}/`);

  useEffect(() => {
    // If there are fetched comments, merge them with the blog's comments.
    if (fetchedComments) {
      setComments(fetchedComments);
    }
  }, [fetchedComments]);

  const options = { day: "numeric", month: "long", year: "numeric" };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!user) {
      setIsLoginAlertVisible(true);
      return;
    }

    const commentMsg = commentMsgRef.current.value.trim();
    if (!commentMsg) return;

    const commentData = {
      comment: commentMsg,
      username: user.username,
    };

    try {
      const response = await axios.post(`${BASE_URL}/comment/${id}`, commentData);
      console.log("response.data : ", response.data);
      // Append the new comment without reloading the page
      setComments((prevComments) => [...prevComments, response.data]);
      commentMsgRef.current.value = "";
      setCommentStatus("success");
    } catch (err) {
      setCommentStatus("error");
    }
  };

  // Delete comment handler for admins
  const handleDeleteComment = async (commentId) => {
    try {
      await axios.get(`${BASE_URL}/comment/${commentId}`);
      // Remove the deleted comment from state
      setComments((prevComments) =>
        prevComments.filter((comment) => comment._id !== commentId)
      );
    } catch (err) {
      console.log("Error deleting comment: ", err);
    }
  };

  if (loading || loadingComments) {
    return (
      <div className="loader-container">
        <div className="loader" />
        <div className="loading-text">Loading...</div>
      </div>
    );
  }

  if (error || !blog || errorComments) {
    console.log("Error : ", error);
    console.log("errorComments : ", errorComments);
    console.log("blog : ", blog);

    return <div className="error__msg">Error loading blog details. Check your network</div>;
  }

  // Destructure blog properties
  const { title, author, createdAt, photo, content } = blog;

  return (
    <>
      <section className="blog-details-section">
        <Container>
          <Row>
            <Col lg="8">
              <article className="blog__content">
                <header className="blog__header">
                  <h2 className="blog__title">{title}</h2>
                  <div className="blog__meta d-flex align-items-center gap-5">
                    <div className="blog__author d-flex align-items-center gap-1">
                      <i className="ri-user-line"></i>
                      <span>{author}</span>
                    </div>
                    <div className="blog__date d-flex align-items-center gap-1">
                      <i className="ri-calendar-line"></i>
                      <span>{new Date(createdAt).toLocaleDateString("en-in", options)}</span>
                    </div>
                    <div className="blog__comments d-flex align-items-center gap-1">
                      <i className="ri-chat-3-line"></i>
                      <span>
                        {comments?.length || 0}{" "}
                        {comments?.length === 1 ? "Comment" : "Comments"}
                      </span>
                    </div>
                  </div>
                </header>
                <section className="blog__body">
                  {photo && (
                    <div className="blog__image">
                      <img src={photo} alt="Blog Visual" />
                    </div>
                  )}
                  <div className="blog__text">
                    <h5>Blog Content</h5>
                    <p>{content}</p>
                  </div>
                </section>
                <section className="blog__reviews mt-4">
                  <h4>Comments</h4>
                  {commentStatus === "success" && (
                    <Alert color="success" toggle={() => setCommentStatus(null)}>
                      Comment successfully added.
                    </Alert>
                  )}
                  {commentStatus === "error" && (
                    <Alert color="danger" toggle={() => setCommentStatus(null)}>
                      Failed to add comment. Please try again.
                    </Alert>
                  )}
                  {isLoginAlertVisible && (
                    <Alert color="warning" toggle={() => setIsLoginAlertVisible(false)}>
                      Please login to add a comment.
                    </Alert>
                  )}
                  <Form onSubmit={submitHandler}>
                    <div className="review__input">
                      <input
                        type="text"
                        placeholder="Share your thoughts"
                        required
                        ref={commentMsgRef}
                      />
                      <button className="primary__btn text-white" type="submit">
                        Submit
                      </button>
                    </div>
                  </Form>
                  <ListGroup className="user__reviews">
                    {comments.map((comment, index) => (
                      <div className="review__item" key={index}>
                        <img src={avtar} alt="User Avatar" />
                        <div className="review__details w-100">
                          <div className="d-flex align-items-center justify-content-between">
                            <div>
                              <h5>{comment.username}</h5>
                              <p>
                                {new Date(comment.createdAt).toLocaleDateString("en-in", options)}
                              </p>
                            </div>
                            {isAdmin && (
                              <i
                                className="ri-delete-bin-line delete-icon"
                                style={{ cursor: "pointer" }}
                                onClick={() => handleDeleteComment(comment._id)}
                              ></i>
                            )}
                          </div>
                          <h6>{comment.comment}</h6>
                        </div>
                      </div>
                    ))}
                  </ListGroup>
                </section>
              </article>
            </Col>
            <Col lg="4">
              <aside className="Featured__blogs">
                <div className="title">
                  <Subtitle subtitle={"Featured Blogs"} />
                </div>
                <div className="mx-auto md:text-center">
                  <FeaturedBlogsList lg={11} md={10} sm={11} />
                </div>
              </aside>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default BlogDetails;
