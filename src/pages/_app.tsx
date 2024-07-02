import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Layout from '../components/Layout';
import { init, Web3OnboardProvider } from "@web3-onboard/react";
import { onboardConfig } from "../utils/connectWallet";
import { RequestProvider } from "@/Providers/RequestProvider";

const wen3Onboard = init({
  connect: {
    autoConnectAllPreviousWallet: true,
  },
  ...onboardConfig,
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Web3OnboardProvider web3Onboard={wen3Onboard}>
      <Layout>
        <RequestProvider>
          <Component {...pageProps} />
        </RequestProvider>
      </Layout>
    </Web3OnboardProvider>
  );
}
