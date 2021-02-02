import React, { useState, useEffect } from 'react';
import { Button, Card, CardHeader, CardBody, CardFooter, CardTitle, FormGroup, Form, Input, Row, Col } from "reactstrap";
import { connect } from 'react-redux';
import Cryptr from 'cryptr';
import { ToastContainer } from 'react-toastify';
import toast from '../common/toast';
import { resetpassword } from '../../service/service';
import './resetpassword.css';
const appLogo = require("../../assets/img/appLogo.png").default


function ResetPasswordScreen(props) {
  const { history, ResetPassword, isLoading } = props;
  const [emailId, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setconfirmPassword] = useState('');
  const [error, setError] = useState({ password: '', confirmPassword: '' });
  const cryptr = new Cryptr('myTotalySecretKey');
  const [params, setParams] = useState([]);

  useEffect(() => {
    const parameter = new URLSearchParams(history.location.search).get("data");
    if (parameter !== null) {
      const decryptedString = cryptr.decrypt(parameter);
      const arr = decryptedString.split(',');
      setParams(arr)
      if (arr.length === 2 && new Date(arr[1]) < new Date()) {
        toast("Link has been expired. Please genrate a new link", "warning")
      } else {
        setEmail(arr[0]);
      }
    }
  }, [])

  const validate = () => {
    if (!password || password.trim() === '' || !confirmPassword || confirmPassword.trim() === '') {
      if (!password) setError(error => ({ ...error, password: 'please enter password.' }))
      if (!confirmPassword) setError(error => ({ ...error, confirmPassword: 'please enter confirm Password.' }))
      return false
    }
    if (password !== confirmPassword) {
      setError(error => ({ ...error, confirmPassword: "password doesn't match." }))
      return false
    }
    if (params.length === 0) {
      toast('please generate a link from forgot password', 'error')
      return false
    }
    setError(error => ({ ...error, password: '', confirmPassword: '' }))
    return true;
  }

  const resetpassword = (e) => {
    e.preventDefault();
    if (validate()) {
      ResetPassword(emailId, password, history)
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
                      <h1 className="h4 text-gray-900 mb-2">Reset Your Password?</h1>
                      <p className="mb-4">We get it, stuff happens. Just enter your password and confirm password below and we'll reset your password!</p>
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
                                  <label>Password</label>
                                  <Input
                                    placeholder="Password"
                                    value={password}
                                    type="password"
                                    onChange={(event) => setPassword(event.target.value)}
                                  />
                                  {error && error.password && <div className='error'>{error.password} </div>}
                                </FormGroup>
                                <FormGroup>
                                  <label>confirm Password</label>
                                  <Input
                                    placeholder="confirm Password"
                                    value={confirmPassword}
                                    type="password"
                                    onChange={(event) => setconfirmPassword(event.target.value)}
                                  />
                                  {error && error.confirmPassword && <div className='error'>{error.confirmPassword} </div>}
                                </FormGroup>
                                <div className="update ml-auto mr-auto text-center">
                                  <Button
                                    className="btn-round"
                                    color="primary"
                                    type="submit"
                                    onClick={e => resetpassword(e)}
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
  ResetPassword: (emailId, password, history) => dispatch(resetpassword(emailId, password, history)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ResetPasswordScreen);
