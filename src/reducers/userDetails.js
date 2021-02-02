import { Map } from 'immutable';
import { getfromLocalStorage } from '../utils/common';
import { USER_DETAILS, JWT_TOKEN, IS_LOADING } from '../const/urls';
const initialState = new Map({
    userDetail: getfromLocalStorage('userDetails') ? getfromLocalStorage('userDetails') : {},
    jwtToken: '',
    isLoading: false
})

const userDetails = (state = initialState, action) => {
    switch (action.type) {
        case IS_LOADING:
            return state.set('isLoading', action.payload);
        case USER_DETAILS:
            return state.set('userDetail', action.payload);
        case JWT_TOKEN:
            return state.set('jwtToken', action.payload);
        default:
            return state;
    }
}
export default userDetails;
