import { Map } from 'immutable';
import { USERS } from '../const/urls';
const initialState = new Map({
  getAllUsers: [],
  getHost: {},
  hostDetails: {},
});
const allUser = (state = initialState, action) => {
  switch (action.type) {
    case USERS.GET_HOST:
      return state.set('getHost', action.payload);
    case USERS.GET_ALL_USERS:
      return state.set('getAllUsers', action.payload);
    case USERS.GET_HOST_DETAILS:
      return state.set('hostDetails', action.payload);
    default:
      return state;
  }
};
export default allUser;
