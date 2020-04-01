import React from 'react';
import {HashRouter, Link, Route} from "react-router-dom";
import Writer from "./writer/app/components/Writer";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Config from "./config";
import Rocket from "./rockets/app/components/Rocket";

function App() {
  return (
    <div>
      <HashRouter>
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
          <Navbar.Brand href="/">{Config.projectName}</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="ml-auto">
              {Object.entries(Config.apps).map(([key, val]) =>
                <Nav.Item className="nav-link">
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
