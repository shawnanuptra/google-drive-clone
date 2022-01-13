import React, { useRef, useState } from "react";
import { Button, Card, Form, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import CenteredContainer from "./CenteredContainer";

export default function Login() {
    //declaring refs, so we can access the DOM
    const emailRef = useRef();
    const passwordRef = useRef();

    //taking login() from 
    const { login } = useAuth();

    //error state, if log in unsuccessful
    const [error, setError] = useState('');

    //loading state, to prevent multiple requests to log in when it's loading
    const [loading, setLoading] = useState(false);

    const history = useNavigate();

    async function handleSubmit(e) {
        //prevents page from loading
        e.preventDefault();

        let email = emailRef.current.value;
        let password = passwordRef.current.value;

        try {
            setError(''); //resets error back to '', so no previous errors are caught
            setLoading(true); //loading..

            await login(email, password)

            //reroute to <Dashboard />, remove loginpage from history
            history('/', {replace: true});
        } catch (e) {
            (e.code === 'auth/wrong-password')
                ? setError('Password entered is incorrect. Try again')
                : (e.code === 'auth/user-not-found') ? setError('Account with this email does not exist. Please sign up.') : setError('Log in failed. Please try again.');
        }

        setLoading(false); //loading finished


    }

    return (
        <CenteredContainer>
            <Card>
                <Card.Body>
                    <h2 className="text-center mb-4">Log In</h2>

                    <Form onSubmit={handleSubmit}>
                        {/* if (error = ''), (error &&) will result to false. If the condition is true, the element right after && will appear in the output. If it is false, React will ignore and skip it.,  */}
                        {error && <Alert variant="danger">{error}</Alert>}
                        <Form.Group id="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" required ref={emailRef} />
                        </Form.Group>

                        <Form.Group id="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" required ref={passwordRef} />
                        </Form.Group>

                        <Button className="w-100 mt-4" type="submit" disabled={loading}>
                            Log In
                        </Button>

                    </Form>
                    <div className="w-100 text-center mt-3">
                        <Link to='/forgot-password'>Forgot Password?</Link>
                    </div>
                </Card.Body>
            </Card>
            <div className="w-100 text-center mt-2">
                Don't have an account yet? <Link to="/signup">Sign up</Link>
            </div>
        </CenteredContainer>
    );
}
