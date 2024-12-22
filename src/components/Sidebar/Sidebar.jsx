/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import Logo from "../../assets/image/logo.png";
import Logo_symb from "../../assets/image/logo_symb.png";
import { useHistory } from "react-router";
import { useDispatch } from "react-redux";
import { logout } from "../../utils/reducer";

const Sidebar = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [ isViewInventoryOpen, setIsViewInventoryOpen ] = useState( false );

  const LogOutHandler = () => {
    localStorage.clear();
    dispatch( logout() );
    history.push( `/` );
  };

  return (
    <div className="sidebar--container shade-blue">
      <div className="logo">
        <img className="img1" src={Logo_symb} alt="" />
        <img className="img2" src={Logo} alt="" />
      </div>
      <ul className="menu--container">
        <li className="active">
          <a
            className="hover-menu"
            onClick={() => history.push( "/dashboard" )}
          >
            <i className="fas fa-tachometer-alt"></i>
            <span className="little-menu">Dashboard</span>
          </a>
        </li>
        <li className="sub--menu">
          <a
            className="hover-menu"
            onClick={() => history.push( "/addInventories" )}
          >
            <i className="fas fa-pen-fancy"></i>
            <span className="little-menu">Add Inventory</span>
          </a>
        </li>
        <li>
          <a
            className="hover-menu"
            onClick={() => setIsViewInventoryOpen( !isViewInventoryOpen )}
          >
            <i className="fas fa-user-group"></i>
            <span className="little-menu">View Inventory</span>
            <i
              className={`fas fa-chevron-${ isViewInventoryOpen ? "up" : "down"
                } submenu-arrow`}
            ></i>
          </a>
          {isViewInventoryOpen && (
            <ul className="submenu">
              <li>
                <a
                  className="hover-menu"
                  onClick={() => history.push( "/pending" )}
                >
                  <span className="little-menu">Pending Inventory</span>
                </a>
              </li>
              <li>
                <a
                  className="hover-menu"
                  onClick={() => history.push( "/approved" )}
                >
                  <span className="little-menu">Approved Inventory</span>
                </a>
              </li>
            </ul>
          )}
        </li>
        <li>
          <a
            className="hover-menu"
            onClick={() => setIsViewInventoryOpen( !isViewInventoryOpen )}
          >
            <i className="fas fa-chart-pie"></i>
            <span className="little-menu">View Analytics</span>
            <i
              className={`fas fa-chevron-${ isViewInventoryOpen ? "up" : "down"
                } submenu-arrow`}
            ></i>
          </a>
          {isViewInventoryOpen && (
            <ul className="submenu">
              <li>
                <a
                  className="hover-menu"
                  onClick={() => history.push( "/pending_graph" )}
                >
                  <span className="little-menu">Pending Analytics</span>
                </a>
              </li>
              <li>
                <a
                  className="hover-menu"
                  onClick={() => history.push( "/approved_graph" )}
                >
                  <span className="little-menu">Approved Analytics</span>
                </a>
              </li>
            </ul>
          )}
        </li>
        <li>
          <a className="hover-menu">
            <i className="fas fa-user-gear"></i>
            <span className="little-menu">Users</span>
          </a>
        </li>
        <li className="logout" onClick={LogOutHandler}>
          <a className="hover-menu">
            <i className="fas fa-door-closed"></i>
            <span className="little-menu">Logout</span>
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
