import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Table } from "reactstrap";
import { getAllRecording, downloadRecordedVideo, playRecordedVideo } from '../../service/service';
import { validateToken, getfromLocalStorage } from '../../utils/common';
import './recording.css';

function Recording(props) {
  const { history, userDetail, jwtToken, GetAllRecording, allRecording, DownloadRecordedVideo, PlayRecordedVideo } = props;
  const [play, setPlay] = useState(false);
  const [isUrl, setUrl] = useState('');

  useEffect(() => {
    const jwt = jwtToken != "" ? jwtToken : getfromLocalStorage('token');
    const isValid = validateToken(jwt, history);
    if (isValid) {
      GetAllRecording(userDetail.id);
    }
  }, []);

  const downloadVideo = (videoName) => {
    DownloadRecordedVideo(userDetail.id, videoName)
      .then(response => {
        if (response && response.data && response.data.data.length > 0) {
          let url = URL.createObjectURL(response.data);
          let a = document.createElement('a');
          a.href = url;
          a.download = data[0].videoName;
          a.click();
        }
      });
  }
  const playVideo = (videoName) => {
    PlayRecordedVideo(userDetail.id, videoName)
      .then(response => {
        if (response && response.data) {
          const arrayBuffer = response.data.data && response.data.data.data;
          const blob = new Blob(arrayBuffer, { type: "video/webm" });
          let url = URL.createObjectURL(blob);
          setUrl(url);
          setPlay(true);
        }
      })
      .catch((err) => {
        console.log('err', err)
      })
  }

  return (
    <div className="content">
      <div className="container-fluid">
        <h1 className="h3 mb-2 text-gray-800">Recordings</h1>
        <div className="card shadow mb-4">
          <div className="card-body">
            <Table>
              <tbody>
                <tr>
                  <td>Name</td>
                  <td>Date</td>
                  <td>Time</td>
                  <td>Download</td>
                  <td>View</td>
                  <td></td>
                </tr>
                {(allRecording && allRecording.length > 0) ?
                  allRecording.map((item, index) => {
                    const str = item.videoName.split('.')[0];
                    const time = str.split('_')[2];
                    const date = str.split('_')[1];
                    // const time = str.substring(str.length, str.length - 8);
                    // const date = str.substring(str.length - 9, str.length - 20);
                    return (
                      <tr id={index} key={index}>
                        <td>{item.videoName}</td>
                        <td>{date}</td>
                        <td>{time}</td>
                        <td><span onClick={() => playVideo(item.videoName)}>View</span></td>
                        <td> <a href='#' onClick={() => downloadVideo(item.videoName)}>Download</a></td>
                      </tr>
                    )
                  }) : <tr>
                    <td></td>
                    <td></td>
                    <td>No Recordings Found</td>
                    <td></td>
                    <td></td>
                  </tr>
                }
              </tbody>
            </Table>
          </div>
        </div>
      </div>
      <div>
      </div>
    </div>
  );
}
const mapStateToProps = state => {
  const userDetail = state.userDetail.get('userDetail');
  const jwtToken = state.userDetail.get('jwtToken');
  const allRecording = state.recording.get('allRecording');
  return {
    userDetail, jwtToken, allRecording
  }
};

const mapDispatchToProps = dispatch => ({
  GetAllRecording: (hostId) => { dispatch(getAllRecording(hostId)) },
  DownloadRecordedVideo: (hostId, videoName) => dispatch(downloadRecordedVideo(hostId, videoName)),
  PlayRecordedVideo: (hostId, videoName) => dispatch(playRecordedVideo(hostId, videoName))
});
export default connect(mapStateToProps, mapDispatchToProps)(Recording)