import OwnerModal from "../components/OwnerModal";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useContractWrite, useNetwork, useContractRead } from "wagmi";
import "react-toastify/dist/ReactToastify.css";
import { waitForTransaction } from "@wagmi/core";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import { factoryAbi, factoryAddress } from "@/constants";
import { Polybase } from "@polybase/client";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/router";
export default function Create() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [owners, setOwners] = useState([]);
  const [requiredConfirmations, setRequiredConfirmations] = useState(0);
  const [status, setStatus] = useState("Create Smart Wallet");
  // create an array of numbers from  owners length
  const options = Array.from({ length: owners.length }, (_, i) => i + 1);
  const defaultOption = requiredConfirmations;

  const { address } = useAccount();
  const { writeAsync } = useContractWrite({
    address: factoryAddress,
    abi: factoryAbi,
    functionName: "createWallet",
  });

  const { data: walletAddress, isError } = useContractRead({
    address: factoryAddress,
    abi: factoryAbi,
    functionName: "getAddress",
  });

  if (address && owners.length === 0) {
    setOwners([{ id: address }]);
  }
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const db = new Polybase({
    defaultNamespace:
      "pk/0xb5aa6ea50c67df66fc493ab2aef0d9fe423741fa7a4d1eee340e4bb806c2c1be2ae0ce9d519c07da481ad39fa22a96a0811c798db6fae6aa762889c208fee378/SecuredWal",
  });
  const collectionReference = db.collection("SmartWallet");

  async function createRecord() {
    try {
      let ownerDetails = [];

      for (let owner of owners) {
        ownerDetails.push(JSON.stringify(owner));
      }
      console.log(ownerDetails);
      const record = await collectionReference.create([
        document.getElementById("walletName").value,
        address,
        walletAddress,
        ownerDetails,
        requiredConfirmations.value,
      ]);
      console.log(record);
    } catch (err) {
      console.log(err);
    }
  }

  function updateOwners(provider, index) {
    const newOwners = [...owners];
    newOwners[index].provider = provider;
    setOwners(newOwners);
  }

  const createWallet = async () => {
    try {
      if (requiredConfirmations === 0) {
        alert("Please select the number of confirmations required");
        return;
      }
      setStatus("Creating....");
      const addresses = owners.map((owner) => owner.id);
      let tx = await writeAsync({
        args: [addresses, requiredConfirmations.value],
      });
      await waitForTransaction({
        hash: tx.hash,
      });
      setStatus("Uploading to polybase....");
      await createRecord();
      toast.success("Wallet Created");
      setStatus("Create Smart Wallet");
      router.push("/wallet/" + document.getElementById("walletName").value);
    } catch (err) {
      console.log(err);
      setStatus("Create Smart Wallet");
    }
  };

  return (
    <div class="flex flex-col gap-2 font-['DM_Sans'] px-2 mt-2 xl:mx-28 xl:mt-10">
      <div class="flex">
        <div className="mt-2">
          <h1 className="text-2xl tracking-wide ml-2 text-black font-semibold">
            Create Smart Wallet
          </h1>
        </div>
      </div>

      <div className="mt-1 bg-gray-900  rounded-xl">
        <div className=" px-6 py-6 border-b-gray-600">
          <p className="text-lg font-semibold">Enter wallet name</p>
          <input
            className="bg-white border border-gray-600 rounded-md px-3 py-2 mt-2 text-sm text-gray-800  tracking-wide focus:outline-none w-full"
            placeholder="Wallet name"
            id="walletName"
          />
        </div>
      </div>

      <div className=" mt-2 bg-gray-900  rounded-xl">
        <div className="border-b-[1px] px-6 py-6 border-b-gray-600">
          <p className="text-xl font-semibold">Owners</p>
          <p className="mt-">
            Set the owner wallets of your MultiSig Smart Wallet
          </p>
        </div>
        <div className="px-6 py-6">
          {owners.length > 0 && (
            <div className="flex flex-col gap-2 mb-2">
              {owners.map((owner, index) => (
                <div className="flex items-center gap-2 " key={index}>
                  <input
                    className="bg-white border border-gray-600 rounded-md px-3 py-2 mt-2 text-sm text-gray-800 w-1/2 xl:w-60 tracking-wide focus:outline-none"
                    placeholder="Provider"
                    onChange={(e) => updateOwners(e.target.value, index)}
                  />
                  <p className="bg-white border border-gray-600 rounded-md px-3 py-2 mt-2 text-sm text-gray-800 w-1/2 tracking-wide xl:hidden">
                    {owner.id.slice(0, 8) + "..." + owner.id.slice(-6)}
                  </p>
                  <p className="bg-white border border-gray-600 rounded-md px-3 py-2 mt-2 text-sm text-gray-800  tracking-wide  hidden xl:flex w-96">
                    {owner.id}
                  </p>
                </div>
              ))}
            </div>
          )}
          <button
            className="text-blue-500 mt-2 disabled:opacity-50 disabled:text-blue-100"
            onClick={() => setOpenModal(true)}
            disabled={!address}
          >
            + Add new owner
          </button>
        </div>
      </div>
      <div className=" mt-2 bg-gray-900 rounded-xl">
        <div className="border-b-[1px] px-6 py-6 border-b-gray-600">
          <p className="text-xl font-semibold">Confirmations</p>
          <p className="mt-1">Any transaction requires the confirmation of</p>
        </div>
        <div className="px-6 py-6 flex items-center gap-2">
          <Dropdown
            options={options}
            value={defaultOption}
            onChange={(option) => setRequiredConfirmations(option)}
            placeholder={requiredConfirmations}
            className="w-16 text-gray-950 "
          />
          <p>out of {owners.length} owners</p>
        </div>
      </div>
      <div className="flex flex-col items-center m-4">
        {address ? (
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => createWallet()}
          >
            {status}
          </button>
        ) : (
          <ConnectButton showBalance={false} />
        )}
      </div>
      {openModal && (
        <OwnerModal
          onClose={() => setOpenModal(false)}
          setOwners={setOwners}
          owners={owners}
        ></OwnerModal>
      )}
      <ToastContainer />
    </div>
  );
}
