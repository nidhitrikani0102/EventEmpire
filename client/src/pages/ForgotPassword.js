import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [step, setStep] = useState(1); // 1: Request OTP, 2: Reset Password
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleRequestOtp = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
            setStep(2);
            setSuccess('OTP sent to your email. Please check your inbox.');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to send OTP');
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            await axios.post('http://localhost:5000/api/auth/reset-password', {
                email,
                otp,
                newPassword
            });
            setSuccess('Password reset successful. Redirecting to login...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to reset password');
        }
    };

    return (
        <Container className="mt-5" style={{ maxWidth: '400px' }}>
            <Card className="p-4 shadow">
                <Card.Body>
                    <h2 className="text-center mb-4">
                        {step === 1 ? 'Forgot Password' : 'Reset Password'}
                    </h2>

                    {error && <Alert variant="danger">{error}</Alert>}
                    {success && <Alert variant="success">{success}</Alert>}

                    {step === 1 ? (
                        <Form onSubmit={handleRequestOtp}>
                            <p className="text-muted mb-3">
                                Enter your email address to receive a password reset OTP.
                            </p>
                            <Form.Group className="mb-3">
                                <Form.Label>Email Address</Form.Label>
                                <Form.Control
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            <Button variant="primary" type="submit" className="w-100 mb-2">
                                Send OTP
                            </Button>
                            <Button variant="link" className="w-100" onClick={() => navigate('/login')}>
                                Back to Login
                            </Button>
                        </Form>
                    ) : (
                        <Form onSubmit={handleResetPassword}>
                            <p className="text-muted mb-3">
                                Enter the OTP sent to {email} and your new password.
                            </p>
                            <Form.Group className="mb-3">
                                <Form.Label>OTP</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>New Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            <Button variant="primary" type="submit" className="w-100 mb-2">
                                Reset Password
                            </Button>
                            <Button variant="link" className="w-100" onClick={() => setStep(1)}>
                                Back
                            </Button>
                        </Form>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default ForgotPassword;
