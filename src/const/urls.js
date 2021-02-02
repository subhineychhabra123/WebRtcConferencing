export const URLS = {
  LOGIN: 'auth/login',
  FORGOTPASSWORD: 'auth/forgotpassword',
  RESETPASSWORD: 'auth/resetpassword',
  REGISTER: 'auth/register',
  UPDATE_USER: 'auth/updateuser',
  GET_ALL_USERS: 'auth/getAllUser',
  GET_VIDEO_TOKEN: 'auth/video/token',
  ADD_NEW_MEETING: 'meeting/addNewMeeting',
  GET_ALL_MEETING: 'meeting/getAllMeeting',
  INVITE_PARTICIPANT: 'participant/addParticipant',
  DELETE_PARTICIPANT: 'participant/deleteParticipant',
  ADD_CONTACT_PARTICIPANT: 'participant/addContactParticipant',
  GET_ALL_MEETINGPARTICIPANTS: 'participant/getParticipantByMeetingId',
  GET_MEETINGBYID: 'meeting/getMeetingById',
  ADD_CONTACT: 'contact/addNewContact',
  DELETE_CONTACT: 'contact/deleteContact',
  GET_ALL_CONTACTS: 'contact/getAllContacts',
  GET_HOST: 'auth/getHost',
  UPDATE_MEETING_STATUS_BY_ID: 'meeting/updateMeetingStatusById',
  ADD_USER_IN_MEETING: 'meeting/addUserInMeeting',
  DELETE_USER_FROM_MEETING: 'meeting/deleteUserFromMeeting',
  GET_USER_FROM_MEETING_IF_EXIST: 'meeting/getUserFromAnyMeetingIfExist',
  UPDATE_RECORDING_STATUS_IN_MEETING: 'meeting/updateRecordingStatus',
  UPDATE_PRIVATE_CHAT_IN_MEETING: 'meeting/updatePrivateChatStatus',

  GET_GROUP_MESSAGE_BY_MEETING: 'group-chat/getGroupMessageByMeeting',
  Set_Message_Receivers: 'group-chat/setMessageReceivers',
  Upload_GroupChat_Attachment: 'group-chat/uploadAttachment',
  UPLOAD_PRIVATECHAT_IMAGES: 'private-chat/privateImages',
  DOWNLOAD_GROUPMESSAGE_ATTACHMENT:'group-chat/downloadGroupAttachment',
  DOWNLOAD_PRIVATEMESSAGE_ATTACHMENT:'private-chat/downloadPrivateAttachment',

  Get_Private_Messages_By_MeetingAndThread: 'private-chat/getMessagesByMeetingAndThread',
  Get_Participants_Unread_PrivateMessage: 'private-chat/getParticipantsUnreadPrivateMessage',
  Set_Private_Messages_IsReadFlag: 'private-chat/setPrivateMessagesIsReadFlag',

  GET_SETTINGS: 'setting/getSettings',
  UPSERT_SETTINGS: 'setting/upsertSettings',
  SAVE_VIDEO: 'recording/',
  GET_ALL_RECORDING: 'recording/getAllRecording',
  DOWNLOAD_RECORDING: 'recording/download',
  PLAY_RECORDED_VIDEO: 'recording/play',
};

export const USER_DETAILS = 'USER_DETAILS';
export const JWT_TOKEN = 'JWT_TOKEN';
export const IS_LOADING = 'IS_LOADING';

export const MEETING = {
  GET_ALL_MEETING: 'GET_ALL_MEETING',
  ADD_NEW_MEETING: 'ADD_NEW_MEETING',
  GET_ALL_MEETING_PARTICIPANTS: 'GET_ALL_MEETING_PARTICIPANTS',
  UPDATE_MEETING_STATUS: 'UPDATE_MEETING_STATUS',
  IS_USER_EXIST_IN_MEETING: 'IS_USER_EXIST_IN_MEETING',
};

export const CONTACT = {
  GET_ALL_CONTACT: 'GET_ALL_CONTACT',
};

export const RECORDING = {
  GET_ALL_RECORDING: 'GET_ALL_RECORDING',
};

export const USERS = {
  GET_ALL_USERS: 'GET_ALL_USERS',
  GET_HOST: 'GET_HOST',
  GET_HOST_DETAILS: 'GET_HOST_DETAILS',
};

export const CHAT = {
  GET_GROUP_MESSAGE_BY_MEETING: 'GET_GROUP_MESSAGE_BY_MEETING',
  CLEAR_GROUP_MESSAGES: 'CLEAR_GROUP_MESSAGES',
  Upload_GroupChat_Attachment_Progress: 'Upload_GroupChat_Attachment_Progress',
  Upload_Private_Attachment_Progress: 'Upload_Private_Attachment_Progress',

  Get_Private_Messages_By_MeetingAndThread: 'Get_Messages_By_MeetingAndThread',
  Get_Participants_Unread_PrivateMessage: 'Get_Participants_Unread_PrivateMessage',
};

export const SETTING = {
  GET_SETTING: 'GET_SETTING',
  UPSERT_SETTING: 'UPSERT_SETTING',
};
