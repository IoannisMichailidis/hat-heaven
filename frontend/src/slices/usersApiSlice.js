// Communicate with the back-end Server

import { USERS_URL } from "../constants";
import { apiSlice } from './apiSlice';

// Inject endpoints to main apiSlice
export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // login user endpoint
        login: builder.mutation({      // POST request (mutation instead of query)
            query: (data) => ({        // send data to login endpoint
                url: `${USERS_URL}/login`,
                method: 'POST',
                body: data,
            }),
        }),
        // logout user endpoint
        logout: builder.mutation({      // POST request (mutation instead of query)
            query: () => ({
                url: `${USERS_URL}/logout`,
                method: 'POST',
            }),
        }),
        // Register user endpoint
        register: builder.mutation({      // POST request (mutation instead of query)
            query: (data) => ({           // send data to login endpoint
                url: USERS_URL,
                method: 'POST',
                body: data,
            }),
        }),
        // Update user profile endpoint
        profile: builder.mutation({      // POST request (mutation instead of query)
            query: (data) => ({
                url: `${USERS_URL}/profile`,
                method: 'PUT',
                body: data,
            }),
        }),
        // ----------------------------------------------------------
        // ADMIN
        // ----------------------------------------------------------
        // Get users
        getUsers: builder.query({
            query: () => ({
                url: USERS_URL,
            }),
            providesTags: ['Users'], // Otherwise we need to reload the page in case a user is deleted or updated
            keepUnusedDataFor: 5
        }),
        // Delete user
        deleteUser: builder.mutation({
            query: (userId) => ({
                url: `${USERS_URL}/${userId}`,
                method: 'DELETE',
            }),
        }),
        // Get user details
        getUserDetails: builder.query({
            query: (userId) => ({
                url: `${USERS_URL}/${userId}`,
            }),
            keepUnusedDataFor: 5,
        }),
        // Update user
        updateUser: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/${data.userId}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Users'],  // it is stopped from beeing cached. So we have fresh data. We get read of any cached data
        }),
    }),
});

export const {
    useLoginMutation,
    useLogoutMutation,
    useRegisterMutation,
    useProfileMutation,
    useGetUsersQuery,
    useDeleteUserMutation,
    useGetUserDetailsQuery,
    useUpdateUserMutation
} = usersApiSlice;
