import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const VendorSearch = () => {
    const [vendors, setVendors] = useState([]);
    const [filters, setFilters] = useState({ serviceType: '', location: '' });
    const navigate = useNavigate();

    const searchVendors = async () => {
        try {
            const params = new URLSearchParams();
            if (filters.serviceType) params.append('serviceType', filters.serviceType);
            if (filters.location) params.append('location', filters.location);

            const res = await axios.get(`http://localhost:5000/api/vendors/search?${params.toString()}`);
            setVendors(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        searchVendors();
    }, []);

    return (
        <Container className="mt-4">
            <Button variant="link" onClick={() => navigate('/dashboard')} className="mb-3 ps-0">
                &larr; Back to Dashboard
            </Button>
            <h2 className="mb-4">Find Vendors</h2>

            <div className="d-flex gap-2 mb-4">
                <Form.Select
                    value={filters.serviceType}
                    onChange={(e) => setFilters({ ...filters, serviceType: e.target.value })}
                    style={{ maxWidth: '200px' }}
                >
                    <option value="">All Services</option>
                    <option value="Venue">Venue</option>
                    <option value="Catering">Catering</option>
                    <option value="Photography">Photography</option>
                    <option value="Music">Music/DJ</option>
                    <option value="Decoration">Decoration</option>
                </Form.Select>
                <Form.Control
                    type="text"
                    placeholder="Location"
                    value={filters.location}
                    onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                    style={{ maxWidth: '300px' }}
                />
                <Button variant="primary" onClick={searchVendors}>Search</Button>
            </div>

            <Row xs={1} md={3} className="g-4">
                {vendors.length === 0 ? (
                    <Col xs={12}>
                        <Alert variant="info">No vendors found matching your criteria.</Alert>
                    </Col>
                ) : (
                    vendors.map((vendor) => (
                        <Col key={vendor._id}>
                            <Card className="h-100">
                                <Card.Body>
                                    <Card.Title>{vendor.user?.name || 'Vendor'}</Card.Title>
                                    <Card.Subtitle className="mb-2 text-muted">{vendor.serviceType}</Card.Subtitle>
                                    <Card.Text>
                                        <strong>Location:</strong> {vendor.location}<br />
                                        <strong>Price:</strong> {vendor.pricing}<br />
                                        <small>{vendor.description}</small>
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                )}
            </Row>
        </Container>
    );
};

export default VendorSearch;
