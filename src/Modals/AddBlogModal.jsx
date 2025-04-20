import React, { useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Spinner,
} from "reactstrap";
import axios from "axios";
import { BASE_URL } from "../utils/config";
import "./AddBlogModal.css"; // Make sure this path is correct

const AddBlogModal = ({ isOpen, toggle, onBlogAdded }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [photo, setPhoto] = useState("");
  const [featured, setFeatured] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle file input changes and generate a preview image
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission to add a new blog
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const newBlog = { title, content, author, photo, featured };
      const response = await axios.post(`${BASE_URL}/blogs/`, newBlog);
      onBlogAdded(response.data);
      toggle();
      // Reset form fields
      setTitle("");
      setContent("");
      setAuthor("");
      setPhoto("");
      setFeatured(false);
    } catch (err) {
      console.error("Failed to add blog", err);
      setError("Failed to add blog. Please try again.");
    }
    setLoading(false);
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} className="add-blog-modal">
      <ModalHeader toggle={toggle}>Add New Blog</ModalHeader>
      <Form onSubmit={handleSubmit}>
        <ModalBody>
          {error && <p className="error-text">{error}</p>}
          <FormGroup>
            <Label for="blogTitle">Title</Label>
            <Input
              type="text"
              id="blogTitle"
              placeholder="Enter blog title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label for="blogContent">Content</Label>
            <Input
              type="textarea"
              id="blogContent"
              placeholder="Enter blog content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label for="blogAuthor">Author</Label>
            <Input
              type="text"
              id="blogAuthor"
              placeholder="Enter author name"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label for="blogPhoto">Photo</Label>
            <Input
              type="file"
              id="blogPhoto"
              onChange={handlePhotoChange}
              accept="image/*"
            />
            {photo && (
              <div className="preview-image">
                <img src={photo} alt="Preview" />
              </div>
            )}
          </FormGroup>
          <FormGroup check>
            <Label check>
              <Input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
              />{" "}
              Featured
            </Label>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" type="submit" disabled={loading}>
            {loading ? <Spinner size="sm" /> : "Add Blog"}
          </Button>
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default AddBlogModal;
