import React, { Component } from 'react'
import Video from './video'

class Videos extends Component {
  constructor(props) {
    super(props)

    this.state = {
      remoteStreams: []
    }
  }

  componentDidMount() {
    const { remoteStreams } = this.props;
    this.setState({ remoteStreams })
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.remoteStreams !== nextProps.remoteStreams) {
      this.setState({
        remoteStreams: nextProps.remoteStreams,
      })
    }
  }

  updateStreams = (joinedPeers, streams) => {
    if (joinedPeers && joinedPeers.length > 0 && streams && streams.length > 0) {
      streams.forEach((rVideo) => {
        joinedPeers.forEach((joinedPeer) => {
          if (joinedPeer.socketID === rVideo.id) {
            rVideo.username = joinedPeer.username,
              rVideo.emailId = joinedPeer.emailId
          }
        })
      })
    }
  }

  render() {
    const { remoteStreams } = this.state;
    const { meetingParticipants, joinedPeers } = this.props;
    const streams = remoteStreams;
    let updatedParticipant = meetingParticipants.filter(meetingParticipant => meetingParticipant.active !== 0);
    this.updateStreams(joinedPeers, streams);
    return (updatedParticipant && updatedParticipant.length > 0) ? updatedParticipant.map((participant, index) => {
      const streamValue = (streams && streams.length > 0) && streams.filter((rVideo) => participant.emailId == rVideo.emailId);
      if (streamValue && streamValue.length > 0) {
        return <Video
          videoStream={streamValue[0].stream}
          id={streamValue[0].name}
          zoomVideo={this.props.zoomVideo}
          rVideo={streamValue[0]}

          key={index}
          username={streamValue[0].username}
          muted={(streamValue[0] && streamValue[0].muted === 'muted') ? true : false}
        />
      } else {
        return (
          <div className="meet-thumbnail has-video " key={index}>
            <div className="meet-thumbnail-content">
              <div style={{
                display: 'flex', justifyContent: 'center', height: 180
              }}><span style={{ margin: 'auto' }}>not available</span></div>
            </div>
            <div className='meeting-thumbnail-footer'>
              <div className="joinee-name">
                {participant.fullname}
              </div>
            </div>
          </div>
        )
      }
    })
      : <div> </div>
  }
}

export default Videos












// const { meetingParticipants, joinedPeers } = this.props;
// return (meetingParticipants && meetingParticipants.length > 0) ? meetingParticipants.map((participant, index) => {
//   const streamValue = (remoteStreams && remoteStreams.length > 0) && remoteStreams.filter((rVideo) => participant.fullname === rVideo.username)
//   if (streamValue && streamValue.length > 0) {
//     return <Video
//       videoStream={streamValue[0].stream}
//       id={streamValue[0].name}
//       zoomVideo={this.props.zoomVideo}
//       rVideo={streamValue[0]}

//       key={index}
//       username={streamValue[0].username}
//     />
//   } else {
//     return (
//       <div className="meet-thumbnail has-video " key={index}>
//         <div className="meet-thumbnail-content">not available</div>
//         <div className='meeting-thumbnail-footer'>
//           <div className="joinee-name">
//             {participant.fullname}
//           </div>
//         </div>
//       </div>
//     )
//   }
// })
//   : <div> </div>