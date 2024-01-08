// Provide names to screens in window level

import React from 'react'
import { Helmet } from 'react-helmet-async';

const Meta = ({ title, description, keywords}) => {
  return (
    <Helmet>
        <title>{title}</title>
        <meta name='description' content={description}/>
        <meta name='keyword' content={keywords}/>
    </Helmet>
  )
}

Meta.defaultProps = {
    title: 'Welcome to LittleShop',
    description: 'Find anything in the best price',
    keywords: 'apparel, by apparel, cheap apparel'
};

export default Meta;