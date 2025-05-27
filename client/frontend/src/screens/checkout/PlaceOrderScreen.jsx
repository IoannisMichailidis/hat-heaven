import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap';
import { toast } from 'react-toastify';
// Components
import CheckoutSteps from '../../components/CheckoutSteps';
import Message from '../../components/common/Message';
import Loader from '../../components/common/Loader';
// Slices
import { useCreateOrderMutation } from '../../slices/ordersApiSlice';
import { clearCartItems } from '../../slices/cartSlice';

const PlaceOrderScreen = () => {

    // Initialization
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // api function from ordersApiSlice.js
    const [createOrder, { isLoading, error}] = useCreateOrderMutation();

    // Get cart data from the global state
    const cart = useSelector((state) => state.cart);

    // Implement redirection when mount the page
    useEffect(() => {
        if (!cart.shippingAddress.address) {
            navigate('/shipping');
        } else if (!cart.paymentMethod) {
            navigate('/payment');
        }
    },[cart.shippingAddress.address, cart.paymentMethod, navigate])

    const placeOrderHandler = async () => {
        // Create Order by interacting with the backend using the createOrder api slice
        try {
            const res = await createOrder({
                orderItems: cart.cartItems,
                shippingAddress: cart.shippingAddress,
                paymentMethod: cart.paymentMethod,
                itemsPrice: cart.itemsPrice,
                shippingPrice: cart.shippingPrice,
                taxPrice: cart.taxPrice,
                totalPrice: cart.totalPrice
            }).unwrap(); // unwrap the resolved value from the promise

            // Update the global state
            dispatch(clearCartItems());
            console.log(res);
            navigate(`/order/${res._id}`);
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };
    console.log(cart)
  return (
    <>
        <CheckoutSteps step1 step2 step3 step4/>
        <Row>
            <Col md={8}>
                <ListGroup variant='flush'>
                    <ListGroup.Item>
                        <h2>Shipping</h2>
                        <p>
                            <strong>Address: </strong>
                            {cart.shippingAddress.address},
                            {cart.shippingAddress.city},
                            {' '},
                            {cart.shippingAddress.postalCode},
                            {' '},
                            {cart.shippingAddress.country}
                        </p>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <h2>Payment Method</h2>
                        <p>
                            <strong>Method: </strong>
                            {cart.paymentMethod}
                        </p>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <h2>Order Items</h2>
                        {cart.cartItems.length === 0 ? (
                            <Message>Your cart is empty</Message>
                        ) : (
                            <ListGroup variant='flush'>
                                { cart.cartItems.map((item, index) => (
                                    <ListGroup.Item key={index}>
                                        <Row className="align-items-center">
                                            <Col xs={2}>
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    fluid
                                                    rounded
                                                />
                                            </Col>
                                            <Col>
                                                <Link to={`/productDetails/${item._id}`}>
                                                    {item.name}
                                                </Link>
                                            </Col>
                                            <Col xs={4}>
                                                { item.qty } x ${ item.price} = ${ item.qty * item.price}
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                    ))}
                            </ListGroup>
                        )}
                    </ListGroup.Item>
                </ListGroup>
            </Col>
            <Col md={4}>
                <Card>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2>Order Summary</h2>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <Col>Items:</Col>
                                <Col>${cart.itemsPrice}</Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <Col>Shipping:</Col>
                                <Col>${cart.shippingPrice}</Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <Col>Tax:</Col>
                                <Col>${cart.taxPrice}</Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <Col>Total:</Col>
                                <Col>${cart.totalPrice}</Col>
                            </Row>
                        </ListGroup.Item>

                        {error &&
                        <ListGroup.Item>
                             <Message variant='danger'>{error.data.message}</Message>
                        </ListGroup.Item>
                        }

                        <ListGroup.Item>
                            <Button
                                type='button'
                                className='btn-block'
                                disabled={cart.cartItems.length === 0}
                                onClick={ placeOrderHandler }
                            >
                                Place Order
                            </Button>
                            {isLoading && <Loader/>}
                        </ListGroup.Item>
                    </ListGroup>
                </Card>
            </Col>
        </Row>
    </>
  )
}

export default PlaceOrderScreen;