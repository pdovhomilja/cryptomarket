import "../styles/globals.css";
import type { AppProps } from "next/app";
import { LangProvider } from "../context/lang";

import { ThirdwebProvider } from "@thirdweb-dev/react";
import network from "../utils/network";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <LangProvider>
      <ThirdwebProvider desiredChainId={network}>
        <Component {...pageProps} />
      </ThirdwebProvider>
    </LangProvider>
  );
}

export default MyApp;
