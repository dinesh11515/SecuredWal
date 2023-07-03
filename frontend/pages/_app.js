import "@/styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import Layout from "@/components/Layout";

import {
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { fantom } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
const { chains, publicClient } = configureChains([fantom], [publicProvider()]);

const { connectors } = getDefaultWallets({
  appName: "SecuredWal",
  projectId: "f1dd521b87109c82133a11126555675a",
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});
export default function App({ Component, pageProps }) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider
        chains={chains}
        modalSize="compact"
        theme={darkTheme()}
      >
        <Layout>
          <Component {...pageProps} />;
        </Layout>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
