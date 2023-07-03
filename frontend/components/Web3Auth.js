import { Web3AuthNoModal } from "@web3auth/no-modal";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { BrowserProvider } from "ethers";
import { useState, useEffect } from "react";
export const Web3Auth = ({ addWeb3Wallet, setSigner }) => {
  const [web3auth, setWeb3auth] = useState(null);
  const [provider, setProvider] = useState(null);
  const clientId = process.env.NEXT_PUBLIC_CLIENT_ID;

  useEffect(() => {
    const init = async () => {
      try {
        const web3auth = new Web3AuthNoModal({
          clientId,
          chainConfig: {
            chainNamespace: "eip155",
            chainId: "0xfa",
            rpcTarget: "https://rpc.fantom.network",
          },
          web3AuthNetwork: "mainnet",
        });

        const openloginAdapter = new OpenloginAdapter({
          adapterSettings: {
            uxMode: "popup",
            whiteLabel: {
              name: "SecuredWal",
              logoLight: "https://web3auth.io/images/w3a-L-Favicon-1.svg",
              logoDark: "https://web3auth.io/images/w3a-D-Favicon-1.svg",
              defaultLanguage: "en",
              dark: true, // whether to enable dark mode. defaultValue: false
            },
          },
        });
        web3auth.configureAdapter(openloginAdapter);

        setWeb3auth(web3auth);

        await web3auth.init();
        console.log(web3auth.provider);
        if (web3auth.provider) {
          setProvider(web3auth.provider);
          const pro = new BrowserProvider(web3auth.provider);
          const signer = await pro.getSigner();
          setSigner(signer);
          const address = await signer.getAddress();
          // addWeb3Wallet(address);
          console.log(address);
        }
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);
  const connect = async () => {
    try {
      if (provider == null) {
        const web3authProvider = await web3auth.connectTo("openlogin", {
          loginProvider: "google",
        });
        setProvider(web3authProvider);
        const provider = new BrowserProvider(web3authProvider);
        const signer = provider.getSigner();
        setSigner(signer);
        const address = await signer.getAddress();
        addWeb3Wallet(address);
      } else {
        const pro = new BrowserProvider(provider);
        const signer = await pro.getSigner();
        setSigner(signer);
        const address = await signer.getAddress();
        addWeb3Wallet(address);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <button
        className="w-full bg-white border border-gray-600 rounded-md px-3 py-2 mt-2 text-md text-gray-800 flex items-center gap-2 justify-center"
        onClick={connect}
      >
        <img src="/glogo.png" className="h-5"></img>Continue with Google
      </button>
    </div>
  );
};
