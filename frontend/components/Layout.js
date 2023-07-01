import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen text-gray-200 font-['Fira_sans']">
      <Navbar />
      {children}
    </div>
  );
}
