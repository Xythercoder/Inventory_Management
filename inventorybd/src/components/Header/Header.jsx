import React from 'react'
import '../../assets/css/style.css';
import Logo  from "../../assets/image/profile.png";


const Header = () => {
    return (
        <div className="header-wrapper">
            <div className="header-title">
                <h2>Dashboard</h2>
            </div>
            <div className="search-box">
                <i className="fa-solid fa-search hg"></i>
                <input type="text" placeholder="Search" />
            </div>
            <div className="user-info">
                <img src={Logo} alt="" />
            </div>
        </div>
    );
};

export default Header;

