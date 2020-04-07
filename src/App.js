import React from 'react';
// noinspection ES6CheckImport
import {HashRouter, Link, Route} from "react-router-dom";
import Writer from "./writer/app/components/Writer";
import Rocket from "./rockets/app/components/Rocket";
import Flupper from "./flupper/app/components/Flupper";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Config from "./config";
import logo from "./brand_logo.png";
import Tetris from "./tetris/app/component/Tetris";

let changeClass = (e) => {
  let target = e.target.parentElement;
  target.parentElement.childNodes.forEach(node => node.classList.remove("active"));
  target.classList.add("active");
};

function App() {
  return (
    <div>
      <HashRouter>
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" className="fixed-top">
          <Navbar.Brand href="/"><img className="navbar-brand" src={logo} alt={"Not Found"} height={"40px"}/>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="ml-auto">
              {Object.entries(Config.apps).map(([key, val]) =>
                <Nav.Item key={key} className="nav-link navs mx-2">
                  <Link
                    className="evolve-link"
                    to={val["appUrl"]}
                    onClick={(e) => changeClass(e)}>
                    {val["appName"]}
                  </Link>
                </Nav.Item>
              )}
            </Nav>
          </Navbar.Collapse>
        </Navbar>

        <div>
          <Route path={Config.apps.Writer.appUrl} component={Writer}/>
          <Route path={Config.apps.Rockets.appUrl} component={Rocket}/>
          <Route path={Config.apps.Flupper.appUrl} component={Flupper}/>
          <Route path={Config.apps.Tetris.appUrl} component={Tetris}/>
        </div>
      </HashRouter>
    </div>
  );
}

export default App;
