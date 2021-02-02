import React from "react";
import { NavLink } from "react-router-dom";
import PerfectScrollbar from "perfect-scrollbar";
const appLogo = require("../../assets/img/appLogo.png").default

var ps;

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.activeRoute.bind(this);
    this.sidebar = React.createRef();
    this.state = {
      sidebarToggle: false
    }
  }
  // verifies if routeName is the one active (in browser input)
  activeRoute(routeName) {
    return this.props.location.pathname.indexOf(routeName) > -1 ? "active" : "";
  }
  componentDidMount() {
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(this.sidebar.current, {
        suppressScrollX: true,
        suppressScrollY: false,
      });
    }
  }
  componentWillUnmount() {
    if (navigator.platform.indexOf("Win") > -1) {
      ps.destroy();
    }
  }
  render() {
    const { sidebarToggle } = this.state;
    return (
      <ul
        className={!sidebarToggle ? "navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" :
          "navbar-nav bg-gradient-primary sidebar sidebar-dark accordion toggled"}
        id="accordionSidebar"
      >
        <a
          className="sidebar-brand d-flex align-items-center justify-content-center"
          href="/admin/dashboard"
        >
          <img src={appLogo}  />
        </a>

        <div ref={this.sidebar} className="custom-flex">
          {this.props.routes.map((prop, key) => {
            return (
              <li
                className={
                  this.activeRoute(prop.path) +
                  (prop.pro ? " active-pro nav-item" : " nav-item")
                }
                key={key}
              >
                <NavLink
                  to={prop.layout + prop.path}
                  className=" nav-link"
                  activeClassName="active"
                >
                  <i className={prop.icon} />
                  <span>{prop.name}</span>
                </NavLink>
              </li>
            );
          })}
          <div className="text-center d-none d-md-inline">
            <button
              className="rounded-circle border-0"
              id="sidebarToggle"
              onClick={() => this.setState({ sidebarToggle: !sidebarToggle })}>
            </button>
          </div>
        </div>
        
      </ul>
    );
  }
}

export default Sidebar;
