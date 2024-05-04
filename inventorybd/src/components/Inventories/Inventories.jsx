/* eslint-disable no-undef */
import React from 'react'
import { useState, useEffect } from "react";
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import Sidebar from '../Sidebar/Sidebar';
import { apiEndPoint } from "../../utils/constants";
import axios, { config } from "../../utils/api";


const Inventories = () => {

    const [ data, setData ] = useState( [] );

    useEffect( () => {
        const fetchData = async () => {
            await axios.get( apiEndPoint.list, config() ).then( ( res ) => {
                if ( res.data ) {
                    setData( res.data );
                }

            } );
        };
        fetchData();
    }, [] );

    return (

        <div class="main--container">
            <Sidebar />
            <div className="main--navbar light-blue">
                <Header />
                <div className="tabular-wraper">
                    <div className="table-container">
                        <h3 className="main-title">Inventory details</h3>
                        <table table-container style={{ height: '100%' }}>
                            <thead>
                                <tr>
                                    <th>Batch No</th>
                                    <th>Product Name</th>
                                    <th>Vendor</th>
                                    <th>Price</th>
                                    <th>Quantity</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map(
                                    ( list, index ) => {

                                        return (

                                            <tr key={index}>
                                                <td>{list.batch_no}</td>
                                                <td>{list.product_name}</td>
                                                <td>{list.vendor}</td>
                                                <td>${list.mrp}</td>
                                                <td>{list.quantity}</td>
                                                <td>{list.status}</td>
                                                <td><button className='btn btn-danger'>Edit</button></td>
                                            </tr>

                                        );
                                    }
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    )
}

export default Inventories;