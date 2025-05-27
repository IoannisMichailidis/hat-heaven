import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Col } from 'react-bootstrap';
// Components
import FormContainer from '../../components/common/FormContainer';
import CheckoutSteps from '../../components/CheckoutSteps';
// Slices
import { savePaymentMethod } from '../../slices/cartSlice';

const PaymentScreen = () => {
    const [paymentMethod, setPaymentMethod] = useState('PayPal');

    // Initialization
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Get the cart global state
    const cart = useSelector((state) => state.cart);
    const { shippingAddress } = cart;

    // If user hasn't passed through the shipping address step then gets redirected
    useEffect(() => {
        if (!shippingAddress) {
            navigate('/shipping');
        }
    },[shippingAddress, navigate])

    const submitHandler = (e) => {
        e.preventDefault();
        // Update global state
        dispatch(savePaymentMethod(paymentMethod));
        navigate('/placeorder');
    }

  return (
    <FormContainer>
        <CheckoutSteps step1 step2 step3/>
        <h1>Payment Method</h1>
        <Form onSubmit={ submitHandler }>
            {/* Select Method */}
            <Form.Group>
                <Form.Label as='legend'>Select Method</Form.Label>
                <Col>
                    <Form.Check
                        type='radio'
                        className='my-2'
                        label='PayPal or Credit Card'
                        id='PayPal'
                        name='paymentMethod'
                        value='PayPal'
                        checked
                        onChange={(e) => setPaymentMethod(e.target.value)}
                    ></Form.Check>
                </Col>
            </Form.Group>
            {/* Submit Button */}
            <Button type='submit' variant='primary'>
                Continue
            </Button>
        </Form>
    </FormContainer>
  )
}

export default PaymentScreen;