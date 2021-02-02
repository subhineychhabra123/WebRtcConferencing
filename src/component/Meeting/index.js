import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Table } from "reactstrap";
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import toast from '../common/toast';
import {
  addNewMeeting, getAllMeeting, getMeetingInfoByMeetingId, updateMeetingStatus, addUserInMeeting,
  isUserExistInAnyMeeting, updateRecordingStatus, changePrivateChat
} from '../../service/service';
import { validateToken, getfromLocalStorage } from '../../utils/common';
import AddNewMeetingModal from './../Modal/AddNewMeeting';
import './meeting.css';

function Meeting(props) {
  const { history, userDetail, allMeeting, AddNewMeeting, GetAllMeeting,
    GetMeetingById, UpdateMeetingStatus, AddUserInMeeting, IsUserExistInAnyMeeting,
    alreadyInMeeting, UpdateRecordingStatus, ChangePrivateChat, UserExistInMeeting,
    AddUserExistInMeeting } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [isError, setError] = useState({ title: '', description: '' });
  const [isTitle, setTitle] = useState('');
  const [isDescription, setDescription] = useState('');
  const [isSetting, setSetting] = useState('');

  useEffect(() => {
    const token = getfromLocalStorage('token');
    const isValid = validateToken(token, history)
    GetAllMeeting(userDetail.id);
    if (!alreadyInMeeting) {
      IsUserExistInAnyMeeting(userDetail.id);
    }
    if (!isValid) {
      history.push('/');
    }
  }, []);

  useEffect(() => {
    const meetingId = history.location
      && history.location.state
      && history.location.state.meetingId
    const status = history.location.state
      && history.location.state.status;
    if (meetingId !== null && meetingId !== undefined && status === null) {
      GetMeetingById(meetingId, userDetail.fullname, history);
    }
  }, [])

  useEffect(() => {
    if (alreadyInMeeting) {
      IsUserExistInAnyMeeting(userDetail.id);
      window.location.reload(true);
    }
  }, [])

  const submitAddNewMeeting = (e) => {
    e.preventDefault();
    setIsOpen(true);
  }

  const validate = () => {
    if (!isTitle || isTitle.trim() === '' || !isDescription || isDescription.trim() === '') {
      if (!isTitle || isTitle.trim() === '') setError(prev => ({ ...prev, title: `title can't be empty` }));
      if (!isDescription || isDescription.trim() === '') setError(prev => ({ ...prev, description: `description can't be empty` }));
      return false;
    }
    if (isTitle.length > 250) {
      setError(prev => ({ ...prev, title: `title length can't be greater than 250 character` }));
      return false;
    }
    setError(prev => ({ ...prev, title: '', description: '' }));
    return true;
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validate()) {
      AddNewMeeting(isTitle, isDescription, userDetail.id)
        .then((response) => {
          if (response && response.data.data) {
            setIsOpen(false);
            setDescription('');
            setTitle('');
            toast(`successfully added ${isTitle} meeting`, 'success');
            GetAllMeeting(userDetail.id);
          } else {
            toast(response.data.msg, response.data.status);
          }
        })
        .catch((err) => {
          toast(err, 'error');
        })
    }
  }

  const onHandleChange = (field, value) => {
    if (field === 'title') setTitle(value);
    if (field === 'description') setDescription(value);
  }

  const handleMeetingResponse = (e, item) => {
    e.preventDefault();
    AddUserInMeeting(userDetail.id).then((res) => {
      if (item.hostId === userDetail.id) {
        UpdateMeetingStatus(item.meetingId, 2)
          .then((res) => {
            if (res.data && res.data.data) {
              AddUserExistInMeeting()
              GetAllMeeting(userDetail.id);
            }
          })
      } else {
        UpdateMeetingStatus(item.meetingId, 1)
          .then((res) => {
            if (res.data && res.data.data) {
              AddUserExistInMeeting()
              GetAllMeeting(userDetail.id);
            }
          })
      }
    })
    const params = { meetingInfo: item, userDetail: userDetail }
    history.push(`/meeting/${item.title.replace(/ +/g, "_")}`, params);
  }

  const changeRecordingStatus = (e, item) => {
    e.preventDefault();
    UpdateRecordingStatus(item.meetingId)
      .then((res) => {
        if (res.data && res.data.data) {
          GetAllMeeting(userDetail.id);
          toast(res.data.msg, res.data.status);
        }
      }).catch((err) => {
        if (err.data) {
          toast(err.data.msg, err.data.status)
        }
      })
  }

  const togglePrivateChat = (e, item) => {
    e.preventDefault();
    ChangePrivateChat(item.meetingId)
      .then((res) => {
        if (res.data && res.data.data) {
          GetAllMeeting(userDetail.id);
          toast(res.data.msg, res.data.status);
        }
      }).catch((err) => {
        if (err.data) {
          toast(err.data.msg, err.data.status)
        }
      })
  }

  const openSetting = (index) => {
    if (isSetting === '')
      setSetting(index);
    else if (index === isSetting)
      setSetting('')
    else
      setSetting(index)
  }

  return (
    <div className="content">
      <div className="container-fluid">
        <h1 className="h3 mb-2 text-gray-800">Meetings</h1>
        <div className="card shadow mb-4">
          <div className="card-header py-3" style={{ justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-primary" onClick={(e) => submitAddNewMeeting(e)}>Add New</button>
          </div>
          <div className="card-body">
            <Table>
              <tbody>
                <tr>
                  <td>Meeting Name</td>
                  <td>Status</td>
                  <td>Join</td>
                  <td>Settings</td>
                </tr>
                {allMeeting && allMeeting.length > 0 ?
                  allMeeting.map((item, index) => {
                    const isOpen = isSetting === index;
                    return (

                      <tr id={index} key={index}>
                        <td>{item.title}</td>
                        <td>{item.status === 1 ? 'Waiting for the host' : item.status === 2 ? 'Started - Host available' : 'stopped'}</td>
                        <td><button onClick={(e) => handleMeetingResponse(e, item)}
                          disabled={alreadyInMeeting}
                          className="btn btn-primary">Join</button></td>
                        <td>
                          <Dropdown isOpen={isOpen} toggle={() => openSetting(index)}>
                            <DropdownToggle
                              tag="span"
                              data-toggle="dropdown"
                              aria-expanded={isOpen}
                            >
                              {userDetail.id === item.hostId ?
                                <i className="fas fa-cogs fa-sm fa-fw mr-2 text-black"
                                  style={{ cursor: 'pointer' }}></i> : "Don't have Permission"}
                            </DropdownToggle>
                            <DropdownMenu style={{ minWidth: '12rem' }}>
                              {userDetail.id === item.hostId &&
                                <div className="w-100">
                                  <div className="drop-down-list w-95 m-sm-2">
                                    <div className="w-70">Allow Recording</div>
                                    <label className="switch w-23">
                                      <input type="checkbox" checked={item.canRecord} value='' onClick={(e) => changeRecordingStatus(e, item)} />
                                      <span className="slider round"></span>
                                    </label>
                                  </div>
                                  <div className="drop-down-list w-95 m-sm-2">
                                    <div className="w-70">Allow Private Chat</div>
                                    <label className="switch w-23">
                                      <input type="checkbox" checked={item.allowPrivateChat} value='' onClick={(e) => togglePrivateChat(e, item)} />
                                      <span className="slider round"></span>
                                    </label>
                                  </div>
                                </div>
                              }
                            </DropdownMenu>
                          </Dropdown>
                        </td>
                      </tr>
                    )
                  }) : <tr>
                    <td></td>
                    <td>No Meetings Found</td>
                    <td></td>
                  </tr>
                }
              </tbody>
            </Table>
          </div>
        </div>
      </div>

      <div>
        <ToastContainer />
        {isOpen &&
          <AddNewMeetingModal
            isOpen={isOpen}
            closeModal={() => setIsOpen(false)}
            handleSubmit={handleSubmit}
            onHandleChange={onHandleChange}
            isTitle={isTitle}
            isDescription={isDescription}
            isError={isError}
          />}
      </div>
    </div>
  );
}
const mapStateToProps = state => {
  const userDetail = state.userDetail.get('userDetail');
  const jwtToken = state.userDetail.get('jwtToken');
  const allMeeting = state.meeting.get('getAllMeeting');
  const meetingStatus = state.meeting.get('meetingStatus');
  const alreadyInMeeting = state.meeting.get('alreadyInMeeting');
  return {
    userDetail, jwtToken, allMeeting, meetingStatus, alreadyInMeeting
  }
};

const mapDispatchToProps = dispatch => ({
  AddNewMeeting: (title, description, hostId) => dispatch(addNewMeeting(title, description, hostId)),
  GetAllMeeting: (hostId) => { dispatch(getAllMeeting(hostId)) },
  GetMeetingById: (meetingId, username, history) => { dispatch(getMeetingInfoByMeetingId(meetingId, username, history)) },
  UpdateMeetingStatus: (meetingId, status) => dispatch(updateMeetingStatus(meetingId, status)),
  AddUserInMeeting: (userId) => dispatch(addUserInMeeting(userId)),
  IsUserExistInAnyMeeting: (userId) => dispatch(isUserExistInAnyMeeting(userId)),
  UpdateRecordingStatus: (meetingId) => dispatch(updateRecordingStatus(meetingId)),
  ChangePrivateChat: (meetingId) => dispatch(changePrivateChat(meetingId)),
  UserExistInMeeting: () => dispatch({ type: "IS_USER_EXIST_IN_MEETING", payload: false }),
  AddUserExistInMeeting: () => dispatch({ type: "IS_USER_EXIST_IN_MEETING", payload: true }),
});
export default connect(mapStateToProps, mapDispatchToProps)(Meeting)