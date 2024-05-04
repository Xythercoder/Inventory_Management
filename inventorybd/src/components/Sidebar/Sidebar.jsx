/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import '../../assets/css/style.css';
import Logo from "../../assets/image/logo.png";
import Logo_symb from "../../assets/image/logo_symb.png";
import { useHistory } from "react-router";
import { useDispatch } from "react-redux";
import { logout } from "../../utils/reducer";



const Sidebar = () => {

  const dispatch = useDispatch();
  const history = useHistory();

  const LogOutHandler = () => {
    localStorage.clear();
    dispatch( logout() );
    history.push( `/` );
  }


  return (
    <div className="sidebar--container shade-blue">
      <div className="logo">
        <img className="img1" src={Logo_symb} alt="" />
        <img className="img2" src={Logo} alt="" />
      </div>
      <ul className="menu--container">
        <li className="active">
          <a className="hover-menu" onClick={() => history.push( '/dashboard' )}>
            <i className="fas fa-tachometer-alt"></i>
            <span className="lilte--menu">
              Dashboard
            </span>
          </a>
        </li>
        <li className="sub--menu">
          <a className="hover-menu" onClick={() => history.push( '/addInventories' )}>
            <i className="fas fa-pen-fancy"></i>
            <span className="lilte--menu">ADD Inventory</span>
          </a>
        </li>
        <li>
          <a className="hover-menu" onClick={() => history.push( '/inventories' )}>
            <i className="fas fa-user-group"></i>
            <span className="lilte--menu">View Inventory</span>
          </a>
        </li>
        <li>
          <a className="hover-menu">
            <i className="fas fa-chart-pie"></i>
            <span className="little-menu">Analytics</span>
          </a>
        </li>
        <li>
          <a className="hover-menu">
            <i className="fas fa-user-gear"></i>
            <span className="little-menu">USERS</span>
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