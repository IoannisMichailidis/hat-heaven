import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
// Components
import FormContainer from '../../components/common/FormContainer';
import Loader from '../../components/common/Loader';
// Slices
import { useRegisterMutation } from '../../slices/usersApiSlice';
import { setCredentials } from '../../slices/authSlice';


const RegisterScreen = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Initialization
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [registerApiCall, { isLoading }] = useRegisterMutation();

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
        // Register user
        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        } else {
            try {
                // Login user using login from userLoginMutation (post request to back-end)
                const res = await registerApiCall({name, email, password}).unwrap(); // unwrap the resolved value from the promise
                // Update the user state using the setCredentials
                dispatch(setCredentials({...res}));
                // Redirect the user
                navigate(redirect);
            } catch (err) {
                toast.error(err?.data?.message || err.error);
            }
        }
    };


  return (
    <FormContainer>
        <h1>Register</h1>
        <Form onSubmit={submitHandler}>
            {/* Name */}
            <Form.Group controlId='name' className='my-3'>
                <Form.Label>Name:</Form.Label>
                <Form.Control
                    type='text'
                    placeholder='Insert name'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                ></Form.Control>
            </Form.Group>
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
            {/* Conf Password */}
            <Form.Group controlId='confPassword' className='my-3'>
                <Form.Label>Confirm Password:</Form.Label>
                <Form.Control
                    type='password'
                    placeholder='Confirm password'
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                ></Form.Control>
            </Form.Group>
            {/* Submit Button */}
            <Button type='submit' variant='primary' className='mt-2' disabled={isLoading}>
                Register
            </Button>
            { isLoading && <Loader />}
        </Form>

        <Row className='py-3'>
            <Col>
                Already registered? <Link to={ redirect ? `/login?redirect=${redirect}` : '/login'}>Login</Link>
            </Col>
        </Row>
    </FormContainer>
  )
}

export default RegisterScreen