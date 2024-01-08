import { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Image} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
// Components
import Loader from '../../components/common/Loader';
// Slices
import { useProfileMutation } from '../../slices/usersApiSlice';
import { setCredentials } from '../../slices/authSlice';
// Images
import homeImage from '../../assets/homeImage.jpg';

const ProfileScreen = () => {
    // Local state
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Initialization
    const dispatch = useDispatch();

    // Get user info from global state
    const { userInfo } = useSelector((state) => state.auth);

    // Api Slices
    const [updateProfile, { isLoading: loadingUpdateProfile }] = useProfileMutation();

    // Align local with global state
    useEffect(() => {
        if (userInfo) {
            setName(userInfo.name);
            setEmail(userInfo.email);
        }
    }, [userInfo])

    const submitHandler = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error('Password do not match');
        } else {
            try {
                // Api Slice
                const res = await updateProfile({ _id:userInfo._id, name, email, password }).unwrap(); // unwrap the resolved value from the promise
                // State Slice (upate the credentials)
                dispatch(setCredentials(res));
                toast.success('Profile updated successfully');
            } catch (err) {
                toast.error(err?.data?.message || err?.error );
            }
        }
    }

  return (
    <Row className="justify-content-md-center align-items-center" >
        <Col md={4} >
            <Image src={homeImage} alt='home image' fluid style={{height: '400px', width: '100%', objectFit: 'cover'}} className='mb-4'/>
        </Col>
        <Col md={4}>
            <h2>User Profile</h2>
            <Form onSubmit={submitHandler}>
                {/* Name */}
                <Form.Group controlId='name' className='my-2'>
                    <Form.Label>Name:</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder='Insert name'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    ></Form.Control>
                </Form.Group>
                {/* Email */}
                <Form.Group controlId='email' className='my-2'>
                    <Form.Label>Email:</Form.Label>
                    <Form.Control
                        type='email'
                        placeholder='Insert email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    ></Form.Control>
                </Form.Group>
                {/* Password */}
                <Form.Group controlId='password' className='my-2'>
                    <Form.Label>Password:</Form.Label>
                    <Form.Control
                        type='password'
                        placeholder='Insert password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    ></Form.Control>
                </Form.Group>
                {/* Confirm Password */}
                <Form.Group controlId='confirmPassword' className='my-2'>
                    <Form.Label>Confirm Password:</Form.Label>
                    <Form.Control
                        type='password'
                        placeholder='Confirm password'
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    ></Form.Control>
                </Form.Group>
                {/* Button */}
                <Button type='submit' variant='primary' className='my-2'>
                    Update
                </Button>
                { loadingUpdateProfile && <Loader />}
            </Form>
        </Col>
    </Row>
  )
}

export default ProfileScreen;