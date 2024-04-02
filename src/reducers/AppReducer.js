import {
    LOADING,
    RESET_STORE,
    IS_LOGGED_IN,
    SAVE_USER_DETAILS
} from "../actions/AppActions";

import { APP_LOAD } from '../middleware/storageMiddleware';

export const reducer = (state = {}, action) => {

    switch (action.type) {
        case APP_LOAD:
            return { ...state, ...action.store.app }
        case LOADING:
            return { ...state, loading: action.loading }
        case IS_LOGGED_IN:
            return { ...state, isLoggedIn: action.data }
        case SAVE_USER_DETAILS:
            return { ...state, userDetails: action.data }
        case RESET_STORE:
            return { ...state.app, ...action.data }
        default:
            return state;
    }
}
