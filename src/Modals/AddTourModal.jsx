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

const AddTourModal = ({ isOpen, toggle, onTourAdded }) => {
  const [title, setTitle] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [distance, setDistance] = useState("");
  const [photo, setPhoto] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [maxGroupSize, setMaxGroupSize] = useState("");
  const [featured, setFeatured] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const tourData = {
      title,
      city,
      address,
      distance: Number(distance),
      photo,
      desc,
      price: Number(price),
      maxGroupSize: Number(maxGroupSize),
      featured,
    };

    try {
      const response = await axios.post(`${BASE_URL}/tours/`, tourData, {
        withCredentials: true,
      });
      onTourAdded(response.data.data || response.data);
      // Reset the form fields
      setTitle("");
      setCity("");
      setAddress("");
      setDistance("");
      setPhoto("");
      setDesc("");
      setPrice("");
      setMaxGroupSize("");
      setFeatured(false);
    } catch (err) {
      console.error("Failed to add tour", err);
      alert("Failed to add tour. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Add New Tour</ModalHeader>
      <Form onSubmit={handleSubmit}>
        <ModalBody>
          <FormGroup>
            <Label for="title">Title</Label>
            <Input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label for="city">City</Label>
            <Input
              id="city"
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label for="address">Address</Label>
            <Input
              id="address"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label for="distance">Distance (km)</Label>
            <Input
              id="distance"
              type="number"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label for="photo">Photo</Label>
            <Input id="photo" type="file" onChange={handleImageChange} required />
            {photo && (
              <img
                src={photo}
                alt="Preview"
                style={{ width: "100%", height: "auto", marginTop: "10px" }}
              />
            )}
          </FormGroup>
          <FormGroup>
            <Label for="desc">Description</Label>
            <Input
              id="desc"
              type="textarea"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label for="price">Price</Label>
            <Input
              id="price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label for="maxGroupSize">Max Group Size</Label>
            <Input
              id="maxGroupSize"
              type="number"
              value={maxGroupSize}
              onChange={(e) => setMaxGroupSize(e.target.value)}
              required
            />
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
          <Button color="secondary" onClick={toggle} disabled={loading}>
            Cancel
          </Button>
          <Button color="primary" type="submit" disabled={loading}>
            {loading ? <Spinner size="sm" /> : "Add Tour"}
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default AddTourModal;
