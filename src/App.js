import React from 'react';
import {BrowserRouter, Route} from "react-router-dom";
import {Switch} from "react-bootstrap";
import Writer from "./writer/app/components/Writer";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Config from "./config";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
          <Navbar.Brand href="#home">{Config.projectName}</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
              {Config.apps.map((app) =>
                <Nav.Link key={app.appName} href={app.appUrl}>{app.appName}</Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Navbar>

        <Switch>
          <Route path={"/writer"} component={Writer}/>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
