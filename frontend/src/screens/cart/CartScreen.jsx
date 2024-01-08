import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { Row, Col, ListGroup, Image, Form, Button } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
// Components
import Message from '../../components/common/Message';
// Slices
import { addToCart, removeFromCart } from '../../slices/cartSlice';

function CartScreen() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get the items in the cart from the global state
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  // Update the state with the selected qty
  const addToCartHandler = async (product, qty) => {
    dispatch(addToCart({...product, qty}))
  };

  const removeFromCartHandler = async (id) => {
    dispatch(removeFromCart(id));
  }

  const checkoutHandler = () => {
    // Redirect to loggin if not logged in
    // In the login screen we'll check for the ?redirect part
    navigate('/login?redirect=/shipping');
  }

  return (
    <Row>
        <Col md={8}>
            <h1 style={{ marginBottom: '20px' }}>Shopping Cart</h1>
            { cartItems.length === 0 ? (
                <Message>
                    Your cart is empty <Link to='/products'>Go Back</Link>
                </Message>
            ) : (
                <ListGroup variant='flush'>
                    {cartItems.map((item) => (
                         <ListGroup.Item key={item._id}>
                            <Row className="align-items-center">
                                <Col xs={2}>
                                    <Image src={item.image} alt={item.name} fluid rounded />
                                </Col>
                                <Col xs={3}>
                                    <Link to={`/productDetails/${item._id}`}>{item.name}</Link>
                                </Col>
                                <Col  xs={2}>
                                    {item.price}
                                </Col>
                                <Col xs={2}>
                                    <Form.Control
                                        as='select'
                                        value={item.qty}
                                        onChange={(e) => addToCartHandler(item, Number(e.target.value))}
                                    >
                                        {/* The available selected qty must be based on the available items */}
                                        {/* Create an array with howmany products are in stock and then map through it to create the options tab with those numbers*/}
                                        {[...Array(item.countInStock).keys()].map((x) => (
                                            <option key={ x + 1 } value={ x + 1 }>  {/* +1 to avoid having 0*/}
                                                {x + 1}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Col>
                                <Col xs={2}>
                                    <Button 
                                        type='button' 
                                        variant='light'
                                        onClick={() => removeFromCartHandler(item._id)}
                                    >
                                        <FaTrash/>
                                    </Button>
                                </Col>
                            </Row>
                         </ListGroup.Item>
                    ))}
                </ListGroup>
            ) }
        </Col>
        <Col md={4}>
            <ListGroup variant='flush'>
                <ListGroup.Item>
                   <h2>
                      Subtotal ({ cartItems.reduce((accumulator, item) => accumulator + item.qty, 0)}) items
                   </h2>
                   ${ cartItems
                        .reduce((accumulator, item) => accumulator + item.qty * item.price, 0)
                        .toFixed(2) }
                </ListGroup.Item>
                <ListGroup.Item>
                    <Button 
                        type='button' 
                        className='btn-block' 
                        disabled={cartItems.length === 0}
                        onClick={checkoutHandler}
                    >
                        Proceed To Checkout
                    </Button>
                </ListGroup.Item>
            </ListGroup>
        </Col>
    </Row>
  )
}

export default CartScreen