import React, { Component, useState } from 'react';
import { connect } from 'react-redux';
import io from 'socket.io-client';
import moment from 'moment';
import { ToastContainer } from 'react-toastify';
import toast from '../common/toast';
import {
  getAllUsers, getAllMeeting, inviteParticipant, addContactAsParticiant, deleteParticipant,
    getAllMeetingPaticipants, getAllContacts, getHost, deleteUserFromMeeting, saveStream, getHostDetails,
    updateMeetingStatus
} from '../../service/service';
import {  getGroupMessageByMeeting, setMessageReceivers } from '../../service/chatService';
import AddParticipant from '../Modal/AddParticipant';
import DownloadVideoPopUp from '../Modal/DownloadVideo';
import Video from './video'
import Videos from './videos'
import './video-chat.css';
import setting from '../../setting/index';
import DemoNavbar from '../Navbars/DemoNavbar.jsx';
import { GroupChat } from '../Chat';

const ENDPOINT = setting.load().apiUrl

const appLogo = require("../../assets/img/appLogo.png").default

class VideoChat extends Component {
  constructor(props) {
    super(props)

    this.state = {
      showChatWindow: false,
      unreadMessageCount: "",
      localStream: null,

      remoteStreams: [],
      peerConnections: {},
      selectedVideo: null,
      participantIsOpen: false,
      filterObj: {
        fullname: '',
        emailId: '',
        id: ''
      },
      meetingId: '',

      pc_config: {
        "iceServers": [
          {
            urls: 'stun:unisynq.thinqlabs.net:3478'
          }
        ]
      },
      //  urls: 'stun:stun.unisynq.thinqlabs.net:5349'
      // urls: 'stun:stun.l.google.com:19302'
      sdpConstraints: {
        'mandatory': {
          'OfferToReceiveAudio': true,
          'OfferToReceiveVideo': true
        }
      },
      screenSharing: false,
      mute: false,
      stopVideo: false,
      startRecording: true,
      pauseRecording: false,
      resumeRecording: false,
      joinedPeers: [],
      participant: [],
      isHost: (this.props.location.state.meetingInfo && this.props.userDetail && this.props.userDetail.id) ? this.props.location.state.meetingInfo.hostId === this.props.userDetail.id : false,
      recordedChunks: [],
      openVideoDownload: false,
      videoName: '',
      disableRecorder: true,
      displayVideo: 'screen',
    }
    this.serviceIP = ENDPOINT;
    this.socket = null;
    this.pc = null;
    this.mediaRecorder = null;
  }

  componentWillUnmount() {
    const { userDetail, GetAllMeeting, UpdateMeetingParticipants } = this.props;
    UpdateMeetingParticipants();
    GetAllMeeting(userDetail.id);
    this.cancelCall();
  }

  recordedVideo = async () => {
    const { location } = this.props;
    const {recordedChunks, pauseRecording, resumeRecording} = this.state;
    const videoName = `${location.state.meetingInfo.title + '_' + moment().format('DD-MMM-YYYY_hh:mm:ss')}.webm`;
    if (recordedChunks && recordedChunks.length > 0) {
      // await this.props.SaveStream(userDetail.id, recordedChunks, videoName)
      //   .then((res) => {
      //     if (res.data && res.data.data) {
      //       this.mediaRecorder = null;
      //       this.setState({ recordedChunks: [] })
      //     }
      //   })
      //   .catch((err) => {

      //   })
      this.setState({ openVideoDownload: true, videoName })
    } else {
      if(this.mediaRecorder) {
        this.mediaRecorder = null;
       }
      this.props.history.push('/admin/meeting');
    }
  }
  
  recordVideo = (e) => {
    e.preventDefault();
    this.setState({ startRecording: false, pauseRecording: true })
    this.mediaRecorder.start(1000);
    this.mediaRecorder.ondataavailable = this.handleDataAvailable;
  }

   handleDataAvailable = (event) => {
    if (event.data.size > 0) {
      this.setState({recordedChunks: [...this.state.recordedChunks, event.data ]})
    }
  }

  getLocalStream = () => {
    const constraints = {
      audio: {echoCancellation: true},
      video: true,
    }
    this.getCameraPermission(constraints, 'video')
  }

  getCameraPermission = (constraints, display, startRecord) => {
    const success = (stream) => {
      if(display === this.state.displayVideo) {
         stream.addTrack(this.state.localStream.getAudioTracks()[0], stream)
      }
      window.localStream = stream
      this.setState({
        localStream: stream,
      })
      if (this.state.isHost) {
        this.mediaRecorder = new MediaRecorder(stream);
        if (startRecord === 'startRecording' || display === this.state.displayVideo) {
          this.mediaRecorder.start(1000);
          this.mediaRecorder.ondataavailable = this.handleDataAvailable;
        }
        if (this.mediaRecorder !== null) {
          this.setState({ disableRecorder: false })
        }
      }

      const screenSharingTrack = stream.getVideoTracks()[0];
      screenSharingTrack.onended = async (e) => {
        e.preventDefault()
        const { pauseRecording, resumeRecording, isHost } = this.state;
        const constraints = {
          audio: {echoCancellation: true},
          video: true,
          options: {
            mirror: true,
          }
        }
        if (this.state.localStream) {
          this.state.localStream.getTracks().forEach((track) => {
            if (track.readyState == 'live') {
              track.stop();
            }
          });
        }
        
       if (isHost && (pauseRecording || resumeRecording)) {
        this.mediaRecorder.stop();
       }
        this.setState({ localStream: null, screenSharing: false });
        window.localStream = null;
        this.getCameraPermission(constraints, 'video', 'startRecording')
      }
      this.whoisOnline()
    }
    const failure = (err) => {
      console.log('getUserMedia Error: ', err)
      if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        toast('Check headphone is plugin system', 'error');
      } else if (err.name === "NotReadableError" || err.name === "TrackStartError") {
        toast('webcam or mic are already in use', 'error');
      } else if (err.name === "OverconstrainedError" || err.name === "ConstraintNotSatisfiedError") {
        toast('audio and video can not be satisfied by devices ', 'error');
      } else if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        if (this.state.screenSharing) {
          navigator.mediaDevices.getUserMedia(constraints)
            .then(success)
            .catch(failure)
          this.setState({ screenSharing: !this.state.screenSharing })
        }
      }
    }

    if (display !== null && display !== undefined && display === 'screen') {
       if (this.state.localStream) {
        this.state.localStream.getVideoTracks().forEach((track) => {
          track.stop();
        });
      }
      navigator.mediaDevices.getDisplayMedia(constraints)
        .then(success)
        .catch(failure)
    } else {
      navigator.mediaDevices.getUserMedia(constraints)
        .then(success)
        .catch(failure)
    }
  }

  whoisOnline = () => {
    this.sendToPeer('onlinePeers', null, { local: this.socket.id })
  }

  cancelCall = async () => {
    const { location, userDetail, DeleteUserFromMeeting } = this.props;
    const { joinedPeers, isHost, localStream } = this.state;
    let status;
    if (joinedPeers.length === 1) {
      status = 0;
    } else if (joinedPeers.length > 1 && isHost) {
      status = 1;
    }
    await DeleteUserFromMeeting(userDetail.id)
      .then((res) => {
        if (res.data && res.data.msg !== null) {
          this.props.UpdateMeetingStatus(location.state.meetingInfo.meetingId, status)
          .then((res) => { })
        }
      })
      if (localStream) {
        localStream.getTracks().forEach((track) => {
          if (track.readyState == 'live') {
            track.stop();
          }
        });
      }
      this.setState({ localStream: null })
      window.localStream = null;
      if (this.pc !== null) {
        this.pc.close();
        this.pc = null;
      }
      if (this.socket !== null) {
       this.sendToPeer('cancel-call', null, { local: this.socket.id });
       this.socket.close();
       this.socket = null;
      }
    this.recordedVideo()
  }

  sendToPeer = (messageType, payload, socketID) => {
    this.socket.emit(messageType, {
      socketID,
      payload
    })
  }

  createPeerConnection = (socketID, callback) => {

    try {
      this.pc = new RTCPeerConnection(this.state.pc_config)
      const peerConnections = { ...this.state.peerConnections, [socketID]: this.pc }
      this.setState({
        peerConnections
      })

      this.pc.onicecandidate = (e) => {
        if (e.candidate) {
          this.sendToPeer('candidate', e.candidate, {
            local: this.socket.id,
            remote: socketID,
          })
        }
      }

      this.pc.oniceconnectionstatechange = (e) => {
        if (this.pc.connectionState == 'failed') {
          this.createPeerConnection(socketID, pc => {
           if (pc)
             pc.createOffer({...this.state.sdpConstraints, iceRestart: true})
               .then(sdp => {
                 pc.setLocalDescription(sdp)
                 this.sendToPeer('offer', sdp, {
                   local: this.socket.id,
                   remote: socketID,
                  })
                })
          })
        }
      }

      this.pc.ontrack = (e) => {
        const { joinedPeers, isHost } = this.state;
        const { getHostDetails } = this.props;
        const remoteVideo = {
          id: socketID,
          name: socketID,
          stream: e.streams[0],
        }
        if (!isHost && joinedPeers && joinedPeers.length > 0) {
          joinedPeers.forEach((peer) => {
            if (peer.emailId === getHostDetails.emailId) {
               if(remoteVideo.stream && remoteVideo.stream !== null) {
                this.mediaRecorder = new MediaRecorder(remoteVideo.stream);
               }
              if (this.mediaRecorder !== null) {
                this.setState({ disableRecorder: false })
              }
            }
          })
        }
        this.setState(prevState => {
          let remoteStreams = prevState.remoteStreams && prevState.remoteStreams.filter(streamItem => streamItem.id !== remoteVideo.id)
          remoteStreams = [...remoteStreams, remoteVideo]
          return {
            remoteStreams: remoteStreams
          }
        })
      }

      this.pc.close = () => { }

      if (this.state.localStream){
        this.state.localStream.getTracks().forEach(track => {
          this.pc.addTrack(track, this.state.localStream)
        })
      }
    
      callback(this.pc)

    } catch (e) {
      console.log('Something went wrong! pc not created!!', e)
     
      callback(null)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.meetingParticipants !== nextProps.meetingParticipants) {
      this.setState({ participant: nextProps.meetingParticipants })
    }
  }

  componentDidMount = () => {
    const { location, userDetail, match } = this.props;
    const { meetingInfo } = location.state;
    window.addEventListener('beforeunload', (e) => {
      e.preventDefault();
      this.cancelCall();
      e.returnValue = '';
    });

    this.props.GetAllUsers();
    const meeting = this.state.meetingId != "" ? this.state.meetingId : this.props.location.state.meetingInfo.meetingId;
    this.setState({ meetingId: meeting })
    this.props.GetAllMeetingParticipant(meeting);
    this.props.GetAllContacts(this.props.userDetail.id);
    if (this.props.location.state.meetingInfo.hostId !== this.props.userDetail.id) {
      this.props.GetHost(this.props.location.state.meetingInfo.hostId);
    }

    this.props.GetHostDetails(meetingInfo.hostId);

    this.props.GetGroupMessageByMeeting(meeting).then((response) => {
      const meetingGroupMessageInfo = response.data;
      if (meetingGroupMessageInfo) {
        const userUnreadMessages = meetingGroupMessageInfo.messages.filter(
          (x) => x.Receivers.findIndex((x) => x === userDetail.id) < 0
        );

        this.setState({ unreadMessageCount : userUnreadMessages.length });
      }
    });
   
    
    const room = match.params.meetingId;
    const { fullname, id } = location.state.userDetail;
    
    this.socket = io(this.serviceIP, {
      query: {
        room: room,
        username:fullname,
        meetingId: meeting,
        hostId: meetingInfo.hostId,
        emailId: userDetail.emailId,
        userId: id
      },
    });

    this.socket.emit("join", { username: fullname, room, id }, (error) => {
      if (error) {
        console.error(error);
      }
    });

  
    this.socket.on('connection-success', data => {
      this.getLocalStream()
      this.setState({
        joinedPeers: data.joinedPeers,
        host: location.state.meetingInfo.hostId === userDetail.id
      })
    })

    this.socket.on('joined-peers', data => {
      this.setState({
        joinedPeers: data.joinedPeers
      })
    })

    this.socket.on('peer-disconnected', data => {
      const remoteStreams = this.state.remoteStreams.filter(stream => stream.id !== data.socketID)
      const remainingPeers = this.state.joinedPeers.filter(x=>x.socketID!==data.socketID);
      this.setState({joinedPeers:remainingPeers});

      this.setState(prevState => {
        return {
          remoteStreams,
        }
      })
    })

    this.socket.on('cancel-call', data => {
      const remoteStreams = this.state.remoteStreams.filter(stream => stream.id !== data.socketID)
      const remainingPeers = this.state.joinedPeers.filter(x=>x.socketID!==data.socketID);
      this.setState({joinedPeers: remainingPeers});
      
      this.setState(prevState => {
        return {
          remoteStreams,
        }
      })
    })

    this.socket.on('online-peer', (socketID) => {
      this.createPeerConnection(socketID, pc => {
        if (pc)
          pc.createOffer(this.state.sdpConstraints)
            .then(sdp => {
              pc.setLocalDescription(sdp)
              this.sendToPeer('offer', sdp, {
                local: this.socket.id,
                remote: socketID,
              })
            })
      })
    })

    this.socket.on('offer', data => {
      this.createPeerConnection(data.socketID, pc => {
        pc.addStream(this.state.localStream)
        pc.setRemoteDescription(new RTCSessionDescription(data.sdp)).then(() => {
          pc.createAnswer(this.state.sdpConstraints)
            .then(sdp => {
              pc.setLocalDescription(sdp)
              this.sendToPeer('answer', sdp, {
                local: this.socket.id,
                remote: data.socketID,
              })
            }).catch((err) => {
              console.log('error in offer create Answer', err);
            })
        })
      })
    })

    this.socket.on('answer', data => {
      const pc = this.state.peerConnections[data.socketID]
      pc.setRemoteDescription(new RTCSessionDescription(data.sdp)).then(()=>{})
    })

    this.socket.on('candidate', (data) => {
      const pc = this.state.peerConnections[data.socketID]
      if (pc && (pc !== null || pc !== undefined))
        pc.addIceCandidate(new RTCIceCandidate(data.candidate))
    })
  }

  zoomVideo = (e, _video, username) => {
    e.preventDefault();
    if (this.state.selectedVideo === null && _video !== null) {
      _video.username = username;
      this.setState({
        selectedVideo: _video
      })
    } else {
      this.setState({
        selectedVideo: null
      })
    }
  }

  stopVideo = () => {
    if (this.state.localStream) {
      this.state.localStream.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
        this.setState({ stopVideo: !this.state.stopVideo })
      });
    }
  }

  toggleChatWindow = () => {
    const { showChatWindow, meetingId, unreadMessageCount } = this.state;
    const isOpening = !showChatWindow;
    if (isOpening && unreadMessageCount > 0) {
      const { userDetail } = this.props;
      this.props.SetMessageReceivers(meetingId, userDetail.id).then((response) => {
        if (response.data) {
          this.setState({ unreadMessageCount: 0 });
        }
      });
    }
    this.setState({ showChatWindow: isOpening });
  };

  setChatUnreadMessageCount(newUnreadMessage) {
    const { unreadMessageCount, showChatWindow } = this.state;
    if (!showChatWindow) {
      const totalUnread = unreadMessageCount + newUnreadMessage;
      this.setState({ unreadMessageCount: totalUnread });
    }
  }

  closeModal = () => {
    this.setState({ participantIsOpen: false })
  }

  validate = () => {
    const { userDetail } = this.props;
    const { filterObj } = this.state;
    if (String(filterObj.emailId).toLowerCase() === String(userDetail.emailId).toLowerCase()) {
      toast('you can not Invite self in meeting as participant', 'error');
      return false
    } else
      return true;
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { InviteParticipant, userDetail, location } = this.props;
    const { filterObj } = this.state;
    if (this.validate()) {
      InviteParticipant(userDetail.id, location.state.meetingInfo, filterObj)
        .then((res) => {
          this.props.ToggleDisabledButtons()
          if (res.data && res.data.status === 'success') {
            this.setState({ filterObj: { ...filterObj, emailId: '' } })
            this.props.GetAllMeetingParticipant(this.state.meetingId);
            toast(res.data.msg, res.data.status)
          } else {
            toast(res.data.msg, res.data.status)
          }
        })
        .catch((err) => {
          toast(err, 'err')
        })
    }
  }

  stopAudio = () => {
    if (this.state.localStream) {
      this.state.localStream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
        this.setState({ mute: !this.state.mute })
      });
    }
  }

  screenSharing = async () => {
    let constraints;
    let display = 'video';
    const { pauseRecording, resumeRecording, isHost } = this.state;
    if (isHost && (pauseRecording || resumeRecording)) {
     this.mediaRecorder.stop();
    }
    if (!this.state.screenSharing) {
      constraints = {
         video: true,
      }
      display = 'screen'
    } else {
      constraints = {
        audio: {echoCancellation: true},
        video: true,
      }
    if (isHost && (pauseRecording || resumeRecording)) {
      this.mediaRecorder.start(1000);
     }
    }
    this.setState({ screenSharing: !this.state.screenSharing })
    this.getCameraPermission(constraints, display)
  }

  onHandleChange = (field, value, userInfo, event) => {
    event.preventDefault();
    const { filterObj } = this.state;
    if (userInfo === null && field === 'emailId') {
      this.setState({ filterObj: { ...filterObj, emailId: value } })
    } else {
      this.setState({ filterObj: { ...filterObj, fullname: userInfo.fullname, id: userInfo.id } })
    }
  }

  onDeleteParticipnat = (userId) => {
    this.props.DeleteParticipant(this.state.meetingId, userId)
      .then((response) => {
        this.props.ToggleDisabledButtons()
        if (response && response.status === 200) {
          toast(response.data.msg, 'info');
          this.props.GetAllMeetingParticipant(this.state.meetingId);
          this.props.GetAllContacts(this.props.userDetail.id);
        } else {
          toast(response.data.msg, 'error');
        }
      })
  }

  addConatctAsParticipant = (user) => {
    const { location, userDetail } = this.props;
    this.props.AddContactParticipant(this.state.meetingId, user, location.state.meetingInfo, userDetail)
      .then((response) => {
        this.props.ToggleDisabledButtons()
        if (response && response.status === 200) {
          toast(response.data.msg, 'info');
          this.props.GetAllMeetingParticipant(this.state.meetingId);
          this.props.GetAllContacts(this.props.userDetail.id);
        } else {
          toast(response.data.msg, 'error');
        }
      })
  }

  userExist = (meetingUsers, user) => {
    return (meetingUsers && meetingUsers.length > 0) ? meetingUsers.filter(meetingUser => meetingUser.id === user.id) : [];
  }

  filterContactList = (users, meetingUsers) => {
    let contactList = [];
    if (users && users.length > 0) {
      users.map((user) => {
        const isExist = this.userExist(meetingUsers, user)
        if (isExist.length === 0) {
          contactList.push(user)
        }
      })
    }
    const onlyActiveUserList = contactList && contactList.length > 0 ? contactList.filter(contact => contact.active === 1) : [];
    return onlyActiveUserList;
  }

  participantExist = (participants, getHostDetails) => {
    return participants && participants.length > 0 && participants.filter((participant) => participant.id === getHostDetails.id);
  }

  streamExist = (streams, stream) => {
    return streams && streams.length > 0 && streams.filter((item) => item.id === stream.id);
  }

  updateRemoteStream = (rStream, localStream) => {
    const { remoteStreams } = this.state;
    for (let item of remoteStreams) {
      rStream.push(item)
    }

    if (this.socket !== null && localStream !== null) {
      const lStream = {
        stream: localStream,
        id: this.socket.id,
        name: this.socket.id,
        muted: 'muted'
      }
      if (rStream.length === 0) {
        rStream.push(lStream);
      } else {
        const isExist = this.streamExist(rStream, lStream);
        if (isExist.length === 0) {
          rStream.push(lStream);
        }
      }
    }
  }

  updateParticipant = (participants) => {
    const { userDetail, getHostDetails } = this.props;
    const { isHost, participant } = this.state;
    for (let item of participant) {
      participants.push(item)
    }
    if (isHost) {
      if (participants.length === 0) {
        participants.push(userDetail);
      } else {
        const isExist = this.participantExist(participants, userDetail)
        if (isExist.length === 0 && userDetail && userDetail.id !== null && userDetail.id !== undefined) {
          participants.unshift(userDetail);
        }
      }
    }
    if (!isHost) {
      if (participants.length === 0) {
        participants.push(userDetail);
      } else {
        const isExist = this.participantExist(participants, getHostDetails)
        if (isExist.length === 0 && getHostDetails && getHostDetails.id !== null && getHostDetails.id !== undefined) {
          participants.unshift(getHostDetails)
        }
      }
    }
  }

  pauseRecording = (e) => {
    e.preventDefault();
    this.setState({ startRecording: false, pauseRecording: false, resumeRecording: true });
    this.mediaRecorder.pause();
  }
  resumeRecording = (e) => {
    e.preventDefault();
    this.setState({ resumeRecording: false, pauseRecording: true });
    this.mediaRecorder.resume();
  }

  downloadVideoLocal = () => {
    const blob = new Blob(this.state.recordedChunks, { type: 'video/webm' });
    let url = URL.createObjectURL(blob);
    let a = document.createElement('a');
    a.href = url;
    a.download = this.state.videoName;
    a.click();
    if(this.mediaRecorder) {
     this.mediaRecorder = null;
    }
    this.props.history.push('/admin/meeting');
  }

  closeDownloadModal = () => {
    this.setState({ openVideoDownload: false });
    if(this.mediaRecorder) {
      this.mediaRecorder = null;
     }
    this.props.history.push('/admin/meeting');
  }

  render() {
      const { location, meetingParticipants, allContacts, isLoading, match, userDetail, hostDetails } = this.props;
      const { participantIsOpen, filterObj, selectedVideo, mute, stopVideo, joinedPeers, isHost, localStream,
        disableRecorder,pauseRecording,openVideoDownload,videoName,recordedChunks,startRecording,resumeRecording,
        screenSharing }
         = this.state;
      const { meetingId } = match.params;
    let participants = [];
    const rStream = [];
    this.updateRemoteStream(rStream, localStream)
    this.updateParticipant(participants)
    
    const disableRecordBtn = ((location.state && location.state.meetingInfo
       && location.state.meetingInfo.canRecord && !disableRecorder)) ? true :
        !disableRecorder && isHost ? true : false;
    const allowPrivateChat = location.state && location.state.meetingInfo
     && location.state.meetingInfo.allowPrivateChat;
    return (
      <div className="content conference-screen">
        <DemoNavbar {...this.props} hideSearch={true} />
        <div className="meeting-detail">
          {(location.state && location.state.meetingInfo) && location.state.meetingInfo.title}
        </div>
        <div className="meeting-wrapper">
          <div className="meet-thumbnail-container">
            <Videos
              zoomVideo={this.zoomVideo}
              remoteStreams={rStream}
              meetingParticipants={participants}
              joinedPeers={joinedPeers}
            />
          </div>
          {(selectedVideo !== null) &&
            <Video
              videoStyles={{
                zIndex: 7,
                position: 'fixed',
                top: '12%',
                minWidth: '70%',
                width: '75%',
                minHeight: '70%',
                height: '80%',
                backgroundColor: 'black'
              }}
              footerStyles={{
                zIndex: 7,
                position: 'fixed',
                bottom: '2%',
                minWidth: '70%',
                width: '75%',
                padding: 5,
                marginLeft: 50,
                marginBottom: 20,
                backgroundColor: 'black'
              }}
              zoom='zoom'
              username={selectedVideo.username}
              zoomVideo={this.zoomVideo}
              rVideo={(selectedVideo && selectedVideo.stream) && selectedVideo}
              videoStream={(selectedVideo && selectedVideo.stream) && selectedVideo.stream}
              autoPlay>
            </Video>}
          <div className="meeting-toolbar">
            <nav className=" navbar-transparent bg-transparent">
              <div className="navigation-container">
                <ul className="navbar-nav">

                <li style={{ cursor: 'pointer' }} className="nav-item">
                   <a  className="nav-link btn-rotate" onClick={() => this.toggleChatWindow()}>
                        <span className="fa-stack fa-lg">
                          <i className="fa fa-comment fa-stack-1x"></i>
                        </span>
                       { this.state.showChatWindow === false && this.state.unreadMessageCount > 0  && 
                          <span className='badge badge-danger' style={{ position: 'absolute', right: '32px' }}>
                             {this.state.unreadMessageCount}
                          </span>
                       }
                      <p><span className=" d-md-block"> Chat 
                      
                      </span>
                      </p>
                      </a>
                </li>

                  <li className="nav-item" style={{ cursor: 'pointer' }} onClick={() => this.stopVideo()}>
                    {stopVideo ?
                      <a className="nav-link btn-rotate">
                        <span className="fa-stack fa-lg">
                          <i className="fa fa-video-camera fa-stack-1x"></i>
                          <i className="fa fa-ban fa-stack-2x text-danger"></i>
                        </span>
                        <p><span className=" d-md-block">Resume Video</span></p>
                      </a> :
                      <a className="nav-link btn-rotate">
                        <span className="fa-stack fa-lg">
                          <i className="fa fa-video-camera fa-stack-1x"></i>
                        </span>
                        <p><span className=" d-md-block"> Stop Video</span></p>
                      </a>}
                  </li>
                  <li className="nav-item" style={{ cursor: 'pointer' }} onClick={() => this.stopAudio()}>
                    {mute ? <a className="nav-link btn-magnify" >
                      <i className="fa  fa-microphone-slash"></i>
                      <p><span className=" d-md-block">Unmute</span></p>
                    </a> :
                      <a className="nav-link btn-magnify" >
                        <i className="fa  fa-microphone"></i>
                        <p><span className=" d-md-block">Mute</span></p>
                      </a>}
                  </li>
                  <li className="nav-item" style={{ cursor: 'pointer' }}>
                    <a className="nav-link btn-rotate" style={{
                      color: isHost ? '#fff' : 'gray'
                    }}
                      onClick={() => {
                        isHost &&
                          this.setState({ participantIsOpen: !participantIsOpen })
                      }} >
                      <i className="fa fa-user-plus"></i>
                      <p><span className=" d-md-block">Add Participant</span></p>
                    </a>
                  </li>
                  {screenSharing ? 
                  <li className="nav-item" style={{ cursor: 'pointer' }}>
                  <a className="nav-link btn-rotate" onClick={() => this.screenSharing()}>
                    <i className="fa fa-share" style={{marginTop: 5}}></i>
                    <i className="fa fa-ban fa-stack-2x text-danger" ></i>
                    <p><span className=" d-md-block">Stop Sharing</span></p>
                  </a>
                 </li> :
                  <li className="nav-item" style={{ cursor: 'pointer' }}>
                    <a className="nav-link btn-rotate" onClick={() => this.screenSharing()}>
                      <i className="fa fa-share"></i>
                      <p><span className=" d-md-block">Share Screen</span></p>
                    </a>
                  </li>}
                  <li className="nav-item" style={{ cursor: 'pointer' }}>
                    {startRecording &&
                      <a className="nav-link btn-rotate" style={{ color: disableRecordBtn ? '#fff' : 'gray' }}
                        onClick={(e) => { disableRecordBtn && this.recordVideo(e) }}>
                        <i className="fa fa-circle"></i>
                        <p><span className=" d-md-block">Record Video</span></p>
                      </a>}
                    {pauseRecording &&
                      <a className="nav-link btn-rotate" onClick={(e) => this.pauseRecording(e)}>
                        <i className="fa fa-pause" aria-hidden="true"></i>
                        <p><span className=" d-md-block">Pause Recording</span></p>
                      </a>}
                    {resumeRecording &&
                      <a className="nav-link btn-rotate" onClick={(e) => this.resumeRecording(e)}>
                        <i className="fa fa-play" aria-hidden="true"></i>
                        <p><span className=" d-md-block">Resume Recording</span></p>
                      </a>}
                  </li>
                  <li className="nav-item">
                    <a className="nav-link btn-rotate" onClick={() => this.cancelCall()}>
                      <i className="fa fa-arrow-circle-left" aria-hidden="true"></i>
                      <p><span className=" d-md-block">Leave Meeting</span></p>
                    </a>
                  </li>
                </ul>
              </div>

            </nav>
          </div>
          
            <GroupChat
              socket={this.socket}
              userDetail={userDetail}
              meetingName={meetingId}
              meetingId={this.state.meetingId}
              showChatWindow={this.state.showChatWindow}
              setChatUnreadMessageCount={this.setChatUnreadMessageCount.bind(this)}

              meetingParticipants={meetingParticipants}
              joinedPeers={joinedPeers}
              hostDetails={hostDetails}
              allowPrivateChat={allowPrivateChat}
            />





          <ToastContainer />
          {participantIsOpen &&
            <AddParticipant
              isOpen={participantIsOpen}
              users={this.filterContactList(allContacts, meetingParticipants)}
              meetingUsers={meetingParticipants}
              closeModal={this.closeModal}
              deleteParticipant={this.onDeleteParticipnat}
              addParticipant={this.addConatctAsParticipant}
              handleSubmit={this.handleSubmit}
              filterObj={filterObj}
              onHandleChange={this.onHandleChange}
              isLoading={isLoading} />
          }
          {openVideoDownload &&
            <DownloadVideoPopUp
              isOpen={openVideoDownload}
              closeModal={this.closeDownloadModal}
              isLoading={isLoading}
              downloadVideoLocal={this.downloadVideoLocal}
              videoName={videoName}
              recordedChunks={recordedChunks}
            />
          }
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  const users = state.users.get('getAllUsers');
  const getHostDetails = state.users.get('getHost');
  const userDetail = state.userDetail.get('userDetail');
  const meetingParticipants = state.meeting.get('getAllMeetingParticipants');
  const isLoading = state.meeting.get('isLoading');
  const allContacts = state.contact.get('getAllContacts');
  const hostDetails = state.users.get('hostDetails');
  return {
    users, userDetail, meetingParticipants, allContacts, isLoading, getHostDetails, hostDetails
  }
};

const mapDispatchToProps = dispatch => ({
  GetAllUsers: () => dispatch(getAllUsers()),
  GetAllMeeting: (hostId) => { dispatch(getAllMeeting(hostId)) },
  InviteParticipant: (userId, meetingId, filterObj) => dispatch(inviteParticipant(userId, meetingId, filterObj)),
  AddContactParticipant: (meetingId, user, meetingInfo, sender) => dispatch(addContactAsParticiant(meetingId, user, meetingInfo, sender)),
  DeleteParticipant: (meetingId, userId) => dispatch(deleteParticipant(meetingId, userId)),
  GetAllMeetingParticipant: (meetingId) => { dispatch(getAllMeetingPaticipants(meetingId)) },
  GetAllContacts: (hostId) => { dispatch(getAllContacts(hostId)) },
  UpdateMeetingParticipants: () => dispatch({ type: "GET_ALL_MEETING_PARTICIPANTS", payload: [] }),
  ToggleDisabledButtons: () => dispatch({ type: "IS_LOADING", payload: false }),
  GetHost: (hostId) => { dispatch(getHost(hostId)) },
  GetHostDetails: (hostId) => { dispatch(getHostDetails(hostId)) },
  DeleteUserFromMeeting: (userId) => dispatch(deleteUserFromMeeting(userId)),
  SaveStream: (userId, blob, videoName) => dispatch(saveStream(userId, blob, videoName)),
  GetGroupMessageByMeeting: (meetingId) => dispatch(getGroupMessageByMeeting(meetingId)),
  SetMessageReceivers: (meetingId, receiver) => dispatch(setMessageReceivers(meetingId, receiver)),
  UpdateMeetingStatus: (meetingId, status) => dispatch(updateMeetingStatus(meetingId, status)),
});
export default connect(mapStateToProps, mapDispatchToProps)(VideoChat);