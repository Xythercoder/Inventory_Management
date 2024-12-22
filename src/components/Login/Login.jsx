import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import './login.css';
import { Form, Formik } from 'formik';
import axios from '../../utils/api';
import contactSchema from '../../utils/validation';
import { login } from '../../utils/reducer';
import { apiEndPoint } from '../../utils/constants';

const Login = () => {
    const [ loading, setLoading ] = useState( false );
    const dispatch = useDispatch();
    const history = useHistory();

    const handleSubmit = async ( values ) => {
        const { password, username } = values;
        setLoading( true );
        try {
            // Make the login API call
            const response = await axios.post( apiEndPoint.login, {
                username: username,
                password: password,
            } );

            if ( response.status === 200 ) {
                // Dispatch login action if successful
                dispatch( login( response.data ) );

                // Store user data in localStorage
                localStorage.setItem( "username", response.data.username );
                localStorage.setItem( "authToken", response.data.token );

                toast.success( 'Login Successful' );
                history.push( '/dashboard' ); // Redirect to dashboard
            } else {
                toast.error( 'Unauthorized Access' );
                history.push( '/' ); // Redirect to home if login fails
            }
        } catch ( err ) {
            toast.error( 'Error occurred during login' );
            console.error( 'Login Error:', err );
        } finally {
            setLoading( false );
        }
    };

    return (
        <div className="container">
            <div className="screen">
                <div className="screen__content">
                    <Formik
                        initialValues={{
                            username: '',
                            password: '',
                        }}
                        validationSchema={contactSchema}
                        onSubmit={handleSubmit}
                    >
                        {( { errors, values, handleChange } ) => (
                            <Form className="login">
                                <div className="login__field">
                                    <i className="login__icon fas fa-user"></i>
                                    <input
                                        type="text"
                                        className="login__input"
                                        placeholder="User name"
                                        name="username"
                                        value={values.username || ''}
                                        onChange={handleChange}
                                    />
                                </div>

                                <span style={{ fontSize: '14px', color: '#B22237' }}>
                                    {errors && errors.username}
                                </span>

                                <div className="login__field">
                                    <i className="login__icon fas fa-lock"></i>
                                    <input
                                        type="password"
                                        className="login__input"
                                        placeholder="Password"
                                        name="password"
                                        value={values.password || ''}
                                        onChange={handleChange}
                                    />
                                </div>

                                <span style={{ fontSize: '14px', color: '#B22237' }}>
                                    {errors && errors.password}
                                </span>

                                <button type="submit" className="button login__submit">
                                    <span className="button__text">
                                        {loading ? 'Please Wait...' : 'Log In Now'}
                                    </span>
                                    <i className="button__icon fas fa-chevron-right"></i>
                                </button>
                            </Form>
                        )}
                    </Formik>

                    <div className="login-link">
                        <p>
                            Signup an account?{' '}
                            <span onClick={() => history.push( '/signup' )}>Click here</span>
                        </p>
                    </div>
                </div>

                <div className="screen__background">
                    <span className="screen__background__shape screen__background__shape4"></span>
                    <span className="screen__background__shape screen__background__shape3"></span>
                    <span className="screen__background__shape screen__background__shape2"></span>
                    <span className="screen__background__shape screen__background__shape1"></span>
                </div>
            </div>
        </div>
    );
};

export default Login;
