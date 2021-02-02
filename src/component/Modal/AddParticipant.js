import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { Card, CardHeader, CardBody, CardTitle, Row, Col, Table, FormGroup, Input } from "reactstrap";
import './style.css';

function AddParticipant(props) {
  const { isOpen, closeModal, onHandleChange,
    users, meetingUsers, deleteParticipant, addParticipant, handleSubmit, filterObj, isLoading } = props;

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      height: '75%',
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
            <CardTitle tag="h4">Invite New Participant</CardTitle>
          </CardHeader>
          <CardBody>
            <div className="row" style={{ paddingBottom: "15px" }}>
              <FormGroup className="col-md-8">
                <Input type='text' placeholder="Enter email to invite" className="Inputfield" value={filterObj.emailId}
                  onChange={(e) => onHandleChange('emailId', e.target.value, null, e)} />
              </FormGroup>
              <FormGroup className="col-md-2" style={{ paddingTop: "11px" }}>
                <button className="invite-btn btn btn-primary"
                  disabled={isLoading}
                  onClick={(event) => handleSubmit(event)}>Invite</button>
              </FormGroup>
            </div>
            <Card style={{ marginBottom: 20, boxShadow: 'rgba(0, 0, 0, 0.55) 1px 1.8px 4.2px' }}>
              <CardHeader>
                <CardTitle tag="h6">Meeting Participants</CardTitle>
              </CardHeader>
              <CardBody>
                {meetingUsers && meetingUsers.length > 0 ?
                  meetingUsers.map((item, index) => {
                    return (
                      <div className="row" style={{ marginBottom: "5px" }} id={index} key={index}>
                        <div className="col-md-4">{item.fullname}</div>
                        <div className="col-md-6">{item.emailId}</div>
                        <div className="col-md-2">
                          <button className={item.active === 0 ? "status-pending" : "status-active"} disabled={isLoading}
                            onClick={() => deleteParticipant(item.id)}>
                            Remove
                          </button>
                        </div>
                      </div>
                    )
                  }) :
                  <div className="col-md-12">No Participant is added yet.</div>
                }
              </CardBody>
            </Card>
            <Card style={{ boxShadow: 'rgba(0, 0, 0, 0.55) 1px 1.8px 4.2px' }}>
              <CardHeader>
                <CardTitle tag="h6">Add Participant from your Contacts</CardTitle>
              </CardHeader>
              <CardBody>
                {users && users.length > 0 ?
                  users.map((item, index) => {
                    return (
                      <div className="row" style={{ paddingBottom: "5px" }} id={index} key={index}>
                        <div className="col-md-4">{item.fullname}</div>
                        <div className="col-md-6">{item.emailId}</div>
                        <div className="col-md-2">
                          <button className='btn btn-primary' disabled={isLoading} onClick={() => addParticipant(item)}>Add</button>
                        </div>
                      </div>
                    )
                  }) :
                  <div className="col-md-12">No Contact Found.</div>
                }
              </CardBody>
            </Card>
          </CardBody>
        </Card>
        <div className="text-right" style={{ marginRight: 10 }}>
          <button onClick={closeModal} className='btn btn-danger' style={{ margin: '10px 0px' }}>Close</button>
        </div>
      </Modal>
    </div>
  )
}

export default AddParticipant;
