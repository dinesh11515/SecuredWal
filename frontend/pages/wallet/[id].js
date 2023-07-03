import { useNetwork } from "wagmi";
import { ethers, utils, parseEther, formatUnits, Contract } from "ethers";
import { useEffect, useState } from "react";
import { walletAbi } from "@/constants";
import { Web3Auth } from "@/components/Web3Auth";
import { useContractWrite, useContractRead, useBalance } from "wagmi";
import {
  DocumentDuplicateIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";
import { ArrowUpRightIcon, UserIcon } from "@heroicons/react/20/solid";
import { waitForTransaction } from "@wagmi/core";
import { useRouter } from "next/router";
import { Polybase } from "@polybase/client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function index() {
  const router = useRouter();
  const name = router.query.id;
  const [signer, setSigner] = useState(null);
  const [started, setStarted] = useState(false);
  console.log(signer);
  const db = new Polybase({
    defaultNamespace:
      "pk/0xb5aa6ea50c67df66fc493ab2aef0d9fe423741fa7a4d1eee340e4bb806c2c1be2ae0ce9d519c07da481ad39fa22a96a0811c798db6fae6aa762889c208fee378/FanSig",
  });
  const collectionReference = db.collection("SmartWallet");
  const [data, setData] = useState({
    id: "",
    address: "",
    owners: [],
    requiredConfirmations: 0,
  });
  const [loading, setLoading] = useState(true);
  const wallet = data.address;
  const { chain } = useNetwork();
  const [mounted, setMounted] = useState(false);
  const { data: balan } = useBalance({
    address: wallet,
  });
  const getRecord = async () => {
    try {
      const record = await collectionReference.record(name).get();
      if (record.data) {
        setData(record.data);
      }
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (name) {
      getRecord();
    }
  }, [name]);

  const { writeAsync: submit } = useContractWrite({
    address: wallet,
    abi: walletAbi,
    functionName: "submitTransaction",
  });

  //   const { writeAsync: internalTransfer } = useContractWrite({
  //     address: wallet,
  //     abi: walletAbi,
  //     functionName: "internalTransfer",
  //   });

  const { data: transactions, isError } = useContractRead({
    address: wallet,
    abi: walletAbi,
    functionName: "getTransactions",
  });

  const addWeb3Wallet = async (wallet) => {
    console.log(wallet);
  };

  const send = async () => {
    try {
      setStarted(true);
      const receiver = document.getElementById("receiver").value;
      const amount = document.getElementById("amount").value;
      const tx = submit({
        args: [receiver, parseEther(amount), "0x"],
      });
      const receipt = await waitForTransaction({
        hash: tx.hash,
      });
      toast.success("Transaction sent");
      setStarted(false);
    } catch (err) {
      console.log(err);
      // toast.error("Transaction failed");
      setStarted(false);
    }
  };

  async function confirm(index) {
    try {
      setStarted(true);
      const contract = new Contract(wallet, walletAbi, signer);
      const tx = await contract.confirmTransaction(index);
      const receipt = await tx.wait();
      toast.success("Transaction confirmed");
      setStarted(false);
    } catch (err) {
      console.log(err);
      toast.error("Transaction failed");
      setStarted(false);
    }
  }

  function copyAddress() {
    navigator.clipboard.writeText(wallet);
    toast.success("Address copied");
  }

  function openExplorer() {
    window.open("https://ftmscan.com/address/" + wallet);
  }

  useState(() => {
    setMounted(true);
  }, []);

  let found = false;
  let queue = false;

  if (!mounted) {
    return null;
  }

  return (
    <div>
      {loading ? (
        <div className="flex  justify-center mt-[22%]">
          <img src="/loading.gif" className="h-8 rounded-full"></img>
        </div>
      ) : (
        <div className="font-['DM_Sans'] mx-3 xl:mx-20 xl:mt-5">
          <div className="">
            <div className="xl:flex xl:w-full xl:gap-8">
              <div className="w-full xl:w-1/2">
                <h1 className="text-lg tracking-wider font-bold text-black m-2 xl:m-0">
                  Overview
                </h1>
                <div className=" mt-2 bg-gray-900 py-5 px-7 rounded-xl">
                  <div className="flex items-center justify-between">
                    <img src="/profile.png" className="h-12 rounded-full"></img>
                    <div className="flex gap-2">
                      {chain && (
                        <div className="ml-2 bg-blue-800 rounded-md p-2 px-4">
                          <p className="text-sm font-semibold">{chain.name}</p>

                          {balan && (
                            <div className="flex gap-1 text-sm items-center justify-center">
                              <p>{balan.formatted}</p>
                              <p>{balan.symbol}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col mt-4">
                    <p>{name}</p>
                    <div className="flex items-center gap-2 justify-between">
                      <p className="hidden xl:flex tracking-wider">{wallet}</p>
                      <p className="tracking-widest xl:hidden">
                        {wallet.slice(0, 8) + "......." + wallet.slice(-8)}{" "}
                      </p>
                      <div className="flex gap-2 items-center  hover:cursor-pointer">
                        <DocumentDuplicateIcon
                          className="h-5 mb-1"
                          onClick={copyAddress}
                        />
                        <ArrowTopRightOnSquareIcon
                          className="h-5 mb-1 hover:cursor-pointer"
                          onClick={openExplorer}
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="mt-2 text-lg">Owners</p>
                    {data.owners.map((owner) => {
                      const details = JSON.parse(owner);
                      return (
                        <div className="flex mb-2 gap-2 items-center justify-between">
                          <p className="hidden xl:flex tracking-wider ">
                            {details.id}
                          </p>
                          <p className="tracking-widest xl:hidden">
                            {details.id.slice(0, 8) +
                              "......." +
                              details.id.slice(-8)}
                          </p>
                          <p className="bg-[#232323] border border-gray-600 rounded-md px-3 py-1 text-sm text-gray-300 w-fit tracking-wide capitalize">
                            {details.provider}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="w-full mt-3 xl:w-1/2 xl:mt-0 ">
                <h1 className="text-lg tracking-wider font-bold text-black m-2 xl:m-0">
                  Transaction
                </h1>
                <div className=" mt-2 bg-gray-900  py-5 px-7 rounded-xl">
                  <p>Receiver address</p>
                  <input
                    className="w-full bg-white p-2 text-gray-800 rounded-md mt-2 focus:outline-none"
                    placeholder="address"
                    id="receiver"
                  ></input>
                  <p className="mt-2">Amount</p>
                  <input
                    className="w-full bg-white text-gray-800 p-2 rounded-md mt-2 focus:outline-none"
                    placeholder="0"
                    id="amount"
                  ></input>
                  <div className="mt-2 flex flex-col items-center">
                    {started ? (
                      <div className="flex gap-2 items-center mt-2">
                        <img
                          src="/loading.gif"
                          className="h-6 rounded-full"
                        ></img>
                      </div>
                    ) : (
                      <button
                        className="bg-blue-800 rounded-md p-2 mt-2 px-6"
                        onClick={send}
                      >
                        Send
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-5">
            <div className="xl:flex xl:w-full xl:gap-8">
              <div className="w-full xl:w-1/2">
                <h1 className="text-lg tracking-wider font-bold text-black m-2 xl:m-0">
                  History
                </h1>
                <div className="flex flex-col gap-2 bg-gray-900 p-2 mt-2 rounded-xl ">
                  <div className="flex flex-col gap-2 ">
                    <div>
                      {transactions ? (
                        transactions.map((tx, index) => {
                          console.log(tx);
                          if (
                            tx.numConfirmations == data.requiredConfirmations
                          ) {
                            found = true;
                            return (
                              <div className="px-2 py-2 xl:flex xl:items-center xl:gap-10  xl:justify-between ">
                                <div className="flex items-center justify-between xl:gap-3 xl:w-full">
                                  <p>{index}</p>
                                  <p className="flex gap-1">
                                    <ArrowUpRightIcon className="h-6" />
                                    <p className="">Send</p>
                                  </p>
                                  <p className="">
                                    {tx.to.slice(0, 11)}....{tx.to.slice(-11)}
                                  </p>
                                </div>

                                <div className="flex justify-between items-center mt-2 xl:mt-0 xl:gap-3 xl:w-full">
                                  <div className="flex items-center gap-1 ">
                                    <p>{formatUnits(tx.value)}</p>
                                    <p>{chain.nativeCurrency.symbol}</p>
                                  </div>
                                  <p className="flex items-center gap-1">
                                    <UserIcon className="h-5 text-gray-600" />{" "}
                                    {formatUnits(tx.numConfirmations, 0)} out of{" "}
                                    {data.requiredConfirmations}
                                  </p>

                                  <p className="h-6 text-green-500">success</p>
                                </div>
                              </div>
                            );
                          }
                        })
                      ) : (
                        <div className="flex justify-center p-2">
                          {(found = true)}
                          <p>No Transactions in History</p>
                        </div>
                      )}
                      {!found && (
                        <div className="flex justify-center p-2">
                          <p>No Transactions in History</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full mt-3 xl:w-1/2 xl:mt-0 ">
                <h1 className="text-lg tracking-wider font-bold text-black m-2 xl:m-0">
                  Transaction Queue
                </h1>
                <div className="flex flex-col gap-2 bg-gray-900 p-2 mt-2 rounded-xl ">
                  <div className="flex flex-col gap-2 ">
                    {signer ? (
                      <div>
                        {transactions ? (
                          transactions.map((tx, index) => {
                            if (
                              tx.numConfirmations != data.requiredConfirmations
                            ) {
                              queue = true;
                              return (
                                <div className="px-2 py-1 xl:flex xl:items-center xl:gap-10  xl:justify-between">
                                  <div className="flex items-center justify-between xl:gap-3 xl:w-full">
                                    <p>{index}</p>
                                    <p className="flex gap-1">
                                      <ArrowUpRightIcon className="h-6" />
                                      <p className="">Send</p>
                                    </p>
                                    <p className="">
                                      {tx.to.slice(0, 11)}....{tx.to.slice(-11)}
                                    </p>
                                  </div>

                                  <div className="flex justify-between items-center mt-2 xl:mt-0 xl:w-full">
                                    <div className="flex items-center gap-1">
                                      <p>{formatUnits(tx.value)}</p>
                                      <p>{chain.nativeCurrency.symbol}</p>
                                    </div>
                                    <p className="flex items-center gap-1">
                                      <UserIcon className="h-5 text-gray-600" />{" "}
                                      {formatUnits(tx.numConfirmations, 0)} out
                                      of {data.requiredConfirmations}
                                    </p>

                                    {started ? (
                                      <div className="flex gap-2 items-center mt-2">
                                        <img
                                          src="/loading.gif"
                                          className="h-6 rounded-full"
                                        ></img>
                                      </div>
                                    ) : (
                                      <button
                                        className="bg-blue-800 rounded-md px-4 py-1"
                                        onClick={() => confirm(index)}
                                      >
                                        Confirm
                                      </button>
                                    )}
                                  </div>
                                </div>
                              );
                            }
                          })
                        ) : (
                          <div className="flex justify-center p-2">
                            {(queue = true)}
                            <p>No Transactions in Queue</p>
                          </div>
                        )}
                        {!queue && (
                          <div className="flex justify-center p-2">
                            <p>No Transactions in Queue</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className=" px-6 pb-2">
                        <p className=" text-md py-2">
                          One of the owner was Google. So you have to sign in
                          with google to confirm transactions.
                        </p>
                        <Web3Auth
                          addWeb3Wallet={addWeb3Wallet}
                          setSigner={setSigner}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="xl:mt-4">
            <div className="xl:flex xl:w-full xl:gap-8">
              <div className="w-full mt-3 xl:w-1/2 xl:mt-0 "></div>
            </div>
          </div>
          <ToastContainer />
        </div>
      )}
    </div>
  );
}
