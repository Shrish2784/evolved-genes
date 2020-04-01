import React from 'react';
import {BrowserRouter, Route} from "react-router-dom";
import {Switch} from "react-bootstrap";
import Writer from "./writer/app/components/Writer";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Config from "./config";
import Rocket from "./rockets/app/components/Rocket";

function App() {
  return (
    <div>
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Navbar.Brand href="/">{Config.projectName}</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            {Object.entries(Config.apps).map(([key, val]) =>
              <Nav.Link key={key} href={val.appUrl}>{val.appName}</Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <BrowserRouter>
        <Switch>
          <Route path={Config.apps.Writer.appUrl} component={Writer}/>
          <Route path={Config.apps.Rockets.appUrl} component={Rocket}/>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
