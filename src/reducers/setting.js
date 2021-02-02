import { Map } from 'immutable';
import { SETTING, IS_LOADING } from '../const/urls';

const initialState = new Map({
  isLoading: false,
  setting: { timezone: '' },
});

const chat = (state = initialState, action) => {
  switch (action.type) {
    case IS_LOADING:
      return state.set('isLoading', action.payload);
    case SETTING.GET_SETTING:
      return state.set('setting', action.payload);

    default:
      return state;
  }
};

export default chat;
