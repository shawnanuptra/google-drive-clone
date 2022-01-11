import React, { useRef, useState } from "react";
import { Button, Card, Form, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Signup() {
  //declaring refs, so we can access the DOM
  const emailRef = useRef();
  const passwordRef = useRef();
  const passConfRef = useRef();

  //taking signup() from 
  const {signup} = useAuth();

  //error state, if sign up unsuccessful
  const [error, setError] = useState('');

  //loading state, to prevent multiple requests to sign up when it's loading
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    //prevents page from loading
    e.preventDefault();

    let email = emailRef.current.value;
    let password = passwordRef.current.value;
    let passConf = passConfRef.current.value;

    //authenticate password
    if (password !== passConf) {
      // "return" will force to exit out of the function execution
      return setError('Passwords do not match');
    }

    try {
      setError(''); //resets error back to '', so no previous errors are caught
      setLoading(true); //loading..

      await signup(email, password)
    } catch (e) {
      (e.code === 'auth/weak-password') 
      ? setError('Password should be at least 6 characters') 
      : setError('Sign up failed. Please try again.');
    }

    setLoading(false); //loading finished

    
  }

  return (
    <>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Sign Up</h2>

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

            <Form.Group id="password-confirm">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control type="password" required ref={passConfRef} />
            </Form.Group>
            
            <Button className="w-100 mt-4" type="submit" disabled={loading}>
              Sign Up
            </Button>

          </Form>

        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        Already have an account? <Link to="/login">Log In</Link>
      </div>
    </>
  );
}
