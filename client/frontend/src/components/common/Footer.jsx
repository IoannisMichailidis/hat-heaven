import React from 'react'
import { Container, Row, Col } from 'react-bootstrap';
import { FaFacebookSquare , FaInstagramSquare, FaTwitterSquare } from 'react-icons/fa';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer>
            <Container>
                <Row>
                    <Col className='text-center py-3'>
                        <p>HatHaven &copy; {currentYear}</p>
                        <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                            <FaFacebookSquare  color='black' size={50}/>
                        </a>
                        <a href="https://www.Instagram.com" target="_blank" rel="noopener noreferrer">
                            <FaInstagramSquare  color='black' size={50}/>
                        </a>
                        <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
                            <FaTwitterSquare  color='black' size={50}/>
                        </a>
                    </Col>
                </Row>
            </Container>
        </footer>
    )
}

export default Footer