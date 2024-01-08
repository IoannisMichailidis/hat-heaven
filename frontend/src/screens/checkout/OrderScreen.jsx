import React, { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom';
import { Row, Col, ListGroup, Image, Button, Card } from 'react-bootstrap';
import { PayPalButtons, FUNDING, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
// Components
import Message from '../../components/common/Message';
import Loader from '../../components/common/Loader';
// Slices
import {
    useGetOrderDetailsQuery,
    usePayOrderMutation,
    useGetPayPalClientIdQuery,
    useDeliverOrderMutation
} from '../../slices/ordersApiSlice';

const OrderScreen = () => {
    // Get the id from the URL
    const { id: orderId } = useParams();

    // Api Slice: Query the order using the useGetOrderDetailsQuery instead of using axios or fetch
    const { data: order, refetch, isLoading, error } = useGetOrderDetailsQuery(orderId);

    // Api Slice:
    const [ payOrder, { isLoading: loadingPay}] = usePayOrderMutation();
    const [ deliverOrder ] = useDeliverOrderMutation();

    // Coming from PayPal
    const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

    // Api Slice: Get PayPal Client
    const { data: paypal, isLoading: loadingPayPal, error: errorPayPal } = useGetPayPalClientIdQuery();

    // State Slice: Get userInfo from the global state
    const { userInfo } = useSelector((state) => state.auth);

    // Load PayPal script (from doc)
    useEffect(() => {
        if (!errorPayPal && !loadingPayPal && paypal.clientId) {
            const loadPayPalScript = async () => {
                paypalDispatch({
                    type: 'resetOptions',
                    value: {
                        'client-id': paypal.clientId,
                        currency: 'USD',
                    }
                });
                paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
            }
            if (order && !order.isPaid) {
                if (!window.paypal) { // loadPayPalScript is not already loaded
                    loadPayPalScript();
                }
            }
        }
    },[order, paypal, paypalDispatch, loadingPayPal, errorPayPal])

    // PayPal related functions (from doc)
    function onApprove(data, actions) {
        return actions.order.capture().then(async function (details) {
            try {
                // Api Slice
                await payOrder({orderId, details}).unwrap(); // details coming from paypal as a promise
                refetch(); // Refetch the screen to update the data coming from the endpoint
                toast.success('Payment succesful');
            } catch (err) {
                toast.error(err?.data?.message || err.message);
            }
        });
    }

    function onError(err) {
        toast.error(err.message);
    }

    function createOrder(data, actions) {
        return actions.order.create({
            purchase_units: [
                {
                    amount: {
                        value: order.totalPrice,
                    },
                },
            ],
        })
        .then((orderId) => {
            return orderId;
        });
    }

    // Mark as deliver functionality
    const deliverOrderHandler = async () => {
        try {
            // Api Slice
            await deliverOrder(orderId);
            refetch(); // Refetch the screen to update the data coming from the endpoints as we just updated it
            toast.success('Order delivered');
        } catch (err) {
            toast.error(err?.data?.message || err.message);
        }
    }

  return isLoading ? (
        <Loader />
    ) : error ? (
        <Message variant='danger'>{error?.data?.message || error.message}</Message>
    ) : (
        <>
            <h1>Order: {order._id}</h1>
            <Row>
                <Col md={8}>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2>Shipping</h2>
                            <p>
                                <strong>Name: </strong> {order.user.name}
                            </p>
                            <p>
                                <strong>Email: </strong> {order.user.email}
                            </p>
                            <p>
                                <strong>Address: </strong>
                                {order.shippingAddress.address}, {order.shippingAddress.city} {' '}
                                {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                            </p>
                            { order.isDelivered ? (
                                <Message variant='success'>
                                    Delivered on {order.deliveredAt}
                                </Message>
                            ) : (
                                <Message variant='danger'>
                                    Not Delivered
                                </Message>
                            )}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <h2>Payment Method</h2>
                            <p>
                                <strong>Method: </strong> {order.paymentMethod}
                            </p>
                            { order.isPaid ? (
                                <Message variant='success'>
                                    Paid on {order.paidAt}
                                </Message>
                            ) : (
                                <Message variant='danger'>
                                    Not Paid
                                </Message>
                            )}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <h2>Order Items</h2>
                            { order.orderItems.map((item, index) => (
                                <ListGroup.Item key={index}>
                                    <Row className="align-items-center">
                                        <Col xs={2}>
                                            <Image src={item.image} alt={item.name} fluid rounded/>
                                        </Col>
                                        <Col>
                                            <Link to={`/productDetails/${item.product}`}>
                                                {item.name}
                                            </Link>
                                        </Col>
                                        <Col xs={4}>
                                            {item.qty} x ${item.price} = ${ item.qty * item.price }
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            ))}
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
                                    <Col>Items</Col>
                                    <Col>${order.itemsPrice}</Col>
                                </Row>
                                <Row>
                                    <Col>Shipping</Col>
                                    <Col>${order.shippingPrice}</Col>
                                </Row>
                                <Row>
                                    <Col>Tax</Col>
                                    <Col>${order.taxPrice}</Col>
                                </Row>
                                <Row>
                                    <Col>Total</Col>
                                    <Col>${order.totalPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            {/* PayPal Buttons */}
                            { !order.isPaid && (
                                <ListGroup.Item>
                                    {loadingPay && <Loader />}
                                    {isPending ? <Loader /> : (
                                        <div>
                                            <div>
                                                <PayPalButtons
                                                    fundingSource={FUNDING.PAYPAL}
                                                    createOrder={createOrder}
                                                    onApprove={onApprove}
                                                    onError={onError}
                                                ></PayPalButtons>
                                                <PayPalButtons
                                                    fundingSource={FUNDING.CARD}
                                                    createOrder={createOrder}
                                                    onApprove={onApprove}
                                                    onError={onError}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </ListGroup.Item>
                            )}
                            {/* Mark as Delivered Button (Admin action) */}
                            { userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                                <ListGroup.Item>
                                    <Button type='button' className='btn btn-block' onClick={deliverOrderHandler}>
                                        Mark As Delivered
                                    </Button>
                                </ListGroup.Item>
                            )}
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default OrderScreen;