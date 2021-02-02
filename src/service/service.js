import { getDataAction, postDataAction } from './dataAction';
import { URLS, USER_DETAILS, MEETING, USERS, JWT_TOKEN, CONTACT, IS_LOADING, RECORDING } from '../const/urls';
import { setInLocalStorage } from '../utils/common';
import toast from '../component/common/toast';
import createAction from './createAction';
import Meeting from '../component/Meeting';
import setting from '../setting/index';

const ENDPOINT = setting.load().apiUrl;

const login = (emailId, password, history, queryString) => (dispatch) => {
  const form = { emailId, password };
  const url = ENDPOINT + `${URLS.LOGIN}`;
  dispatch(createAction(IS_LOADING, true));
  postDataAction(url, form)
    .then((res) => {
      dispatch(createAction(IS_LOADING, false));
      if (res.data && res.data.data && res.data.data.id !== undefined && res.data.msg !== '') {
        dispatch(createAction(USER_DETAILS, res.data.data));
        dispatch(createAction(JWT_TOKEN, res.data.token));
        setInLocalStorage('token', res.data.token);
        setInLocalStorage('userDetails', res.data.data);
        setInLocalStorage('userSetting', res.data.setting);
        toast(res.data.msg, res.data.status);
        if (queryString && queryString.length > 0) {
          if (queryString[2] == 1) {
            const params = { meetingId: queryString[0] };
            setTimeout(() => history.push(`/admin/meeting/`, params), 1000);
          }
        } else {
          setTimeout(() => history.push('/admin/dashboard'), 1000);
        }
      } else {
        toast(res.data.msg, res.data.status);
      }
    })
    .catch((err) => {
      dispatch(createAction(IS_LOADING, false));
      toast(err, 'error');
    });
};

const forgotpassword = (emailId) => (dispatch) => {
  const form = { emailId };
  const url = ENDPOINT + `${URLS.FORGOTPASSWORD}`;
  dispatch(createAction(IS_LOADING, true));
  return postDataAction(url, form);
};

const resetpassword = (emailId, password, history) => (dispatch) => {
  const form = { emailId, password };
  const url = ENDPOINT + `${URLS.RESETPASSWORD}`;
  dispatch(createAction(IS_LOADING, true));
  postDataAction(url, form)
    .then((res) => {
      toast(res.data.msg, res.data.status);
      dispatch(createAction(IS_LOADING, false));
      setTimeout(() => history.push('/'), 1000);
    })
    .catch((err) => {
      toast(err, 'error');
      dispatch(createAction(IS_LOADING, false));
    });
};

const register = (emailId, password, fullname, history) => (dispatch) => {
  const form = { emailId, password, fullname, active: 1 };
  const url = ENDPOINT + `${URLS.REGISTER}`;
  dispatch(createAction(IS_LOADING, true));
  postDataAction(url, form)
    .then((res) => {
      dispatch(createAction(IS_LOADING, false));
      if (res.data.data) {
        setInLocalStorage('token', res.data.token);
        setInLocalStorage('userDetails', res.data.data);
        toast(res.data.msg, res.data.status);
        setTimeout(() => history.push('/admin/dashboard'), 1000);
      } else {
        toast(res.data.msg, res.data.status);
      }
    })
    .catch((err) => {
      dispatch(createAction(IS_LOADING, false));
    });
};

const updateUser = (emailId, password, fullname, history, queryString) => (dispatch) => {
  const form = { emailId, password, fullname };
  const url = ENDPOINT + `${URLS.UPDATE_USER}`;
  dispatch(createAction(IS_LOADING, true));
  postDataAction(url, form)
    .then((res) => {
      dispatch(createAction(IS_LOADING, false));
      if (res.data.data) {
        toast(res.data.msg, res.data.status);
        setInLocalStorage('token', res.data.token);
        setInLocalStorage('userDetails', res.data.data);
        if (queryString && queryString.length > 2) {
          const params = { meetingId: queryString[0] };
          setTimeout(() => history.push(`/admin/meeting/`, params), 1000);
        } else {
          setTimeout(() => history.push('/admin/dashboard'), 1000);
        }
      } else {
        toast(res.data.msg, res.data.status);
      }
    })
    .catch((err) => {
      toast(err, 'error');
      dispatch(createAction(IS_LOADING, false));
    });
};

const addNewMeeting = (title, description, hostId) => (dispatch) => {
  const form = { title, description, hostId, status: 0, duration: '' };
  const url = ENDPOINT + `${URLS.ADD_NEW_MEETING}`;
  return postDataAction(url, form);
};

const getAllMeeting = (hostId) => (dispatch) => {
  const url = ENDPOINT + `${URLS.GET_ALL_MEETING}`;
  const form = { hostId };
  getDataAction(url, form)
    .then((res) => {
      if (res.data && res.data.data.length > 0) {
        dispatch(createAction(MEETING.GET_ALL_MEETING, res.data.data));
      }
    })
    .catch((err) => {
      // debugger
    });
};

const getAllUsers = () => (dispatch) => {
  const url = ENDPOINT + `${URLS.GET_ALL_USERS}`;
  getDataAction(url)
    .then((res) => {
      if (res.data && res.data.data.length > 0) {
        dispatch(createAction(USERS.GET_ALL_USERS, res.data.data));
      }
    })
    .catch((err) => {
      // debugger
    });
};

const inviteParticipant = (userId, meetingInfo, filterObject) => (dispatch) => {
  const url = ENDPOINT + `${URLS.INVITE_PARTICIPANT}`;
  const form = { userId, meetingInfo, filterObject };
  dispatch(createAction(IS_LOADING, true));
  return postDataAction(url, form);
};

const addContactAsParticiant = (meetingId, user, meetingInfo, sender) => (dispatch) => {
  const url = ENDPOINT + `${URLS.ADD_CONTACT_PARTICIPANT}`;
  const form = { meetingId, user, meetingInfo, sender };
  dispatch(createAction(IS_LOADING, true));
  return postDataAction(url, form);
};

const deleteParticipant = (meetingId, userId) => (dispatch) => {
  const url = ENDPOINT + `${URLS.DELETE_PARTICIPANT}`;
  const form = { meetingId, userId };
  dispatch(createAction(IS_LOADING, true));
  return postDataAction(url, form);
};

const getAllMeetingPaticipants = (meetingId) => (dispatch) => {
  const form = { meetingId };
  const url = ENDPOINT + `${URLS.GET_ALL_MEETINGPARTICIPANTS}`;
  getDataAction(url, form)
    .then((res) => {
      if (res.data && res.data.data) {
        dispatch(createAction(MEETING.GET_ALL_MEETING_PARTICIPANTS, res.data.data));
      }
    })
    .catch((err) => {
      // debugger
    });
};

const getMeetingInfoByMeetingId = (meetingId, username, history) => (dispatch) => {
  const form = { meetingId };
  const url = ENDPOINT + `${URLS.GET_MEETINGBYID}`;
  getDataAction(url, form)
    .then((res) => {
      if (res.data.data != null) {
        const item = res.data.data;
        const params = { meetingInfo: item, username };
        history.push(`/meeting/${item.title.replace(/ +/g, '_')}`, params);
      }
    })
    .catch((err) => {
      // debugger
    });
};

const addConatct = (userId, hostmail, emailId) => (dispatch) => {
  const form = { userId, sender: hostmail, contactId: emailId };
  const url = ENDPOINT + `${URLS.ADD_CONTACT}`;
  return postDataAction(url, form);
};

const deleteConatct = (userId, contactID) => (dispatch) => {
  const form = { userId, contactID };
  const url = ENDPOINT + `${URLS.DELETE_CONTACT}`;
  return postDataAction(url, form);
};

const getAllContacts = (userId) => (dispatch) => {
  const form = { userId };
  const url = ENDPOINT + `${URLS.GET_ALL_CONTACTS}`;
  getDataAction(url, form)
    .then((res) => {
      if (res.data && res.data.data.length > 0) {
        dispatch(createAction(CONTACT.GET_ALL_CONTACT, res.data.data));
      }
    })
    .catch((err) => {
      // debugger
    });
};

const getHost = (hostId) => (dispatch) => {
  const form = { hostId };
  const url = ENDPOINT + `${URLS.GET_HOST}`;
  getDataAction(url, form)
    .then((res) => {
      if (res.data && res.data.data) {
        dispatch(createAction(USERS.GET_HOST, res.data.data));
      }
    })
    .catch((err) => {
      // debugger
    });
};

const getHostDetails = (hostId) => (dispatch) => {
  const form = { hostId };
  const url = ENDPOINT + `${URLS.GET_HOST}`;
  getDataAction(url, form)
    .then((res) => {
      if (res.data && res.data.data) {
        dispatch(createAction(USERS.GET_HOST_DETAILS, res.data.data));
      }
    })
    .catch((err) => {
    });
};

const updateMeetingStatus = (meetingId, status) => (dispatch) => {
  const form = { meetingId, status };
  const url = ENDPOINT + `${URLS.UPDATE_MEETING_STATUS_BY_ID}`;
  return getDataAction(url, form);
};

const addUserInMeeting = (userId) => (dispatch) => {
  const form = { userId };
  const url = ENDPOINT + `${URLS.ADD_USER_IN_MEETING}`;
  return postDataAction(url, form);
};

const deleteUserFromMeeting = (userId) => (dispatch) => {
  const form = { userId };
  const url = ENDPOINT + `${URLS.DELETE_USER_FROM_MEETING}`;
  return getDataAction(url, form);
};

const updateRecordingStatus = (meetingId) => (dispatch) => {
  const form = { meetingId };
  const url = ENDPOINT + `${URLS.UPDATE_RECORDING_STATUS_IN_MEETING}`;
  return getDataAction(url, form);
};

const changePrivateChat = (meetingId) => (dispatch) => {
  const form = { meetingId };
  const url = ENDPOINT + `${URLS.UPDATE_PRIVATE_CHAT_IN_MEETING}`;
  return getDataAction(url, form);
};

const isUserExistInAnyMeeting = (userId) => (dispatch) => {
  const form = { userId };
  const url = ENDPOINT + `${URLS.GET_USER_FROM_MEETING_IF_EXIST}`;
  getDataAction(url, form)
    .then((res) => {
      if (res.data && res.data.data) {
        dispatch(createAction(MEETING.IS_USER_EXIST_IN_MEETING, true));
      } else {
        dispatch(createAction(MEETING.IS_USER_EXIST_IN_MEETING, false));
      }
    })
};

const saveStream = (userId, blob, videoName) => dispatch => {
  const url = ENDPOINT + `${URLS.SAVE_VIDEO}`;
  const headers = { 'content-type': 'multipart/form-data' }
  const form = new FormData();
  const file = new File([blob], videoName, { type: 'video/webm' });
  form.append('blob', file);
  form.append("userId", userId);
  form.append("videoName", videoName);
  return postDataAction(url, form, headers)
}

const getAllRecording = (userId) => dispatch => {
  const form = { userId };
  const url = ENDPOINT + `${URLS.GET_ALL_RECORDING}`;
  getDataAction(url, form)
    .then((res) => {
      if (res.data && res.data.data.length > 0) {
        dispatch(createAction(RECORDING.GET_ALL_RECORDING, res.data.data));
      }
    })
    .catch((err) => {
      // debugger
    })
}

const downloadRecordedVideo = (userId, videoName) => dispatch => {
  const form = { userId, videoName };
  const url = ENDPOINT + `${URLS.DOWNLOAD_RECORDING}`;
  return getDataAction(url, form);
}
const playRecordedVideo = (userId, videoName) => dispatch => {
  const form = { userId, videoName };
  const url = ENDPOINT + `${URLS.PLAY_RECORDED_VIDEO}`;
  return getDataAction(url, form);
}


export {
  login,
  forgotpassword,
  resetpassword,
  register,
  updateUser,
  addNewMeeting,
  getAllMeeting,
  getAllUsers,
  inviteParticipant,
  addContactAsParticiant,
  deleteParticipant,
  getMeetingInfoByMeetingId,
  addConatct,
  deleteConatct,
  getAllContacts,
  getAllMeetingPaticipants,
  getHost,
  updateMeetingStatus,
  updateRecordingStatus,
  changePrivateChat,
  addUserInMeeting,
  deleteUserFromMeeting,
  isUserExistInAnyMeeting,
  saveStream,
  getAllRecording,
  downloadRecordedVideo,
  playRecordedVideo,
  getHostDetails,
};