

import React from 'react';
import { Navbar, Nav, NavItem} from "react-bootstrap"
import OcticonGear from 'react-icons/lib/go/gear';
import OcticonHome from  "react-icons/lib/go/home"
import Icon from "./Icon"

const NavBar = ({active, onChange}) => {
  return (
    <div className="bg-primary text-secondary">
      <Navbar>
        <Navbar.Header>
          <Navbar.Brand>
            <span>Piphy</span>
          </Navbar.Brand>
        </Navbar.Header>
          <Nav>
            <NavItem eventKey={1} href="#">
                <Icon icon={OcticonHome}
                      active={active === "home"}
                      onClick={onChange.bind(null, "home")}
                      title="Home"
                      />
                <Icon icon={OcticonGear}
                      active={active === "settings"}
                      onClick={onChange.bind(null, "settings")}
                      title="Settings"
                      />
            </NavItem>
          </Nav>
      </Navbar>
    </div>
  )
}

export default NavBar
