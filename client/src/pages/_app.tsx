import { ColorModeProvider, CSSReset, ThemeProvider } from "@chakra-ui/react";
import { AppProps } from "next/app";
import React from "react";
import { createClient, Provider } from "urql";
import theme from "../theme";
import { AuthContextProvider } from "../context/auth";

const client = createClient({
  url: "http://localhost:8080/graphql",
  fetchOptions: () => {
    const token = localStorage?.getItem("jwtToken");
    console.log("Token: ", token);
    return {
      headers: { authorization: token ? `Bearer ${token}` : "" },
    };
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider value={client}>
      <AuthContextProvider>
        <ThemeProvider theme={theme}>
          <ColorModeProvider options={{}}>
            <CSSReset />
            <Component {...pageProps} />
          </ColorModeProvider>
        </ThemeProvider>
      </AuthContextProvider>
    </Provider>
  );
}

export default MyApp;
