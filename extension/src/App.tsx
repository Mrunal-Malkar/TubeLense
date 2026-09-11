import { Toaster } from "react-hot-toast";
import "./App.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Navbar from "./components/navbar";
import { useState } from "react";
import HomePage from "./pages/home";
import Profile from "./pages/profile";
import Insights from "./pages/Insights";
import Filters from "./pages/filters";
import Info from "./pages/info";

const queryClient = new QueryClient();
function App() {
  // Initialize with 'home' so a tab is selected on mount
  const [currentPage, setCurrentPage] = useState<string>("home");

  // Void function to handle navigation changes
  const handleNavigate = (page: string): void => {
    setCurrentPage(page);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex h-[680px] w-90 items-center justify-center bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.08),transparent_32%),linear-gradient(135deg,#F7F8FC_0%,#FBFCFF_100%)] overflow-y-auto pb-16">
        <Toaster />

        {/* You can now use currentPage to conditionally render your page components */}
        {currentPage === "home" && <HomePage goToInfoPage={() => handleNavigate("info")} />}
        {currentPage === "profile" && <Profile />}
        {currentPage === "insights" && <Insights />}
        {currentPage === "filters" &&
          <Filters goToInfoPage={() => handleNavigate("info")} />}
        {currentPage === "info" && <Info goToHome={() => handleNavigate("home")} />}

        <Navbar currentPage={currentPage} onNavigate={handleNavigate} />
      </div>
    </QueryClientProvider>
  );
}

export default App;