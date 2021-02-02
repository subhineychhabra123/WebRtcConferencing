import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Card, CardHeader, CardBody, CardTitle, Row, Col, Table } from "reactstrap";
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import toast from '../common/toast';
import { addNewMeeting, getAllMeeting, getAllContacts, addConatct, deleteConatct } from '../../service/service';
import { validateToken, getfromLocalStorage } from '../../utils/common';
import AddNewContactModel from './../Modal/AddNewContact';
import DeleteContactModel from './../Modal/DeleteContact';

function Contacts(props) {
  const { history, userDetail, allContacts, jwtToken, AddNewContact, GetAllContacts, DeleteContact } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [isError, setError] = useState({ emailId: '' });
  const [emailId, setEmail] = useState('');
  const [deleteContactPopUpOpen, setDeleteContactPopUpOpen] = useState(false);
  const [deleteContactData, setDeleteContactData] = useState({});

  useEffect(() => {
    const jwt = jwtToken != "" ? jwtToken : getfromLocalStorage('token');
    const isValid = validateToken(jwt, history);
    if (isValid) {
      GetAllContacts(userDetail.id);
    }
  }, [])

  const submitAddNewContact = (e) => {
    e.preventDefault();
    setIsOpen(true);
  }

  const validate = () => {
    const expression = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
    if (!emailId) {
      if (!emailId) setError(prev => ({ ...prev, emailId: `Please enter email` }));
      return false
    } else if (!expression.test(String(emailId).toLowerCase())) {
      setError(error => ({ ...error, emailId: 'please enter a valid email.' }))
      return false
    } else if (String(emailId).toLowerCase() === String(userDetail.emailId).toLowerCase()) {
      toast('you can not add self in contact', 'error');
      setEmail('')
      return false
    } else
      return true;
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validate()) {
      AddNewContact(userDetail.id, userDetail.fullname, emailId)
        .then((response) => {
          if (response && response.status === 200) {
            GetAllContacts(userDetail.id);
            setIsOpen(false);
            setEmail('');
            toast(response.data.msg, 'info');
          } else {
            toast(response.data.msg, 'error');
          }
        })
        .catch((err) => {
          toast(err, 'error');
        })
    }
  }

  const onHandleChange = (field, value) => {
    if (field === 'emailId') setEmail(value);
  }

  const deleteContact = (data) => {
    DeleteContact(userDetail.id, data.id)
      .then((response) => {
        if (response && response.status === 200) {
          toast(response.data.msg, 'info');
          GetAllContacts(userDetail.id);
          setDeleteContactData({});
          setDeleteContactPopUpOpen(false);
        } else {
          toast(response.data.msg, 'error');
          setDeleteContactData({});
          setDeleteContactPopUpOpen(false);
        }
      })
  }

  const onDeleteContact = (data) => {
    setDeleteContactPopUpOpen(true);
    setDeleteContactData(data);
  }


  return (
    <div className="content">
      <div className="container-fluid">
        <h1 className="h3 mb-2 text-gray-800">Contacts</h1>
        <div className="card shadow mb-4">
          <div className="card-header py-3" style={{ justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-primary" onClick={(e) => submitAddNewContact(e)}>Add New</button>
          </div>
          <div className="card-body">
            <Table>
              <tbody>
                <tr>
                  <td>Name</td>
                  <td>Email</td>
                  <td>Status</td>
                  <td></td>
                </tr>
                {allContacts && allContacts.length > 0 ?
                  allContacts.map((item, index) => {
                    return (

                      <tr id={index} key={index}>
                        <td>{item.fullname}</td>
                        <td>{item.emailId}</td>
                        <td>{item.active == 1 ? "Active" : "Pending"}</td>
                        <td><i className="far fa-trash-alt" style={{ color: "red", cursor: "pointer" }} onClick={() => onDeleteContact(item)}></i></td>
                      </tr>
                    )
                  }) : <tr>
                    <td></td>
                    <td>No Contacts Found</td>
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
          <AddNewContactModel
            isOpen={isOpen}
            closeModal={() => setIsOpen(false)}
            handleSubmit={handleSubmit}
            onHandleChange={onHandleChange}
            isTitle={emailId}
            isError={isError}
          />}
        {deleteContactPopUpOpen &&
          <DeleteContactModel
            isOpen={deleteContactPopUpOpen}
            closeModal={() => setDeleteContactPopUpOpen(false)}
            onSubmit={deleteContact}
            item={deleteContactData}
          />}
      </div>
    </div>
  );
}
const mapStateToProps = state => {
  const userDetail = state.userDetail.get('userDetail');
  const jwtToken = state.userDetail.get('jwtToken');
  const allContacts = state.contact.get('getAllContacts');
  return {
    userDetail, jwtToken, allContacts
  }
};

const mapDispatchToProps = dispatch => ({
  AddNewContact: (hostId, hostmail, emailId) => dispatch(addConatct(hostId, hostmail, emailId)),
  DeleteContact: (userId, contactId) => dispatch(deleteConatct(userId, contactId)),
  GetAllContacts: (hostId) => { dispatch(getAllContacts(hostId)) }
});
export default connect(mapStateToProps, mapDispatchToProps)(Contacts)