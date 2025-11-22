import React, { useEffect, useState, useContext } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Alert, Badge, InputGroup } from 'react-bootstrap';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import eventPlaceholder from '../assets/event_placeholder_festive.png';

const UserDashboard = () => {
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [open, setOpen] = useState(false);
    const [newEvent, setNewEvent] = useState({
        name: '',
        date: '',
        time: '',
        location: '',
        mapLink: '',
        type: '',
        description: '',
        organizerName: '',
    });
    const [message, setMessage] = useState(null);
    const [vendorCount, setVendorCount] = useState(0);
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }
        fetchEvents();
        fetchVendorCount();
        if (user) {
            setNewEvent(prev => ({ ...prev, organizerName: user.name }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, token, navigate]);

    useEffect(() => {
        setFilteredEvents(
            events.filter(event =>
                event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.type.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [searchTerm, events]);

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    const fetchEvents = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/events', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEvents(res.data);
        } catch (err) {
            console.error('Error fetching events:', err);
            setMessage({ type: 'danger', text: 'Failed to fetch events.' });
            if (err.response && err.response.status === 401) {
                logout();
                navigate('/login');
            }
        }
    };

    const fetchVendorCount = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/vendors/search');
            setVendorCount(res.data.length);
        } catch (err) {
            console.error('Error fetching vendors:', err);
        }
    };

    const handleCreateEvent = async () => {
        try {
            const res = await axios.post('http://localhost:5000/api/events', newEvent, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEvents([...events, res.data]);
            setOpen(false);
            setNewEvent({
                name: '',
                date: '',
                time: '',
                location: '',
                mapLink: '',
                type: '',
                description: '',
                organizerName: user.name,
            });
            setMessage({ type: 'success', text: 'Event created successfully!' });
        } catch (err) {
            console.error('Error creating event:', err);
            setMessage({ type: 'danger', text: err.response?.data?.message || 'Failed to create event.' });
        }
    };

    const handleDeleteEvent = async (eventId) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                await axios.delete(`http://localhost:5000/api/events/${eventId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setEvents(events.filter(event => event._id !== eventId));
                setMessage({ type: 'success', text: 'Event deleted successfully' });
            } catch (err) {
                console.error('Error deleting event:', err);
                setMessage({ type: 'danger', text: 'Failed to delete event' });
            }
        }
    };

    const handleEventClick = (eventId) => {
        navigate(`/events/${eventId}`);
    };

    const upcomingCount = events.filter(e => new Date(e.date) >= new Date()).length;
    const completedCount = events.filter(e => new Date(e.date) < new Date()).length;

    return (
        <Container className="mt-4">
            {message && (
                <Alert variant={message.type} onClose={() => setMessage(null)} dismissible>
                    {message.text}
                </Alert>
            )}

            {/* Welcome Section with Creative Cards */}
            <div className="mb-4">
                <h1 className="display-5 fw-bold mb-3">Welcome back, {user?.name}!</h1>
                <p className="text-muted fs-5 mb-4">Manage your plans, track budgets, and connect with vendors all in one place.</p>

                <Row className="g-3 mb-4">
                    <Col md={3}>
                        <Card className="h-100 border-0 shadow-sm text-white" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                            <Card.Body className="d-flex align-items-center p-3">
                                <div className="rounded-circle bg-white bg-opacity-25 p-3 me-3">
                                    <i className="bi bi-calendar-event fs-3 text-white"></i>
                                </div>
                                <div>
                                    <h2 className="display-6 fw-bold mb-0">{events.length}</h2>
                                    <p className="mb-0 opacity-75">Total Events</p>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card className="h-100 border-0 shadow-sm text-white" style={{ background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' }}>
                            <Card.Body className="d-flex align-items-center p-3">
                                <div className="rounded-circle bg-white bg-opacity-25 p-3 me-3">
                                    <i className="bi bi-calendar-check fs-3 text-white"></i>
                                </div>
                                <div>
                                    <h2 className="display-6 fw-bold mb-0">{upcomingCount}</h2>
                                    <p className="mb-0 opacity-75">Upcoming</p>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card className="h-100 border-0 shadow-sm text-white" style={{ background: 'linear-gradient(135deg, #ff9966 0%, #ff5e62 100%)' }}>
                            <Card.Body className="d-flex align-items-center p-3">
                                <div className="rounded-circle bg-white bg-opacity-25 p-3 me-3">
                                    <i className="bi bi-shop fs-3 text-white"></i>
                                </div>
                                <div>
                                    <h2 className="display-6 fw-bold mb-0">{vendorCount}</h2>
                                    <p className="mb-0 opacity-75">Vendors</p>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card className="h-100 border-0 shadow-sm bg-white text-primary">
                            <Card.Body className="d-flex flex-column justify-content-center align-items-center p-3 text-center">
                                <Button variant="primary" className="w-100 mb-2" onClick={() => setOpen(true)}>
                                    <i className="bi bi-plus-lg me-2"></i> Create Event
                                </Button>
                                <Button variant="outline-primary" className="w-100" onClick={() => navigate('/messages')}>
                                    <i className="bi bi-chat-dots me-2"></i> Inquiries
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3>Your Events</h3>
            </div>

            <InputGroup className="mb-4" style={{ maxWidth: '400px' }}>
                <InputGroup.Text><i className="bi bi-search"></i></InputGroup.Text>
                <Form.Control
                    placeholder="Search events..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </InputGroup>

            <Row>
                {filteredEvents.length > 0 ? (
                    filteredEvents.map(event => (
                        <Col key={event._id} sm={12} md={6} lg={4} className="mb-4">
                            <Card className="h-100 shadow-sm">
                                <Card.Img variant="top" src={eventPlaceholder} alt="Event Placeholder" style={{ height: '180px', objectFit: 'cover' }} />
                                <Card.Body>
                                    <Card.Title>{event.name}</Card.Title>
                                    <Card.Text className="text-muted mb-1">
                                        <i className="bi bi-calendar me-2"></i>
                                        {new Date(event.date).toLocaleDateString()} at {event.time}
                                    </Card.Text>
                                    <Card.Text className="text-muted mb-2">
                                        <i className="bi bi-geo-alt me-2"></i>
                                        {event.location}
                                    </Card.Text>
                                    <Badge bg="info" className="mb-2">{event.type}</Badge>
                                    <Card.Text className="text-truncate">{event.description}</Card.Text>
                                </Card.Body>
                                <Card.Footer className="bg-white border-top-0 d-flex justify-content-between align-items-center pb-3">
                                    <small className="text-muted">By: {event.organizerName}</small>
                                    <div>
                                        <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleEventClick(event._id)}>
                                            Manage
                                        </Button>
                                        <Button variant="outline-danger" size="sm" onClick={() => handleDeleteEvent(event._id)}>
                                            Delete
                                        </Button>
                                    </div>
                                </Card.Footer>
                            </Card>
                        </Col>
                    ))
                ) : (
                    <Col>
                        <Alert variant="info">No events found. Create one or adjust your search!</Alert>
                    </Col>
                )}
            </Row>

            {/* Create New Event Modal */}
            <Modal show={open} onHide={() => setOpen(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Create New Event</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Event Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={newEvent.name}
                                onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
                                placeholder="Enter event name"
                            />
                        </Form.Group>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={newEvent.date}
                                        onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Time</Form.Label>
                                    <Form.Control
                                        type="time"
                                        value={newEvent.time}
                                        onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group className="mb-3">
                            <Form.Label>Location</Form.Label>
                            <Form.Control
                                type="text"
                                value={newEvent.location}
                                onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                                placeholder="Venue Address"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Google Map Link (Optional)</Form.Label>
                            <Form.Control
                                type="text"
                                value={newEvent.mapLink}
                                onChange={(e) => setNewEvent({ ...newEvent, mapLink: e.target.value })}
                                placeholder="https://maps.google.com/..."
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Type</Form.Label>
                            <Form.Select
                                value={newEvent.type}
                                onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
                            >
                                <option value="">Select Type</option>
                                <option value="Wedding">Wedding</option>
                                <option value="Birthday">Birthday</option>
                                <option value="Corporate">Corporate</option>
                                <option value="Social">Social</option>
                                <option value="Other">Other</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={newEvent.description}
                                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Organizer Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={newEvent.organizerName}
                                onChange={(e) => setNewEvent({ ...newEvent, organizerName: e.target.value })}
                                disabled
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleCreateEvent}>
                        Create Event
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default UserDashboard;
