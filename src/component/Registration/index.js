import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Button, Card, CardBody, FormGroup, Form, Input, Row, Col } from "reactstrap";
import Cryptr from 'cryptr';
import { ToastContainer } from 'react-toastify';
import toast from '../common/toast';
import { register, updateUser } from '../../service/service';
import './register.css';
const appLogo = require("../../assets/img/appLogo.png").default
function SignUp(props) {
  const { history, UpdateUser, Register, isLoading } = props;
  const [emailId, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [parameter, setParameter] = useState('');
  const [disable, disableEmail] = useState(false);
  const [error, setError] = useState({ email: '', password: '', confirmPassword: '', fullName: '' });
  const [params, setParams] = useState([]);
  const cryptr = new Cryptr('myTotalySecretKey');

  useEffect(() => {
    const data = new URLSearchParams(history.location.search).get("data");
    setParameter(data);
    if (data != null) {
      const decryptedString = cryptr.decrypt(data);
      const arr = decryptedString.split(',');
      if (arr.length === 2 && new Date(arr[1]) <= new Date()) {
        toast("Link has been expired. Please request User to genrate a new link", "warning")
        return false
      } else if (arr.length === 4) {
        if (new Date(arr[3]) < new Date()) {
          toast("Link has been expired. Please request User to genrate a new link", "warning")
        }
      }
      disableEmail(true)
      setParams(arr)
      arr.length > 2 ? setEmail(arr[1]) : setEmail(arr[0]);
    }
  }, [])

  const validate = () => {
    const expression = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
    if (!emailId || !password || !fullName) {
      if (!emailId) setError(error => ({ ...error, email: 'please enter email Id.' }))
      if (!password) setError(error => ({ ...error, password: 'please enter password.' }))
      if (!fullName) setError(error => ({ ...error, fullName: 'please enter full Name.' }))
      if (!confirmPassword) setError(error => ({ ...error, confirmPassword: 'please enter confirm password.' }))
      else if (confirmPassword !== password) setError(error => ({ ...error, confirmPassword: "confirm password doesn't match with password ." }))
      return false
    } else if (!expression.test(String(emailId).toLowerCase())) {
      setError(error => ({ ...error, email: 'please enter a valid email.' }))
      return false
    }
    setError(error => ({ ...error, email: '', password: '', fullName: '' }))
    return true;
  }

  const registerUser = (e) => {
    e.preventDefault();
    if (validate()) {
      !disable ? Register(emailId, password, fullName, history) : UpdateUser(emailId, password, fullName, history, params);
    }
  }
  const navigate = () => {
    parameter != null ? history.push('/login?data=' + parameter) : history.push('/')
  }

  return (
    <div className="login-background">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-6 col-lg-6 col-md-8">
            <div className="card o-hidden border-0 shadow-lg my-5">
              <div className="card-body p-0">

                <div className="p-5">
                  <div className="text-center">
                    <img src={appLogo} />
                  </div>
                  <div className="content container">
                    <Row className="justify-content-center">
                      <Col className="login-container  pt-4">
                        <Card className="card-user">
                          <CardBody>
                            <Form>
                              <Row>
                                <Col className="pr-1" md="12">
                                  <FormGroup>
                                    <label>Full Name</label>
                                    <Input
                                      placeholder="Full Name"
                                      type="text"
                                      onChange={(event) => setFullName(event.target.value)}
                                    />
                                    {error && error.fullName && <div className='error'>{error.fullName} </div>}
                                  </FormGroup>
                                </Col>
                              </Row>
                              <Row>
                                <Col className="pr-1" md="12">
                                  <FormGroup>
                                    <label>Email</label>
                                    <Input
                                      placeholder="Email ID"
                                      disabled={disable} value={emailId}
                                      type="text"
                                      onChange={(event) => setEmail(event.target.value.toLowerCase())}
                                    />
                                    {error && error.email && <div className='error'>{error.email} </div>}
                                  </FormGroup>
                                </Col>
                              </Row>
                              <Row>
                                <Col className="pr-1" md="12">
                                  <FormGroup>
                                    <label>Password</label>
                                    <Input
                                      placeholder="password"
                                      type="password"
                                      onChange={(event) => setPassword(event.target.value)}
                                    />
                                    {error && error.password && <div className='error'>{error.password} </div>}
                                  </FormGroup>
                                </Col>
                              </Row>
                              <Row>
                                <Col className="pr-1" md="12">
                                  <FormGroup>
                                    <label>Confirm Password</label>
                                    <Input
                                      placeholder="confirm password"
                                      type="password"
                                      onChange={(event) => setConfirmPassword(event.target.value)}
                                    />
                                    {error && error.confirmPassword && <div className='error'>{error.confirmPassword} </div>}
                                  </FormGroup>
                                </Col>
                              </Row>
                              <Row style={{ textAlign: "center" }}>
                                <div className="update ml-auto mr-auto">
                                  <Button
                                    className="btn-round"
                                    color="primary"
                                    type="submit"
                                    onClick={e => registerUser(e)}
                                    style={{ width: "100%" }}
                                    disabled={isLoading}
                                  >
                                    Sign Up
                                </Button>
                                  <span className="signup" onClick={() => navigate()} >
                                    If have an account? Sign In
                                </span>
                                </div>
                              </Row>
                            </Form>

                          </CardBody>
                        </Card>
                      </Col>
                    </Row>
                    <ToastContainer />
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
  Register: (emailId, password, fullName, history) => dispatch(register(emailId, password, fullName, history)),
  UpdateUser: (emailId, password, fullName, history, params) => dispatch(updateUser(emailId, password, fullName, history, params)),
});
export default connect(mapStateToProps, mapDispatchToProps)(SignUp);