import React, { useState, useContext } from 'react';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import loginBanner from '../assets/login_banner.png'; // Reusing the login banner for consistency

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'user', secret: '' });
    const [error, setError] = useState('');
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(formData);
            navigate('/login'); // Redirect to login after register
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundImage: `url(${loginBanner})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
        }}>
            <Container style={{ maxWidth: '500px' }}>
                <Card className="p-4 shadow border-0">
                    <Card.Body>
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h2 className="mb-0">Sign Up</h2>
                            <Button variant="outline-secondary" size="sm" as={Link} to="/">
                                <i className="bi bi-house-door me-1"></i> Home
                            </Button>
                        </div>

                        {error && <Alert variant="danger">{error}</Alert>}

                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label>Full Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Email Address</Form.Label>
                                <Form.Control
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>I am a...</Form.Label>
                                <Form.Select
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                >
                                    <option value="user">User (Event Planner)</option>
                                    <option value="vendor">Vendor (Service Provider)</option>
                                    <option value="admin">Admin (Platform Manager)</option>
                                </Form.Select>
                            </Form.Group>

                            {formData.role === 'admin' && (
                                <Form.Group className="mb-3">
                                    <Form.Label>Admin Secret Key</Form.Label>
                                    <Form.Control
                                        type="password"
                                        value={formData.secret}
                                        onChange={(e) => setFormData({ ...formData, secret: e.target.value })}
                                    />
                                </Form.Group>
                            )}

                            <Button variant="primary" type="submit" className="w-100 btn-lg mt-3">
                                Create Account
                            </Button>
                        </Form>
                        <div className="text-center mt-4">
                            <p className="mb-0">Already have an account? <Link to="/login" className="fw-bold">Login</Link></p>
                        </div>
                    </Card.Body>
                </Card>
            </Container>
        </div>
    );
};

export default Register;
