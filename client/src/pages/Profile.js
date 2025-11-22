import React, { useState, useContext, useEffect } from 'react';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
    const { user, updateUser } = useContext(AuthContext);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
        }
    }, [user]);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put('http://localhost:5000/api/auth/profile', { name, email }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            updateUser(res.data);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (err) {
            console.error('Error updating profile:', err);
            setMessage({ type: 'danger', text: 'Failed to update profile.' });
        }
    };

    return (
        <Container className="mt-4" style={{ maxWidth: '600px' }}>
            <h2 className="mb-4">Edit Profile</h2>
            {message && (
                <Alert variant={message.type} onClose={() => setMessage(null)} dismissible>
                    {message.text}
                </Alert>
            )}
            <Card className="shadow-sm">
                <Card.Body>
                    <Form onSubmit={handleUpdateProfile}>
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                value={email}
                                disabled
                            />
                            <Form.Text className="text-muted">
                                Email cannot be changed.
                            </Form.Text>
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Save Changes
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Profile;
