import React, { useState, useEffect } from 'react';
import { Button, Card, CardHeader, CardBody, CardFooter, CardTitle, FormGroup, Form, Input, Row, Col } from "reactstrap";
import { connect } from 'react-redux';
import Cryptr from 'cryptr';
import { ToastContainer } from 'react-toastify';
import { login } from '../../service/service';
import toast from '../common/toast';
import './login.css';
import { removeFromLocalStorage, getfromLocalStorage, validateToken } from '../../utils/common';
const appLogo = require("../../assets/img/appLogo.png").default


function LoginScreen(props) {
  const { history, Login, isLoading } = props;
  const [emailId, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [disable, disableEmail] = useState(false);
  const [error, setError] = useState({ email: '', password: '' });
  const cryptr = new Cryptr('myTotalySecretKey');
  const [params, setParams] = useState([]);

  useEffect(() => {
    const parameter = new URLSearchParams(history.location.search).get("data");
    const token = getfromLocalStorage('token');
    const isValid = validateToken(token, history)
    if (parameter !== null) {
      const decryptedString = cryptr.decrypt(parameter);
      const arr = decryptedString.split(',');
      if (arr.length === 4 && new Date(arr[3]) < new Date()) {
        toast("Link has been expired. Please request User to genrate a new link", "warning")
      }
      if (arr[2] == 0) {
        history.push('/register?data=' + parameter)
      } else if (arr[2] == 1) {
        if (token !== null && isValid) {
          const params = { meetingId: arr[0] }
          history.push(`/admin/meeting`, params);
        } else {
          disableEmail(true)
          setEmail(arr[1]);
          setParams(arr);
        }
      }
    } else {
      removeFromLocalStorage("userDetails");
      removeFromLocalStorage("token");
      history.push('/');
    }
  }, [])

  const validate = () => {
    const expression = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
    if (!emailId || !password) {
      if (!emailId) setError(error => ({ ...error, email: 'please enter email.' }))
      if (!password) setError(error => ({ ...error, password: 'please enter password.' }))
      return false
    } else if (!expression.test(String(emailId).toLowerCase())) {
      setError(error => ({ ...error, email: 'please enter a valid email.' }))
      return false
    }
    setError(error => ({ ...error, email: '', password: '' }))
    return true;
  }

  const signIn = (e) => {
    e.preventDefault();
    if (validate()) {
      Login(emailId, password, history, params)
    }
  }

  const navigate = () => {
    var parameter = new URLSearchParams(history.location.search).get("data");
    parameter != null ? history.push('/register?data=' + parameter) : history.push('/register')
  }

  return (
    <div className="login-background">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-6 col-lg-6 col-md-8">
            <div className="card o-hidden border-0 shadow-lg my-5">
              <div className="card-body p-0">
                <div className="p-5">
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
                                  placeholder="Email ID"
                                  disabled={disable} value={emailId}
                                  type="text"
                                  onChange={(event) => setEmail(event.target.value.toLowerCase())}
                                />
                                {error && error.email && <div className='error'>{error.email} </div>}
                              </FormGroup>
                              <FormGroup>
                                <label>Password</label>
                                <Input
                                  placeholder="password"
                                  type="password"
                                  onChange={(event) => setPassword(event.target.value)}
                                />
                                {error && error.password && <div className='error'>{error.password} </div>}
                                <div style={{ textAlign: "right" }}> <span className="signup" onClick={() => history.push('/forgetpassword')} >
                                  Forget Password
                                   </span>
                                </div>
                              </FormGroup>
                              <div className="update ml-auto mr-auto text-center">
                                <Button
                                  className="btn-round"
                                  color="primary"
                                  type="submit"
                                  onClick={e => signIn(e)}
                                  style={{ width: "100%" }}
                                  disabled={isLoading}
                                >
                                  Sign In
                                  </Button>
                                <span className="signup" onClick={() => navigate()} >
                                  Don't have an account? Sign up
                                   </span>
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
  );
}
const mapStateToProps = state => {
  const isLoading = state.userDetail.get('isLoading');
  return {
    isLoading
  }
};
const mapDispatchToProps = dispatch => ({
  Login: (emailId, password, history, params) => dispatch(login(emailId, password, history, params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
