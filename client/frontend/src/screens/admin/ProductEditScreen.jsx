import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
// Components
import Message from '../../components/common/Message';
import Loader from '../../components/common/Loader';
import FormContainer from '../../components/common/FormContainer';
// Slices
import { useUpdateProductMutation, useGetProductDetailsQuery, useUploadProductImageMutation } from '../../slices/productsApiSlice';

const ProductEditScreen = () => {
    // Get product id from url
    const { id: productId } = useParams();

    // Local state
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState('');
    const [brand, setBrand] = useState('');
    const [category, setCategory] = useState('');
    const [countInStock, setCountInStock] = useState(0);
    const [description, setDescription] = useState('');

    // Api Slice: Get a product
    const { data: product, isLoading, error } = useGetProductDetailsQuery(productId);

    // Api Slice: Update a product
    const [ updateProduct, {isLoading: loadingUpdate }] = useUpdateProductMutation();

    // Api Slice: Upload product image (POST)
    const [uploadProductImage, {isLoading: loadingUpload}] = useUploadProductImageMutation();

    // Initialization
    const navigate = useNavigate();

    // Align the local state with the product data coming from the api call for form initial data representation.
    useEffect(() => {
        if (product) {
            setName(product.name);
            setPrice(product.price);
            setImage(product.image);
            setBrand(product.brand);
            setCategory(product.category);
            setCountInStock(product.countInStock);
            setDescription(product.description);
        }
    }, [product]);

    const submitHandler = async (e) => {
        e.preventDefault();
        const updatedProduct = {
            _id: productId,
            name,
            price,
            image,
            brand,
            category,
            countInStock,
            description,
        };
        // Api Slice: Update a product
        const result = await updateProduct(updatedProduct);

        if (result.error) {
            toast.error(result.error);
        } else {
            toast.success('Product updated');
            navigate('/admin/productlist');
        }
    };

    const uploadFileHandler = async (e) => {
        // Resize the image before upload
        const file = e.target.files[0];
        if (!file) {
            return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            const img = new Image();
            img.src = reader.result;
            img.onload = async () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = 640;
                canvas.height = 960;

                // Draw the image on canvas with new dimensions
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                // Convert canvas to blob
                canvas.toBlob(async (blob) => {
                    const formData = new FormData();
                    formData.append('image', blob, 'resized-image.jpg'); 

                    try {
                        // Api Slice
                        const res = await uploadProductImage(formData).unwrap();
                        console.log(res);
                        toast.success(res.message);
                        // Update local state
                        setImage(res.image);
                    } catch (err) {
                        toast.error(err?.data?.message || err.error);
                    }
                }, 'image/jpeg', 0.75); // Adjust the format and quality as needed
            };
        };
    };

  return (
    <>
        <Link to='/admin/productlist' className='btn btn-light my-2'>
            Go Back
        </Link>
        <FormContainer>
            <h1>Edit Product</h1>
            {loadingUpdate && <Loader/>}

            {isLoading ? (
                <Loader />
            ) : error ? (
                <Message variant='danger'>{error.data.message}</Message>
            ) : (
                <Form onSubmit={ submitHandler }>
                    {/* Name */}
                    <Form.Group controlId='name' className='my-2'>
                        <Form.Label>Name:</Form.Label>
                        <Form.Control
                            type='text'
                            placeholder='Insert name'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        ></Form.Control>
                    </Form.Group>
                    {/* Price */}
                    <Form.Group controlId='price' className='my-2'>
                        <Form.Label>Price:</Form.Label>
                        <Form.Control
                            type='number'
                            placeholder='Insert price'
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        ></Form.Control>
                    </Form.Group>
                    {/* Image */}
                    <Form.Group controlId='image' className='my-2'>
                        <Form.Label>Image:</Form.Label>
                        <Form.Control
                            type='text'
                            placeholder='Insert image url'
                            value={image}
                            onChange={(e) => setImage(e.target.value)}
                        ></Form.Control>
                        <Form.Control
                            type='file'
                            label='Upload file'
                            onChange={uploadFileHandler}
                        ></Form.Control>
                    </Form.Group>
                    {loadingUpload && <Loader />}
                    {/* Brand */}
                    <Form.Group controlId='brand' className='my-2'>
                        <Form.Label>Brand:</Form.Label>
                        <Form.Control
                            type='text'
                            placeholder='Insert brand'
                            value={brand}
                            onChange={(e) => setBrand(e.target.value)}
                        ></Form.Control>
                    </Form.Group>
                    {/* CountInStock */}
                    <Form.Group controlId='countInStock' className='my-2'>
                        <Form.Label>Count In Stock:</Form.Label>
                        <Form.Control
                            type='number'
                            placeholder='Insert count in stock'
                            value={countInStock}
                            onChange={(e) => setCountInStock(e.target.value)}
                        ></Form.Control>
                    </Form.Group>
                    {/* Category */}
                    <Form.Group controlId='category' className='my-2'>
                        <Form.Label>Category:</Form.Label>
                        <Form.Select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <option value='-'>Select category...</option>
                            <option value='fedora'>Fedora</option>
                            <option value='bowler'>Bowler</option>
                            <option value='cowboy'>Cowboy</option>
                        </Form.Select>
                    </Form.Group>
                    {/* Description */}
                    <Form.Group controlId='description' className='my-2'>
                        <Form.Label>Description:</Form.Label>
                        <Form.Control
                            type='text'
                            placeholder='Insert description'
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        ></Form.Control>
                    </Form.Group>
                    {/* Submit Button */}
                    <Button type='submit' variant='primary' className='my-2'>
                        Update
                    </Button>
                </Form>
            )}
        </FormContainer>
    </>
  )
}

export default ProductEditScreen;