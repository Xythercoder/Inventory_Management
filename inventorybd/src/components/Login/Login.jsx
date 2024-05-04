import React, { useState } from 'react'
import { useHistory } from 'react-router';
import { useDispatch } from 'react-redux' 
import { toast } from 'react-toastify'
import './login.css'
import { Form, Formik } from 'formik'
import axios from '../../utils/api'
import contactSchema from '../../utils/validation'
import { login } from '../../utils/reducer'
import { apiEndPoint } from '../../utils/constants'



const Login = () => {

    const [ loading, setLoading ] = useState( false )
    const dispatch = useDispatch()
    const history = useHistory()

    const handleSubmit = async values => {
        const { password, username } = values
        setLoading( true )
        const response = await axios
            .post( apiEndPoint.login, {
                username: username,
                password: password
            } )
            .catch( err => {
                toast.error( 'Unauthorized Access' )
            } )
        setLoading( false )
        if ( response.status === 200) {
            dispatch( login( response.data ) )
            localStorage.setItem( 'authToken', response.data.token );
            toast.success( 'Login Successful' )
            history.push( '/dashboard' )
        }

        else {
            history.push( '/' )
            console.log( response.status )
        }
    }


    return (
        <div className="container">
            <div className="screen">
                <div className="screen__content">
                    <Formik
                        initialValues={{
                            username: '',
                            password: ''
                        }}
                        validationSchema={contactSchema}
                        onSubmit={handleSubmit}
                    >
                        {( { errors, values, handleChange } ) => (
                            <Form className="login">
                                <div className="login__field">
                                    <i className="login__icon fas fa-user"></i>
                                    <input type="text" className="login__input" placeholder="User name" name="username" values={values.username || ''} onChange={handleChange} />
                                </div>

                                <span style={{ fontSize: '14px', color: '#B22237' }}>
                                    {errors && errors.username}
                                </span>

                                <div className="login__field">
                                    <i className="login__icon fas fa-lock"></i>
                                    <input type="password" className="login__input" placeholder="Password" name="password"
                                        value={values.password || ''}
                                        onChange={handleChange} />
                                </div>

                                <span style={{ fontSize: '14px', color: '#B22237' }}>
                                    {errors && errors.password}
                                </span>


                                <button type="submit" className="button login__submit">
                                    <span className="button__text">{' '}
                                        {loading ? 'Please Wait...' : 'Log In Now'}</span>
                                    <i class="button__icon fas fa-chevron-right"></i>
                                </button>
                            </Form>
                        )}
                    </Formik>
                </div>
                <div className="screen__background">
                    <span className="screen__background__shape screen__background__shape4"></span>
                    <span className="screen__background__shape screen__background__shape3"></span>
                    <span className="screen__background__shape screen__background__shape2"></span>
                    <span className="screen__background__shape screen__background__shape1"></span>
                </div>
            </div>
        </div>
    )
}

export default Login;