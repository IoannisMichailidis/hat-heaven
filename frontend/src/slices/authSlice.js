// Manipulate global frond-end state

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null, // get userInfo from the local storage
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            state.userInfo = action.payload;
            localStorage.setItem('userInfo', JSON.stringify(action.payload)); // store the userInfo into local storage
        },
        logout: (state, action) => {
            state.userInfo = null;
            localStorage.clear();
        },
    }
})

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;