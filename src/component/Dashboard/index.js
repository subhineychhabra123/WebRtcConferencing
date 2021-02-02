import React, { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import Meeting from '../Meeting';
import Recording from '../Recording';
import Contact from '../Contact';
// import VideoChat from '../VideoChat';
import './dashboard.css';
import { Card, CardHeader, CardBody, CardTitle, Row, Col, Table, } from "reactstrap";

export default function DashBoard(props) {
  const { history, navData, location } = props;
  const [showNav, setShowNav] = useState(false);

  const customStyle = showNav ? { width: '71%', float: 'right' } : {};

  const handleChangeLink = () => {
    if (location && location.pathname) {
      const toggleComp = location.pathname.split('/')[2];
      switch (toggleComp) {
        case 'meeting':
          return <Meeting
            history={history}
          // handleMeetingResponse={handleMeetingResponse}
          />
        case 'recording': return <Recording />
        case 'contact': return <Contact />
        case 'Logout':
        default: return;
      }
    }
  }

  return (
    <div className="content">
      {/* <Row>
        <Col md="12">
          <Card>
            <CardHeader>
              <CardTitle tag="h4">Meetings</CardTitle>
              <button type="button" className="btn btn-primary  ">Add New</button>
            </CardHeader>
            <CardBody>
              <Table>
                <tbody>
                  <tr>
                    <td>Meeting with Technical Leads</td>
                    <td>Stopped</td>
                    <td><button type="button" className="btn btn-primary  ">start</button></td>
                  </tr>
                  <tr>
                    <td>Meeting with Hiring Agencies</td>
                    <td>Running<small> 2:12:00</small></td>
                    <td><button type="button" className="btn btn-primary ">stop</button></td>
                  </tr>
                </tbody>
              </Table>
            </CardBody>
          </Card>
        </Col>
      </Row>
     */}
    </div>
  )
}