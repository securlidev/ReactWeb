/*!

=========================================================
* Black Dashboard PRO React - v1.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/black-dashboard-pro-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
// react plugin used to create charts
import { Line, Bar, Pie } from "react-chartjs-2";
// reactstrap components
import { Card, CardHeader, CardBody, CardTitle, Row, Col,
  CardFooter,
  Table,
  Button,
  ModalBody,
  Modal
} from "reactstrap";

import SortingTable from "components/SortingTable/SortingTable.js";

// core components

import Axios from 'axios';
import NotificationAlert from "react-notification-alert";


const Charts = () => {

  const [isLoading, setLoading] = React.useState(true);
  const [data, setData] = React.useState([]);
  const [modalO, setmo] = React.useState([]);
  const [re, setre] = React.useState(false);

  const notificationAlertRef = React.useRef(null);
  const notify = (place, msg) => {
    var color = Math.floor(Math.random() * 5 + 1);
    var type;
    switch (color) {
      case 1:
        type = "primary";
        break;
      case 2:
        type = "success";
        break;
      case 3:
        type = "danger";
        break;
      case 4:
        type = "warning";
        break;
      case 5:
        type = "info";
        break;
      default:
        break;
    }
    var options = {};
    options = {
      place: place,
      message: (
        <div>
          <div>
            {msg}
          </div>
        </div>
      ),
      type: type,
      icon: "tim-icons icon-bell-55",
      autoDismiss: 7,
    };
    notificationAlertRef.current.notificationAlert(options);
  };

  React.useEffect(() => {

    Axios.get('http://localhost:3001/api/get').then((response) => {
      var temp = [];
      var openm = [];
      for (var i in response.data){
        if (response.data[i]["Alert Level"] == "Critical"){
          temp.push({type: response.data[i]["Alert Type"], recommendation: response.data[i]["Recommendations"]});
          openm.push(false);
        }
      }
      setData(temp);
      setmo(openm);
      setLoading(false);
    });

  }, []);

  if (isLoading) {
    return (<div>Loading...</div>);
  }

  return (
    <>
      {/* notification */}
      <div className="rna-container">
        <NotificationAlert ref={notificationAlertRef} />
      </div>
      <div className="content">
        <Row>
          <Col lg="2"></Col>
            <Col lg="8">
              <Card>
                <CardHeader>
                  <CardTitle tag="h2" className="text-danger">
                    {/* title */}
                    Critical Incident
                  </CardTitle>
                </CardHeader>
                
                <CardBody>
                  <Table responsive>
                    <thead className="text-primary">
                      <tr>
                        {/* column heading */}
                        <th>Task</th>
                        <th className="text-center">Assign</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* one data one row */}
                      {data.map((val, index) => {
                        return (
                            <tr>
                              <td>{"#" + (index+1) + " " + val["type"]}</td>
                              <td className="text-center"><Button color="warning" onClick={
                                () => {
                                  var temp = modalO;
                                  temp[index] = !temp[index];
                                  setmo(temp);
                                  setre(!re);
                                }
                              }>Assign</Button></td>
                            </tr>
                        )
                      })}
                    </tbody>
                  </Table>
                </CardBody>
              </Card>
            </Col>
          <Col lg="2"></Col>
        </Row>
            {/* the pop out window for each data */}
            {data.map((val, index) => {
              return (
                <Row>
                  <Col className="text-center" md="12">
                    <Modal isOpen={modalO[index]} toggle={() => {
                      var temp = modalO;
                      temp[index] = !temp[index];
                      setmo(temp);
                      setre(!re);
                    }}>
                      <div className="modal-header justify-content-center">
                        <button
                          aria-hidden={true}
                          className="close"
                          data-dismiss="modal"
                          type="button"
                          onClick={() => {
                            var temp = modalO;
                            temp[index] = !temp[index];
                            setmo(temp);
                            setre(!re);
                          }}
                          >
                          <i className="tim-icons icon-simple-remove" />
                        </button>
                        <h6 className="title title-up">Assign Task</h6>
                      </div>

                      <ModalBody>
                        <div>
                          {/* recommendation text */}
                        {val["recommendation"]}
                        </div>
                        <hr/>
                        <Card>
                        <CardBody>
                          {/* assign person in charge, not yet finish the complete functionality */}
                          <CardTitle>{"Name: " + "(choose a person to follow)"}</CardTitle>
                          {/* due date, simply add 3 days or 1 day from the current day */}
                          <CardTitle>{"Due Date: " + 
                                      "" }
                          </CardTitle>
                        </CardBody>
                        </Card>
                        
                        
                      </ModalBody>
                      <div className="modal-footer">
                        <Button
                          color="default"
                          type="button"
                          onClick={() => {
                            // anything u want to happen after clicking the confirm button
                            var temp = modalO;
                            temp[index] = !temp[index];
                            setmo(temp);
                            setre(!re);
                            //pop the notification, first para is the place where the noti pop out on screen, 
                            //e.g. t = top, b = bottom, l = left, r = right, 
                            //e.g tr = top right
                            //second para is the notification message
                            notify("tc", "Task [" + val["type"] + "] is assigned to (someone).");
                          }}
                          
                        >
                          Confirm
                        </Button>
                        <Button
                          color="danger"
                          data-dismiss="modal"
                          type="button"
                          onClick={() => {
                            //anything u want to happen after clicking the close buton
                            var temp = modalO;
                            temp[index] = !temp[index];
                            setmo(temp);
                            setre(!re);
                          }}
                        >
                          Close
                        </Button>
                      </div>

                    </Modal>
                  </Col>
                </Row>
              )
            })}


        
        
      </div>
    </>
  );
};

export default Charts;
