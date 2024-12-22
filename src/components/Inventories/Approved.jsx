/* eslint-disable no-undef */
import React, { useState, useEffect } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import Sidebar from "../Sidebar/Sidebar";
import { apiEndPoint } from "../../utils/constants";
import axios, { config } from "../../utils/api";
import { toast } from 'react-toastify';

const Approved = () => {
    const [ data, setData ] = useState( [] );

    useEffect( () => {
        const fetchData = async () => {
            try {
                const loggedInUsername = localStorage.getItem( "username" );

                if ( !loggedInUsername ) {
                    console.error( "No logged-in username found in localStorage." );
                    return;
                }

                // Fetch the approved inventories
                const inventoriesEndpoint = `${ apiEndPoint.list }?status=approved`;
                const res = await axios.get( inventoriesEndpoint, config() );
                if ( res.data ) {
                    setData( res.data ); // Set the approved inventories
                }
            } catch ( error ) {
                console.error( "Error fetching data:", error );
                toast.error( "Failed to fetch inventory data." );
            }
        };

        fetchData();
    }, [] ); // Run only once on mount

    return (
        <div className="main--container">
            <Sidebar />
            <div className="main--navbar light-blue">
                <Header />
                <div className="tabular-wraper1">
                    <div className="table-container">
                        <h3 className="main-title">Approved Inventory Details</h3>
                        <table style={{ height: "100%" }}>
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
                                {data.map( ( item, index ) => (
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
                                ) )}
                            </tbody>
                        </table>
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    );
};

export default Approved;
