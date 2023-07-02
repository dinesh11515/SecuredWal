import React, { useState, useEffect } from "react";

import { Web3Auth } from "./Web3Auth";
const Backdrop = ({ onClose }) => {
  return (
    <div
      onClick={onClose}
      className="top-0 left-0 fixed bg-black/20 backdrop-blur-md h-screen w-screen"
    ></div>
  );
};

const OwnerModal = ({ onClose, setOwners, owners }) => {
  const [error, setError] = useState(false);
  const [signer, setSigner] = useState(null);

  function addWallet() {
    const wallet = document.getElementById("wallet").value;
    addWeb3Wallet(wallet);
  }

  function addWeb3Wallet(wallet) {
    if (!wallet) return;
    //check for unique wallet in owners
    //getAddress out from owners
    const addresses = owners.map((owner) => owner.id);
    if (addresses.includes(wallet)) {
      onClose();
      return;
    }
    setOwners((owners) => [...owners, { id: wallet }]);
    onClose();
  }

  return (
    <>
      <Backdrop onClose={onClose} />
      <div className="w-[90%] xl:w-[500px] rounded-2xl absolute top-[40%] left-[50%] shadow-md -translate-x-[50%] -translate-y-[50%] z-10 rounded-b-2xl  overflow-hidden border border-gray-800">
        <div className="bg-gray-900  w-full  rounded-t-2xl text-gray-300">
          <div className="border-b-[1px] border-b-gray-600 px-6 py-3 pt-7">
            <h2 className=" font-semibold text-xl">Add owner</h2>
            <p className="text-sm">
              you can create a Web3Auth tKey using Google
            </p>
          </div>
          <div className="px-6 py-1">
            <Web3Auth addWeb3Wallet={addWeb3Wallet} setSigner={setSigner} />
          </div>

          <div className="flex flex-col items-center pb-2 gap-2 px-4 border-b-[1px] border-b-gray-600 text-sm">
            Powered By Web3Auth
          </div>

          <div className="px-6 py-4 pb-7">
            <p className="text-sm">
              if you're confident that you own a wallet then you can enter that
              wallet address here
            </p>
            <div>
              <input
                className={`w-full bg-white border-2 rounded-md px-3 py-2 mt-2 text-sm text-gray-800 focus:outline-none ${
                  error ? "border-[#ff5f72]" : "border-gray-600"
                }`}
                placeholder="wallet address"
                id="wallet"
              />
            </div>
            <div>
              <button
                className="w-full bg-white border border-gray-600 rounded-md px-3 py-2 mt-2 text-sm text-gray-800"
                onClick={addWallet}
              >
                Add Owner
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OwnerModal;
