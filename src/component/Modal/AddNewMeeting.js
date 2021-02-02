import React from 'react';
import Modal from 'react-modal';
import { Card, CardHeader, CardBody, CardTitle, Row, Col, Table, FormGroup, Input } from "reactstrap";
import './style.css';

function AddNewMeetingModal(props) {
  const { isOpen, closeModal, isError, handleSubmit, onHandleChange, isTitle, isDescription } = props;
  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      height: 'auto',
      width: '50%',
    }
  };
  return (
    <div>
      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        style={customStyles}
        ariaHideApp={false}
      >
        <Card>
          <CardHeader>
            <CardTitle tag="h4">Add New Meeting</CardTitle>
          </CardHeader>
          <CardBody>
                <FormGroup>
                  <label>Title</label>
                  <Input
                    placeholder="Title"
                    type="text"
                    value={isTitle} onChange={(e) => onHandleChange('title', e.target.value)}
                  />
                  {isError && isError.title && <div className='custom-error'>{isError.title} </div>}
                </FormGroup>
                <FormGroup>
                  <label>Description</label>
                  <Input
                    placeholder="Description"
                    type="text"
                    value={isDescription} onChange={(e) => onHandleChange('description', e.target.value)}
                  />
                  {isError && isError.description && <div className='custom-error'>{isError.description} </div>}
                </FormGroup>
                <div className="text-right">
                  <button onClick={(e) => handleSubmit(e)} className='btn btn-primary mr-2'>Save</button>
                  <button onClick={closeModal} className='btn btn-danger'>Close</button>
              </div>
          </CardBody>
        </Card>
      </Modal>
    </div>
  )
}

export default AddNewMeetingModal
