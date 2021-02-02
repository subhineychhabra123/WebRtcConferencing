import React from "react";
import { Navbar } from "reactstrap";
import { getfromLocalStorage } from "../../utils/common";

const appLogo = require("../../assets/img/appLogo.png").default

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      dropdownOpen: false,
      color: "transparent",
      notificationAlertToggle: false,
      messageAlertToggle: false,
      userLogoutToggleIcon: false,
      userName: getfromLocalStorage("userDetails") ? getfromLocalStorage("userDetails").fullname : ''
    };
  }

  notificationAlert = (e) => {
    e.preventDefault();
    const { notificationAlertToggle } = this.state;
    this.setState({
      notificationAlertToggle: !notificationAlertToggle,
      messageAlertToggle: false, userLogoutToggleIcon: false
    })
  }

  messageAlert = (e) => {
    e.preventDefault();
    const { messageAlertToggle } = this.state;
    this.setState({ messageAlertToggle: !messageAlertToggle, notificationAlertToggle: false, userLogoutToggleIcon: false })
  }

  userLogoutAlert = (e) => {
    e.preventDefault();
    const { userLogoutToggleIcon } = this.state;
    this.setState({ userLogoutToggleIcon: !userLogoutToggleIcon, messageAlertToggle: false, notificationAlertToggle: false, })
  }

  render() {
    const { notificationAlertToggle, messageAlertToggle, userLogoutToggleIcon, userName } = this.state;
    const { history, hideSearch } = this.props;
    return (
      <div>
        <Navbar
          color={
            this.props.location.pathname.indexOf("full-screen-maps") !== -1
              ? "dark"
              : this.state.color
          }
          expand="lg"
          className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow"
        >
          <button id="sidebarToggleTop" className="btn btn-link d-md-none rounded-circle mr-3">
            <i className="fa fa-bars"></i>
          </button>
          {hideSearch &&
            <a
              className="sidebar-brand d-flex align-items-center justify-content-center"
              href="/admin/dashboard"
            >
              <img src={appLogo} />
            </a>}
          {!hideSearch && <form className="d-none d-sm-inline-block form-inline mr-auto ml-md-3 my-2 my-md-0 mw-100 navbar-search">
            <div className="input-group">
              <input type="text" className="form-control bg-light border-0 small" placeholder="Search for..." aria-label="Search" aria-describedby="basic-addon2" />
              <div className="input-group-append">
                <button className="btn btn-primary" type="button">
                  <i className="fas fa-search fa-sm"></i>
                </button>
              </div>
            </div>
          </form>}


          <ul className="navbar-nav ml-auto">
            <li className="nav-item dropdown no-arrow d-sm-none">
              <a className="nav-link dropdown-toggle" href="#" id="searchDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <i className="fas fa-search fa-fw"></i>
              </a>
              <div className="dropdown-menu dropdown-menu-right p-3 shadow animated--grow-in" aria-labelledby="searchDropdown">
                <form className="form-inline mr-auto w-100 navbar-search">
                  <div className="input-group">
                    <input type="text" className="form-control bg-light border-0 small" placeholder="Search for..." aria-label="Search" aria-describedby="basic-addon2" />
                    <div className="input-group-append">
                      <button className="btn btn-primary" type="button">
                        <i className="fas fa-search fa-sm"></i>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </li>

            <li className={"nav-item dropdown no-arrow mx-1 " + (notificationAlertToggle && "show")}>
              <a className="nav-link dropdown-toggle"
                onClick={(e) => this.notificationAlert(e)} id="alertsDropdown" role="button" data-toggle="dropdown"
                aria-haspopup="true" aria-expanded={notificationAlertToggle ? "true" : "false"} >
                <i className="fas fa-bell fa-fw"></i>
                <span className="badge badge-danger badge-counter">3+</span>
              </a>
              <div className={"dropdown-list dropdown-menu dropdown-menu-right shadow animated--grow-in " + (notificationAlertToggle && "show")}
                aria-labelledby="alertsDropdown">
                <h6 className="dropdown-header">
                  Alerts Center
                </h6>
                <a className="dropdown-item d-flex align-items-center" href="#">
                  <div className="mr-3">
                    <div className="icon-circle bg-primary">
                      <i className="fas fa-file-alt text-white"></i>
                    </div>
                  </div>
                  <div>
                    <div className="small text-gray-500">December 12, 2019</div>
                    <span className="font-weight-bold">A new monthly report is ready to download!</span>
                  </div>
                </a>
                <a className="dropdown-item d-flex align-items-center" href="#">
                  <div className="mr-3">
                    <div className="icon-circle bg-success">
                      <i className="fas fa-donate text-white"></i>
                    </div>
                  </div>
                  <div>
                    <div className="small text-gray-500">December 7, 2019</div>
                    $290.29 has been deposited into your account!
                  </div>
                </a>
                <a className="dropdown-item d-flex align-items-center" href="#">
                  <div className="mr-3">
                    <div className="icon-circle bg-warning">
                      <i className="fas fa-exclamation-triangle text-white"></i>
                    </div>
                  </div>
                  <div>
                    <div className="small text-gray-500">December 2, 2019</div>
                    Spending Alert: We've noticed unusually high spending for your account.
                  </div>
                </a>
                <a className="dropdown-item text-center small text-gray-500" href="#">Show All Alerts</a>
              </div>
            </li>

            <li className={"nav-item dropdown no-arrow mx-1 " + (messageAlertToggle && "show")}>
              <a className="nav-link dropdown-toggle" id="messagesDropdown" role="button" data-toggle="dropdown" aria-haspopup="true"
                onClick={(e) => this.messageAlert(e)} aria-expanded={messageAlertToggle ? "true" : "false"}>
                <i className="fas fa-envelope fa-fw"></i>
                <span className="badge badge-danger badge-counter">7</span>
              </a>
              <div className={"dropdown-list dropdown-menu dropdown-menu-right shadow animated--grow-in " + (messageAlertToggle && 'show')}
                aria-labelledby="messagesDropdown">
                <h6 className="dropdown-header">
                  Message Center
                </h6>
                <a className="dropdown-item d-flex align-items-center" href="#">
                  <div className="dropdown-list-image mr-3">
                    <img className="rounded-circle" src="https://source.unsplash.com/fn_BT9fwg_E/60x60" alt="" />
                    <div className="status-indicator bg-success"></div>
                  </div>
                  <div className="font-weight-bold">
                    <div className="text-truncate">Hi there! I am wondering if you can help me with a problem I've been having.</div>
                    <div className="small text-gray-500">Emily Fowler · 58m</div>
                  </div>
                </a>
                <a className="dropdown-item d-flex align-items-center" href="#">
                  <div className="dropdown-list-image mr-3">
                    <img className="rounded-circle" src="https://source.unsplash.com/AU4VPcFN4LE/60x60" alt="" />
                    <div className="status-indicator"></div>
                  </div>
                  <div>
                    <div className="text-truncate">I have the photos that you ordered last month, how would you like them sent to you?</div>
                    <div className="small text-gray-500">Jae Chun · 1d</div>
                  </div>
                </a>
                <a className="dropdown-item d-flex align-items-center" href="#">
                  <div className="dropdown-list-image mr-3">
                    <img className="rounded-circle" src="https://source.unsplash.com/CS2uCrpNzJY/60x60" alt="" />
                    <div className="status-indicator bg-warning"></div>
                  </div>
                  <div>
                    <div className="text-truncate">Last month's report looks great, I am very happy with the progress so far, keep up the good work!</div>
                    <div className="small text-gray-500">Morgan Alvarez · 2d</div>
                  </div>
                </a>
                <a className="dropdown-item d-flex align-items-center" href="#">
                  <div className="dropdown-list-image mr-3">
                    <img className="rounded-circle" src="https://source.unsplash.com/Mv9hjnEUHR4/60x60" alt="" />
                    <div className="status-indicator bg-success"></div>
                  </div>
                  <div>
                    <div className="text-truncate">Am I a good boy? The reason I ask is because someone told me that people say this to all dogs, even if they aren't good...</div>
                    <div className="small text-gray-500">Chicken the Dog · 2w</div>
                  </div>
                </a>
                <a className="dropdown-item text-center small text-gray-500" href="#">Read More Messages</a>
              </div>
            </li>

            <div className="topbar-divider d-none d-sm-block"></div>

            <li className={"nav-item dropdown no-arrow " + (userLogoutToggleIcon && 'show')}>
              <a className="nav-link dropdown-toggle" id="userDropdown" role="button" data-toggle="dropdown" aria-haspopup="true"
                onClick={(e) => this.userLogoutAlert(e)} aria-expanded={userLogoutToggleIcon ? "true" : "false"}>
                <span className="mr-2 d-none d-lg-inline text-gray-600 small">{userName}</span>
                <img className="img-profile rounded-circle" src="https://img.icons8.com/bubbles/50/000000/user.png" />
              </a>
              <div className={"dropdown-menu dropdown-menu-right shadow animated--grow-in " + (userLogoutToggleIcon && 'show')}
                aria-labelledby="userDropdown">
                <a className="dropdown-item" href="#">
                  <i className="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
                  Profile
                </a>
                <a className="dropdown-item" onClick={() => history.push('/admin/setting')}>
                  <i className="fas fa-cogs fa-sm fa-fw mr-2 text-gray-400"></i>
                  Settings
                </a>
                <a className="dropdown-item" href="#/">
                  <i className="fas fa-list fa-sm fa-fw mr-2 text-gray-400"></i>
                  Activity Log
                </a>
                <div className="dropdown-divider"></div>
                <a className="dropdown-item" data-toggle="modal" data-target="#logoutModal"
                  onClick={() => history.push('/login')}>
                  <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                  Logout
                </a>
              </div>
            </li>
          </ul>
        </Navbar>
      </div>
    );
  }
}

export default Header;
