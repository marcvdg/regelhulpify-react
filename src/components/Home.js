import React, { Component } from "react";
import { Col, Container, Row } from "reactstrap";
import ToolForm from "./ToolForm";

import axios from "axios";

import { API_URL } from "../constants";

class Home extends Component {




  render() {
    return (
      <Container style={{ marginTop: "20px" }}>
        <Row>
          <Col>
            <ToolForm/>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Home;