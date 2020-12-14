import { Box, Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useRouter } from "next/dist/client/router";
import React, { useContext } from "react";
import { AuthContext } from "src/context/auth";
import InputField from "../components/InputField";
import Wrapper from "../components/Wrapper";
import { useLoginMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";

const login: React.FC<{}> = ({}) => {
  const router = useRouter();
  const authContext = useContext(AuthContext);
  const [, login] = useLoginMutation();
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ username: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await login({
            options: values,
          });
          if (response.data?.login.errors) {
            setErrors(toErrorMap(response.data.login.errors));
          } else if (response.data?.login.user) {
            const { user, token } = response.data?.login;
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
              login
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default login;
