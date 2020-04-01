import React from 'react';
import {HashRouter, Link, Route} from "react-router-dom";
import Writer from "./writer/app/components/Writer";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Config from "./config";
import Rocket from "./rockets/app/components/Rocket";
// import {Image} from "react-bootstrap";
import logo from "./brand_logo.png";

function App() {
  return (
    <div>
      <HashRouter>
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
          <Navbar.Brand href="/"><img className="navbar-brand" src={logo} alt={"Not Found"} height={"40px"}/>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="ml-auto">
              {Object.entries(Config.apps).map(([key, val]) =>
                <Nav.Item key={key} className="nav-link">
                  <Link className="evolve-link" to={val.appUrl}>{val.appName}</Link>
                </Nav.Item>
              )}
            </Nav>
          </Navbar.Collapse>
        </Navbar>

        <div>
          <Route path={Config.apps.Writer.appUrl} component={Writer}/>
          <Route path={Config.apps.Rockets.appUrl} component={Rocket}/>
        </div>
      </HashRouter>
    </div>
  );
}

export default App;
