import React, { useState, useEffect } from 'react';
import { Button, Card, CardHeader, CardBody, CardFooter, CardTitle, FormGroup, Form, Input, Row, Col } from "reactstrap";
import { connect } from 'react-redux';
import Cryptr from 'cryptr';
import { ToastContainer } from 'react-toastify';
import { forgotpassword } from '../../service/service';
import './forgetpassword.css';
import toast from '../common/toast';
import { removeFromLocalStorage, getfromLocalStorage } from '../../utils/common';
const appLogo = require("../../assets/img/appLogo.png").default


function ForgetPasswordScreen(props) {
  const { history, ForgotPassword, isLoading, ToggleDisabledButtons } = props;
  const [emailId, setEmail] = useState('');
  const [error, setError] = useState({ email: '' });
  const cryptr = new Cryptr('myTotalySecretKey');


  useEffect(() => {

  }, [])

  const validate = () => {
    if (!emailId || emailId.trim() === '') {
      if (!emailId) setError(error => ({ ...error, email: 'please enter email.' }))
      return false
    }
    setError(error => ({ ...error, email: '' }))
    return true;
  }

  const forgotpassword = async (e) => {
    e.preventDefault();
    if (validate()) {
      ForgotPassword(emailId)
        .then((res) => {
          setEmail('')
          toast(res.data.msg, res.data.status);
          ToggleDisabledButtons();
        })
        .catch((err) => {
          toast(err, 'error');
          ToggleDisabledButtons();
        });
    }
  }

  const navigate = () => {
    history.push('/register')
  }

  const navigateLogin = () => {
    history.push('/login')
  }

  return (
    <div className="login-background">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card o-hidden border-0 shadow-lg my-5">
              <div className="card-body p-0">
                <div className="row">
                  <div className="p-5">
                    <div className="text-center">
                      <h1 className="h4 text-gray-900 mb-2">Forgot Your Password?</h1>
                      <p className="mb-4">We get it, stuff happens. Just enter your email address below and we'll send you a link to reset your password!</p>
                    </div>
                    <div className="text-center login-logo">
                      <img src={appLogo} />
                    </div>
                    <div className="content container">
                      <Row className="justify-content-center">
                        <Col className="login-container col pt-4">
                          <Card className="card-user">
                            <CardBody >
                              <Form>
                                <FormGroup>
                                  <label>Email</label>
                                  <Input
                                    placeholder="Email"
                                    value={emailId}
                                    type="email"
                                    onChange={(event) => setEmail(event.target.value.toLowerCase())}
                                  />
                                  {error && error.email && <div className='error'>{error.email} </div>}
                                </FormGroup>
                                <div className="update ml-auto mr-auto text-center">
                                  <Button
                                    className="btn-round"
                                    color="primary"
                                    type="submit"
                                    onClick={e => forgotpassword(e)}
                                    style={{ width: "100%" }}
                                    disabled={isLoading}
                                  >
                                    Reset Password
                                   </Button>
                                  <div>
                                    <span className="signup" onClick={() => navigate()} >
                                      Don't have an account? Sign up
                                </span>
                                  </div>
                                  <div>
                                    <span className="login" onClick={() => navigateLogin()}>
                                      Already have an account? Login!
                                  </span>
                                  </div>
                                </div>
                              </Form>
                            </CardBody>
                          </Card>
                        </Col>
                        <ToastContainer />
                      </Row>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
const mapStateToProps = state => {
  const isLoading = state.userDetail.get('isLoading');
  return {
    isLoading
  }
};
const mapDispatchToProps = dispatch => ({
  ForgotPassword: (emailId) => dispatch(forgotpassword(emailId)),
  ToggleDisabledButtons: () => dispatch({ type: "IS_LOADING", payload: false }),
});

export default connect(mapStateToProps, mapDispatchToProps)(ForgetPasswordScreen);
