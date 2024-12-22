import React, { useState, useEffect } from 'react';
import { apiEndPoint } from "../../utils/constants";
import axios, { config } from "../../utils/api"; 
import { useHistory } from "react-router";

const Notification = () => {
    const history = useHistory();
    const [ notifications, setNotifications ] = useState( [] );
    const [ showNotifications, setShowNotifications ] = useState( false );

    useEffect( () => {
        // Fetch notifications on component mount
        const fetchNotifications = async () => {
            try {
                const response = await axios.get( apiEndPoint.pending_notification, config() );
                if ( response.data ) {
                    setNotifications( response.data );
                }
            } catch ( error ) {
                console.error( "Error fetching notifications:", error );
            }
        };

        fetchNotifications();
    }, [] );

    return (
        <div
            className="notification-container"
            onMouseEnter={() => setShowNotifications( true )}
            onMouseLeave={() => setShowNotifications( false )}
        >
            <div className="notification-content">
                {/* Icon and text inside notification content */}
                <div className="notification-icon">
                    <i className="fa-solid fa-bell"></i>
                </div>
                <span>Notification</span>
            </div>

            {showNotifications && notifications.length > 0 && (
                <div className="notification-dropdown">
                    <h4>Notifications</h4>
                    <ul>
                        {notifications.map( ( notification, index ) => (
                            <li className="hoverzz"
                                onClick={() => history.push( "/pending" )} key={index}>
                                <p>{notification.product_id}</p>
                                <small>{notification.status}</small>
                                <small>{notification.created_at}</small>
                            </li>
                        ) )}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Notification;
