import { Map } from 'immutable';
import { CHAT, IS_LOADING } from '../const/urls';

const initialState = new Map({
  isLoading: false,
  meetingGroupMessageInfo: null,
  meetingPrivateMessageInfo: null,
  unreadPrivateMessageInfo: [],
  groupImageUploadStatus: { percentage: 0, uploadInProgress: false },
});

const chat = (state = initialState, action) => {
  switch (action.type) {
    case IS_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };
    case CHAT.GET_GROUP_MESSAGE_BY_MEETING:
      return { ...state, meetingGroupMessageInfo: action.payload };
    case CHAT.CLEAR_GROUP_MESSAGES:
      return { ...state, meetingGroupMessageInfo: null };
    case CHAT.Upload_GroupChat_Attachment_Progress:
      return { ...state, groupImageUploadStatus: action.payload };
      case CHAT.Upload_Private_Attachment_Progress:
      return { ...state, privateAttachmentUploadStatus: action.payload };
    case CHAT.Get_Private_Messages_By_MeetingAndThread:
      return { ...state, meetingPrivateMessageInfo: action.payload };

    case CHAT.Get_Participants_Unread_PrivateMessage:
      const updatedState = {
        ...state,
        unreadPrivateMessageInfo: action.payload.map((item) => item),
      };

      return updatedState;

    default:
      return state;
  }
};

export default chat;
