import React from 'react';
import Modal from 'react-modal';
import { Card, CardHeader, CardBody, CardTitle, Row, Col, Table, FormGroup, Input } from "reactstrap";
import './style.css';

function AddNewContactModal(props) {
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
            <CardTitle tag="h4">Add New Contact</CardTitle>
          </CardHeader>
          <CardBody>
                <FormGroup>
                  <label>Email</label>
                  <Input
                    placeholder="Email"
                    type="text"
                    value={isTitle} onChange={(e) => onHandleChange('emailId', e.target.value)}
                  />
                  {isError && isError.emailId && <div className='custom-error'>{isError.emailId} </div>}
                </FormGroup>
                <div className="text-right">
                  <button onClick={(e) => handleSubmit(e)} className='btn btn-primary  mr-2'>Invite</button>
                  <button onClick={closeModal} className='btn btn-danger'>Close</button>
              </div>
          </CardBody>
        </Card>
      </Modal>
    </div>
  )
}

export default AddNewContactModal
