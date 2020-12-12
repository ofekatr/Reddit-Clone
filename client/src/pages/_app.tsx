import { ColorModeProvider, CSSReset, ThemeProvider } from "@chakra-ui/react";
import { AppProps } from "next/app";
import { Provider, createClient } from "urql";
import theme from "../theme";

const client = createClient({
  url: "http://localhost:8080/graphql",
  fetchOptions: {
    credentials: "include"
  }
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider value={client}>
      <ThemeProvider theme={theme}>
        <ColorModeProvider options={{}}>
          <CSSReset />
          <Component {...pageProps} />
        </ColorModeProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default MyApp;
