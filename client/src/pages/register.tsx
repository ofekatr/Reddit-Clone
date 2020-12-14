import { Box, Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useRouter } from "next/dist/client/router";
import React, { useContext } from "react";
import InputField from "../components/InputField";
import Wrapper from "../components/Wrapper";
import { AuthContext } from "../context/auth";
import { useRegisterMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";

interface registerProps {}

const Register: React.FC<registerProps> = ({}) => {
  const router = useRouter();
  const authContext = useContext(AuthContext);
  const [, register] = useRegisterMutation();
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ username: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await register(values);
          if (response.data?.register.errors) {
            setErrors(toErrorMap(response.data.register.errors));
          } else if (response.data?.register.user) {
            const { user, token } = response.data?.register;
            authContext.login({ ...user, token });
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField name="username" label="username" />
            <Box mt={4}>
              <InputField name="password" label="password" type="password" />
            </Box>
            <Button
              colorScheme="teal"
              isLoading={isSubmitting}
              type="submit"
              mt={4}
            >
              register
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default Register;
