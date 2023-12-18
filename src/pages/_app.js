import "@/styles/globals.css";
import "typeface-roboto";
import "typeface-roboto-mono";

import React from "react";
import AudioContextProviderWrapper from "../../providers/AudioContextProvider";

function MyApp({ Component, pageProps }) {
  return (
    <AudioContextProviderWrapper>
      <Component {...pageProps} />
    </AudioContextProviderWrapper>
  );
}

export default MyApp;
