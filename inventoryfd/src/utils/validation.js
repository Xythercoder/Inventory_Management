import * as Yup from "yup";

const contactSchema = Yup.object().shape( {
    password: Yup.string().required( "Password is required" ),
    username: Yup.string().required( "username is required" ),
} );

export default contactSchema;