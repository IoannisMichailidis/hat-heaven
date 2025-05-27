import React from 'react'
import { Row, Col, Image } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
// Components
import Product from '../../components/productscreen/Product';
import Loader from '../../components/common/Loader';
import Message from '../../components/common/Message';
import Paginate from '../../components/productscreen/Paginate';
// Slices
import { useGetProductsQuery } from '../../slices/productsApiSlice';
// Images
import allHatsScreenImage from '../../assets/allHatsScreenImage.jpg';


const ProductScreen = () => {
  const { keyword, pageNumber } = useParams();

  // Query the products using the useGetProducsQuery instead of using axios or fetch
  const { data, isLoading, error} = useGetProductsQuery({keyword, pageNumber});

  return (
    <>
      {/* Back nav button after search */}
      {keyword && ( <Link to='/products' className='btn btn-light mb-4'>Go Back</Link> )}

      { isLoading ? (
        <Loader/>
      ) : error ? (
        <Message variant='danger'>{ error?.data?.message || error.error }</Message>
      ) : (
        <>
          <Row>
              <Image src={allHatsScreenImage} alt='hats image' fluid style={{height: '400px', width: '100%', objectFit: 'cover'}} className='mb-4'/>
          </Row>
          <h1>All Hats</h1>
          <Row>
              {data.products.map((product) => (
                  <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                      <Product product={product} category='all' />
                  </Col>
              ))}
          </Row>
          <Paginate
            pages={data.pages}
            page={data.page}
            keyword = {keyword ? keyword : ''}
          />
        </>
      ) }


    </>
  )
}

export default ProductScreen;