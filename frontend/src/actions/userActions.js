import axios from 'axios';
import {
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    REGISTER_USER_REQUEST,
    REGISTER_USER_SUCCESS,
    REGISTER_USER_FAIL,
    LOAD_USER_REQUEST,
    LOAD_USER_SUCCESS,
    LOAD_USER_FAIL,
    LOGOUT_SUCCESS,
    LOGOUT_FAIL,
    CLEAR_ERRORS
} from '../constants/userConstants';

export const login = (email, password) => async dispatch => {
    try{
        dispatch({type: LOGIN_REQUEST});

        const config = {
            headers: {
                'content-type': 'application/json'
            }
        }

        const { data } = await axios.post('/api/v1/login', {email, password}, config);

        dispatch({type: LOGIN_SUCCESS, payload: data.user});
    }
    catch(error){
        dispatch({
            type: LOGIN_FAIL,
            payload: error.response.data.errorMessage
        })
    }
}

export const register = (userData) => async dispatch => {
    try{
        dispatch({type: REGISTER_USER_REQUEST});

        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }

        const { data } = await axios.post('/api/v1/register', userData, config);

        dispatch({type: REGISTER_USER_SUCCESS, payload: data.user});
    }
    catch(error){
        dispatch({
            type: REGISTER_USER_FAIL,
            payload: error.response.data.errorMessage
        })
    }
}

export const loadUser = () => async dispatch => {
    try{
        dispatch({type: LOAD_USER_REQUEST});

        const { data } = await axios.get('/api/v1/me');

        dispatch({type: LOAD_USER_SUCCESS, payload: data.user});
    }
    catch(error){
        dispatch({
            type: LOAD_USER_FAIL,
            payload: error.response.data.errorMessage
        })
    }
}

export const logout = () => async dispatch => {
    try{

        const { data } = await axios.get('/api/v1/logout');

        dispatch({type: LOGOUT_SUCCESS, payload: data.user});
    }
    catch(error){
        dispatch({
            type: LOGOUT_FAIL,
            payload: error.response.data.errorMessage
        })
    }
}

export const clearErrors = () => async dispatch => {
    dispatch({
        type: CLEAR_ERRORS
    })
}