import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Tab, Nav, Card, Button, Form, Modal, ListGroup, Alert, ProgressBar, Table } from 'react-bootstrap';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const EventPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    const [event, setEvent] = useState(null);
    const [guests, setGuests] = useState([]);
    const [budget, setBudget] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showGuestModal, setShowGuestModal] = useState(false);
    const [newGuest, setNewGuest] = useState({ name: '', email: '' });
    const [message, setMessage] = useState(null);

    // Edit Event State
    const [showEditModal, setShowEditModal] = useState(false);
    const [editEventData, setEditEventData] = useState({
        name: '',
        date: '',
        time: '',
        location: '',
        mapLink: '',
        type: '',
        description: '',
    });

    // Budget State
    const [totalBudget, setTotalBudget] = useState(0);
    const [newExpense, setNewExpense] = useState({ title: '', amount: '', category: '' });
    const [showBudgetModal, setShowBudgetModal] = useState(false);

    useEffect(() => {
        fetchEventDetails();
        fetchGuests();
        fetchBudgetDetails();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    const fetchEventDetails = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/events/${id}`, config);
            setEvent(res.data);
            setEditEventData({
                name: res.data.name,
                date: res.data.date.split('T')[0], // Format for date input
                time: res.data.time,
                location: res.data.location,
                mapLink: res.data.mapLink || '',
                type: res.data.type,
                description: res.data.description,
            });
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
            setMessage({ type: 'danger', text: 'Error fetching event details' });
        }
    };

    const fetchGuests = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/guests/${id}`, config);
            setGuests(res.data);
        } catch (err) {
            console.error("Error fetching guests:", err);
        }
    };

    const fetchBudgetDetails = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/budget/${id}`, config);
            if (res.data) {
                setBudget(res.data);
                setTotalBudget(res.data.totalBudget);
            }
        } catch (err) {
            console.error("Error fetching budget:", err);
        }
    };

    const handleUpdateEvent = async () => {
        try {
            const res = await axios.put(`http://localhost:5000/api/events/${id}`, editEventData, config);
            setEvent(res.data);
            setShowEditModal(false);
            setMessage({ type: 'success', text: 'Event updated successfully' });
        } catch (err) {
            console.error(err);
            setMessage({ type: 'danger', text: 'Error updating event' });
        }
    };

    const handleAddGuest = async () => {
        try {
            await axios.post(`http://localhost:5000/api/guests/${id}/invite`, newGuest, config);
            fetchGuests(); // Refresh guests list
            setShowGuestModal(false);
            setNewGuest({ name: '', email: '' });
            setMessage({ type: 'success', text: 'Guest invited successfully' });
        } catch (err) {
            setMessage({ type: 'danger', text: 'Error adding guest' });
        }
    };

    const handleUpdateBudget = async () => {
        try {
            const res = await axios.post(`http://localhost:5000/api/budget/${id}`, { totalBudget: Number(totalBudget) }, config);
            setBudget(res.data);
            setMessage({ type: 'success', text: 'Budget updated successfully' });
        } catch (err) {
            console.error(err);
            setMessage({ type: 'danger', text: 'Error updating budget' });
        }
    };

    const handleAddExpense = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`http://localhost:5000/api/budget/${id}/expense`, {
                title: newExpense.title,
                amount: Number(newExpense.amount),
                category: newExpense.category
            }, config);

            // Backend returns { budget, alert, remaining }
            setBudget(res.data.budget);
            setNewExpense({ title: '', amount: '', category: '' });
            setShowBudgetModal(false);

            if (res.data.alert) {
                setMessage({ type: 'warning', text: 'Warning: You are close to or have exceeded your budget limit!' });
            } else {
                setMessage({ type: 'success', text: 'Expense added successfully' });
            }
        } catch (err) {
            console.error(err);
            setMessage({ type: 'danger', text: 'Error adding expense' });
        }
    };

    if (loading) return <Container className="mt-4">Loading...</Container>;
    if (!event) return <Container className="mt-4">Event not found</Container>;

    // Budget Calculations
    const totalSpent = budget?.expenses?.reduce((acc, curr) => acc + curr.amount, 0) || 0;
    const remainingBudget = (budget?.totalBudget || 0) - totalSpent;
    const progressVariant = remainingBudget < 0 ? 'danger' : remainingBudget < (budget?.totalBudget * 0.2) ? 'warning' : 'success';
    const progressPercentage = budget?.totalBudget ? Math.min((totalSpent / budget.totalBudget) * 100, 100) : 0;

    return (
        <Container className="mt-4">
            {message && (
                <Alert variant={message.type} onClose={() => setMessage(null)} dismissible>
                    {message.text}
                </Alert>
            )}
            {/* Show persistent warning if budget is exceeded */}
            {remainingBudget < 0 && (
                <Alert variant="danger" className="mb-4">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    <strong>Budget Exceeded!</strong> You have spent ₹{Math.abs(remainingBudget).toFixed(2)} over your budget.
                </Alert>
            )}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>{event.name}</h1>
                <Button variant="outline-secondary" onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
            </div>

            <Tab.Container defaultActiveKey="details">
                <Nav variant="tabs" className="mb-3">
                    <Nav.Item>
                        <Nav.Link eventKey="details">Details</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="guests">Guests & Invitations</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="budget">Budget</Nav.Link>
                    </Nav.Item>
                </Nav>

                <Tab.Content>
                    <Tab.Pane eventKey="details">
                        <Card className="shadow-sm">
                            <Card.Body>
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                    <Card.Title className="fs-4">Event Details</Card.Title>
                                    <Button variant="primary" onClick={() => setShowEditModal(true)}>
                                        <i className="bi bi-pencil me-2"></i> Edit Event
                                    </Button>
                                </div>
                                <Row>
                                    <Col md={6}>
                                        <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
                                        <p><strong>Time:</strong> {event.time}</p>
                                        <p><strong>Location:</strong> {event.location}</p>
                                        {event.mapLink && (
                                            <p><strong>Map:</strong> <a href={event.mapLink} target="_blank" rel="noopener noreferrer">View on Google Maps</a></p>
                                        )}
                                        <p><strong>Type:</strong> {event.type}</p>
                                        <p><strong>Organizer:</strong> {event.organizerName}</p>
                                    </Col>
                                    <Col md={6}>
                                        <p><strong>Description:</strong></p>
                                        <p>{event.description}</p>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Tab.Pane>

                    <Tab.Pane eventKey="guests">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h3>Guest List & Invitations</h3>
                            <Button variant="primary" onClick={() => setShowGuestModal(true)}>
                                <i className="bi bi-envelope me-2"></i> Send Invitation
                            </Button>
                        </div>
                        <ListGroup>
                            {guests.length === 0 ? (
                                <ListGroup.Item>No guests invited yet. Click "Send Invitation" to start!</ListGroup.Item>
                            ) : (
                                guests.map((guest, index) => (
                                    <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <strong>{guest.name}</strong> ({guest.email})
                                        </div>
                                        <span className={`badge bg-${guest.isInvited ? 'success' : 'secondary'}`}>
                                            {guest.isInvited ? 'Invited' : 'Not Invited'}
                                        </span>
                                    </ListGroup.Item>
                                ))
                            )}
                        </ListGroup>
                    </Tab.Pane>

                    <Tab.Pane eventKey="budget">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h3>Budget Management</h3>
                            <Button variant="success" onClick={() => setShowBudgetModal(true)}>
                                <i className="bi bi-plus-circle me-2"></i> Add Expense
                            </Button>
                        </div>

                        <Card className="mb-4 shadow-sm">
                            <Card.Body>
                                <Row className="align-items-end">
                                    <Col md={4}>
                                        <Form.Group>
                                            <Form.Label><strong>Total Budget</strong></Form.Label>
                                            <div className="d-flex gap-2">
                                                <Form.Control
                                                    type="number"
                                                    value={totalBudget}
                                                    onChange={(e) => setTotalBudget(e.target.value)}
                                                />
                                                <Button onClick={handleUpdateBudget}>Set</Button>
                                            </div>
                                        </Form.Group>
                                    </Col>
                                    <Col md={4} className="text-center">
                                        <h5>Total Spent</h5>
                                        <h3 className="text-danger">₹{totalSpent.toFixed(2)}</h3>
                                    </Col>
                                    <Col md={4} className="text-center">
                                        <h5>Remaining</h5>
                                        <h3 className={`text-${remainingBudget < 0 ? 'danger' : 'success'}`}>
                                            ₹{remainingBudget.toFixed(2)}
                                        </h3>
                                    </Col>
                                </Row>
                                <div className="mt-3">
                                    <ProgressBar now={progressPercentage} variant={progressVariant} label={`${progressPercentage.toFixed(0)}%`} />
                                </div>
                            </Card.Body>
                        </Card>

                        <h4>Expenses</h4>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Category</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {budget?.expenses?.length > 0 ? (
                                    budget.expenses.map((expense, index) => (
                                        <tr key={index}>
                                            <td>{expense.title}</td>
                                            <td>{expense.category}</td>
                                            <td>₹{expense.amount.toFixed(2)}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="text-center">No expenses recorded yet.</td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </Tab.Pane>
                </Tab.Content>
            </Tab.Container>

            {/* Edit Event Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Event</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Event Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={editEventData.name}
                                onChange={(e) => setEditEventData({ ...editEventData, name: e.target.value })}
                            />
                        </Form.Group>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={editEventData.date}
                                        onChange={(e) => setEditEventData({ ...editEventData, date: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Time</Form.Label>
                                    <Form.Control
                                        type="time"
                                        value={editEventData.time}
                                        onChange={(e) => setEditEventData({ ...editEventData, time: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group className="mb-3">
                            <Form.Label>Location</Form.Label>
                            <Form.Control
                                type="text"
                                value={editEventData.location}
                                onChange={(e) => setEditEventData({ ...editEventData, location: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Google Map Link</Form.Label>
                            <Form.Control
                                type="text"
                                value={editEventData.mapLink}
                                onChange={(e) => setEditEventData({ ...editEventData, mapLink: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Type</Form.Label>
                            <Form.Select
                                value={editEventData.type}
                                onChange={(e) => setEditEventData({ ...editEventData, type: e.target.value })}
                            >
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
                                value={editEventData.description}
                                onChange={(e) => setEditEventData({ ...editEventData, description: e.target.value })}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleUpdateEvent}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Add Guest Modal */}
            <Modal show={showGuestModal} onHide={() => setShowGuestModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Invite Guest</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={newGuest.name}
                                onChange={(e) => setNewGuest({ ...newGuest, name: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                value={newGuest.email}
                                onChange={(e) => setNewGuest({ ...newGuest, email: e.target.value })}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowGuestModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleAddGuest}>
                        Send Invitation
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Add Expense Modal */}
            <Modal show={showBudgetModal} onHide={() => setShowBudgetModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Expense</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleAddExpense}>
                        <Form.Group className="mb-3">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                value={newExpense.title}
                                onChange={(e) => setNewExpense({ ...newExpense, title: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Category</Form.Label>
                            <Form.Select
                                value={newExpense.category}
                                onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                                required
                            >
                                <option value="">Select Category</option>
                                <option value="Venue">Venue</option>
                                <option value="Catering">Catering</option>
                                <option value="Decoration">Decoration</option>
                                <option value="Entertainment">Entertainment</option>
                                <option value="Other">Other</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Amount</Form.Label>
                            <Form.Control
                                type="number"
                                value={newExpense.amount}
                                onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <div className="d-flex justify-content-end gap-2">
                            <Button variant="secondary" onClick={() => setShowBudgetModal(false)}>
                                Cancel
                            </Button>
                            <Button variant="primary" type="submit">
                                Add Expense
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default EventPage;
