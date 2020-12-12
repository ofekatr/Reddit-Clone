import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import React from "react";

interface registerProps {}

const Register: React.FC<registerProps> = ({}) => {
  return (
    <Formik
      initialValues={{ username: "", password: "" }}
      onSubmit={(values) => console.log(values)}
    >
      {({ values, handleChange }) => (
        <Form>
          <FormControl>
            <FormLabel htmlFor="username">Username</FormLabel>
            <Input
              value={values.username}
              id="username"
              placeholder="username"
              onChange={handleChange}
            />
            {/* <FormErrorMessage>{form.error.name}</FormErrorMessage> */}
          </FormControl>
        </Form>
      )}
    </Formik>
  );
};

export default Register;
