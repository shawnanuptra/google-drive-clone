import React, { useRef, useState } from "react";
import { Button, Card, Form, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import CenteredContainer from "./CenteredContainer";

export default function ForgotPassword() {
    //declaring refs, so we can access the DOM
    const emailRef = useRef();

    //taking login() from 
    const { resetPassword } = useAuth();

    //error state, if log in unsuccessful
    const [error, setError] = useState('');

    //loading state, to prevent multiple requests to log in when it's loading
    const [loading, setLoading] = useState(false);

    //message state
    const [message, setMessage] = useState('');

    async function handleSubmit(e) {
        //prevents page from loading
        e.preventDefault();

        let email = emailRef.current.value;

        try {
            setMessage('');
            setError(''); //resets error back to '', so no previous errors are caught
            setLoading(true); //loading..

            await resetPassword(email);
            setMessage('Check your inbox for further instructions');

        } catch (e) {
            (e.code === 'auth/user-not-found') ? setError('Account with this email does not exist. Please sign up.') : setError('Log in failed. Please try again.');
        }

        setLoading(false); //loading finished


    }

    return (
        <CenteredContainer>
            <Card>
                <Card.Body>
                    <h2 className="text-center mb-4">Reset Password</h2>

                    <Form onSubmit={handleSubmit}>
                        {/* if (error = ''), (error &&) will result to false. If the condition is true, the element right after && will appear in the output. If it is false, React will ignore and skip it.,  */}
                        {error && <Alert variant="danger">{error}</Alert>}
                        {message && <Alert variant="success">{message}</Alert>}
                        <Form.Group id="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" required ref={emailRef} />
                        </Form.Group>

                        <Button className="w-100 mt-4" type="submit" disabled={loading}>
                            Reset Password
                        </Button>

                    </Form>
                    <div className="w-100 text-center mt-3">
                        <Link to='/login'>Login</Link>
                    </div>
                </Card.Body>
            </Card>
            <div className="w-100 text-center mt-2">
                Don't have an account yet? <Link to="/signup">Sign up</Link>
            </div>
        </CenteredContainer>
    );
}