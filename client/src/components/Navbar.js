import React, { useContext } from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const NavigationBar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (!user) return null;

    const menuItems = user.role === 'vendor' ? [
        { label: 'Dashboard', path: '/vendor-dashboard' },
        { label: 'Messages', path: '/messages' },
    ] : [
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'Find Vendors', path: '/find-vendors' },
        { label: 'Messages', path: '/messages' },
    ];

    return (
        <Navbar bg="primary" variant="dark" expand="lg" className="mb-4" style={{ background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)' }}>
            <Container>
                <Navbar.Brand as={Link} to="/" className="fw-bold">EventEmpire</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        {menuItems.map((item) => (
                            <Nav.Link key={item.label} as={Link} to={item.path} className="text-white">
                                {item.label}
                            </Nav.Link>
                        ))}
                        <Button variant="outline-light" as={Link} to="/profile" className="ms-2">
                            Profile
                        </Button>
                        <Button variant="outline-light" onClick={handleLogout} className="ms-2">
                            Logout
                        </Button>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavigationBar;
