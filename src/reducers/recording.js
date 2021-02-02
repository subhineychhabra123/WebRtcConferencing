import { Map } from 'immutable';
import { RECORDING, IS_LOADING } from '../const/urls';
const initialState = new Map({
  allRecording: [],
  isLoading: false,
})
const recording = (state = initialState, action) => {
  switch (action.type) {
    case IS_LOADING:
      return state.set('isLoading', action.payload);
    case RECORDING.GET_ALL_RECORDING:
      return state.set('allRecording', action.payload);
    default:
      return state;
  }
}
export default recording;
