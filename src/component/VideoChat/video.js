import React, { Component } from 'react';

class Video extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    if (this.props.videoStream) {
      this.video.srcObject = this.props.videoStream
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.videoStream && nextProps.videoStream !== this.props.videoStream) {
      this.video.srcObject = nextProps.videoStream
    }
  }

  render() {
    const { username, zoomVideo, rVideo, videoStyles, footerStyles, zoom } = this.props;
    return (
      <div className="meet-thumbnail has-video ">
        <video
          id={this.props.id}
          muted={this.props.muted}
          autoPlay
          style={videoStyles}
          className="meet-thumbnail-content"
          ref={(ref) => { this.video = ref }}
        >
        </video>
        <div className='meeting-thumbnail-footer' style={footerStyles}>
          <div className="joinee-name">
            {username}
          </div>
          <div onClick={e => zoomVideo(e, rVideo, username)} style={{ cursor: 'pointer' }}>
            {zoom === 'zoom' ? <i className="fa fa-compress"></i> : <i className="fa fa-expand"></i>}
          </div>
        </div>
      </div>
    )
  }
}

export default Video