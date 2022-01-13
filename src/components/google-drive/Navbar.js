import React from 'react'
import { Navbar, Nav, Container } from 'react-bootstrap'
import { Link } from 'react-router-dom'

// NavbarComponent not Navbar, because Navbar is the imported component default name from Bootstrap
export default function NavbarComponent() {
    return (
        <Navbar bg='light' expand='sm'>
            <Container>
                <Navbar.Brand as={Link} to='/'>
                    Shawn's Drive
                </Navbar.Brand>
                <Nav>
                    <Nav.Link as={Link} to='/user'>
                        Profile
                    </Nav.Link>
                </Nav>
            </Container>
        </Navbar>
    )
}
