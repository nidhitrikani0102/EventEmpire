import React, { useEffect, useState, useContext } from 'react';
import { Container, Form, Button, Card, Row, Col, Alert, Tab, Nav, Image, Modal } from 'react-bootstrap';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Messages from './Messages'; // Reusing Messages component

const VendorDashboard = () => {
    const [profile, setProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        serviceType: '',
        location: '',
        pricing: '',
        description: '',
    });
    const [message, setMessage] = useState(null);
    const [newImage, setNewImage] = useState('');
    const [showImageModal, setShowImageModal] = useState(false);
    const { user } = useContext(AuthContext);
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchProfile();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    const fetchProfile = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/vendors/profile', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProfile(res.data);
            if (res.data) {
                setFormData({
                    serviceType: res.data.serviceType || '',
                    location: res.data.location || '',
                    pricing: res.data.pricing || '',
                    description: res.data.description || '',
                });
            }
        } catch (err) {
            console.log('No profile found');
        }
    };

    const handleSave = async () => {
        try {
            const res = await axios.post('http://localhost:5000/api/vendors/profile', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProfile(res.data);
            setIsEditing(false);
            setMessage({ type: 'success', text: 'Profile saved successfully' });
        } catch (err) {
            console.error(err);
            setMessage({ type: 'danger', text: 'Error saving profile' });
        }
    };

    const handleAddImage = async () => {
        try {
            const res = await axios.post('http://localhost:5000/api/vendors/portfolio', { imageUrl: newImage }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProfile(res.data);
            setNewImage('');
            setShowImageModal(false);
            setMessage({ type: 'success', text: 'Image added to portfolio' });
        } catch (err) {
            console.error(err);
            setMessage({ type: 'danger', text: 'Error adding image' });
        }
    };

    return (
        <Container className="mt-4">
            <h2 className="mb-4">Vendor Dashboard</h2>
            {message && (
                <Alert variant={message.type} onClose={() => setMessage(null)} dismissible>
                    {message.text}
                </Alert>
            )}

            <Tab.Container defaultActiveKey="profile">
                <Nav variant="tabs" className="mb-3">
                    <Nav.Item>
                        <Nav.Link eventKey="profile">Profile</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="inquiries">Inquiries</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="portfolio">Portfolio</Nav.Link>
                    </Nav.Item>
                </Nav>

                <Tab.Content>
                    <Tab.Pane eventKey="profile">
                        <Row>
                            <Col md={8}>
                                <Card className="shadow-sm">
                                    <Card.Body>
                                        {!profile && !isEditing && (
                                            <Alert variant="info">You haven't set up your profile yet.</Alert>
                                        )}

                                        {isEditing ? (
                                            <Form>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Service Type</Form.Label>
                                                    <Form.Select
                                                        value={formData.serviceType}
                                                        onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                                                    >
                                                        <option value="">Select Service Type</option>
                                                        <option value="Catering">Catering</option>
                                                        <option value="Photography">Photography</option>
                                                        <option value="Venue">Venue</option>
                                                        <option value="Decor">Decor</option>
                                                        <option value="Music">Music</option>
                                                        <option value="Other">Other</option>
                                                    </Form.Select>
                                                </Form.Group>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Location</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        value={formData.location}
                                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                                    />
                                                </Form.Group>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Pricing</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        value={formData.pricing}
                                                        onChange={(e) => setFormData({ ...formData, pricing: e.target.value })}
                                                    />
                                                </Form.Group>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Description</Form.Label>
                                                    <Form.Control
                                                        as="textarea"
                                                        rows={3}
                                                        value={formData.description}
                                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                        placeholder="Describe your services..."
                                                    />
                                                </Form.Group>
                                                <Button variant="success" onClick={handleSave} className="me-2">
                                                    Save Profile
                                                </Button>
                                                <Button variant="secondary" onClick={() => setIsEditing(false)}>
                                                    Cancel
                                                </Button>
                                            </Form>
                                        ) : (
                                            <div>
                                                <p><strong>Service Type:</strong> {profile?.serviceType || 'N/A'}</p>
                                                <p><strong>Location:</strong> {profile?.location || 'N/A'}</p>
                                                <p><strong>Pricing:</strong> {profile?.pricing || 'N/A'}</p>
                                                <p><strong>Description:</strong> {profile?.description || 'N/A'}</p>
                                                <p><strong>Pricing:</strong> {profile?.pricing || 'N/A'}</p>
                                                <Button variant="primary" onClick={() => setIsEditing(true)}>
                                                    Edit Profile
                                                </Button>
                                            </div>
                                        )}
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Tab.Pane>

                    <Tab.Pane eventKey="inquiries">
                        <Messages />
                    </Tab.Pane>

                    <Tab.Pane eventKey="portfolio">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h4>My Portfolio</h4>
                            <Button onClick={() => setShowImageModal(true)}>Add Image</Button>
                        </div>
                        <Row xs={1} md={3} className="g-4">
                            {profile?.portfolio?.map((img, idx) => (
                                <Col key={idx}>
                                    <Card>
                                        <Card.Img variant="top" src={img} style={{ height: '200px', objectFit: 'cover' }} />
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                        {(!profile?.portfolio || profile.portfolio.length === 0) && (
                            <p className="text-muted">No images in portfolio yet.</p>
                        )}
                    </Tab.Pane>
                </Tab.Content>
            </Tab.Container>

            {/* Add Image Modal */}
            <Modal show={showImageModal} onHide={() => setShowImageModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Portfolio Image</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Image URL</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="https://example.com/image.jpg"
                            value={newImage}
                            onChange={(e) => setNewImage(e.target.value)}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowImageModal(false)}>Cancel</Button>
                    <Button variant="primary" onClick={handleAddImage}>Add</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default VendorDashboard;
