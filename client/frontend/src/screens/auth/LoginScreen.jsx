import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
// Components
import FormContainer from '../../components/common/FormContainer';
import Loader from '../../components/common/Loader';
// Slices
import { useLoginMutation } from '../../slices/usersApiSlice';
import { setCredentials } from '../../slices/authSlice';

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [loginApiCall, { isLoading }] = useLoginMutation();

    // Get user info from the global state
    const { userInfo } = useSelector((state) => state.auth);

    // Search params to implement redirection functionality
    const { search } = useLocation();
    const searchParams = new URLSearchParams(search);
    const redirect = searchParams.get('redirect') || '/'; // checks if there is the redirect in the params. If not then /

    // Redirected if logged in
    useEffect(() => {
        if (userInfo) {
            navigate(redirect);
        }
    },[userInfo, redirect, navigate])

    const submitHandler = async (e) => {
        e.preventDefault();
        // Login user
        try {
            // Login user using login from userLoginMutation (post request to back-end)
            const res = await loginApiCall({email, password}).unwrap(); // unwrap the resolved value from the promise
            // Update the user state using the setCredentials
            dispatch(setCredentials({...res}));
            // Redirect the user
            navigate(redirect);
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };


  return (
    <FormContainer>
        <h1>Sign In</h1>
        <Form onSubmit={submitHandler}>
            {/* Email */}
            <Form.Group controlId='email' className='my-3'>
                <Form.Label>Email:</Form.Label>
                <Form.Control
                    type='email'
                    placeholder='Insert email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                ></Form.Control>
            </Form.Group>
            {/* Password */}
            <Form.Group controlId='password' className='my-3'>
                <Form.Label>Password:</Form.Label>
                <Form.Control
                    type='password'
                    placeholder='Insert password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                ></Form.Control>
            </Form.Group>
            {/* Submit Button */}
            <Button type='submit' variant='primary' className='mt-2' disabled={isLoading}>
                Sign In
            </Button>
            { isLoading && <Loader />}
        </Form>

        <Row className='py-3'>
            <Col>
                Don't you have an account? <Link to={ redirect ? `/register?redirect=${redirect}` : '/register'}>Register</Link>
            </Col>
        </Row>
    </FormContainer>
  )
}

export default LoginScreen