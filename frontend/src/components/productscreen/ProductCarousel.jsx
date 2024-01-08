import React from 'react'
import { Link } from 'react-router-dom'
import { Carousel, Image } from 'react-bootstrap';

// Components
import Loader from '../common/Loader';
import Message from '../common/Message';

// Slices
import { useGetTopProductsQuery } from '../../slices/productsApiSlice';

const ProductCarousel = () => {
    // Api Slice: get top products
    const {data: products, isLoading, error} = useGetTopProductsQuery();

  return (
    isLoading ? <Loader/> : error ? <Message variant='danger'>{error}</Message>
    : (
        <Carousel pause='hover' className='bg-dark mb-4'>
            {products.map((product) => (
                <Carousel.Item key={product._id}>
                    <Link to={`/productDetails/${product._id}`}>
                        <Image src={product.image} alt={product.name} fluid/>
                    </Link>
                    <Carousel.Caption className='carousel-caption'>
                        <h2>{product.name} (${product.price})</h2>
                    </Carousel.Caption>
                </Carousel.Item>
            ))}
        </Carousel>
    )
  )
}

export default ProductCarousel;