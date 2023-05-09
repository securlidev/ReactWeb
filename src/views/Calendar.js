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
import React, {useState, useEffect} from "react";
// react component used to create a calendar with events on it
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
// dependency plugin for react-big-calendar
import moment from "moment";
// react component used to create alerts
import SweetAlert from "react-bootstrap-sweetalert";

// reactstrap components
import { Card, CardBody, Row, Col, CardHeader, CardTitle,
CardFooter,
Button,
Modal,
ModalBody,
Collapse
 } from "reactstrap";

import { events } from "variables/general.js";

import Axios from 'axios';

import GaugeChart from 'react-gauge-chart'



const localizer = momentLocalizer(moment);

const Calendar = () => {
  const [isLoading, setLoading] = useState(true);
  

  const [pci, setpci] = useState([]);
  const [pciModal, setpciModal] = useState([]);

  const [rehar, setrehar] = useState(false);
  //hard coding the data for demo purpose
  const pci8 = [
    "8.1 User Identification Management",
    "8.2 User Authentication Management",
    "8.3 Incorporating Multi-factor Authentication",
    "8.4 Documenting and Communicating Authentication Policies and Procedures", 
    "8.5 Use of Group, Shared, or Generic Authentication Methods",
    "8.6 Use of Other Authentication Mechanisms",
    "8.7 Access to Databases Containing Cardholder Data",
    "8.8 Policies and Procedures"
  ];
  const [pci8open, openpci8] = useState([false, false]);


  useEffect(() => {
    Axios.get('http://localhost:3001/api/get/pci').then((response) => {
      var temppci = [];
      var pm = [];
      for (var i in response.data[0]){
        if (i != "Company")
          temppci.push([i, response.data[0][i]]);
          pm.push(false);
      }
      setpciModal(pm);
      setpci(temppci);
      setLoading(false);
    });
  }, []);

  if (isLoading) {
    return (
    <div className="App">Loading...</div>)
  }

  return (
    <>
      <div className="content">
        
        <Row>
          <Col lg="3"></Col>
          <Col lg="6">
            {/* overview PCI */}
            <Card className="card-chart mx-auto " style={{width: '31rem'}}>
              <CardHeader>
                <CardTitle tag="h1" className="text-center">PCI</CardTitle>
              </CardHeader>
              <GaugeChart 
                percent={0.153} //the number shown on the gauge chart
                nrOfLevels={5} //the number of segments op the gauge chart
                needleColor= "#f0625d" 
                colors={["red","green"] 
                }/>
            </Card>
          </Col>
          <Col lg="3"></Col>
        </Row>
        
         

        <Row >
          {/* small gauge chart */}
          {pci.map((val, index) => {
            return (
              <Col lg="2" md="4">
                <Card className="card-stats" style={{height: "100%"}}>
                  <CardHeader>
                    <CardTitle tag="h6">{val[0]}</CardTitle>
                  </CardHeader>
                  <GaugeChart 
                    percent={val[1]/100} 
                    nrOfLevels={20} 
                    needleColor= "#f0625d" 
                    colors={["#7EE081","#3c59e8"]}/>
                  <CardFooter>
                    <div className="text-center">
                      <Button size="sm" color={"info"} onClick={() => {
                        var temp = pciModal;
                        temp[index] = !temp[index];
                        setpciModal(temp);
                        setrehar(!rehar);
                      }}>Info</Button>
                    </div>
                  </CardFooter>
                </Card>
              </Col>
            );
          })}     
        </Row>

        {pciModal.map((val, index) => {
          return (
            <Modal isOpen={pciModal[index]} size="small" toggle={() => {
              var temp = pciModal;
              temp[index] = !temp[index];
              setpciModal(temp);
              openpci8([false, false]);
              setrehar(!rehar);
            }} >
              <div className="modal-header justify-content-center">
                <button
                  aria-hidden={true}
                  className="close"
                  data-dismiss="modal"
                  type="button"
                  onClick={() => {
                    var temp = pciModal;
                    temp[index] = !temp[index];
                    setpciModal(temp);
                    openpci8([false, false]);
                    setrehar(!rehar);
                  }}
                >
                  <i className="tim-icons icon-simple-remove" />
                </button>
                <h6 className="title title-up">Task</h6>
              </div>

              <ModalBody >
                {pci8.map((val, index) => {
                  const haha = index == 0 ? "(Removing/disabling Inactive User Accounts)" : "";
                  return(
                  <Card className="card-plain">
                    <CardHeader role="tab">
                      <a
                        aria-expanded={pci8open[index]}
                        href="#pablo"
                        data-parent="#accordion"
                        data-toggle="collapse"
                        onClick={(e) => {
                          var temp = pci8open;
                          temp[index] = !temp[index];
                          openpci8(temp);
                          setrehar(!rehar);
                        }}
                      >
                          
                          <CardTitle  tag="h4" className="text-warning">
                          <small>{val+ " "}</small>
                          <i className="tim-icons icon-minimal-down" />
                          
                          </CardTitle>
                        
                      </a>
                    </CardHeader>
                    <Collapse role="tabpanel" isOpen={pci8open[index]}>
                      <CardBody>
                        <div className="text-info">
                          <h6 className="text-danger">{haha}</h6>
                        </div>
                        <CardTitle  tag="h4" className="text-danger">
                        Action Items:
                        </CardTitle>
                          <p>
                          1) Verify that inactive user accounts are removed or disabled within a defined period (Period of inactivity before disabling may vary depending on framework).
                          </p>  
                          <p>
                          2) Verify that account usage is monitored, and notifications are sent to users/managers when accounts are about to expire or have expired. 
                          </p>
                          <p>
                          3) Verify this control requirement is documented and known by all parties.  
                          </p>
                          
                          
                          <CardTitle tag="h4" className="text-danger">
                          Recommendations:
                          </CardTitle>
                          <p>
                          Ensure 'Accounts: Administrator account status' is set to 'Disabled' (MS only)
                          </p>
                          <Button href="http://cis.securli.hk/win2019.html#detail-w107aae1459d994" target="_blank">Details</Button>
                          
                          <p>
                          Ensure 'Accounts: Guest account status' is set to 'Disabled' (MS only)
                          </p>
                          <Button href="http://cis.securli.hk/win2019.html#detail-w107aae1459d996" target="_blank">Details</Button>
                          <hr/>
                      </CardBody>
                    </Collapse>
                  </Card>
                  )
                  
                })}
              </ModalBody>
            </Modal>
          )
        })}
            
      </div>
    </>
  );
};

export default Calendar;
