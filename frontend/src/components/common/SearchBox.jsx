import React, { useState } from 'react'
import { Form, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';

const SearchBox = () => {
    // Initialization
    const navigate = useNavigate();

    const {keyword: urlKeyword} = useParams();

    // Component local state
    const [keyword, setKeyword] = useState(urlKeyword || '');

    const submitHandler = (e) => {
        e.preventDefault();
        if (keyword.trim()) {
            setKeyword('');
            navigate(`/products/search/${keyword}`)
        } else {
            navigate('/');
        }
    }

  return (
    <Form onSubmit={submitHandler} className='d-flex'>
        <Form.Control
            type='text'
            name='query'
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder='Search Products...'
            className='mr-sm-2 ml-sm-5'
        ></Form.Control>
        <Button type='submit' variant='outline-light' className='p-2 mx-2'>
            Search
        </Button>
    </Form>
  )
}

export default SearchBox;