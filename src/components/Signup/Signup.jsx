import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import './signup.css'; // Create a separate CSS file for styling
import { Form, Formik } from 'formik';
import axios from '../../utils/api';
import contactSchema from '../../utils/validation'; // Assuming you have validation schema for Formik
import { apiEndPoint } from '../../utils/constants';
import { login } from '../../utils/reducer'

const Signup = () => {
    const [ isSubmitting, setIsSubmitting ] = useState( false );
    const dispatch = useDispatch();
    const history = useHistory();

    const initialValues = {
        username: '',
        email: '',
        password: '',
        password2: '',
        role: 'Store Manager', // Default role selected
    };

    const handleSubmit = async ( values ) => {
        setIsSubmitting( true );
        try {
            // Send the data to your backend API
            const response = await axios.post( apiEndPoint.register, values );
            if ( response.data ) {
                toast.success( 'Signup successful!' );
                dispatch( login( response.data ) ); // Assuming you have a login action in your Redux store
                history.push( '/' ); // Redirect to dashboard or another page after successful signup
            }
        } catch ( error ) {
            toast.error( 'Signup failed, please try again.' );
            console.error( 'Error during signup:', error );
        }
        setIsSubmitting( false );
    };

    return (
        <div className="signup-container">
            <div className="signup-form">
                <h2 className='h--2'>Sign Up</h2>
                <Formik
                    initialValues={initialValues}
                    validationSchema={contactSchema} // Assuming you have a validation schema for form fields
                    onSubmit={handleSubmit}
                >
                    {( { handleChange, handleBlur, values, errors, touched } ) => (
                        <Form className="form-container">
                            <div className="form-group">
                                <label htmlFor="username">Username</label>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    placeholder="Enter your username"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.username}
                                    className={touched.username && errors.username ? 'input-error' : ''}
                                />
                                {touched.username && errors.username && (
                                    <div className="error-message">{errors.username}</div>
                                )}
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.email}
                                    className={touched.email && errors.email ? 'input-error' : ''}
                                />
                                {touched.email && errors.email && (
                                    <div className="error-message">{errors.email}</div>
                                )}
                            </div>

                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    placeholder="Enter your password"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.password}
                                    className={touched.password && errors.password ? 'input-error' : ''}
                                />
                                {touched.password && errors.password && (
                                    <div className="error-message">{errors.password}</div>
                                )}
                            </div>

                            <div className="form-group">
                                <label htmlFor="password2">Confirm Password</label>
                                <input
                                    type="password"
                                    id="password2"
                                    name="password2"
                                    placeholder="Confirm your password"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.password2}
                                    className={touched.password2 && errors.password2 ? 'input-error' : ''}
                                />
                                {touched.password2 && errors.password2 && (
                                    <div className="error-message">{errors.password2}</div>
                                )}
                            </div>

                            <div className="form-group">
                                <label htmlFor="role">Role</label>
                                <select
                                    id="role"
                                    name="role"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.role}
                                    className={touched.role && errors.role ? 'input-error' : ''}
                                >
                                    <option value="Store Manager">Store Manager</option>
                                    <option value="Department Manager">Department Manager</option>
                                </select>
                                {touched.role && errors.role && <div className="error-message">{errors.role}</div>}
                            </div>

                            <div className="form-actions">
                                <button
                                    type="submit"
                                    className="btn-submit"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Signing up...' : 'Sign Up'}
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
                <div className="signup-link">
                    <p>Already have an account? <span onClick={() => history.push( '/' )}>Login here</span></p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
