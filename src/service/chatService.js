import axios from 'axios';
import { getDataAction, postDataAction } from './dataAction';
import { CHAT, URLS } from '../const/urls';
import toast from '../component/common/toast';
import createAction from './createAction';
import setting from '../setting/index';

const ENDPOINT = setting.load().apiUrl;

const getGroupMessageByMeeting = (meetingId) => {
  const params = { meetingId };
  const url = ENDPOINT + `${URLS.GET_GROUP_MESSAGE_BY_MEETING}`;
  return (dispatch) =>
    getDataAction(url, params)
      .then((res) => {
        if (res.data) {
          dispatch(createAction(CHAT.GET_GROUP_MESSAGE_BY_MEETING, res.data));
        } else {
          dispatch(createAction(CHAT.CLEAR_GROUP_MESSAGES, []));
        }

        return res;
      })
      .catch((err) => {
        toast(err, 'error');
      });
};

const setMessageReceivers = (meetingId, receiver) => {
  const formData = { meetingId, receiver };
  const url = ENDPOINT + `${URLS.Set_Message_Receivers}`;
  return (dispatch) =>
    postDataAction(url, formData)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        toast(err, 'error');
      });
};

const getPrivateMessagesByMeetingAndThread = (meetingId, owners) => {
  const params = { meetingId, owners };
  const url = ENDPOINT + `${URLS.Get_Private_Messages_By_MeetingAndThread}`;
  return (dispatch) =>
    getDataAction(url, params)
      .then((res) => {
        if (res.data) {
          dispatch(createAction(CHAT.Get_Private_Messages_By_MeetingAndThread, res.data));
        }

        return res;
      })
      .catch((err) => {
        toast(err, 'error');
      });
};

const getParticipantsUnreadPrivateMessage = (participants) => {
  const url = ENDPOINT + `${URLS.Get_Participants_Unread_PrivateMessage}`;
  return (dispatch) =>
    postDataAction(url, participants)
      .then((res) => {
        if (res.data) {
          dispatch(createAction(CHAT.Get_Participants_Unread_PrivateMessage, res.data));
        }

        return res;
      })
      .catch((err) => {
        toast(err, 'error');
      });
};

const setPrivateMessagesIsReadFlag = (meetingId, owner, senderId) => {
  const params = { meetingId, owner, senderId };
  const url = ENDPOINT + `${URLS.Set_Private_Messages_IsReadFlag}`;
  return (dispatch) =>
    getDataAction(url, params)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        toast(err, 'error');
      });
};

const updateUnreadMessages = (unreadMessageInfo) => (dispatch) => {
  dispatch(createAction(CHAT.Get_Participants_Unread_PrivateMessage, unreadMessageInfo));
};

const uploadGroupChatAttachment = (formData) => (dispatch) => {
  const url = ENDPOINT + `${URLS.Upload_GroupChat_Attachment}`;

  let options = {
    onUploadProgress: (progressEvent) => {
      const { loaded, total } = progressEvent;
      let percentage = Math.floor((loaded * 100) / total);
      if (percentage < 100) {
        dispatch(
          createAction(CHAT.Upload_GroupChat_Attachment_Progress, { percentage, uploadInProgress: true })
        );
      }
    },
  };

  return axios.post(url, formData, options).then((res) => {
    dispatch(
      createAction(CHAT.Upload_GroupChat_Attachment_Progress, { percentage: 100, uploadInProgress: true })
    );
    setTimeout(() => {
      dispatch(
        createAction(CHAT.Upload_GroupChat_Attachment_Progress, { percentage: 0, uploadInProgress: false })
      );
    });
    return res;
  });
};

const uploadPrivateChatImages = (formData) => (dispatch) => {
  const url = ENDPOINT + `${URLS.UPLOAD_PRIVATECHAT_IMAGES}`;

  let options = {
    onUploadProgress: (progressEvent) => {
      const { loaded, total } = progressEvent;
      let percentage = Math.floor((loaded * 100) / total);
      if (percentage < 100) {
        dispatch(
          createAction(CHAT.Upload_Private_Attachment_Progress, { percentage, uploadInProgress: true })
        );
      }
    },
  };

  return axios.post(url, formData, options).then((res) => {
    dispatch(
      createAction(CHAT.Upload_Private_Attachment_Progress, { percentage: 100, uploadInProgress: true })
    );
    setTimeout(() => {
      dispatch(
        createAction(CHAT.Upload_Private_Attachment_Progress, { percentage: 0, uploadInProgress: false })
      );
    });
    return res;
  });
};

const createDownloadLink = (src, fileName) => {
  const linkSource = src.data;
  const downloadLink = document.createElement('a');
  const originalName = fileName.split('_')[1];

  downloadLink.href = linkSource;
  downloadLink.download = originalName;
  downloadLink.click();
};

const downloadGroupAttachment = (meetingId, fileName) => {
  const params = { meetingId, fileName };

  const url = ENDPOINT + `${URLS.DOWNLOAD_GROUPMESSAGE_ATTACHMENT}`;
  return (dispatch) =>
    getDataAction(url, params)
      .then((res) => {
        if (res.status !== 200) {
          ErrorHandler.logError(res);
        } else {
          createDownloadLink(res, fileName);
        }
      })
      .catch(function (error) {
        ErrorHandler.logError(error);
      });
};

const downloadPrivateAttachment = (meetingId, fileName, threadId) => {
  const params = { meetingId, fileName, threadId };

  const url = ENDPOINT + `${URLS.DOWNLOAD_PRIVATEMESSAGE_ATTACHMENT}`;
  return (dispatch) =>
    getDataAction(url, params)
      .then((res) => {
        if (res.status !== 200) {
          ErrorHandler.logError(res);
        } else {
          createDownloadLink(res, fileName);
        }
      })
      .catch(function (error) {
        ErrorHandler.logError(error);
      });
};

export {
  getGroupMessageByMeeting,
  setMessageReceivers,
  getPrivateMessagesByMeetingAndThread,
  getParticipantsUnreadPrivateMessage,
  updateUnreadMessages,
  setPrivateMessagesIsReadFlag,
  uploadGroupChatAttachment,
  uploadPrivateChatImages,
  downloadGroupAttachment,
  downloadPrivateAttachment
};
