/* eslint-disable no-undef */
import React, { useState, useEffect } from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import Sidebar from '../Sidebar/Sidebar';
import { apiEndPoint } from "../../utils/constants";
import axios, { config } from "../../utils/api";

const Dashboard = () => {
    const [role, setRole] = useState("");  // User's role
    const [inventories, setInventories] = useState([]);
    const [tcount, setTCounter] = useState([]);
    const [ucount, setUCounter] = useState([]);
    const [count, setCount] = useState(0);  // Pending or Approved Count

    useEffect(() => {
        const fetchRoleAndData = async () => {
            try {
                // Retrieve the logged-in user's identifier (e.g., username)
                const loggedInUsername = localStorage.getItem("username"); // Make sure it's stored after login

                if (!loggedInUsername) {
                    console.error("No logged-in username found in localStorage.");
                    return;
                }

                // Fetch the list of users from the API
                const userResponse = await axios.get(apiEndPoint.listuser, config());
                console.log("User List Response:", userResponse.data); // Debugging log

                // Find the currently logged-in user dynamically
                const currentUser = userResponse.data.find(user => user.username === loggedInUsername);

                if (!currentUser) {
                    console.error("Logged-in user not found in the user list.");
                    return;
                }

                // Get the role of the logged-in user
                const userRoles = currentUser.roles || [];
                const userRole = userRoles.length > 0 ? userRoles[0].name : null;

                console.log("Extracted Role:", userRole); // Debugging log
                setRole(userRole);

                // Determine the endpoint based on the user's role
                const inventoriesEndpoint =
                    userRole === "Store Manager"
                        ? `${apiEndPoint.list}?status=pending`
                        : `${apiEndPoint.list}?status=approved`;

                // Fetch inventories, counters, and other data based on the role
                const [inventoriesRes, tcountRes, ucountRes, countRes] = await Promise.all([
                    axios.get(inventoriesEndpoint, config()),
                    axios.get(apiEndPoint.inventories_total_count, config()),
                    axios.get(apiEndPoint.total_user_count, config()),
                    axios.get(
                        userRole === "Store Manager"
                            ? apiEndPoint.inventories_pending_count
                            : apiEndPoint.inventories_approved_count,
                        config()
                    ),
                ]);

                // Set the state with the fetched data
                setInventories(inventoriesRes.data);
                setTCounter(tcountRes.data);
                setUCounter(ucountRes.data);
                setCount(
                    userRole === "Store Manager"
                        ? countRes.data.pending_count
                        : countRes.data.approved_count
                );
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchRoleAndData();
    }, []); // Empty dependency array ensures this effect runs only once

    return (
        <div className="main--container">
            <Sidebar />
            <div className="main--navbar light-blue">
                <Header />
                <div className="main-card-wrapper">
                    {tcount && (
                        <div className="card dark-purple">
                            <div className="card-body">
                                <span id="span1">Inventories</span>
                                <span id="span2">{tcount.inventories_count}</span>
                            </div>
                        </div>
                    )}

                    {count !== null &&(
                        <div className={`card ${role === "Store Manager" ? "light-green" : "metal-blue"}`}>
                            <div className="card-body">
                                <span id="span1">
                                    {role === "Store Manager" ? "Pending" : "Approved"}
                                </span>
                                <span id="span2">{count}</span>
                            </div>
                        </div>
                    )}

                    {ucount && (
                        <div className="card dark-orange">
                            <div className="card-body">
                                <span id="span1">Users</span>
                                <span id="span2">{ucount.count_users}</span>
                            </div>
                        </div>
                    )}
                </div>
                <div className="tabular-wraper2">
                    <h3 className="main-title">Inventories Details</h3>
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Product Id</th>
                                    <th>Batch Date</th>
                                    <th>Batch Number</th>
                                    <th>Product Name</th>
                                    <th>Vendor</th>
                                    <th>Price</th>
                                    <th>Quantity</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {inventories && inventories.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.product_id}</td>
                                        <td>{item.batch_date}</td>
                                        <td>{item.batch_num}</td>
                                        <td>{item.product_name}</td>
                                        <td>{item.vendor}</td>
                                        <td>${item.mrp}</td>
                                        <td>{item.quantity}</td>
                                        <td>{item.status}</td>
                                    </tr>
                                ))}
                                {!inventories.length && (
                                    <tr>
                                        <td colSpan="8">No items are there</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    );
};

export default Dashboard;
