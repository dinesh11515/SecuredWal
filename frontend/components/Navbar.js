import { useRouter } from "next/router";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Navbar() {
  const router = useRouter();
  return (
    <div className="flex flex-row justify-between items-center py-3 px-6 mx-2 rounded-2xl bg-gray-200 mt-3 text-black xl:mx-28 xl:mt-5">
      <div className="flex flex-row items-center">
        <button
          className="text-2xl font-bold tracking-widest font-['Fira_sans']"
          onClick={() => {
            router.push("/");
          }}
        >
          SecuredWal
        </button>
      </div>
      <ConnectButton />
    </div>
  );
}
