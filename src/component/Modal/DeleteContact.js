import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { Card, CardHeader, CardBody, CardTitle, Row, Col, Table, FormGroup, Input } from "reactstrap";
import './style.css';

function DeleteContactModel(props) {
  const { isOpen, closeModal, onSubmit, item } = props;

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      height: '30%',
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
            <CardTitle tag="h4">Delete Contact</CardTitle>
          </CardHeader>
          <CardBody>
            Do you want to delete <strong>{item.emailId}</strong> from your Contact.
          </CardBody>
        </Card>
        <div className="text-right" style={{ margin: '10px 10px' }}>
          <button onClick={closeModal} className='btn btn-danger mr-2' >No</button>
          <button onClick={() => onSubmit(item)} className='btn btn-primary'>Yes</button>
        </div>
      </Modal>
    </div>
  )
}

export default DeleteContactModel;
