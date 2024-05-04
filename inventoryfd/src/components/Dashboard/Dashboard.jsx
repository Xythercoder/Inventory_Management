import React, { useState, useEffect } from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import Sidebar from '../Sidebar/Sidebar';
import { apiEndPoint } from "../../utils/constants";
import axios, { config } from "../../utils/api";

const Dashboard = () => {
    const [ pending, setPending ] = useState( [] );
    const [ pcount, setPCounter ] = useState( [] );
    const [ acount, setACounter ] = useState( [] );
    const [ tcount, setTCounter ] = useState( [] );

    useEffect( () => {
        const fetchData = async () => {
            try {
                const [ pcountRes, acountRes, tcountRes, pendingRes ] = await Promise.all( [
                    axios.get( apiEndPoint.pendingcount, config() ),
                    axios.get( apiEndPoint.approvecount, config() ),
                    axios.get( apiEndPoint.totalcount, config() ),
                    axios.get( apiEndPoint.pending, config() )
                ] );
                setPCounter( pcountRes.data );
                setACounter( acountRes.data );
                setTCounter( tcountRes.data );
                setPending( pendingRes.data );
            } catch ( error ) {
                console.error( "Error fetching data:", error );
            }
        };
        fetchData();
    }, [] );

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
                                <span id="span2">{tcount.product_total_count}</span>
                            </div>
                        </div>
                    )}
                    {pcount && (
                        <div className="card light-green">
                            <div className="card-body">
                                <span id="span1">Pending</span>
                                <span id="span2">{pcount.product_pending_count}</span>
                            </div>
                        </div>
                    )}
                    {acount && (
                        <div className="card metal-blue">
                            <div className="card-body">
                                <span id="span1">Approved</span>
                                <span id="span2">{acount.product_approve_count}</span>
                            </div>
                        </div>
                    )}
                    <div className="card dark-orange">
                        <div className="card-body">
                            <span id="span1">Users</span>
                            <span id="span2">10,000</span>
                        </div>
                    </div>
                </div>
                <div className="tabular-wraper">
                    <h3 className="main-title">Inventory Pending Details</h3>
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Batch No</th>
                                    <th>Product Name</th>
                                    <th>Vendor</th>
                                    <th>Price</th>
                                    <th>Quantity</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pending && pending.map( ( item, index ) => (
                                    <tr key={index}>
                                        <td>{item.batch_no}</td>
                                        <td>{item.product_name}</td>
                                        <td>{item.vendor}</td>
                                        <td>${item.mrp}</td>
                                        <td>{item.quantity}</td>
                                        <td>{item.status}</td>
                                    </tr>
                                ) )}
                                {!pending.length && (
                                    <tr>
                                        <td colSpan="6">No pending items</td>
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
