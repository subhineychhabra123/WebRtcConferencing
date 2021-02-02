import Login from "../src/component/Login/index"
import Dashboard from "../src/component/Dashboard/index";
import Meeting from "../src/component/Meeting/index"
import Contacts from "../src/component/Contact/index"
import Recordings from "../src/component/Recording/index";

var routes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "fas fa-fw fa-tachometer-alt",
    component: Dashboard,
    layout: "/admin"
  },
  {
    path: "/meeting",
    name: "Meetings",
    icon: "fa fa-users",
    component: Meeting,
    layout: "/admin"
  }, {
    path: "/recordings",
    name: "Recordings",
    icon: "fa fa-video-camera",
    component: Recordings,
    layout: "/admin"
  },
  {
    path: "/contacts",
    name: "Contacts",
    icon: "fa fa-vcard",
    component: Contacts,
    layout: "/admin"
  }
];
export default routes;
