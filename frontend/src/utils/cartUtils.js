// Decimal helper function
export const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2);
}

export const updateCart = (state) => {
    // Calc items price
    state.itemsPrice = addDecimals(state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0));

    // Calc shipping price (shipping policy: free for >100$, else 10$ )
    state.shippingPrice = addDecimals(state.itemsPrice > 100 ? 0 : 10);

    // Calc tax price
    state.taxPrice = addDecimals(Number((0.15 * state.itemsPrice).toFixed(2)));

    // Calc total price
    state.totalPrice = (
        Number(state.itemsPrice) +
        Number(state.shippingPrice) +
        Number(state.taxPrice)
    ).toFixed(2);

    // Save the state to localstorage
    localStorage.setItem('cart', JSON.stringify(state));

    return state;
}