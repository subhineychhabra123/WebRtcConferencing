import React from "react";
import PerfectScrollbar from "perfect-scrollbar";
import { Route, Switch } from "react-router-dom";

import DemoNavbar from "../component/Navbars/DemoNavbar.jsx";
import Footer from "../component/Footer/Footer.jsx";
import Sidebar from "../component/Sidebar/Sidebar.jsx";
import FixedPlugin from "../component/FixedPlugin/FixedPlugin.jsx";
import { Setting } from '../component';

import routes from "../routes";

var ps;

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      backgroundColor: "black",
      activeColor: "info"
    };
    this.mainPanel = React.createRef();
  }
  componentDidMount() {
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(this.mainPanel.current);
      document.body.classList.toggle("perfect-scrollbar-on");
    }
  }
  componentWillUnmount() {
    if (navigator.platform.indexOf("Win") > -1) {
      ps.destroy();
      document.body.classList.toggle("perfect-scrollbar-on");
    }
  }
  componentDidUpdate(e) {
    if (e.history.action === "PUSH") {
      this.mainPanel.current.scrollTop = 0;
      document.scrollingElement.scrollTop = 0;
    }
  }
  handleActiveClick = color => {
    this.setState({ activeColor: color });
  };
  handleBgClick = color => {
    this.setState({ backgroundColor: color });
  };
  render() {
    return (
      <div id="wrapper">
        <Sidebar
          {...this.props}
          routes={routes}
          bgColor={this.state.backgroundColor}
          activeColor={this.state.activeColor}
        />
        <div id="content-wrapper" className="d-flex flex-column">
          <div id="content">
            <div className="main-panel" ref={this.mainPanel} style={{ height: '100%' }}>
              <DemoNavbar {...this.props} />
              <Switch>
                {routes.map((prop, key) => {
                  return (
                    <Route
                      path={prop.layout + prop.path}
                      component={prop.component}
                      key={key}
                    />
                  );
                })}
                 <Route path='/admin/setting' component={Setting} />
              </Switch>
              {/* <Footer fluid /> */}
            </div>
            {/* <FixedPlugin
              bgColor={this.state.backgroundColor}
              activeColor={this.state.activeColor}
              handleActiveClick={this.handleActiveClick}
              handleBgClick={this.handleBgClick}
            /> */}
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;
