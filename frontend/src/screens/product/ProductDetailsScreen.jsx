import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Row, Col, Image, ListGroup, Card, Button, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
// Components
import Rating from '../../components/productscreen/Rating';
import Loader from '../../components/common/Loader';
import Message from '../../components/common/Message';
import Meta from '../../components/Meta';
// Slices
import { useGetProductDetailsQuery, useCreateReviewMutation } from '../../slices/productsApiSlice';
import { addToCart } from '../../slices/cartSlice';

const ProductDetailsScreen = () => {

    const { category, id: productId } = useParams();

    // Use dispatch to be able to trigger the actions
    const dispatch = useDispatch();

    const navigate = useNavigate();

    // component local state
    const [qty, setQty] = useState(1);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    // Api Slice: Query the product using the useGetProductDetailsQuery instead of using axios or fetch
    const { data: product, isLoading, error, refetch } = useGetProductDetailsQuery(productId);

    // Api Slice: create review (POST)
    const [createReview, {isLoading: loadingProductReview}] = useCreateReviewMutation();

    // State Slice: get user info
    const { userInfo } = useSelector((state) => state.auth);

    const addToCartHandler = () => {
        // State Slice: Trigger the addToCard action
        dispatch(addToCart({...product, qty}))
        navigate('/cart');
    };

    // Submit Review
    const submitReviewHandler = async (e) => {
        e.preventDefault();
        try {
            // Api Slice: create review
            await createReview({productId, rating, comment}).unwrap(); // unwrap the resolved value from the promise
            refetch(); // refetch the product using the get product api call (that's why the refetch function comes from the useGetProductDetailsQuery)
            toast.success('Review Submitted');
            // Reset local state
            setRating(0);
            setComment('');
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    }

    console.log(category)
    return (
        <>
            {category === undefined ? (
                <Link className='btn btn-light my-3' to='/'>Go Back</Link>
            ) : category === 'all' ? (
                <Link className='btn btn-light my-3' to='/products/'>Go Back</Link>
            ) : (
                <Link className='btn btn-light my-3' to={`/products/${category}`}>Go Back</Link>
            )}

            { isLoading ? (
                <Loader/>
            ): error ? (
                <Message variant='danger'>{ error?.data?.message || error.error }</Message>
            ) : (
                <>
                    <Meta title={product.name}/> {/* Changed only the windows level name by setting the title */}
                    <Row>
                        <Col md={5}>
                            <Image src={product.image} alt={product.name} fluid/>
                        </Col>

                        <Col md={7}>
                            <Row>
                                <Col md={6}>   
                                    <ListGroup variant='flush'>
                                        <ListGroup.Item>
                                            <h3>{product.name}</h3>
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            <Rating value={product.rating} text={`${product.numReviews} reviews`}/>
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            Price: ${product.price}
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            Description: {product.description}
                                        </ListGroup.Item>
                                    </ListGroup>
                                </Col>
                                <Col md={6}>
                                    <Card>
                                        <ListGroup variant='flush'>
                                            <ListGroup.Item>
                                                <Row>
                                                    <Col>Price:</Col>
                                                    <Col>
                                                        <strong>${product.price}</strong>
                                                    </Col>
                                                </Row>
                                            </ListGroup.Item>
                                            <ListGroup.Item>
                                                <Row>
                                                    <Col>Status:</Col>
                                                    <Col>
                                                        <strong>{product.countInStock > 0 ? 'In Stock' : 'Out Of Stock'}</strong>
                                                    </Col>
                                                </Row>
                                            </ListGroup.Item>

                                            {product.countInStock > 0 && (
                                                <ListGroup.Item>
                                                    <Row>
                                                        <Col>Qty:</Col>
                                                        <Col>
                                                            <Form.Control
                                                                as='select'
                                                                value={qty}
                                                                onChange={(e) => setQty(Number(e.target.value))}
                                                            >
                                                                {/* The available selected qty must be based on the available items */}
                                                                {/* Create an array with howmany products are in stock and then map through it to create the options tab with those numbers*/}
                                                                {[...Array(product.countInStock).keys()].map((x) => (
                                                                    <option key={ x + 1 } value={ x + 1 }>  {/* +1 to avoid having 0*/}
                                                                        {x + 1}
                                                                    </option>
                                                                ))}
                                                            </Form.Control>
                                                        </Col>
                                                    </Row>
                                                </ListGroup.Item>
                                            )}

                                            <ListGroup.Item>
                                                <Button 
                                                    className='btn-block' 
                                                    type='button' 
                                                    disabled={product.countInStock === 0}
                                                    onClick={addToCartHandler} 
                                                >
                                                    Add To Cart
                                                </Button>
                                            </ListGroup.Item>
                                        </ListGroup>
                                    </Card>
                                </Col>
                            </Row>
                            {/* Rating */}
                            <Row className='review'>
                                <Col md={6}>
                                    <h2>Reviews</h2>
                                    {product.reviews.length === 0 && <Message>No Reviews</Message>}

                                    <ListGroup variant='flush'>
                                        {/* List of reviews */}
                                        {product.reviews.map((review) => (
                                            <ListGroup.Item key={review._id}>
                                                <strong>{review.name}</strong>
                                                <Rating value={review.rating}/>
                                                <p>{review.createdAt.substring(0, 10)}</p>
                                                <p>{review.comment}</p>
                                            </ListGroup.Item>
                                        ))}
                                        {/* Create Review */}
                                        <ListGroup.Item>
                                            <h2>Write a review</h2>
                                            {loadingProductReview && <Loader />}
                                            {/* only for logged in users */}
                                            {userInfo ? (
                                                <Form onSubmit={ submitReviewHandler }>
                                                    {/* Rating */}
                                                    <Form.Group controlId='rating' className='my-2'>
                                                        <Form.Label>Rating:</Form.Label>
                                                        <Form.Control
                                                            as='select'
                                                            value={rating}
                                                            onChange={(e) => setRating(Number(e.target.value))}
                                                        >
                                                            <option value=''>Select</option>
                                                            <option value='1'>1 - Poor</option>
                                                            <option value='2'>2 - Fair</option>
                                                            <option value='3'>3 - Good</option>
                                                            <option value='4'>4 - Very Good</option>
                                                            <option value='5'>5 - Excellent</option>
                                                        </Form.Control>
                                                    </Form.Group>
                                                    {/* Comment */}
                                                    <Form.Group controlId='comment' className='my-2'>
                                                        <Form.Label>Comment:</Form.Label>
                                                        <Form.Control
                                                            as='textarea'
                                                            row='4'
                                                            value={comment}
                                                            onChange={(e) => setComment(e.target.value)}
                                                        ></Form.Control>
                                                    </Form.Group>
                                                    {/* Button */}
                                                    <Button type='submit' variant='primary' disabled={loadingProductReview}>
                                                        Submit Review
                                                    </Button>
                                                </Form>
                                            ) : (
                                                <Message>
                                                    Please <Link to='/login'>sign in</Link> to write a review
                                                </Message>
                                            )}
                                        </ListGroup.Item>
                                    </ListGroup>
                                </Col>
                            </Row>
                        </Col>
                    </Row>

                </>
            ) }

        </>
    )
    }

    export default ProductDetailsScreen;