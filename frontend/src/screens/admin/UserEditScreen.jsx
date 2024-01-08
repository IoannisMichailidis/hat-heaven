import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
// Components
import Message from '../../components/common/Message';
import Loader from '../../components/common/Loader';
import FormContainer from '../../components/common/FormContainer';
// Slices
import { useUpdateUserMutation, useGetUserDetailsQuery } from '../../slices/usersApiSlice';

const UserEditScreen = () => {
    // Get product id from url
    const { id: userId } = useParams();

    // Local state
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);


    // Api Slice: Get a user
    const { data: user, isLoading, refetch, error } = useGetUserDetailsQuery(userId);

    // Api Slice: Update user
    const [ updateUser, {isLoading: loadingUpdate }] = useUpdateUserMutation();


    // Initialization
    const navigate = useNavigate();

    // Align the local state with the user data coming from the api call for form initial data representation.
    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
            setIsAdmin(user.isAdmin);
        }
    }, [user]);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            // Api Slice: update user
            await updateUser({ userId, name, email, isAdmin});
            toast.success('User updated successfully');
            refetch();  // refetch the users using the get user api call (that's why the refetch function comes from the useGetUserDetailsQuery)
            navigate('/admin/userlist');
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };


  return (
    <>
        <Link to='/admin/userlist' className='btn btn-light my-2'>
            Go Back
        </Link>
        <FormContainer>
            <h1>Edit User</h1>
            {loadingUpdate && <Loader/>}

            {isLoading ? (
                <Loader />
            ) : error ? (
                <Message variant='danger'>{error}</Message>
            ) : (
                <Form onSubmit={ submitHandler }>
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
                    {/* Is Admin */}
                    <Form.Group controlId='isAdmin' className='my-2'>
                        <Form.Check
                            type='checkbox'
                            label='Is Admin'
                            checked={isAdmin}
                            onChange={(e) => setIsAdmin(e.target.checked)}
                        >
                        </Form.Check>
                    </Form.Group>
                    {/* Submit Button */}
                    <Button type='submit' variant='primary' className='my-2'>
                        Update
                    </Button>
                </Form>
            )}
        </FormContainer>
    </>
  )
}

export default UserEditScreen;