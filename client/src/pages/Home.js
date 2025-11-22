import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Card, Carousel } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
    const [stats, setStats] = useState({ users: 0, vendors: 0, events: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/stats');
                setStats(res.data);
            } catch (err) {
                console.error('Error fetching stats:', err);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="d-flex flex-column min-vh-100 overflow-hidden">
            {/* Hero Section */}
            <div className="position-relative bg-light text-center py-5 mb-5" style={{ backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                {/* Animated Background Shapes */}
                <div className="bg-shape shape-1 floating floating-delay-1"></div>
                <div className="bg-shape shape-2 floating floating-delay-2"></div>

                <Container className="py-5 position-relative" style={{ zIndex: 1 }}>
                    <div className="d-inline-block mb-3">
                        <h1 className="display-3 fw-bold typing-text">Plan Your Dream Event</h1>
                    </div>
                    <p className="lead mb-4">
                        The all-in-one platform to manage guests, budgets, and vendors for weddings, parties, and corporate events.
                    </p>
                    <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
                        <Button variant="light" size="lg" as={Link} to="/register" className="px-4 gap-3 fw-bold text-primary shadow-sm transform-hover">
                            Get Started Free
                        </Button>
                        <Button variant="outline-light" size="lg" as={Link} to="/login" className="px-4 shadow-sm transform-hover">
                            Login
                        </Button>
                    </div>
                </Container>
            </div>

            {/* Stats Section */}
            <Container className="mb-5">
                <div className="text-center mb-5">
                    <h2 className="fw-bold gradient-text d-inline-block" style={{ background: 'linear-gradient(45deg, #667eea, #764ba2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Our Growing Community</h2>
                    <p className="text-muted">Join thousands of others planning their dream events.</p>
                </div>
                <Row className="g-4 justify-content-center">
                    <Col md={4}>
                        <Card className="h-100 border-0 shadow-sm text-white text-center transform-hover" style={{ background: 'linear-gradient(45deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%)' }}>
                            <Card.Body className="p-5">
                                <div className="display-4 fw-bold mb-2">{stats.users}</div>
                                <div className="fs-5">Happy Users</div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className="h-100 border-0 shadow-sm text-white text-center transform-hover" style={{ background: 'linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)' }}>
                            <Card.Body className="p-5">
                                <div className="display-4 fw-bold mb-2">{stats.vendors}</div>
                                <div className="fs-5">Trusted Vendors</div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className="h-100 border-0 shadow-sm text-white text-center transform-hover" style={{ background: 'linear-gradient(to top, #a18cd1 0%, #fbc2eb 100%)' }}>
                            <Card.Body className="p-5">
                                <div className="display-4 fw-bold mb-2">{stats.events}</div>
                                <div className="fs-5">Events Planned</div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>

            {/* Features Section */}
            <Container className="mb-5">
                <Row className="text-center g-4">
                    <Col md={4}>
                        <Card className="h-100 shadow-sm border-0 transform-hover">
                            <Card.Body className="p-4">
                                <div className="display-4 text-primary mb-3">
                                    <i className="bi bi-calendar-check"></i>
                                </div>
                                <Card.Title as="h3">Event Management</Card.Title>
                                <Card.Text>
                                    Create and manage multiple events. Track dates, locations, and guest lists with ease.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className="h-100 shadow-sm border-0 transform-hover">
                            <Card.Body className="p-4">
                                <div className="display-4 text-primary mb-3">
                                    <i className="bi bi-shop"></i>
                                </div>
                                <Card.Title as="h3">Vendor Discovery</Card.Title>
                                <Card.Text>
                                    Find and connect with top-rated vendors for catering, photography, venues, and more.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className="h-100 shadow-sm border-0 transform-hover">
                            <Card.Body className="p-4">
                                <div className="display-4 text-primary mb-3">
                                    <i className="bi bi-cash-coin"></i>
                                </div>
                                <Card.Title as="h3">Budget Tracking</Card.Title>
                                <Card.Text>
                                    Keep your finances in check. Set budgets, track expenses, and never overspend again.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>

            {/* Testimonials Carousel */}
            <div className="bg-light py-5 mb-5">
                <Container>
                    <h2 className="text-center fw-bold mb-5">What Our Users Say</h2>
                    <Carousel className="text-center" indicators={false} interval={3000}>
                        <Carousel.Item>
                            <div className="d-flex justify-content-center">
                                <Card className="border-0 shadow-sm p-4" style={{ maxWidth: '600px' }}>
                                    <Card.Body>
                                        <div className="mb-3 text-warning">
                                            <i className="bi bi-star-fill"></i>
                                            <i className="bi bi-star-fill"></i>
                                            <i className="bi bi-star-fill"></i>
                                            <i className="bi bi-star-fill"></i>
                                            <i className="bi bi-star-fill"></i>
                                        </div>
                                        <Card.Text className="fs-5 fst-italic">
                                            "EventEmpire made planning my wedding so much easier! The budget tracker is a lifesaver."
                                        </Card.Text>
                                        <Card.Footer className="bg-white border-0 fw-bold">
                                            - Sarah J., Bride
                                        </Card.Footer>
                                    </Card.Body>
                                </Card>
                            </div>
                        </Carousel.Item>
                        <Carousel.Item>
                            <div className="d-flex justify-content-center">
                                <Card className="border-0 shadow-sm p-4" style={{ maxWidth: '600px' }}>
                                    <Card.Body>
                                        <div className="mb-3 text-warning">
                                            <i className="bi bi-star-fill"></i>
                                            <i className="bi bi-star-fill"></i>
                                            <i className="bi bi-star-fill"></i>
                                            <i className="bi bi-star-fill"></i>
                                            <i className="bi bi-star-half"></i>
                                        </div>
                                        <Card.Text className="fs-5 fst-italic">
                                            "As a corporate event planner, finding vendors used to be a hassle. Now it's just a click away."
                                        </Card.Text>
                                        <Card.Footer className="bg-white border-0 fw-bold">
                                            - Mike T., Event Coordinator
                                        </Card.Footer>
                                    </Card.Body>
                                </Card>
                            </div>
                        </Carousel.Item>
                        <Carousel.Item>
                            <div className="d-flex justify-content-center">
                                <Card className="border-0 shadow-sm p-4" style={{ maxWidth: '600px' }}>
                                    <Card.Body>
                                        <div className="mb-3 text-warning">
                                            <i className="bi bi-star-fill"></i>
                                            <i className="bi bi-star-fill"></i>
                                            <i className="bi bi-star-fill"></i>
                                            <i className="bi bi-star-fill"></i>
                                            <i className="bi bi-star-fill"></i>
                                        </div>
                                        <Card.Text className="fs-5 fst-italic">
                                            "I love the guest list management feature. It kept everything organized for my birthday bash!"
                                        </Card.Text>
                                        <Card.Footer className="bg-white border-0 fw-bold">
                                            - Emily R., Party Host
                                        </Card.Footer>
                                    </Card.Body>
                                </Card>
                            </div>
                        </Carousel.Item>
                    </Carousel>
                </Container>
            </div>

            {/* Footer */}
            <footer className="mt-auto py-3 bg-dark text-white text-center">
                <Container>
                    <p className="mb-0">&copy; 2023 EventEmpire. All rights reserved.</p>
                </Container>
            </footer>
        </div>
    );
};

export default Home;
