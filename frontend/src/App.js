import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route} from 'react-router-dom'

import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Home from './components/Home';
import ProductDetails from './components/product/ProductDetails';
import Login from './components/user/Login';
import Register from './components/user/Register';
import Profile from './components/user/Profile';
import ProtectedRoute from './components/route/ProtectedRoute';
import Cart from './components/cart/Cart';
import Shipping from './components/cart/Shipping';
import Payment from './components/cart/Payment';
import OrderSuccess from './components/cart/orderSuccess';
import ListOrders from './components/order/ListOrders';
import OrderDetails from './components/order/OrderDetails';

import {clearErrors, loadUser} from './actions/userActions';
import store from './store';
import ConfirmOrder from './components/cart/ConfirmOrder';
import axios from 'axios';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const App = () => {

    const [stripeApiKey, setStripeApiKey] = useState('');

    useEffect(() => {
        store.dispatch(loadUser());

        async function getStripeApiKey(){
            const { data } = await axios.get('/api/v1/stripeapi');
            setStripeApiKey(data.stripeApiKey);
        }

        getStripeApiKey();
    },[])
    return (
        <Router>
            <div className="App">
                <Header/>
                <div className="container container-fluid">
                    <Route path="/" component = {Home} exact/>
                    <Route path="/search/:keyword" component = {Home}/>
                    <Route path="/product/:id" component = {ProductDetails}/>
                    <Route path="/login" component = {Login}/>
                    <Route path ="/register" component = {Register}/>
                    <ProtectedRoute path="/me" exact component={Profile}/>
                    <Route path="/cart" component={Cart} exact/>
                    <ProtectedRoute path="/shipping" exact component={Shipping}/>
                    <ProtectedRoute path="/confirm" exact component={ConfirmOrder   }/>
                    <ProtectedRoute path = "/success" exact component = {OrderSuccess} />
                    <ProtectedRoute path = "/orders/me" exact component = {ListOrders} />
                    <ProtectedRoute path="/order/:id" component={OrderDetails} exact />
                    {stripeApiKey && 
                        <Elements stripe = {loadStripe(stripeApiKey)}>
                            <ProtectedRoute path="/payment" component={Payment}/>
                        </Elements>
                    }
                </div>
                <Footer/>
            </div>
        </Router>
    )
}

export default App;
