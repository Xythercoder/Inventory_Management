/* eslint-disable no-undef */
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import Sidebar from "../Sidebar/Sidebar";
import { apiEndPoint } from "../../utils/constants";
import axios, { config } from "../../utils/api";
import { toast } from "react-toastify";

const Pending = () => {
    const [ role, setUserRole ] = useState( "" );
    const [ data, setData ] = useState( [] );
    const [ editData, setEditData ] = useState( null );
    const [ deleteId, setDeleteId ] = useState( null );
    const [ isEditModalOpen, setIsEditModalOpen ] = useState( false );
    const [ isDeleteModalOpen, setIsDeleteModalOpen ] = useState( false );
    const history = useHistory();

    useEffect( () => {
        const fetchData = async () => {
            try {
                const loggedInUsername = localStorage.getItem( "username" );

                if ( !loggedInUsername ) {
                    console.error( "No logged-in username found in localStorage." );
                    return;
                }

                const userResponse = await axios.get( apiEndPoint.listuser, config() );
                const currentUser = userResponse.data.find( user => user.username === loggedInUsername );

                if ( !currentUser ) {
                    console.error( "Logged-in user not found in the user list." );
                    return;
                }

                const userRoles = currentUser.roles || [];
                const userRole = userRoles.length > 0 ? userRoles[ 0 ].name : null;
                setUserRole( userRole );

                const inventoriesEndpoint = `${ apiEndPoint.list }?status=pending`;
                const res = await axios.get( inventoriesEndpoint, config() );
                if ( res.data ) {
                    setData( res.data );
                }
            } catch ( error ) {
                console.error( "Error fetching data:", error );
                toast.error( "Failed to fetch inventory data." );
            }
        };

        fetchData();
    }, [] );

    const openEditModal = ( item ) => {
        setEditData( item );
        setIsEditModalOpen( true );
    };

    const closeEditModal = () => {
        setEditData( null );
        setIsEditModalOpen( false );
    };

    const openDeleteModal = ( id ) => {
        setDeleteId( id );
        setIsDeleteModalOpen( true );
    };

    const closeDeleteModal = () => {
        setDeleteId( null );
        setIsDeleteModalOpen( false );
    };

    const handleEditSubmit = async () => {
        try {
            if ( role === "Department Manager" ) {
                const updatedData = {
                    ...editData,
                    status: "Pending", // Ensure status remains unchanged
                };
                await axios.put( apiEndPoint.update_inventories( editData.id ), updatedData, config() );
                toast.success( "Inventory updated successfully!" );
            } else if ( role === "Store Manager" ) {
                await axios.put( apiEndPoint.update_inventories( editData.id ), editData, config() );
                toast.success( "Inventory updated successfully!" );
            }
            setData( prevData => prevData.map( item => ( item.id === editData.id ? editData : item ) ) );
            closeEditModal();
            history.push( "/pending" );
        } catch ( error ) {
            console.error( "Error updating inventory:", error );
            toast.error( "Failed to update inventory." );
        }
    };

    const handleDeleteSubmit = async () => {
        try {
            const itemToDelete = data.find( item => item.id === deleteId );

            if ( !itemToDelete ) {
                toast.error( "Item not found!" );
                return;
            }

            await axios.delete( apiEndPoint.delete_inventories( deleteId ), config() );
            toast.success( "Inventory deleted successfully!" );
            setData( prevData => prevData.filter( item => item.id !== deleteId ) );

            closeDeleteModal();

            // Redirect logic for Store Manager based on status
            if ( role === "Store Manager" ) {
                history.push( itemToDelete.status === "Pending" ? "/pending" : "/approved" );
            }
        } catch ( error ) {
            console.error( "Error deleting inventory:", error );
            toast.error( "Failed to delete inventory." );
        }
    };

    return (
        <div className="main--container">
            <Sidebar />
            <div className="main--navbar light-blue">
                <Header />
                <div className="tabular-wraper1">
                    <div className="table-container">
                        <h3 className="main-title">Pending Inventories</h3>
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
                                    <th>Action</th>
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
                                        <td>
                                            <div className="menu-wrap">
                                                <ul className="menu">
                                                    <li className="menu-item">
                                                        <button className="btn-action">Action</button>
                                                        <ul className="drop-menu">
                                                            <li className="drop-menu-item">
                                                                <span
                                                                    className="btn-edit"
                                                                    onClick={() => openEditModal( item )}
                                                                >
                                                                    Edit
                                                                </span>
                                                            </li>
                                                            <li className="drop-menu-item">
                                                                {role === "Store Manager" && (
                                                                    <span
                                                                        className="btn-delete"
                                                                        onClick={() => openDeleteModal( item.id )}
                                                                    >
                                                                        Delete
                                                                    </span>
                                                                )}
                                                            </li>
                                                        </ul>
                                                    </li>
                                                </ul>
                                            </div>
                                        </td>
                                    </tr>
                                ) )}
                            </tbody>
                        </table>
                    </div>
                </div>
                <Footer />
            </div>

            {isEditModalOpen && editData && (
                <div className="modal fade-in">
                    <div className="modal-content">
                        <h4>Edit Inventory</h4>
                        <form>
                            <div className="form-group">
                                <label>Product Name</label>
                                <input
                                    type="text"
                                    value={editData.product_name}
                                    onChange={( e ) =>
                                        setEditData( { ...editData, product_name: e.target.value } )
                                    }
                                    className="input-field"
                                />
                            </div>
                            <div className="form-group">
                                <label>Vendor</label>
                                <input
                                    type="text"
                                    value={editData.vendor}
                                    onChange={( e ) =>
                                        setEditData( { ...editData, vendor: e.target.value } )
                                    }
                                    className="input-field"
                                />
                            </div>
                            <div className="form-group">
                                <label>Quantity</label>
                                <input
                                    type="number"
                                    value={editData.quantity}
                                    onChange={( e ) =>
                                        setEditData( { ...editData, quantity: e.target.value } )
                                    }
                                    className="input-field"
                                />
                            </div>
                            <div className="form-group">
                                <label>Price</label>
                                <input
                                    type="number"
                                    value={editData.mrp}
                                    onChange={( e ) =>
                                        setEditData( { ...editData, mrp: e.target.value } )
                                    }
                                    className="input-field"
                                />
                            </div>
                            {role === "Store Manager" && (
                                <div className="form-group">
                                    <label>Status</label>
                                    <select
                                        value={editData.status}
                                        onChange={( e ) =>
                                            setEditData( { ...editData, status: e.target.value } )
                                        }
                                        className="select-field"
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Approved">Approved</option>
                                    </select>
                                </div>
                            )}
                            <div className="modal-actions">
                                <button className="btn-save" type="button" onClick={handleEditSubmit}>
                                    Save
                                </button>
                                <button className="btn-cancel"
                                    type="button" onClick={closeEditModal}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isDeleteModalOpen && (
                <div className="modal fade-in">
                    <div className="modal-content">
                        <h4>Are you sure you want to delete this inventory?</h4>
                        <div className="modal-actions">
                            <button className="btn-delete-confirm" onClick={handleDeleteSubmit}>
                                Yes
                            </button>
                            <button className="btn-cancel" onClick={closeDeleteModal}>
                                No
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Pending;
