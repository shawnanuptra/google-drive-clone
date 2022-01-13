import React, { useState } from 'react'
import { Card, Alert, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {Link} from 'react-router-dom';
import CenteredContainer from './CenteredContainer';

export default function Profile() {

    const history = useNavigate();
    const [error, setError] = useState('');

    const { currentUser, logout } = useAuth();

    async function handleLogOut() {
        setError('')
        try {
            await logout();
            history('/login');
            
        } catch {
            setError('Log out failed. Please try again');
        }

    }
    return (
        <CenteredContainer>
            <Card>
                <Card.Body>
                    <h2 className='text-center mb-4'>Profile</h2>
                    {error && <Alert variant='danger'>{error}</Alert>}

                    <strong>Email: </strong> {currentUser.email}

                    <Link to='/update-profile' className="btn btn-primary w-100 mt-3">Update Profile</Link>
                </Card.Body>
            </Card>

            <div className='w-100 text-center mt-2'>
                <Button variant='link' onClick={handleLogOut}>Log Out</Button>
            </div>
        </CenteredContainer>
    )
}
