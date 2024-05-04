import React from 'react'
import Button from 'react-bootstrap/Button';
import { Form } from 'react-bootstrap';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import instance from '../../utils/api';
import { apiEndPoint } from '../../utils/constants';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import Sidebar from '../Sidebar/Sidebar';



const Add = () => {

    const validationSchema = Yup.object().shape( {
        product_name: Yup.string().required( 'Product name is required' ),
        vendor: Yup.string().required( 'Vendor name is required' ),
        batch_no: Yup.string().required( 'Batch number is required' ),
        mrp: Yup.number().required( 'MRP is required' ).positive().integer(),
        quantity: Yup.number().required( 'Quantity is required' ).positive().integer(),
    } );


    const handleSubmit = async ( values ) => {
        try {
            const response = await instance.post( apiEndPoint.listadd, {
                product_name: values.product_name,
                vendor: values.vendor,
                batch_no: values.batch_no,
                mrp: values.mrp,
                quantity: values.quantity,
            } );
            console.log( 'Data posted successfully:', response.data );
        } catch ( error ) {
            console.error( 'Error posting data:', error );
        }
    };
    

    return (
        <div className="main--container con">
            <Sidebar />
            <div className="main--navbar light-blue">
                <Header />
                <Formik
                    initialValues={{
                        product_name: '',
                        vendor: '',
                        batch_no: '',
                        mrp: '',
                        quantity: '',
                    }}
                    validationSchema={validationSchema}
                    onSubmit={( values, { setSubmitting } ) => {
                        handleSubmit( values ); // Call your handleSubmit function with form values
                        setSubmitting( false );
                    }}
                >
                    {( { isSubmitting } ) => (
                        <Form className="form-control container-xxl">
                            <h4>Add Inventory</h4>
                            <Row className="mb-4">
                                <Form.Group as={Col} md="6" controlId="batch_no">
                                    <Field type="text" placeholder="Enter Batch Number" name="batch_no" className="form-control" />
                                    <ErrorMessage name="batch_no" component="div" className="text-danger" />
                                </Form.Group>
                            </Row>
                            <Row className="mb-4">
                                <Form.Group as={Col} md="6" controlId="product_name">
                                    <Field type="text" placeholder="Enter Product Name" name="product_name" className="form-control" />
                                    <ErrorMessage name="product_name" component="div" className="text-danger" />
                                </Form.Group>
                                <Form.Group as={Col} md="6" controlId="vendor">
                                    <Field type="text" placeholder="Enter Vendor" name="vendor" className="form-control" />
                                    <ErrorMessage name="vendor" component="div" className="text-danger" />
                                </Form.Group>
                            </Row>

                            <Row className="mb-4">
                                <Form.Group as={Col} md="6" controlId="mrp">
                                    <Field type="number" placeholder="Enter MRP" name="mrp" className="form-control" />
                                    <ErrorMessage name="mrp" component="div" className="text-danger" />
                                </Form.Group>

                                <Form.Group as={Col} md="6" controlId="quantity">
                                    <Field type="number" placeholder="Enter Quantity" name="quantity" className="form-control" />
                                    <ErrorMessage name="quantity" component="div" className="text-danger" />
                                </Form.Group>
                            </Row>
                            <div className="form-control">
                                <Button type="submit" disabled={isSubmitting} variant="primary">
                                    Submit
                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>
                <Footer />
            </div>
        </div>
    )
}

export default Add;