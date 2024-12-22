import React from 'react';
import { Form } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { toast } from 'react-toastify';
import axios, { config } from '../../utils/api'; // Ensure you import config
import { apiEndPoint } from '../../utils/constants';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import Sidebar from '../Sidebar/Sidebar';

const Add = () => {
    const history = useHistory()
    const validationSchema = Yup.object().shape( {
        product_id: Yup.string().required( 'Product Id is required' ),
        product_name: Yup.string().required( 'Product name is required' ),
        vendor: Yup.string().required( 'Vendor name is required' ),
        batch_date: Yup.string().required( 'Batch date is required' ),
        mrp: Yup.number().required( 'MRP is required' ).positive().integer(),
        quantity: Yup.number().required( 'Quantity is required' ).positive().integer(),
    } );

    const handleSubmit = async ( values, { setSubmitting } ) => {
        try {
            // Make sure to pass the config function to set Authorization headers
            const response = await axios.post( apiEndPoint.listadd, values, config() );
            console.log( 'Data posted successfully:', response.data );
            toast.success( 'Product Added Successfully' );
            history.push( '/pending' );
        } catch ( error ) {
            console.error( 'Error posting data:', error );
        } finally {
            setSubmitting( false ); // Stop the submit spinner
        }
    };

    return (
        <div className="main--container con">
            <Sidebar />
            <div className="main--navbar light-blue">
                <Header />
                <div className="formbold-main-wrapper">
                    <div className="formbold-form-wrapper">
                        <Formik
                            initialValues={{
                                product_id: '',
                                product_name: '',
                                vendor: '',
                                batch_date: '',
                                mrp: '',
                                quantity: '',
                            }}
                            validationSchema={validationSchema}
                            onSubmit={handleSubmit}
                        >
                            {( { values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting } ) => (
                                <Form className="form-control container-xxl" onSubmit={handleSubmit}>
                                    <div className="flex flex-wrap formbold--mx-3">
                                        <div className="w-full sm:w-half formbold-px-3">
                                            <div className="formbold-mb-5">
                                                <label htmlFor="product_id" className="formbold-form-label">
                                                    Product ID
                                                </label>
                                                <input
                                                    type="text"
                                                    name="product_id"
                                                    id="product_id"
                                                    placeholder="Enter Product ID"
                                                    className="formbold-form-input"
                                                    value={values.product_id}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                />
                                                {errors.product_id && touched.product_id && (
                                                    <div className="text-danger">{errors.product_id}</div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="w-full sm:w-half formbold-px-3">
                                            <div className="formbold-mb-5">
                                                <label htmlFor="product_name" className="formbold-form-label">
                                                    Product Name
                                                </label>
                                                <input
                                                    type="text"
                                                    name="product_name"
                                                    id="product_name"
                                                    placeholder="Enter Product Name"
                                                    className="formbold-form-input"
                                                    value={values.product_name}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                />
                                                {errors.product_name && touched.product_name && (
                                                    <div className="text-danger">{errors.product_name}</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap formbold--mx-3">
                                        <div className="w-full sm:w-half formbold-px-3">
                                            <div className="formbold-mb-5">
                                                <label htmlFor="vendor" className="formbold-form-label">
                                                    Vendor
                                                </label>
                                                <input
                                                    type="text"
                                                    name="vendor"
                                                    id="vendor"
                                                    placeholder="Enter Vendor Name"
                                                    className="formbold-form-input"
                                                    value={values.vendor}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                />
                                                {errors.vendor && touched.vendor && (
                                                    <div className="text-danger">{errors.vendor}</div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="w-full sm:w-half formbold-px-3">
                                            <div className="formbold-mb-5">
                                                <label htmlFor="batch_date" className="formbold-form-label">
                                                    Batch Date
                                                </label>
                                                <input
                                                    type="date"
                                                    name="batch_date"
                                                    id="batch_date"
                                                    className="formbold-form-input"
                                                    value={values.batch_date}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                />
                                                {errors.batch_date && touched.batch_date && (
                                                    <div className="text-danger">{errors.batch_date}</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap formbold--mx-3">
                                        <div className="w-full sm:w-half formbold-px-3">
                                            <div className="formbold-mb-5">
                                                <label htmlFor="mrp" className="formbold-form-label">
                                                    MRP
                                                </label>
                                                <input
                                                    type="number"
                                                    name="mrp"
                                                    id="mrp"
                                                    placeholder="Enter MRP"
                                                    className="formbold-form-input"
                                                    value={values.mrp}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                />
                                                {errors.mrp && touched.mrp && (
                                                    <div className="text-danger">{errors.mrp}</div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="w-full sm:w-half formbold-px-3">
                                            <div className="formbold-mb-5">
                                                <label htmlFor="quantity" className="formbold-form-label">
                                                    Quantity
                                                </label>
                                                <input
                                                    type="number"
                                                    name="quantity"
                                                    id="quantity"
                                                    placeholder="Enter Quantity"
                                                    className="formbold-form-input"
                                                    value={values.quantity}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                />
                                                {errors.quantity && touched.quantity && (
                                                    <div className="text-danger">{errors.quantity}</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="formbold-mb-5">
                                        <button
                                            type="submit"
                                            className="formbold-btn"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? 'Adding...' : 'Add Product'}
                                        </button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    );
};

export default Add;
