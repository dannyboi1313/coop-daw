import "@/styles/globals.css";

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
