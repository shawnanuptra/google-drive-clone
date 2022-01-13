import { updateEmail, updatePassword } from "firebase/auth";
import React, { useRef, useState } from "react";
import { Button, Card, Form, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import CenteredContainer from "./CenteredContainer";

export default function UpdateProfile() {
    //declaring refs, so we can access the DOM
    const emailRef = useRef();
    const passwordRef = useRef();
    const passConfRef = useRef();


    const { currentUser } = useAuth();

    //error state, if sign up unsuccessful
    const [error, setError] = useState('');

    //loading state, to prevent multiple requests to sign up when it's loading
    const [loading, setLoading] = useState(false);

    const history = useNavigate();
    async function handleSubmit(e) {
        //prevents page from loading
        e.preventDefault();

        let email = emailRef.current.value;
        let password = passwordRef.current.value;
        let passConf = passConfRef.current.value;

        //validate password
        if (password !== passConf) {
            // "return" will force to exit out of the function execution
            return setError('Passwords do not match');
        }

        //promises to resolve at once
        const promises = [];
        setLoading(true);
        setError('');

        if (email !== currentUser.email) {
            promises.push(updateEmail(currentUser, email))
        }
        if (password) {
            promises.push(updatePassword(currentUser, password))
        }

        //resolve all promises at once
        Promise.all(promises).then( () => {
            history('/user');
        }).catch( (e) => {
            (e.code === 'auth/weak-password')
                ? setError('Password should be at least 6 characters')
                : setError('Failed to update account')
            
        }).finally( () => {setLoading(false)})
    

    }

    return (
        <CenteredContainer>
            <Card>
                <Card.Body>
                    <h2 className="text-center mb-4">Update Profile</h2>

                    <Form onSubmit={handleSubmit}>
                        {/* if (error = ''), (error &&) will result to false. If the condition is true, the element right after && will appear in the output. If it is false, React will ignore and skip it.,  */}
                        {error && <Alert variant="danger">{error}</Alert>}
                        <Form.Group id="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" required ref={emailRef} defaultValue={currentUser.email} />
                        </Form.Group>

                        <Form.Group id="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" ref={passwordRef} placeholder="Leave blank to keep the same" />
                        </Form.Group>

                        <Form.Group id="password-confirm">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control type="password" ref={passConfRef} placeholder="Leave blank to keep the same" />
                        </Form.Group>

                        <Button className="w-100 mt-4" type="submit" disabled={loading}>
                            Update
                        </Button>

                    </Form>

                </Card.Body>
            </Card>
            <div className="w-100 text-center mt-2">
                <Link to="/user">Cancel</Link>
            </div>
        </CenteredContainer>
    );
}
