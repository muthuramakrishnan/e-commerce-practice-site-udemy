/*Redux store is maintained here
All reducers are imported from Reducers Directory.  
Then store is created by including all other dependencies like thunk, dev tools etc*/

import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import { productsReducer, productDetailsReducer } from './reducers/productReducers';
import { authReducer } from './reducers/userReducers';
import { cartReducer } from './reducers/cartReducers';
import { myOrdersReducer, newOrderReducer, orderDetailsReducer } from './reducers/orderReducers';

const reducer = combineReducers({
    products: productsReducer,
    productDetails: productDetailsReducer,
    auth: authReducer,
    cart: cartReducer,
    newOrder: newOrderReducer,
    myOrders: myOrdersReducer,
    orderDetails: orderDetailsReducer
});

let initialState = {
    cart: {
        cartItems: localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')):[], shippingInfo: localStorage.getItem('shippingInfo')?JSON.parse(localStorage.getItem('shippingInfo')):{}
    }
};

const middleware = [thunk];
const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middleware)));

export default store;