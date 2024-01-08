import React from 'react'
import { Row, Col, Image } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
// Components
import Product from '../../components/productscreen/Product';
import Loader from '../../components/common/Loader';
import Message from '../../components/common/Message';
import Paginate from '../../components/productscreen/Paginate';
// Slices
import { useGetCategoryProductsQuery } from '../../slices/productsApiSlice';
// Helper Functions
import { capitalizeFirstLetter } from '../../utils/strUtils';
// Images
import cowboyScreenImage from '../../assets/cowboyScreenImage.jpg';
import fedoraScreenImage from '../../assets/fedoraScreenImage.jpg';
import bowlerScreenImage from '../../assets/bowlerScreenImage.jpg';

const CategoryProductsScreen = () => {
    const { category, pageNumber } = useParams();

    // Api Slice: Query the products using the useGetProducsQuery instead of using axios or fetch
    const { data, isLoading, error} = useGetCategoryProductsQuery({category: category, pageNumber});

  return (
    <>
      { isLoading ? (
        <Loader/>
      ) : error ? (
        <Message variant='danger'>{ error?.data?.message || error.error }</Message>
      ) : (
        <>
          <Row>
            {category === 'fedora' ? (
              <Image src={fedoraScreenImage} alt='fedora hats image' fluid style={{height: '400px', width: '100%', objectFit: 'cover'}} className='mb-4'/>
            ) : category === 'cowboy' ? (
              <Image src={cowboyScreenImage} alt='cowboy hats image' fluid style={{height: '400px', width: '100%', objectFit: 'cover'}} className='mb-4'/>
            ) : (
              <Image src={bowlerScreenImage} alt='bowler hats image' fluid style={{height: '400px', width: '100%', objectFit: 'cover'}} className='mb-4'/>
            ) }
          </Row>
          <h1>{capitalizeFirstLetter(category)} Hats</h1>
          <Row>
              { data.products.length > 0 ? (
                  data.products.map((product) => (
                    <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                        <Product product={product} category={category}/>
                    </Col>
                  ))
              ) : (
                <Message variant='danger'>No hats found.</Message>
              ) }

          </Row>
          <Paginate
            pages={data.pages}
            page={data.page}
            category = {category}
          />
        </>
      ) }


    </>
  )
}

export default CategoryProductsScreen;