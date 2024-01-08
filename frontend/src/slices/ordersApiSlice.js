// Communicate with the back-end Server

import { ORDERS_URL, PAYPAL_URL } from "../constants";
import { apiSlice } from './apiSlice';

// Inject endpoint to main apiSlice
export const ordersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Create order
        createOrder: builder.mutation({
            query: (order) => ({
                url: ORDERS_URL,
                method: 'POST',
                body: {...order}
            })
        }),
        // Get order by ID
        getOrderDetails: builder.query({
            query: (orderId) => ({
                url: `${ORDERS_URL}/${orderId}`
            }),
            keepUnusedDataFor: 5
        }),
        // Pay order
        payOrder: builder.mutation({
            query: ({orderId, details}) => ({
                url: `${ORDERS_URL}/${orderId}/pay`,
                method: 'PUT',
                body: {...details},
            })
        }),
        // Get PayPal client
        getPayPalClientId: builder.query({
            query: () => ({
                url: PAYPAL_URL,
            }),
            keepUnusedDataFor: 5,
        }),
        // Get logged in user's orders
        getMyOrders: builder.query({
            query: ({pageNumber}) => ({ // Pagination functionality
                url: `${ORDERS_URL}/myorders`,
                params: {
                    pageNumber,
                },
            }),
            keepUnusedDataFor: 5
        }),
        // ----------------------------------------------------------
        // ADMIN
        // ----------------------------------------------------------
        // Get all orders
        getOrders: builder.query({
            query: ({pageNumber}) => ({ // Pagination functionality
                url: ORDERS_URL,
                params: {
                    pageNumber,
                },
            }),
            keepUnusedDataFor: 5
        }),
        // Update order to be set as delivered
        deliverOrder: builder.mutation({
            query: (orderId) => ({
                url: `${ORDERS_URL}/${orderId}/deliver`,
                method: 'PUT'
            }),
        }),
    }),
});

export const {
    useCreateOrderMutation,
    useGetOrderDetailsQuery,
    usePayOrderMutation,
    useGetPayPalClientIdQuery,
    useGetMyOrdersQuery,
    useGetOrdersQuery,
    useDeliverOrderMutation
 } = ordersApiSlice;
