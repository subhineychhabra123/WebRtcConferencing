import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { Card, CardHeader, CardBody, CardTitle, Row, Col, Table, FormGroup, Input } from "reactstrap";
import './style.css';

function DownloadVideo(props) {
  const { isOpen, closeModal, isLoading, downloadVideoLocal, videoName, recordedChunks } = props;
  const blob = new Blob(recordedChunks, { type: 'video/webm' });
  let url = URL.createObjectURL(blob);
  const [isUrl, setUrl] = useState(url);


  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      height: '40%',
      width: '50%',
    }
  };

  const [width, setWidth] = useState('');

  function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    setWidth(width);
  }

  useEffect(() => {
    getWindowDimensions();
  });

  return (
    <div>
      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        style={customStyles}
        ariaHideApp={false}
      >  <Card>
          <CardHeader>
            <CardTitle tag="h4"> Download Video</CardTitle>
          </CardHeader>
          <CardBody>
            <FormGroup>
              Do you want to Download <strong>{videoName}</strong>
            </FormGroup>
          </CardBody>
        </Card>
        <div className="text-right" style={{ marginRight: 10 }}>
          <a href={isUrl} className='btn btn-primary' style={{ margin: 10 }} target="_blank">View Video</a>
          <button onClick={downloadVideoLocal} className='btn btn-primary' style={{ margin: 10 }}>Download</button>
          <button onClick={closeModal} className='btn btn-danger' style={{ margin: '10px 0px' }}>Close</button>
        </div>
      </Modal>
    </div>
  )
}

export default DownloadVideo;
