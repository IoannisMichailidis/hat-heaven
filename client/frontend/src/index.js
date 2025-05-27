import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider
} from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
// Providers
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
// Redux
import store from './store';
// Styles
// import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap
import './assets/styles/bootstrap.custom.css'; // Custom Bootstrap
import './assets/styles/index.css';
// Components
import App from './App';
// Screens
import HomeScreen from './screens/HomeScreen';
import ProductsScreen from './screens/product/ProductsScreen';
import CategoryProductsScreen from './screens/product/CategoryProductsScreen';
import ProductDetailsScreen from './screens/product/ProductDetailsScreen';
import CartScreen from './screens/cart/CartScreen';
import LoginScreen from './screens/auth/LoginScreen';
import RegisterScreen from './screens/auth/RegisterScreen';
import ShippingScreen from './screens/checkout/ShippingScreen';
import PrivateRoute from './components/protectedRoutes/PrivateRoute';
import AdminRoute from './components/protectedRoutes/AdminRoute';
import PaymentScreen from './screens/checkout/PaymentScreen';
import PlaceOrderScreen from './screens/checkout/PlaceOrderScreen';
import OrderScreen from './screens/checkout/OrderScreen';
import ProfileScreen from './screens/profile/ProfileScreen';
import MyOrdersScreen from './screens/MyOrdersScreen';
// Admin Screens
import OrderListScreen from './screens/admin/OrderListScreen';
import ProductListScreen from './screens/admin/ProductListScreen';
import ProductEditScreen from './screens/admin/ProductEditScreen';
import UserListScreen from './screens/admin/UserListScreen';
import UserEditScreen from './screens/admin/UserEditScreen';

// Router
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App></App>}>
        {/* Public routes: Access by all users */}
        <Route index={true} path='/' element={<HomeScreen />}/>
        <Route path='/products' element={<ProductsScreen />}/>
        <Route path='/products/search/:keyword' element={<ProductsScreen />}/> {/* Search Functionality */}
        <Route path='/products/page/:pageNumber' element={<ProductsScreen />}/> {/* Pagination Functionality */}
        <Route path='/products/search/:keyword/page/:pageNumber' element={<ProductsScreen />}/> {/* Search & Pagination Functionality */}

        <Route path='/products/:category' element={<CategoryProductsScreen />}/>
        <Route path='/products/:category/page/:pageNumber' element={<CategoryProductsScreen />}/> {/* Pagination Functionality */}

        <Route path='/productDetails/:id/:category?' element={<ProductDetailsScreen />}/> {/* category is optional*/}
        <Route path='/cart' element={<CartScreen />}/>
        <Route path='/login' element={<LoginScreen />}/>
        <Route path='/register' element={<RegisterScreen />}/>

        {/* Private routes: Access by logged in users */}
        <Route path='' element={<PrivateRoute/>}>
          <Route path='/shipping' element={<ShippingScreen />}/>
          <Route path='/payment' element={<PaymentScreen />}/>
          <Route path='/placeorder' element={<PlaceOrderScreen />}/>
          <Route path='/order/:id' element={<OrderScreen />}/>
          <Route path='/profile' element={<ProfileScreen />}/>
          <Route path='/myOrders' element={<MyOrdersScreen />}/>
          {/* myOrders Pagination */}
          <Route path='/myOrders/page/:pageNumber' element={<MyOrdersScreen />}/>
        </Route>

        {/* Admin routes: Access by the admin */}
        <Route path='' element={<AdminRoute/>}>
          <Route path='/admin/orderlist' element={<OrderListScreen/>}/>
          {/* Order Pagination */}
          <Route path='/orders/admin/orderlist/:pageNumber' element={<OrderListScreen/>}/>

          <Route path='/admin/productlist' element={<ProductListScreen/>}/>
          {/* Product Pagination */}
          <Route path='/products/admin/productlist/:pageNumber' element={<ProductListScreen/>}/>

          <Route path='/admin/product/:id/edit' element={<ProductEditScreen/>}/>
          <Route path='/admin/userlist' element={<UserListScreen/>}/>
          <Route path='/admin/user/:id/edit' element={<UserEditScreen/>}/>
        </Route>
    </Route>
  )
)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HelmetProvider>
      <Provider store={store}>
        <PayPalScriptProvider deferLoading={true}>
          <RouterProvider router={router}/>
        </PayPalScriptProvider>
      </Provider>
    </HelmetProvider>
  </React.StrictMode>
);

reportWebVitals();
