import React, { useState, useContext } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import loginBanner from '../assets/login_banner.png';
import axios from 'axios';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState(1); // 1: Credentials, 2: OTP
    const [userId, setUserId] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            if (step === 1) {
                const res = await axios.post('http://localhost:5000/api/auth/login', formData);
                if (res.data.requiresOtp) {
                    setUserId(res.data.userId);
                    setStep(2);
                    setSuccess('OTP sent to your email. Please check your inbox.');
                } else {
                    login(res.data.token, res.data);
                    navigate('/dashboard');
                }
            } else {
                const res = await axios.post('http://localhost:5000/api/auth/verify-otp', {
                    userId,
                    otp
                });
                login(res.data.token, res.data);
                navigate(res.data.role === 'vendor' ? '/vendor-dashboard' : '/dashboard');
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Login failed');
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
            <Container style={{ maxWidth: '400px' }}>
                <Card className="p-4 shadow border-0">
                    <Card.Body>
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h2 className="mb-0">Login</h2>
                            <Button variant="outline-secondary" size="sm" as={Link} to="/">
                                <i className="bi bi-house-door me-1"></i> Home
                            </Button>
                        </div>

                        {error && <Alert variant="danger">{error}</Alert>}
                        {success && <Alert variant="success">{success}</Alert>}

                        <Form onSubmit={handleSubmit}>
                            {step === 1 ? (
                                <>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Email Address</Form.Label>
                                        <Form.Control
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>
                                    <Button variant="primary" type="submit" className="w-100 btn-lg">
                                        Login
                                    </Button>
                                    <div className="text-center mt-3">
                                        <Link to="/forgot-password">Forgot Password?</Link>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <Alert variant="info">Enter the OTP sent to your email.</Alert>
                                    <Form.Group className="mb-3">
                                        <Form.Label>OTP</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            required
                                        />
                                    </Form.Group>
                                    <Button variant="primary" type="submit" className="w-100 btn-lg">
                                        Verify OTP
                                    </Button>
                                </>
                            )}
                        </Form>
                        <div className="text-center mt-4">
                            <p className="mb-0">Don't have an account? <Link to="/register" className="fw-bold">Register</Link></p>
                        </div>
                    </Card.Body>
                </Card>
            </Container>
        </div>
    );
};

export default Login;
