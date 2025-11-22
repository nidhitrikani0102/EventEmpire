import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, ListGroup, Form, Button, Card } from 'react-bootstrap';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Messages = () => {
    const [conversations, setConversations] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const { user } = useContext(AuthContext);
    const [searchParams] = useSearchParams();
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    useEffect(() => {
        fetchConversations();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const chatWithId = searchParams.get('chatWith');
        if (chatWithId) {
            const existingConversation = conversations.find(c => c._id === chatWithId);
            if (existingConversation) {
                setCurrentChat(existingConversation);
            } else {
                fetchUserDetails(chatWithId);
            }
        }
    }, [searchParams, conversations]);

    useEffect(() => {
        if (currentChat) {
            fetchMessages(currentChat._id);
            const interval = setInterval(() => fetchMessages(currentChat._id), 5000);
            return () => clearInterval(interval);
        }
    }, [currentChat]);

    const fetchUserDetails = async (userId) => {
        try {
            const res = await axios.get(`http://localhost:5000/api/auth/${userId}`);
            setCurrentChat(res.data);
        } catch (err) {
            console.error(err);
            // Fallback if fetch fails, though unlikely with valid ID
            setCurrentChat({ _id: userId, name: 'Unknown User' });
        }
    };

    const fetchConversations = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/messages/conversations', config);
            setConversations(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchMessages = async (userId) => {
        try {
            const res = await axios.get(`http://localhost:5000/api/messages/${userId}`, config);
            setMessages(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteConversation = async () => {
        if (window.confirm('Are you sure you want to delete this conversation? This action cannot be undone.')) {
            try {
                await axios.delete(`http://localhost:5000/api/messages/conversations/${currentChat._id}`, config);
                setConversations(conversations.filter(c => c._id !== currentChat._id));
                setCurrentChat(null);
                setMessages([]);
            } catch (err) {
                console.error(err);
                if (err.response) {
                    // Server responded with a status code outside 2xx
                    const errorMsg = err.response.data?.error || err.response.data?.message || 'Failed to delete conversation';
                    alert(`Server Error: ${errorMsg}`);
                } else if (err.request) {
                    // Request was made but no response received
                    alert('Network Error: No response from server. Please check your connection.');
                } else {
                    // Something happened in setting up the request
                    alert(`Error: ${err.message}`);
                }
            }
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !currentChat) return;

        try {
            const res = await axios.post('http://localhost:5000/api/messages', {
                receiverId: currentChat._id, // Changed from recipientId to receiverId to match backend
                content: newMessage
            }, config);
            setMessages([...messages, res.data]);
            setNewMessage('');
            if (!conversations.find(c => c._id === currentChat._id)) {
                fetchConversations();
            }
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || 'Failed to send message');
        }
    };

    return (
        <Container className="mt-4" style={{ height: '80vh' }}>
            <Row className="h-100">
                <Col md={4} className="border-end">
                    <h4 className="mb-3">Conversations</h4>
                    <ListGroup variant="flush">
                        {conversations.map((c) => (
                            <ListGroup.Item
                                key={c._id}
                                action
                                active={currentChat?._id === c._id}
                                onClick={() => setCurrentChat(c)}
                            >
                                {c.name}
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Col>
                <Col md={8} className="d-flex flex-column h-100">
                    {currentChat ? (
                        <>
                            <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
                                <h5>{currentChat.name}</h5>
                                <Button variant="outline-danger" size="sm" onClick={handleDeleteConversation}>
                                    <i className="bi bi-trash me-1"></i> Delete Conversation
                                </Button>
                            </div>
                            <div className="flex-grow-1 overflow-auto p-3" style={{ backgroundColor: '#f8f9fa' }}>
                                {messages.map((msg, index) => (
                                    <div
                                        key={index}
                                        className={`d-flex mb-2 ${msg.sender === user._id ? 'justify-content-end' : 'justify-content-start'}`}
                                    >
                                        <Card
                                            body
                                            className={`p-2 ${msg.sender === user._id ? 'bg-primary text-white' : 'bg-white'}`}
                                            style={{ maxWidth: '70%', borderRadius: '15px' }}
                                        >
                                            {msg.content}
                                        </Card>
                                    </div>
                                ))}
                            </div>
                            <div className="p-3 border-top">
                                <Form onSubmit={handleSendMessage} className="d-flex gap-2">
                                    <Form.Control
                                        type="text"
                                        placeholder="Type a message..."
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                    />
                                    <Button type="submit" variant="primary">Send</Button>
                                </Form>
                            </div>
                        </>
                    ) : (
                        <div className="d-flex align-items-center justify-content-center h-100 text-muted">
                            Select a conversation to start messaging
                        </div>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default Messages;
