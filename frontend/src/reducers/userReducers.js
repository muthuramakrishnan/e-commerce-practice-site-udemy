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
    CLEAR_ERRORS,
    LOGOUT_SUCCESS,
    LOGOUT_FAIL
} from '../constants/userConstants';

export const authReducer = (state = { user:{} }, action) => {
    switch(action.type){
        case LOGIN_REQUEST:
        case LOAD_USER_REQUEST:
        case REGISTER_USER_REQUEST: return{
            loading: true,
            isAuthenticated: false
        }
        case LOGIN_SUCCESS:
        case LOAD_USER_SUCCESS: 
        case REGISTER_USER_SUCCESS: return{
            ...state,
            isAuthenticated: true,
            loading: false,
            user: action.payload
        }
        case LOAD_USER_FAIL:return{
            ...state,
            loading: false,
            isAuthenticated: false,
            user: null,
            error: null
        }
        case LOGIN_FAIL:
        case REGISTER_USER_FAIL: return{
            ...state,
            loading: false,
            isAuthenticated: false,
            user: null,
            error: action.payload
        }
        case CLEAR_ERRORS: return{
            ...state,
            error: null
        }
        case LOGOUT_SUCCESS: return{
            loading:false,
            isAuthenticated: false,
            user: null
        }
        case LOGOUT_FAIL: return{
            ...state,
            loading: false,
            error: action.payload
        }
        default: return state;
    }
}

// export const userReducer = (state = {}, action) => {
//     switch(action.type){
//         case UPDATE_PASSWORD_REQUEST: return{
//             ...state,
//             loading: true
//         }
//         case UPDATE_PASSWORD_SUCCESS: return{
//             ...state,
//             loading: false,
//             isUpdated: action.payload
//         }
//         case UPDATE_PASSWORD_FAIL: return{
//             ...state,
//             loading: false,
//             error: action.payload
//         }
//         case UPDATE_PASSWORD_RESET: return{
//             ...state,
//             isUpdated: false
//         }
//         default: return state;
//     }
// }