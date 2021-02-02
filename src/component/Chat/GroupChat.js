import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment-timezone';
import ScrollToBottom from 'react-scroll-to-bottom';
import classNames from 'classnames';
import $ from 'jquery';

import ImageMessage from './ImageMessage';
import TextMessage from './TextMessage';

import userAvatar from '../../assets/img/default-avatar.png';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import toast from '../common/toast';
import userChatIcon from '../../assets/img/user-icon.png';
import mike from '../../assets/img/mike.jpg';

import axios from 'axios';

import {
  getGroupMessageByMeeting,
  setMessageReceivers,
  getPrivateMessagesByMeetingAndThread,
  getParticipantsUnreadPrivateMessage,
  updateUnreadMessages,
  setPrivateMessagesIsReadFlag,
  uploadGroupChatAttachment,
  uploadPrivateChatImages,
} from '../../service/chatService';
import { getfromLocalStorage } from '../../utils/common';
import '../Chat/chat.css';
import DocumentMessage from './DocumentMessage';

const GroupChat = ({
  socket,
  userDetail,
  meetingName,
  meetingId,
  setChatUnreadMessageCount,
  showChatWindow,
  meetingParticipants,
  joinedPeers,
  hostDetails,
  ...props
}) => {
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [unreadMessageState, setUnreadMessageState] = useState([]);

  const [participants, setMeetingParticipants] = useState([]);
  const [cloneParticipants, setParticipantsClone] = useState([]);
  const [activeTab, setActiveTab] = useState('groupChatTab');
  const [isChatWindowOpen, setShowChatWindow] = useState(showChatWindow);
  const [chatSocket, setSocket] = useState(socket);
  const [msg, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);

  const [selectedPrivateChat, setPrivateChat] = useState(null);
  const [privateMsg, setPrivateMessage] = useState('');
  const [privateMessages, setPrivateMessages] = useState([]);
  const [privateTypingUsers, setPrivateTypingUsers] = useState([]);
  const [lastAttachmentFileName, setlastAttachmentFileName] = useState(null);
  const [lastPrivateAttachmentFileName, setlastPrivateAttachmentFileName] = useState(null);

  const dispatch = useDispatch();

  const meetingGroupMessageInfo = useSelector((state) => state.chat.meetingGroupMessageInfo);
  const meetingPrivateMessageInfo = useSelector((state) => state.chat.meetingPrivateMessageInfo);
  const unreadPrivateMessageInfo = useSelector((state) => state.chat.unreadPrivateMessageInfo);
  const groupImageUploadStatus = useSelector((state) => state.chat.groupImageUploadStatus);
  const privateAttachmentUploadStatus = useSelector((state) => state.chat.privateAttachmentUploadStatus);

  const stableDispatch = useCallback(dispatch, []);

  useEffect(() => {
    const setting = getfromLocalStorage('userSetting') || {};
    const today = new Date();

    if (meetingPrivateMessageInfo) {
      const clientTimezone = moment.tz.guess();
      setting.timezone = setting.timezone || clientTimezone;
      const messagesWithSenderInfo = meetingPrivateMessageInfo.messages.map((msg) => {
        const currentTimezoneTimestamp = moment.tz(msg.timestamp, setting.timezone);

        const todayMoment = moment.tz(today, setting.timezone);
        const insideMinutes = todayMoment.subtract(1, 'minutes');
        var isTodayDate = currentTimezoneTimestamp.isSame(todayMoment, 'day');
        var isSameYear = currentTimezoneTimestamp.isSame(todayMoment, 'year');

        if (isTodayDate) {
          msg.formattedDate = currentTimezoneTimestamp.format('h:mm A');
        }

        if (!isTodayDate && isSameYear) {
          msg.formattedDate = currentTimezoneTimestamp.format('dddd, MMM DD, h:mm A');
        }

        if (!isSameYear) {
          msg.formattedDate = currentTimezoneTimestamp.format('dddd, MMM DD, YYYY, h:mm A');
        }

        const isFewSecondsAgo = currentTimezoneTimestamp.isBetween(insideMinutes);

        if (isFewSecondsAgo) {
          msg.formattedDate = 'a few seconds ago';
        }

        msg.threadId = meetingPrivateMessageInfo.threadId;
        msg.isSender = msg.senderId === userDetail.id;
        return msg;
      });

      setPrivateMessages(messagesWithSenderInfo);
    }
  }, [meetingPrivateMessageInfo]);

  useEffect(() => {
    if (meetingParticipants && meetingParticipants.length && isChatWindowOpen === true) {
      setTimeout(() => {
        $('.friend').each(function () {
          $(this)
            .unbind('click')
            .click(function () {
              var childOffset = $(this).offset();
              var parentOffset = $(this).parent().parent().offset();
              var childTop = childOffset.top - parentOffset.top;
              var clone = $(this).find('img').eq(0).clone();
              var top = childTop + 12 + 'px';

              $(clone)
                .css({
                  top: top,
                })
                .addClass('floatingImg')
                .appendTo('#chatbox');

              setTimeout(function () {
                $('#profile p').addClass('animate');
                $('#profile').addClass('animate');
              }, 100);
              setTimeout(function () {
                $('#chat-messages').addClass('animate');
                $('.cx, .cy').addClass('s1');
                setTimeout(function () {
                  $('.cx, .cy').addClass('s2');
                }, 100);
                setTimeout(function () {
                  $('.cx, .cy').addClass('s3');
                }, 200);
              }, 150);

              $('.floatingImg').animate(
                {
                  width: '68px',
                  left: '108px',
                  top: '20px',
                },
                200
              );

              var name = $(this).find('p strong').html();
              var email = $(this).find('p span').html();
              $('#profile p').html(name);
              $('#profile span').html(email);

              $('.message').not('.right').find('img').attr('src', $(clone).attr('src')); // may remove
              $('#friendslist').fadeOut();
              $('#chatview').fadeIn();

              $('#close')
                .unbind('click')
                .click(function () {
                  $('#profile, #profile p').removeClass('animate');
                  $('.cx, .cy').removeClass('s1 s2 s3');
                  $('.floatingImg').animate(
                    {
                      width: '40px',
                      top: top,
                      left: '12px',
                    },
                    200,
                    function () {
                      $('.floatingImg').remove();
                    }
                  );

                  setTimeout(function () {
                    $('#chatview').fadeOut();
                    $('#friendslist').fadeIn();
                  }, 50);
                });
            });
        });
      });
    }
  }, [isChatWindowOpen, meetingParticipants]);

  useEffect(() => {
    if (meetingParticipants && meetingParticipants.length && isChatWindowOpen === true) {
      const { id, fullname, emailId } = hostDetails;
      const userIsHost = id === userDetail.id;
      let participantsInfo = [];

      if (userIsHost) {
        participantsInfo = meetingParticipants;
      } else {
        const isHostOnline = joinedPeers.some((joinedPeer) => joinedPeer.emailId === hostDetails.emailId);
        participantsInfo.push({ id, fullname, emailId, isOnline: isHostOnline, isHost: true });
      }

      const participantsThreads = participantsInfo.map((participant) => {
        const owner = getOwner([userDetail.id, participant.id]);

        return owner;
      });

      stableDispatch(
        getParticipantsUnreadPrivateMessage({ participantsThreads, meetingId, userId: userDetail.id })
      );
    }
  }, [meetingParticipants, isChatWindowOpen]);

  useEffect(() => {
    if (hostDetails.id) {
      const { id, fullname, emailId } = hostDetails;
      const userIsHost = id === userDetail.id;
      let participantsInfo = [];

      if (userIsHost) {
        participantsInfo = getAllMeetingParticipants(meetingParticipants, joinedPeers);
      } else {
        const isHostOnline = joinedPeers.some((joinedPeer) => joinedPeer.emailId === hostDetails.emailId);
        participantsInfo.push({ id, fullname, emailId, isOnline: isHostOnline, isHost: true });
      }

      if (unreadPrivateMessageInfo && unreadPrivateMessageInfo.length) {
        setUnreadMessageState(unreadPrivateMessageInfo);

        participantsInfo = participantsInfo.map((participant) => {
          const currentParticipantInfo = unreadPrivateMessageInfo.find(
            (unreadMessage) => unreadMessage.participantId === participant.id
          );

          participant.unreadMessageCount = currentParticipantInfo
            ? currentParticipantInfo.unreadMessageCount
            : null;

          return participant;
        });
      }

      setParticipantsClone(participantsInfo);
      setMeetingParticipants(participantsInfo);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meetingParticipants, joinedPeers, hostDetails, unreadPrivateMessageInfo]);

  useEffect(() => {
    if (meetingId) {
      stableDispatch(getGroupMessageByMeeting(meetingId));
    }
  }, [meetingId, stableDispatch]);

  useEffect(() => {
    setShowChatWindow(showChatWindow);
  }, [showChatWindow]);

  useEffect(() => {
    const setting = getfromLocalStorage('userSetting') || {};
    const today = new Date();

    if (meetingGroupMessageInfo) {
      const clientTimezone = moment.tz.guess();
      setting.timezone = setting.timezone || clientTimezone;
      const messagesWithSenderInfo = meetingGroupMessageInfo.messages.map((msg) => {
        const currentTimezoneTimestamp = moment.tz(msg.timestamp, setting.timezone);

        const todayMoment = moment.tz(today, setting.timezone);
        const insideMinutes = todayMoment.subtract(1, 'minutes');
        var isTodayDate = currentTimezoneTimestamp.isSame(todayMoment, 'day');
        var isSameYear = currentTimezoneTimestamp.isSame(todayMoment, 'year');

        if (isTodayDate) {
          msg.formattedDate = currentTimezoneTimestamp.format('h:mm A');
        }

        if (!isTodayDate && isSameYear) {
          msg.formattedDate = currentTimezoneTimestamp.format('dddd, MMM DD, h:mm A');
        }

        if (!isSameYear) {
          msg.formattedDate = currentTimezoneTimestamp.format('dddd, MMM DD, YYYY, h:mm A');
        }

        const isFewSecondsAgo = currentTimezoneTimestamp.isBetween(insideMinutes);

        if (isFewSecondsAgo) {
          msg.formattedDate = 'a few seconds ago';
        }

        msg.isSender = msg.senderId === userDetail.id;
        return msg;
      });

      setMessages(messagesWithSenderInfo);
    } else {
      setMessages([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meetingGroupMessageInfo]);

  useEffect(() => {
    setSocket(socket);

    if (socket) {
      socket.on('message', (message) => {
        setChatUnreadMessageCount(1);
        const isSender = message.senderId === userDetail.id;
        message.isSender = isSender;
        message.formattedDate = 'a few seconds ago';
        setMessages((messages) => [...messages, message]);

        setShowChatWindow((isChatWindowOpen) => {
          if (isChatWindowOpen && !isSender) {
            stableDispatch(setMessageReceivers(meetingId, userDetail.id));
          }

          return isChatWindowOpen;
        });
      });

      socket.on('typingState', (typingInfo) => {
        const { message, username, isTyping, socketID } = typingInfo;

        setTypingUsers((typingUsers) => {
          const typedUserIndex = typingUsers.findIndex((x) => x.socketID === socketID);
          const isTypingUserAlreadyExist = typedUserIndex >= 0;

          return isTyping && !isTypingUserAlreadyExist
            ? [...typingUsers, { socketID: socketID, username, message }]
            : !isTyping && isTypingUserAlreadyExist
            ? typingUsers.filter((item, index) => index !== typedUserIndex)
            : typingUsers;
        });
      });

      //  Private Message Block Start
      socket.on('privateMessage', (message) => {
        const isSender = message.senderId === userDetail.id;
        message.isSender = isSender;
        message.formattedDate = 'a few seconds ago';
        setPrivateMessages((privateMessages) => [...privateMessages, message]);

        setShowChatWindow((isChatWindowOpen) => {
          if (isChatWindowOpen) {
            setPrivateChat((privateChat) => {
              const isSenderChatOpen = privateChat && privateChat.id === message.senderId;
              const threadId = getOwner([userDetail.id, message.senderId]);

              if (isSenderChatOpen) {
                const owner = getOwner([userDetail.id, message.senderId]);
                stableDispatch(setPrivateMessagesIsReadFlag(meetingId, owner, message.senderId));
              } else {
                setUnreadMessageState((unreadMessageState) => {
                  const newJoinedParticipantUnreadMessageInfo = {
                    meetingId,
                    participantId: message.senderId,
                    threadId,
                    unreadMessageCount: 1,
                    userId: userDetail.id,
                  };
                  updateUnreadMessagesProps(
                    unreadMessageState,
                    message.senderId,
                    false,
                    newJoinedParticipantUnreadMessageInfo
                  );
                  return unreadMessageState;
                });
              }

              return privateChat;
            });
          }

          return isChatWindowOpen;
        });
      });

      socket.on('privateTypingState', (typingInfo) => {
        const { message, username, isTyping, socketID, typingUserEmailId } = typingInfo;

        setPrivateTypingUsers((typingUsers) => {
          const typedUserIndex = typingUsers.findIndex((x) => x.socketID === socketID);
          const isTypingUserAlreadyExist = typedUserIndex >= 0;

          return isTyping && !isTypingUserAlreadyExist
            ? [...typingUsers, { socketID: socketID, username, message, typingUserEmailId }]
            : !isTyping && isTypingUserAlreadyExist
            ? typingUsers.filter((item, index) => index !== typedUserIndex)
            : typingUsers;
        });
      });

      //  Private Message Block End
    }
  }, [socket]);

  const sendMessages = (event) => {
    event.preventDefault();
    const { emailId, id } = userDetail;
    if (msg) {
      const messageBody = { emailId, senderId: id, message: msg };
      chatSocket.emit('sendMessage', messageBody, () => setMessageAndTypingState(''));
    }
  };

  const setMessageAndTypingState = (message) => {
    setMessage(message);
    updateTypingState(message.length > 0);
  };

  const updateTypingState = (isTyping) => {
    chatSocket.emit('updateTypingState', isTyping);
  };

  const sendPrivateMessage = (event) => {
    event.preventDefault();
    const { emailId, id } = userDetail;

    if (privateMsg) {
      const messageBody = {
        emailId,
        senderId: id,
        message: privateMsg,
        owners: getOwner([id, selectedPrivateChat.id]),
        receiverId: selectedPrivateChat.id,
      };
      chatSocket.emit('sendPrivateMessage', messageBody, () => setPrivateMessageAndTypingState(''));
    }
  };

  const setPrivateMessageAndTypingState = (message) => {
    setPrivateMessage(message);
    updatePrivateChatTypingState(message.length > 0);
  };

  const updatePrivateChatTypingState = (isTyping) => {
    chatSocket.emit('updatePrivateChatTypingState', { isTyping, receiverId: selectedPrivateChat.id });
  };

  const searchContacts = (searchKeyword) => {
    const filteredContacts = cloneParticipants.filter(
      (cp) => cp.fullname.includes(searchKeyword) || cp.emailId.includes(searchKeyword)
    );

    setMeetingParticipants(filteredContacts);
  };

  const getAllMeetingParticipants = (meetingParticipants, joinedPeers) => {
    return meetingParticipants.map((participant) => {
      const isParticipantOnline = joinedPeers.some(
        (joinedPeer) => joinedPeer.emailId === participant.emailId
      );
      participant.isOnline = isParticipantOnline;

      return participant;
    });
  };

  const onPrivateChatOpen = (participant) => {
    const selectedChatThread = getThreadId([userDetail.id, participant.id]);
    participant.threadId = selectedChatThread;
    setPrivateChat(participant);
    const owners = getOwner([userDetail.id, participant.id]);
    stableDispatch(setPrivateMessagesIsReadFlag(meetingId, owners, participant.id)).then(() => {
      updateUnreadMessagesProps(unreadMessageState, participant.id, true);
    });

    stableDispatch(getPrivateMessagesByMeetingAndThread(meetingId, owners));
  };

  const onPrivateChatClose = () => {
    setPrivateChat(null);
    setPrivateMessage('');
    setPrivateMessages([]);
  };

  const getOwner = (owners) => {
    return owners.join('!');
  };

  const getThreadId = (owners) => {
    const [firstOwnerId, secondOwnerId] = owners;
    const idWithGreaterValue = firstOwnerId > secondOwnerId ? firstOwnerId : secondOwnerId;
    const idWithSmallValue = firstOwnerId < secondOwnerId ? firstOwnerId : secondOwnerId;

    return `${idWithGreaterValue}!${idWithSmallValue}`;
  };

  const updateUnreadMessagesProps = (
    unreadMessages,
    senderId,
    resetCount,
    newJoinedParticipantUnreadMessageInfo = {}
  ) => {
    const senderUnreadMessageInfoIndex = unreadMessages.findIndex(
      (unreadMsg) => unreadMsg.participantId === senderId
    );

    const senderUnreadMessageInfo = unreadMessages[senderUnreadMessageInfoIndex];
    if (senderUnreadMessageInfo) {
      const count = resetCount ? 0 : (senderUnreadMessageInfo.unreadMessageCount += 1);
      senderUnreadMessageInfo.unreadMessageCount = count;
      stableDispatch(updateUnreadMessages(unreadMessages));
    } else {
      unreadMessages.push(newJoinedParticipantUnreadMessageInfo);
      stableDispatch(updateUnreadMessages(unreadMessages));
    }
  };

  useEffect(() => {
    if (groupImageUploadStatus) {
      setMessages((messages) =>
        messages.map((msg, index) => {
          const lastMessageIndex = messages.length - 1;
          if (
            (index === lastMessageIndex && msg.type === 'image') ||
            (index === lastMessageIndex && msg.type === 'docs')
          ) {
            msg.uploadStaus = groupImageUploadStatus;
          }
          return msg;
        })
      );
    }
  }, [groupImageUploadStatus]);

  useEffect(() => {
    if (lastAttachmentFileName) {
      setMessages((messages) =>
        messages.map((msg, index) => {
          const lastMessageIndex = messages.length - 1;
          if (
            (index === lastMessageIndex && msg.type === 'image') ||
            (index === lastMessageIndex && msg.type === 'docs')
          ) {
            msg.uploadStaus = privateAttachmentUploadStatus;
            msg.fileName = lastAttachmentFileName;
          }
          return msg;
        })
      );
    }
  }, [lastAttachmentFileName]);

  const uploadAttachment = async ({ target: { files } }) => {
    const file = files[0];
    const restrictedFileTypes = ['exe'];

    if (file) {
      const attachmentFileType = getFileExtension(file.name);
      const shouldNotUploadThisFile = restrictedFileTypes.indexOf(attachmentFileType) !== -1;
      if (!shouldNotUploadThisFile) {
        const fileType = file.type.split('/')[0];
        let data = new FormData();
        data.append('file', file);
        data.append('meetingId', meetingId);

        const toBase64 = (file) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
          });

        const base64Image = await toBase64(file);

        let message;
        if (fileType === 'image') {
          message = {
            type: 'image',
            isSender: true,
            formattedDate: 'a few seconds ago',
            uploadPercentage: 0,
            src: base64Image,
            isDummyAttachment: true,
          };
        } else {
          message = {
            type: 'docs',
            isSender: true,
            formattedDate: 'a few seconds ago',
            uploadPercentage: 0,
            fileName: `${meetingId}_${file.name}`,
            isDummyAttachment: true,
          };
        }

        setMessages((messages) => [...messages, message]);

        stableDispatch(uploadGroupChatAttachment(data)).then((res) => {
          const { emailId, id } = userDetail;
          const { _id, name } = res.data;

          const messageBody = {
            emailId,
            senderId: id,
            message: msg,
            type: fileType === 'image' ? 'image' : 'docs',
            mimeType: file.type,
            attachmentId: _id,
            fileName: name,
          };
          setlastAttachmentFileName(messageBody.fileName);
          chatSocket.emit('sendMessage', messageBody, () => setMessageAndTypingState(''));
        });
      } else {
        toast(`Unable to upload this type of file.`);
      }
    }
  };

  const getFileExtension = (fileName) => {
    const lastOccuringIndex = fileName.lastIndexOf('.') + 1;
    return fileName.slice(lastOccuringIndex);
  };

  useEffect(() => {
    if (privateAttachmentUploadStatus) {
      setPrivateMessages((privateMessages) =>
        privateMessages.map((msg, index) => {
          const lastMessageIndex = privateMessages.length - 1;
          if (
            (index === lastMessageIndex && msg.type === 'image') ||
            (index === lastMessageIndex && msg.type === 'docs')
          ) {
            msg.uploadStaus = privateAttachmentUploadStatus;
          }
          return msg;
        })
      );
    }
  }, [privateAttachmentUploadStatus]);

  useEffect(() => {
    if (lastPrivateAttachmentFileName) {
      setPrivateMessages((privateMessages) =>
        privateMessages.map((msg, index) => {
          const lastMessageIndex = privateMessages.length - 1;
          if (
            (index === lastMessageIndex && msg.type === 'image') ||
            (index === lastMessageIndex && msg.type === 'docs')
          ) {
            msg.uploadStaus = privateAttachmentUploadStatus;
            msg.fileName = lastPrivateAttachmentFileName;
          }
          return msg;
        })
      );
    }
  }, [lastPrivateAttachmentFileName]);

  const uploadImagePrivate = async ({ target: { files } }) => {
    const file = files[0];
    const restrictedFileTypes = ['exe'];

    if (file) {
      const attachmentFileType = getFileExtension(file.name);
      const shouldNotUploadThisFile = restrictedFileTypes.indexOf(attachmentFileType) !== -1;
      if (!shouldNotUploadThisFile) {
        const fileType = file.type.split('/')[0];
        let data = new FormData();
        data.append('file', file);
        data.append('meetingId', meetingId);
        data.append('owners', getOwner([userDetail.id, selectedPrivateChat.id]));

        const toBase64 = (file) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
          });

        const base64Image = await toBase64(file);

        let privateMessage;
        if (fileType === 'image') {
          privateMessage = {
            type: 'image',
            isSender: true,
            formattedDate: 'a few seconds ago',
            uploadPercentage: 0,
            src: base64Image,
            threadId: selectedPrivateChat.threadId,
          };
        } else {
          privateMessage = {
            type: 'docs',
            isSender: true,
            formattedDate: 'a few seconds ago',
            uploadPercentage: 0,
            fileName: `${meetingId}_${file.name}`,
            threadId: selectedPrivateChat.threadId,
          };
        }

        setPrivateMessages(() => [...privateMessages, privateMessage]);

        stableDispatch(uploadPrivateChatImages(data)).then((res) => {
          const { emailId, id } = userDetail;
          const { _id, name } = res.data;
          const messageBody = {
            emailId,
            senderId: id,
            message: msg,
            owners: getOwner([id, selectedPrivateChat.id]),
            receiverId: selectedPrivateChat.id,
            type: fileType === 'image' ? 'image' : 'docs',
            mimeType: file.type,
            attachmentId: _id,
            fileName: name,
          };
          setlastPrivateAttachmentFileName(messageBody.fileName);
          chatSocket.emit('sendPrivateMessage', messageBody, () => setPrivateMessageAndTypingState(''));
        });
      } else {
        toast(`Unable to upload this type of file.`);
      }
    }
  };

  // const toBase64 = (file) =>
  //   new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.readAsDataURL(file);
  //     reader.onload = () => resolve(reader.result);
  //     reader.onerror = (error) => reject(error);
  //   });

  if (!showChatWindow) {
    return null;
  }

  return (
    <React.Fragment>
      <div id='chatbox'>
        <div id='friendslist'>
          <div id='topmenu'>
            <a
              id='home-tab'
              className={classNames({
                'tab-head': true,
                active: activeTab === 'groupChatTab',
              })}
              data-toggle='tab'
              role='tab'
              aria-controls='group-chat-screen'
              aria-selected='true'
              onClick={() => setActiveTab('groupChatTab')}
            >
              <i className='fa fa-comment'></i>
            </a>

            <a
              id='home-tab'
              className={classNames({
                'tab-head': true,
                active: activeTab === 'participantTab',
              })}
              data-toggle='tab'
              role='tab'
              aria-controls='contacts-screen1'
              aria-selected='true'
              onClick={() => setActiveTab('participantTab')}
            >
              <i className='fa fa-users'></i>
            </a>

            <a
              id='home-tab'
              className={classNames({
                'tab-head': true,
                active: activeTab === 'settingTab',
              })}
              data-toggle='tab'
              role='tab'
              aria-controls='setting-tab'
              aria-selected='true'
              onClick={() => setActiveTab('settingTab')}
            >
              <i className='fa fa-cog'></i>
            </a>
          </div>
          <div
            className={classNames({
              'contacts-screen tab-pane fade show ': true,
              active: activeTab === 'participantTab',
            })}
            id='contacts-screen1'
            role='tabpanel'
            aria-labelledby='home-tab'
          >
            <div id='friends'>
              <div id='search'>
                <input
                  type='text'
                  id='searchfield'
                  onChange={(e) => searchContacts(e.target.value)}
                  placeholder='Search contacts...'
                />
              </div>

              {participants.map((participant, index) => (
                <div key={index} className='friend' onClick={() => onPrivateChatOpen(participant)}>
                  <img alt='user' src={userAvatar} />
                  <p>
                    <strong> {participant.fullname} </strong>
                    <span> {participant.emailId} </span>
                  </p>
                  {participant.unreadMessageCount > 0 && (
                    <span className='badge badge-danger privateMessageUnreadBadge'>
                      {participant.unreadMessageCount}
                    </span>
                  )}
                  <div
                    className={classNames({
                      status: true,
                      available: participant.isOnline,
                      inactive: !participant.isOnline,
                    })}
                  ></div>
                </div>
              ))}
            </div>
          </div>
          <div
            className={classNames({
              'group-chat-screen tab-pane fade show ': true,
              active: activeTab === 'groupChatTab',
            })}
            id='group-chat-screen'
            role='tabpanel'
            aria-labelledby='home-tab'
          >
            <ScrollToBottom className='groupChatTabScrollToBottom'>
              <Messages chatMessages={messages} meetingId={meetingId} />

              <TypingState typingUsers={typingUsers} />
            </ScrollToBottom>

            <div id='sendmessage'>
              <input
                type='text'
                onChange={(e) => setMessageAndTypingState(e.target.value)}
                value={msg}
                onKeyPress={(event) => (event.key === 'Enter' ? sendMessages(event) : null)}
                placeholder='Send message...'
              />

              <input
                onChange={uploadAttachment}
                id='groupImageUpload'
                type='file'
                style={{ display: 'none' }}
              />

              <button
                className='attachmentBtn'
                onClick={() => document.getElementById('groupImageUpload').click()}
              >
                <i className='fa fa-paperclip'></i>
              </button>
              <button onClick={(e) => sendMessages(e)}>
                <i className='fa fa-paper-plane'></i>
              </button>
            </div>
          </div>
          <div
            className={classNames({
              'setting-tab tab-pane fade show ': true,
              active: activeTab === 'settingTab',
            })}
            id='setting-tab'
            role='tabpanel'
            aria-labelledby='home-tab'
          >
            <div className='detail-area'>
              <div className='detail-area-header'>
                <div className='msg-profile group'>
                  <svg
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                    strokeWidth='2'
                    fill='none'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    className='css-i6dzq1'
                  >
                    <path d='M12 2l10 6.5v7L12 22 2 15.5v-7L12 2zM12 22v-6.5'></path>
                    <path d='M22 8.5l-10 7-10-7'></path>
                    <path d='M2 15.5l10-7 10 7M12 2v6.5'></path>
                  </svg>
                </div>
                <div className='detail-title'>Techbit Group</div>
                <div className='detail-subtitle'>Created by Techbit, 22 June 2020</div>
                <div className='detail-buttons'>
                  <button className='detail-button'>
                    <svg
                      viewBox='0 0 24 24'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='currentColor'
                      stroke='currentColor'
                      strokeWidth='0'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      className='feather feather-phone'
                    >
                      <path d='M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z'></path>
                    </svg>
                    Call Group
                  </button>
                  <button className='detail-button'>
                    <svg
                      viewBox='0 0 24 24'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='currentColor'
                      stroke='currentColor'
                      strokeWidth='0'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      className='feather feather-video'
                    >
                      <path d='M23 7l-7 5 7 5V7z'></path>
                      <rect x='1' y='5' width='15' height='14' rx='2' ry='2'></rect>
                    </svg>
                    Video Chat
                  </button>
                </div>
              </div>
              <div className='detail-changes'>
                <input type='text' onChange={(e) => console.log('dd')} placeholder='Search in Conversation' />
                <div className='detail-change'>
                  Change Color
                  <div className='colors'>
                    <div className='color blue selected' data-color='blue'></div>
                    <div className='color purple' data-color='purple'></div>
                    <div className='color green' data-color='green'></div>
                    <div className='color orange' data-color='orange'></div>
                  </div>
                </div>
                <div className='detail-change'>
                  Change Emoji
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    className='feather feather-thumbs-up'
                  >
                    <path d='M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3'></path>
                  </svg>
                </div>
              </div>
              <div className='detail-photos'>
                <div className='detail-photo-title'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    className='feather feather-image'
                  >
                    <rect x='3' y='3' width='18' height='18' rx='2' ry='2'></rect>
                    <circle cx='8.5' cy='8.5' r='1.5'></circle>
                    <path d='M21 15l-5-5L5 21'></path>
                  </svg>
                  Shared photos
                </div>
                <div className='detail-photo-grid'>
                  <img
                    alt=''
                    src='https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=crop&amp;w=2168&amp;q=80'
                  />
                  <img
                    alt=''
                    src='https://images.unsplash.com/photo-1516085216930-c93a002a8b01?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=crop&amp;w=2250&amp;q=80'
                  />
                  <img
                    alt=''
                    src='https://images.unsplash.com/photo-1458819714733-e5ab3d536722?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=crop&amp;w=933&amp;q=80'
                  />
                  <img
                    alt=''
                    src='https://images.unsplash.com/photo-1520013817300-1f4c1cb245ef?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=crop&amp;w=2287&amp;q=80'
                  />
                  <img
                    alt=''
                    src='https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=crop&amp;w=2247&amp;q=80'
                  />
                  <img
                    alt=''
                    src='https://images.unsplash.com/photo-1559181567-c3190ca9959b?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=crop&amp;w=1300&amp;q=80'
                  />
                  <img
                    alt=''
                    src='https://images.unsplash.com/photo-1560393464-5c69a73c5770?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=crop&amp;w=1301&amp;q=80'
                  />
                  <img
                    alt=''
                    src='https://images.unsplash.com/photo-1506619216599-9d16d0903dfd?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=crop&amp;w=2249&amp;q=80'
                  />
                  <img
                    alt=''
                    src='https://images.unsplash.com/photo-1481349518771-20055b2a7b24?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=crop&amp;w=2309&amp;q=80'
                  />
                  <img
                    alt=''
                    src='https://images.unsplash.com/photo-1473170611423-22489201d919?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=crop&amp;w=2251&amp;q=80'
                  />
                  <img
                    alt=''
                    src='https://images.unsplash.com/photo-1579613832111-ac7dfcc7723f?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=crop&amp;w=2250&amp;q=80'
                  />
                  <img
                    alt=''
                    src='https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=crop&amp;w=2189&amp;q=80'
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div id='chatview' className='p1'>
          <div id='profile'>
            <div id='close' onClick={() => onPrivateChatClose()}>
              <div className='cy'></div>
              <div className='cx'></div>
            </div>

            <p>User name placeholder</p>
            <span>user email placeholder</span>
          </div>

          <ScrollToBottom className='privateChatTabScrollToBottom'>
            <Messages
              chatMessages={privateMessages}
              meetingId={meetingId}
              selectedPrivateChat={selectedPrivateChat}
            />

            <TypingState typingUsers={privateTypingUsers} selectedPrivateChat={selectedPrivateChat} />
          </ScrollToBottom>

          <div id='sendmessage'>
            <input
              type='text'
              onChange={(e) => setPrivateMessageAndTypingState(e.target.value)}
              value={privateMsg}
              onKeyPress={(event) => (event.key === 'Enter' ? sendPrivateMessage(event) : null)}
              placeholder='Send message...'
            />
            <input
              onChange={uploadImagePrivate}
              id='privateImageUpload'
              type='file'
              style={{ display: 'none' }}
            />
            <button
              className='attachmentBtn'
              onClick={() => document.getElementById('privateImageUpload').click()}
            >
              <i className='fa fa-paperclip'></i>
            </button>
            <button onClick={(e) => sendPrivateMessage(e)}>
              <i className='fa fa-paper-plane'></i>
            </button>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default GroupChat;

const Messages = ({ chatMessages, selectedPrivateChat, meetingId, threadId }) => {
  const [messages, setMessages] = useState(chatMessages);
  useEffect(() => {
    const selectChatMessages = selectedPrivateChat
      ? chatMessages.filter((x) => x.threadId === selectedPrivateChat.threadId)
      : chatMessages;

    setMessages(selectChatMessages);
  }, [chatMessages, selectedPrivateChat]);

  const images = chatMessages
    .filter((x) => x.type === 'image')
    .map((x, i) => {
      return { src: x.src };
    });
  return (
    <React.Fragment>
      <div id='chat-messages' className='chat-messages' style={{ opacity: 1 }}>
        {/* <label>Thursday 02</label> */}
        <label></label>

        {messages &&
          messages.length > 0 &&
          messages.map((msg, index) => (
            <React.Fragment key={index}>
              {msg.type === 'image' ? (
                <ImageMessage msg={msg} images={images} />
              ) : msg.type === 'docs' ? (
                <DocumentMessage msg={msg} meetingId={meetingId} />
              ) : (
                <TextMessage msg={msg} />
              )}
            </React.Fragment>
          ))}
      </div>
    </React.Fragment>
  );
};

const TypingState = ({ typingUsers, selectedPrivateChat }) => {
  const [typingState, setTypingState] = useState('');

  useEffect(() => {
    let typingMessage = null;

    if (selectedPrivateChat) {
      const currentUser = typingUsers.find(
        (typingUser) => typingUser.typingUserEmailId === selectedPrivateChat.emailId
      );

      typingMessage = currentUser ? currentUser.message : '';
    } else {
      let [first, second] = typingUsers;
      if (typingUsers.length === 1) {
        typingMessage = `${first.username} is typing`;
      }
      if (typingUsers.length === 2) {
        typingMessage = `${first.username} and ${second.username} is typing`;
      }

      if (typingUsers.length > 2) {
        const otherTypingUsersCount = typingUsers.length - 2;
        typingMessage = `${first.username}, ${second.username} and ${otherTypingUsersCount} other is typing`;
      }
    }

    setTypingState(typingMessage);
  }, [typingUsers, selectedPrivateChat]);

  if (!typingState) {
    return null;
  }

  return (
    <>
      <label className='typing-label'>
        <div>
          <span> {typingState} </span>
          <div className='loader' id='loader-4'>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </label>
    </>
  );
};
