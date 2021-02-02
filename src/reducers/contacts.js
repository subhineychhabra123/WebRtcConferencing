import { Map } from 'immutable';
import { CONTACT } from '../const/urls';
const initialState = new Map({
  getAllContacts: []
})
const contact = (state = initialState, action) => {
  switch (action.type) {
    case CONTACT.GET_ALL_CONTACT:
      return state.set('getAllContacts', action.payload);
    default:
      return state;
  }
}
export default contact;
