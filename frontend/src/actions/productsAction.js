import axios from 'axios';
import { 
    ALL_PRODUCTS_REQUEST, 
    ALL_PRODUCTS_SUCCESS, 
    ALL_PRODUCTS_FAIL, 
    CLEAR_ERRORS ,
    PRODUCT_DETAILS_REQUEST,
    PRODUCT_DETAILS_SUCCESS,
    PRODUCT_DETAILS_FAIL
} from '../constants/productConstants';

export const getProducts = ( keyword = '', currentPage = 1 ) => async(dispatch, getState) => {
    try{
        dispatch({type: ALL_PRODUCTS_REQUEST});

        const {data} = await axios.get(`/api/v1/products?page=${currentPage}&keyword=${keyword}`);

        dispatch({type: ALL_PRODUCTS_SUCCESS, payload: data});
    }
    catch(error){
        dispatch({
            type: ALL_PRODUCTS_FAIL,
            payload: error.response.data.errorMessage
        })
    }
}

//clear Errors
export const clearErrors = () => async dispatch => {
    dispatch({
        type: CLEAR_ERRORS
    })
}

export const getProductDetails = (id) => async(dispatch, getState) => {
    try{
        dispatch({type: PRODUCT_DETAILS_REQUEST});

        const {data} = await axios.get(`/api/v1/product/${id}`);
        
        dispatch({type: PRODUCT_DETAILS_SUCCESS, payload: data.product});
    }
    catch(error){
        dispatch({
            type: PRODUCT_DETAILS_FAIL,
            payload: error.response.data.errorMessage
        })
    }
}