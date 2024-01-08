import React from 'react'
import { Table, Button, Row, Col } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
// Components
import Message from '../../components/common/Message';
import Loader from '../../components/common/Loader';
import Paginate from '../../components/productscreen/Paginate';
// Slices
import { useGetProductsQuery, useCreateProductMutation, useDeleteProductMutation } from '../../slices/productsApiSlice';

const ProductListScreen = () => {
    const {pageNumber} = useParams();

    // Api Slice: Get products
    const { data, isLoading, error, refetch } = useGetProductsQuery({pageNumber});

    // Api Slice: Create product
    const [ createProduct, {isLoading: loadingCreate }] = useCreateProductMutation();

    // Api Slice: Delete product
    const [deleteProduct, { isLoading: loadingDelete }] = useDeleteProductMutation();

    const createProductHandler = async () => {
        if(window.confirm('Are you sure you want to create a enw product?')) {
            try{
                // Api slice
                await createProduct();
                refetch(); // refetch the products using the get product api call (that's why the refetch function comes from the useGetProductsQuery)
            } catch (err) {
                toast.error(err?.data?.message || err.error);
            }
        }
    };

    const deleteHandler = async (id) => {
        if(window.confirm('Are you sure?')) {
            try {
                // Api Slice
                await deleteProduct(id);
                toast.success('Product deleted');
                refetch(); // refetch the products using the get product api call (that's why the refetch function comes from the useGetProductsQuery)
            } catch (err) {
                toast.error(err?.data?.message || err.error)
            }
        }
    };

    return (
    <>
        <Row className='align-items-center'>
            <Col>
                <h1>Products</h1>
            </Col>
            <Col className='text-end'>
                <Button className='btn-sm m-3' onClick={createProductHandler}>
                    <FaEdit/> Create Product
                </Button>
            </Col>
        </Row>
        {loadingCreate && <Loader />}
        {loadingDelete && <Loader />}
        {isLoading ? (
            <Loader />
        ) : error ? (
            <Message variant='danger'>{error.data.message}</Message>
        ) : (
            <>
                <Table striped hover responsive className='table-sm'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>NAME</th>
                            <th>PRICE</th>
                            <th>CATEGORY</th>
                            <th>BRAND</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.products.map((product) => (
                            <tr key={product._id}>
                                <td>{product._id}</td>
                                <td>{product.name}</td>
                                <td>{product.price}</td>
                                <td>{product.category}</td>
                                <td>{product.brand}</td>
                                <td>
                                    <LinkContainer to={`/admin/product/${product._id}/edit`}>
                                        <Button variant='light' className='btn-sm mx-2'>
                                            <FaEdit/>
                                        </Button>
                                    </LinkContainer>
                                    <Button variant='danger' className='btn-sm' onClick={() => deleteHandler(product._id)}>
                                        <FaTrash/>
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <Paginate pages={data.pages} page={data.page} isAdmin={true}/>
            </>
        )}
    </>
  );
};

export default ProductListScreen;