import { Map } from 'immutable';
import { MEETING, IS_LOADING } from '../const/urls';
const initialState = new Map({
  getAllMeeting: [],
  getAllMeetingParticipants: [],
  isLoading: false,
  status: 0,
  alreadyInMeeting: false
})
const meeting = (state = initialState, action) => {
  switch (action.type) {
    case IS_LOADING:
      return state.set('isLoading', action.payload);
    case MEETING.IS_USER_EXIST_IN_MEETING:
      return state.set('alreadyInMeeting', action.payload);
    case MEETING.UPDATE_MEETING_STATUS:
      return state.set('meetingStatus', action.payload.status);
    case MEETING.GET_ALL_MEETING:
      return state.set('getAllMeeting', action.payload);
    case MEETING.GET_ALL_MEETING_PARTICIPANTS:
      return state.set('getAllMeetingParticipants', action.payload);
    default:
      return state;
  }
}
export default meeting;
