import React from 'react'
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

// Components
import Rating from './Rating';

const product = ({ product, category }) => {

  return (
    <Card className='my-3 p-3 rounded'  >
        <Link to={`/productDetails/${product._id}/${category}`}>
            <Card.Img src={product.image} variant='top' />
        </Link>
        <Card.Body>
            <Link to={`/productDetails/${product._id}/${category}`}>
                <Card.Title as='div' className='product-title'>
                    <strong>{product.name}</strong>
                </Card.Title>
            </Link>
            <Card.Text as='div'>
                <Rating value={ product.rating} text={`${product.numReviews} reviews`}/>
            </Card.Text>
            <Card.Text as='h3'>
                ${product.price}
            </Card.Text>
        </Card.Body>
    </Card>
  )
}

export default product