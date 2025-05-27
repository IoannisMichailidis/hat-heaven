// Communicate with the back-end Server

import { PRODUCTS_URL, UPLOAD_URL } from "../constants";
import { apiSlice } from './apiSlice';

// Inject endpoint to main apiSlice
export const productsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // ----------------------------------------------------------
        // Public
        // ----------------------------------------------------------
        // Get all the products
        getProducts: builder.query({
            query: ({keyword, pageNumber}) => ({  // Search and Pagination functionality
                url: PRODUCTS_URL,
                params: {
                    keyword,
                    pageNumber,
                },
            }),
            providesTags: ['Products'], // instead of having to refresh the page or refetching the data using the refetch
            keepUnusedDataFor: 5
        }),
        // Get category products (fedora | bowler | cowboy)
        getCategoryProducts: builder.query({
            query: ({category, pageNumber}) => ({ // Only Pagination functionality
                url: `${PRODUCTS_URL}/category/${category}`,
                params: {
                     category,
                     pageNumber,
                },
            }),
            keepUnusedDataFor: 5
        }),
        // Get a single product
        getProductDetails: builder.query({
            query: (productId) => ({
                url: `${PRODUCTS_URL}/${productId}`,
            }),
            keepUnusedDataFor: 5
        }),
        // Get top 3 products
        getTopProducts: builder.query({
            query: () => ({
                url: `${PRODUCTS_URL}/top`,
            }),
            keepUnusedDataFor: 5
        }),
        // ----------------------------------------------------------
        // Private
        // ----------------------------------------------------------
        // Create product review
        createReview: builder.mutation({
            query: (data) => ({
                url: `${PRODUCTS_URL}/${data.productId}/reviews`,
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['Product'], // it is stopped from beeing cached. So we have fresh data or we clear the cache. We get read of any cached data
        }),
        // ----------------------------------------------------------
        // ADMIN
        // ----------------------------------------------------------
        // Create a product
        createProduct: builder.mutation({
            query: () => ({                 // Even if it is a post request, we don't pass any data because we create it with sample data directly in the backend endpoint and later on we will edit it
                url: PRODUCTS_URL,
                method: 'POST'
            }),
            invalidatesTags: ['Product'],   // it is stopped from beeing cached. So we have fresh data. We get read of any cached data
        }),
        // Update a product
        updateProduct: builder.mutation({
            query: (data) => ({
                url: `${PRODUCTS_URL}/${data._id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Products'],   // it is stopped from beeing cached. So we have fresh data or we clear the cache. We get read of any cached data
        }),
        // Upload product Image
        uploadProductImage: builder.mutation({
            query: (data) => ({
                url: UPLOAD_URL,
                method: 'POST',
                body: data
            })
        }),
        // Delete product
        deleteProduct: builder.mutation({
            query: (productId) => ({
                url: `${PRODUCTS_URL}/${productId}`,
                method: 'DELETE'
            })
        }),
    }),
});

export const {
    useGetProductsQuery,
    useGetProductDetailsQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useUploadProductImageMutation,
    useDeleteProductMutation,
    useCreateReviewMutation,
    useGetTopProductsQuery,
    useGetCategoryProductsQuery
} = productsApiSlice;
