import { combineReducers } from 'redux';
import userDetail from './userDetails';
import meetings from './meeting';
import users from './allUsers';
import contacts from './contacts';
import recording from "./recording";
import chat from './chat';
import setting from './setting';

const reducers = combineReducers({
  userDetail: userDetail,
  meeting: meetings,
  users: users,
  contact: contacts,
  recording: recording,
  chat: chat,
  setting,
});

export default reducers;
