import React, { useState, useEffect } from "react";
import axios, { config } from "../../utils/api"; // Ensure axios is correctly configured
import Logo from "../../assets/image/profile.png";
import { apiEndPoint } from "../../utils/constants"; // Import constants if needed
import Notification from "../Notification/Notification"; // Import the Notification component

const Header = () => {
    const [ showUserInfo, setShowUserInfo ] = useState( false );
    const [ userInfo, setUserInfo ] = useState( {
        username: "Loading...",
        lastLogin: "Loading...",
    } );

    useEffect( () => {
        const fetchUserInfo = async () => {
            try {
                const loggedInUsername = localStorage.getItem( "username" );
                if ( !loggedInUsername ) {
                    console.error( "No logged-in username found in localStorage." );
                    return;
                }

                // Retrieve the authentication token from localStorage
                const authToken = localStorage.getItem( "authToken" ); // Replace with your token key
                if ( !authToken ) {
                    console.error( "Authentication token not found." );
                    return;
                }

                // Include the token in the config object for axios request
                const userConfig = config(); // You may already have the default configuration
                userConfig.headers = {
                    ...userConfig.headers, // Keep any existing headers
                    Authorization: `Bearer ${ authToken }`, // Add the Authorization header
                };

                // Use the updated config object with the token included
                const userResponse = await axios.get( apiEndPoint.listuser, userConfig );

                if ( userResponse.status === 200 ) {
                    const currentUser = userResponse.data.find(
                        ( user ) => user.username === loggedInUsername
                    );

                    if ( currentUser ) {
                        setUserInfo( {
                            username: currentUser.username,
                            email: currentUser.email,
                        } );
                    } else {
                        console.error( "Logged-in user not found in the user list." );
                        setUserInfo( { username: "Not Found", email: "Not Available" } );
                    }
                } else {
                    console.error( `API Error: ${ userResponse.status } - ${ userResponse.statusText }` );
                }
            } catch ( error ) {
                console.error( "Error fetching user info:", error );
                setUserInfo( { username: "Error", email: "Error fetching data" } );
            }
        };

        fetchUserInfo();
    }, [] );

    return (
        <div className="header-wrapper">
            <div className="header-title">
                <h2>Dashboard</h2>
            </div>
            <div className="search-box">
                <i className="fa-solid fa-search hg"></i>
                <input type="text" placeholder="Search" />
            </div>
            <div className="user-notification-section">
                <Notification /> {/* Add the Notification component here */}
            </div>
                <div
                    className="user-info"
                    onMouseEnter={() => setShowUserInfo( true )}
                    onMouseLeave={() => setShowUserInfo( false )}
                >
                    <img src={Logo} alt="User" />
                    {showUserInfo && (
                        <div className="user-hover-info">
                            <p><strong>{userInfo.username}</strong></p>
                            <p>{userInfo.email}</p>
                        </div>
                    )}
                </div>
        </div>
    );
};

export default Header;
