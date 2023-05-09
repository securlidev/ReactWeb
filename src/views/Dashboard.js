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
import React, {useEffect, useState} from "react";
// nodejs library that concatenates classes

// import classNames from "classnames";

// react plugin used to create charts
import { Line, Bar, Doughnut, Radar } from "react-chartjs-2";
// react plugin for creating vector maps

// import { VectorMap } from "react-jvectormap";

// import Notification from "views/components/Notifications.js";
// reactstrap components
import {
  Button,
  //ButtonGroup,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  // DropdownToggle,
  // DropdownMenu,
  // DropdownItem,
  // UncontrolledDropdown,
  // Label, 
  // FormGroup,
  // Input,
  // Progress,
  // Table,
  Row,
  Col,
  // UncontrolledTooltip,
  Modal,
  ModalBody,
  Collapse,
  NavItem,
  NavLink,
  Nav,
  Navbar
  
} from "reactstrap";

// core components
import {
  // chartExample1,
  chartExample2,
  chartExample3,
  chartExample4,
  } from "variables/charts.js";

import GaugeChart from 'react-gauge-chart'

import Axios from 'axios';

import SortingTable from "components/SortingTable/SortingTable.js";



const Dashboard = () => {

  
  const [data, setData] = useState([]);
  //the state of querying data from mysql
  const [isLoading, setLoading] = useState(true);

  const [criticalData, setCriticalData] = useState([]);
  const [criticalCollapseOpen, setCriticalCollapseOpen] = useState([]);
  const [criticalModal, setCriticalModal] = useState([]);
  const toggleCriticalModal = (index) => {
    var temp = criticalModal;
    temp[index] = !temp[index];
    setCriticalModal(temp);
  };
  const [idk, setidk] = useState(false);

  const [majorData, setMajorData] = useState([]);
  const [majorIncidentCount, setMajorIncidentCount] = useState(0);

  const [complianceData, setComplianceData] = useState([]);
  
  const [criticalRisk, setCriticalRisk] = useState([]);
  const [majorRisk, setMajorRisk] = useState([]);

  const [majorBarchartData, setMajorBarchartData] = useState([]);
  const [majorBarchartLabel, setMajorBarchartLabel] = useState([]);

  const [criticalBarchartData, setCriticalBarchartData] = useState([]);
  const [criticalBarchartLabel, setCriticalBarchartLabel] = useState([]);

  


  useEffect(() => {
    var loading1 = false;
    var loading2 = false;
    var loading3 = false;

    //getting data for Critical Incident table and Major Incident table
    Axios.get('http://localhost:3001/api/get').then((response) => {
      //initial empty array
      var d = [];
      var cd = [];
      var md = [];
      var mit = {};
      var cco = [];
      var cm = [];
      var majorBarData = [];
      var majorBarLabel = [];
      var criticalBarData = [];
      var criticalBarLabel = [];
      var cit = {};

      for (var i in response.data){
        d.push(response.data[i]);
        //critical incident data
        if (response.data[i]["Alert Level"] == "Critical"){
          cd.push(response.data[i]);
          cco.push(false);
          cm.push(false);
          if (!cit[response.data[i]["Alert Type"]])
            cit[response.data[i]["Alert Type"]] = 0;
          cit[response.data[i]["Alert Type"]] += 1;
        }
        //major incident data
        if (response.data[i]["Alert Level"] == "Major"){
          md.push(response.data[i]);
          if (!mit[response.data[i]["Alert Type"]]){
            mit[response.data[i]["Alert Type"]] = 0;
          }
          mit[response.data[i]["Alert Type"]] += 1;
        }
      }
      var r = [];
      for (var i in mit)
        r.push([i, mit[i]]);
      
      var r1 = [];
      for (var i in r){
        var temp = 
        {
          data: [
            {text: r[i][0]},
            {text: r[i][1], className: "text-center"},
          ]
        }
        r1.push(temp);
      }
      //debug//////////////////
      console.log(mit);
      for (var i in mit){
        majorBarLabel.push(i);
        majorBarData.push(mit[i]);
      }
      console.log(majorBarLabel);
      console.log(majorBarData);
      console.log(cit);
      for (var i in cit){
        criticalBarLabel.push(i);
        criticalBarData.push(cit[i]);
      }
      console.log(criticalBarLabel);
      console.log(criticalBarData);
      ////////////////////////

      //set all required data
      setData(d);
      setCriticalData(cd);
      setMajorData(r1);
      setMajorIncidentCount(md.length);
      setCriticalCollapseOpen(cco);
      setCriticalModal(cm);
      setMajorBarchartData(majorBarData);
      setMajorBarchartLabel(majorBarLabel);
      setCriticalBarchartData(criticalBarData);
      setCriticalBarchartLabel(criticalBarLabel);


      //finish loading 
      loading1 = true;
      if (loading1 && loading2 && loading3) {
        //after setting all data, finish loading
        setLoading(false);
      }
    });

    //getting data for compliance rating
    Axios.get('http://localhost:3001/api/get/compliances').then((response) => {
      //initial empty array
      var compd = [];
      //getting compliance data for radar chart
      for (var i in response.data){
        compd.push(response.data[i]);
      }

      //set data
      setComplianceData(compd);

      //finish loading
      loading2 = true;
      if (loading1 && loading2 && loading3){
        //after setting all data, finish loading
        setLoading(false);
      }
    });

    //getting data for risk trending
    Axios.get('http://localhost:3001/api/get/risk').then((response) => {
      //initial empty array
      var cr = [];
      var mr = [];

      //getting data for risk trending chart
      for (var i in response.data){
        if (response.data[i]["Alert Level"] == "Critical"){
          cr.push(response.data[i]["freq"]);
        } else if (response.data[i]["Alert Level"] == "Major"){
          mr.push(response.data[i]["freq"]);
        }
      }
      //fake data for critical incident on December
      cr.push(1 );

      //set data 
      setCriticalRisk(cr);
      setMajorRisk(mr);

      //finish loading
      loading3 = true;
      if (loading1 && loading2 &loading3)
        setLoading(false);
    });

  }, []);

  //During the query process, "loading..." will be shown on the left top conrner on the website
  if (isLoading) {
    return (
    <div className="App">Loading...</div>)
      
  }
  
  //the dashboard layout
  return (
    <>
      
      <div className="content">
        
        {/* first row */}
        <Row>
          <Card>
            <Row>
              {/* Company Compliance Risk Level */}
              <Col lg="4"> 
                <Card  className="card-chart" >
                  <CardHeader>
                    <CardTitle tag="h3">
                      <i className="tim-icons icon-bulb-63 text-success" /> Company Compliance Risk Level
                      </CardTitle>
                  </CardHeader>
                  <CardBody>
                    <GaugeChart 
                    percent={1-0.81} 
                    nrOfLevels={3} needleColor= "#827cf7"
                    colors={["green","yellow", "#f24141"]}
                    formatTextValue={(value) => {
                      if (1-value < 33.3)
                        return ('Low')
                      else if (1-value < 66.6)
                        return ('Medium')
                      else if (1-value <= 100)
                        return ('High')
                      else return ('ERROR')
                      
                    }}
                    />
                  </CardBody>
                </Card>
              </Col>
              {/* Compliance Risk Rating */}  
              <Col lg="4">
                <Card  className="card-chart" >
                  <CardHeader>
                    <CardTitle tag="h3"><i className="tim-icons icon-bell-55 text-info" /> Compliance Risk Rating</CardTitle>
                  </CardHeader>
                  <CardBody>
                    <Radar 
                      data={(canvas) => {
                        let ctx = canvas.getContext("2d");

                        let gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);
                    
                        gradientStroke.addColorStop(1, "rgba(29,140,248,0.2)");
                        gradientStroke.addColorStop(0.4, "rgba(29,140,248,0.0)");
                        gradientStroke.addColorStop(0, "rgba(29,140,248,0)"); //blue colors
                    
                        return {
                          labels: ["CIS", "GDPR", "HKMA", "NIST", "PCI", "SFC"],
                          datasets: [
                            {
                              label: "Data",
                              fill: true,
                              backgroundColor: gradientStroke,
                              borderColor: "#1f8ef1",
                              borderWidth: 3,
                              borderDash: [],
                              borderDashOffset: 0.0,
                              pointBackgroundColor: "#1f8ef1",
                              pointBorderColor: "rgba(255,255,255,0.2)",
                              pointHoverBackgroundColor: "#1f8ef1",
                              pointBorderWidth: 6,
                              pointHoverRadius: 4,
                              pointHoverBorderWidth: 15,
                              pointRadius: 6,
                              data: [complianceData[0].CIS, complianceData[0].GDPR, 
                              complianceData[0].HKMA, complianceData[0].NIST, 
                              complianceData[0].PCI, complianceData[0].SFC]
                            },
                          ],
                        };
                      }}
                      options={{
                        legend: {
                          display: false,
                        },
                        responsive: true,
                        scale: {
                          ticks: {
                            beginAtZero: true,
                            max: 100,
                            stepSize: 20,
                            fontColor: "#9d9ea3",
                            backdropColor: "rgba(255,255,255,0)"
                          },
                          gridLines: {
                            color: "#9d9ea3"
                          },
                          pointLabels: {
                            fontColor: "#9d9ea3",
                            fontSize: 12
                          },
                          angleLines: {
                            color: "#9d9ea3"
                          }
                        }
                      }}
                    />
                    

                  </CardBody>
                  <CardFooter>
                    <div className="text-center">
                      <Button color="info" size="sm">CIS</Button>
                      <Button color="info" size="sm">GDPR</Button>
                      <Button color="info" size="sm">HKMA</Button>
                      <Button color="info" size="sm">NIST</Button>
                      <Button color="info" size="sm" href="http://localhost:3000/admin/pci">PCI</Button>
                      <Button color="info" size="sm">SFC</Button>
                    </div>
                  </CardFooter>
                </Card>
              </Col>
              {/* Risk Trending */}
              <Col lg="4" >
                <Card className="card-chart" >
                  <CardHeader>
                    <CardTitle tag="h3">
                      <i className="tim-icons icon-sound-wave text-primary" /> Risk Trending
                    </CardTitle>
                  </CardHeader>
                  <CardBody>
                    <div className="chart-area">
                      <Line 
                        data={(canvas) => {
                                let ctx = canvas.getContext("2d");
                                
                                let gradientStroke1 = ctx.createLinearGradient(0, 230, 0, 50);

                                gradientStroke1.addColorStop(1, "rgba(29,140,248,0.2)");
                                gradientStroke1.addColorStop(0.4, "rgba(29,140,248,0.0)");
                                gradientStroke1.addColorStop(0, "rgba(29,140,248,0)"); //blue colors

                                let gradientStroke2 = ctx.createLinearGradient(0, 230, 0, 50);

                                gradientStroke2.addColorStop(1, "rgba(72,72,176,0.1)");
                                gradientStroke2.addColorStop(0.4, "rgba(72,72,176,0.0)");
                                gradientStroke2.addColorStop(0, "rgba(119,52,169,0)"); //purple colors

                                return {
                                  labels: ["SEP", "OCT", "NOV", "DEC"],
                                  datasets: [
                                    {
                                      label: "Critical",
                                      fill: true,
                                      backgroundColor: gradientStroke1,
                                      borderColor: "#d048b6",
                                      borderWidth: 2,
                                      borderDash: [],
                                      borderDashOffset: 0.0,
                                      pointBackgroundColor: "#d048b6",
                                      pointBorderColor: "rgba(255,255,255,0)",
                                      pointHoverBackgroundColor: "#1f8ef1",
                                      pointBorderWidth: 20,
                                      pointHoverRadius: 4,
                                      pointHoverBorderWidth: 15,
                                      pointRadius: 4,
                                      data: criticalRisk //data for the critical line
                                    },
                                    {
                                      label: "Major",
                                      fill: true,
                                      backgroundColor: gradientStroke2,
                                      borderColor: "#1f8ef1",
                                      borderWidth: 2,
                                      borderDash: [],
                                      borderDashOffset: 0.0,
                                      pointBackgroundColor: "#1f8ef1",
                                      pointBorderColor: "rgba(255,255,255,0)",
                                      pointHoverBackgroundColor: "#1f8ef1",
                                      pointBorderWidth: 20,
                                      pointHoverRadius: 4,
                                      pointHoverBorderWidth: 15,
                                      pointRadius: 4,
                                      data: majorRisk //data for the major line
                                    }

                                  ],
                                };
                              }}
                        options={{
                          maintainAspectRatio: false,
                          legend: {
                            display: true,
                          },
                          tooltips: {
                            backgroundColor: "#f5f5f5",
                            titleFontColor: "#333",
                            bodyFontColor: "#666",
                            bodySpacing: 4,
                            xPadding: 12,
                            mode: "nearest",
                            intersect: 0,
                            position: "nearest",
                          },
                          responsive: true,
                          scales: {
                            yAxes: [
                              {
                                barPercentage: 1.6,
                                gridLines: {
                                  drawBorder: false,
                                  color: "rgba(29,140,248,0.0)",
                                  zeroLineColor: "transparent",
                                },
                                ticks: {
                                  padding: 20,
                                  fontColor: "#9a9a9a",
                                },
                              },
                            ],
                            xAxes: [
                              {
                                barPercentage: 1.6,
                                gridLines: {
                                  drawBorder: false,
                                  color: "rgba(29,140,248,0.1)",
                                  zeroLineColor: "transparent",
                                },
                                ticks: {
                                  padding: 20,
                                  fontColor: "#9a9a9a",
                                },
                              },
                            ],
                          },
                        }}
                      />
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Card>
        </Row>

        {/* second row */}
        <Row>
          {/* Critical Incidents */}
          <Col lg="6" md="6">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col xs="5">
                    <div className="info-icon text-center icon-danger">
                      <i className="tim-icons icon-alert-circle-exc" />
                      
                    </div>
                  </Col>
                  <Col xs="7">
                  
                    <div className="numbers">
                    <h1 className="card-title">Critical Incidents</h1>
                      <CardTitle tag="h2">{criticalData.length}</CardTitle>
                    </div>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
                <hr/>
                <Col className="mb-5" md="12">
                  <Card>
                    
                    <div
                      aria-multiselectable={true}
                      className="card-collapse"
                      id="accordion"
                      role="tablist"
                    >
                      {criticalData.map((val, index) => {
                        var openArray = criticalCollapseOpen;
                        return (
                          <div>
                            <Row>
                              <Col className="text-center" md="12">
                                {/* Classic Modal */}
                                <Modal isOpen={criticalModal[index]} toggle={() => {
                                  toggleCriticalModal(index);
                                  setidk(!idk);
                                }}>
                                  <div className="modal-header justify-content-center">
                                    <button
                                      aria-hidden={true}
                                      className="close"
                                      data-dismiss="modal"
                                      type="button"
                                      onClick={() => {
                                        toggleCriticalModal(index);
                                        setidk(!idk);
                                      }}
                                    >
                                      <i className="tim-icons icon-simple-remove" />
                                    </button>
                                    <h6 className="title title-up">Recommendation</h6>
                                  </div>
                                  <ModalBody className="text-center">
                                    <p>
                                      {val.Recommendations}
                                    </p>
                                  </ModalBody>
                                  <div className="modal-footer">
                                    <Button
                                      color="info"
                                      type="button"
                                      onClick={() => {
                                        //anything u want to happen when clicking on Execute button
                                        toggleCriticalModal(index);
                                        setidk(!idk);
                                      }}
                                       href="http://localhost:3000/admin/task"
                                    >
                                      <span>Execute</span>
                                    </Button>
                                    <Button
                                      color="danger"
                                      data-dismiss="modal"
                                      type="button"
                                      onClick={() => {
                                        //anything u want to happen when clicking on Close button
                                        toggleCriticalModal(index);
                                        setidk(!idk);
                                      }}
                                    >
                                      Close
                                    </Button>
                                  </div>
                                </Modal>
                                {/* End Classic Modal */}
                              </Col>
                            </Row>
                            <Card className="card-plain">
                              <CardHeader role="tab">
                                <a
                                  aria-expanded={openArray[index]}
                                  href="#pablo"
                                  data-parent="#accordion"
                                  data-toggle="collapse"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    openArray[index] = !openArray[index];
                                    setCriticalCollapseOpen(openArray);
                                    setidk(!idk);
                                  }}
                                >
                                  {"#" + (index+1) + " " + val["Alert Type"]}
                                  <i className="tim-icons icon-minimal-down" />
                                </a>
                              </CardHeader>
                              <Collapse role="tabpanel" isOpen={openArray[index]}>
                                <CardBody>
                                  <h6 className="text-danger">Alert Message</h6>
                                  <CardBody>
                                  {val["Alert Message"]}
                                  </CardBody>
                                  <h6 className="text-danger">Alert Status</h6>
                                  <CardBody>
                                  {val["Alert Status"]}
                                  </CardBody>
                                  <h6 className="text-danger">Alert ID</h6>
                                  <CardBody>
                                  {val["ALERT ID"]}
                                  </CardBody>
                                  <h6 className="text-danger">Update Time</h6>
                                  <CardBody>
                                  {val["Update Time"]}
                                  </CardBody>
                                  <h6 className="text-danger">Tenant</h6>
                                  <CardBody>
                                  {val["Tenant"]}
                                  </CardBody>
                                  <h6 className="text-danger">Host</h6>
                                  <CardBody>
                                  {val["Host"]}
                                  </CardBody>
                                  
                                  <Button color="secondary" onClick={() => {
                                    toggleCriticalModal(index);
                                    setidk(!idk);
                                  }}>
                                    Suggestion
                                  </Button>
                                </CardBody>
                              </Collapse>
                            </Card>
                          </div>
                        );
                      })}
                    </div>
                  </Card>
                </Col>
              </CardFooter>
            </Card>
          </Col>
          {/* major table1 */}
          <Col lg="6" md="6">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col xs="5">
                    <div className="info-icon text-center icon-warning">
                      <i className="tim-icons icon-alert-circle-exc" />
                      
                    </div>
                  </Col>
                  <Col xs="7">
                  
                    <div className="numbers">
                    <h1 className="card-title">Major Incidents</h1>
                      <CardTitle tag="h2">{majorIncidentCount}</CardTitle>
                    </div>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
                
                <hr />
                <Col className="mb-5" md="12">
                  <Card>
                    <CardBody>
                      <SortingTable
                        thead = {[
                          {text: "Alert Type"},
                          {text: "Count", className: "text-center"}
                        ]}
                        tbody = {majorData}
                      />
                    </CardBody>
                  </Card>
                </Col>
                
              </CardFooter>
            </Card>
          </Col>
        </Row>

        {/* third row */}
        <Row>
          {/* chart1 */}
          <Col lg="6">
            <Card className="card-chart">
              <CardHeader>
                <CardTitle tag="h3">
                  <i className="tim-icons icon-alert-circle-exc text-primary" /> Major Incident By Type
                </CardTitle>
              </CardHeader>
              <CardBody>
                <div className="chart-area">
                <Bar
                    data={(canvas) => {
                      let ctx = canvas.getContext("2d");
                  
                      let gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);
                  
                      gradientStroke.addColorStop(1, "rgba(72,72,176,0.1)");
                      gradientStroke.addColorStop(0.4, "rgba(72,72,176,0.0)");
                      gradientStroke.addColorStop(0, "rgba(119,52,169,0)"); //purple colors
                  
                      return {
                        //the chart label
                        labels: majorBarchartLabel,
                        datasets: [
                          {
                            label: "Countries",
                            fill: true,
                            backgroundColor: gradientStroke,
                            hoverBackgroundColor: gradientStroke,
                            borderColor: "#d048b6",
                            borderWidth: 2,
                            borderDash: [],
                            borderDashOffset: 0.0,
                            //the chart data
                            data: majorBarchartData,
                          },
                        ],
                      };
                    }}
                    options={{
                      maintainAspectRatio: false,
                      legend: {
                        display: false,
                      },
                      tooltips: {
                        backgroundColor: "#f5f5f5",
                        titleFontColor: "#333",
                        bodyFontColor: "#666",
                        bodySpacing: 4,
                        xPadding: 12,
                        mode: "nearest",
                        intersect: 0,
                        position: "nearest",
                      },
                      responsive: true,
                      scales: {
                        yAxes: [
                          {
                            gridLines: {
                              drawBorder: false,
                              color: "rgba(225,78,202,0.1)",
                              zeroLineColor: "transparent",
                            },
                            ticks: {
                              padding: 20,
                              fontColor: "#9e9e9e",
                              suggestedMin: 0
                            },
                          },
                        ],
                        xAxes: [
                          {
                            gridLines: {
                              drawBorder: false,
                              color: "rgba(225,78,202,0.1)",
                              zeroLineColor: "transparent",
                            },
                            ticks: {
                              padding: 20,
                              fontColor: "#9e9e9e",
                            },
                          },
                        ],
                      },
                    }}
                  />
                </div>
              </CardBody>
            </Card>
          </Col>
          {/* chart2 */}
          <Col lg="6">
            <Card className="card-chart">
              <CardHeader>
                <CardTitle tag="h3">
                  <i className="tim-icons icon-alert-circle-exc text-info" />Critical Incident By Type
                </CardTitle>
              </CardHeader>
              <CardBody>
                <div className="chart-area">
                  <Bar
                    data={(canvas) => {
                      let ctx = canvas.getContext("2d");
                  
                      let gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);
                  
                      gradientStroke.addColorStop(1, "rgba(72,72,176,0.1)");
                      gradientStroke.addColorStop(0.4, "rgba(72,72,176,0.0)");
                      gradientStroke.addColorStop(0, "rgba(119,52,169,0)"); //purple colors
                  
                      return {
                        //chart labels
                        labels: criticalBarchartLabel,
                        datasets: [
                          {
                            label: "Countries",
                            fill: true,
                            backgroundColor: gradientStroke,
                            hoverBackgroundColor: gradientStroke,
                            borderColor: "#d048b6",
                            borderWidth: 2,
                            borderDash: [],
                            borderDashOffset: 0.0,
                            //chart data
                            data: criticalBarchartData,
                          },
                        ],
                      };
                    }}
                    options={{
                      maintainAspectRatio: false,
                      legend: {
                        display: false,
                      },
                      tooltips: {
                        backgroundColor: "#f5f5f5",
                        titleFontColor: "#333",
                        bodyFontColor: "#666",
                        bodySpacing: 4,
                        xPadding: 12,
                        mode: "nearest",
                        intersect: 0,
                        position: "nearest",
                      },
                      responsive: true,
                      scales: {
                        yAxes: [
                          {
                            gridLines: {
                              drawBorder: false,
                              color: "rgba(225,78,202,0.1)",
                              zeroLineColor: "transparent",
                            },
                            ticks: {
                              padding: 20,
                              fontColor: "#9e9e9e",
                              suggestedMin: 0
                            },
                          },
                        ],
                        xAxes: [
                          {
                            gridLines: {
                              drawBorder: false,
                              color: "rgba(225,78,202,0.1)",
                              zeroLineColor: "transparent",
                            },
                            ticks: {
                              padding: 20,
                              fontColor: "#9e9e9e",
                            },
                          },
                        ],
                      },
                    }}
                  />
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Dashboard;
