import { Home, PieChart, SlidersHorizontal } from "lucide-react";

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const Navbar = ({ currentPage, onNavigate }: NavbarProps) => {
  // Helper to determine active classes
  const getButtonClass = (page: string) =>
    `flex flex-col items-center gap-1 transition ${
      currentPage === page
        ? "text-indigo-600"
        : "text-gray-400 hover:text-gray-600"
    }`;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-md border-t border-gray-100 p-4 flex justify-around items-center z-20">
      <button 
        onClick={() => onNavigate("home")} 
        className={getButtonClass("home")}
      >
        <Home size={20} />
        <span className="text-[10px] font-medium">Home</span>
      </button>

      <button 
        onClick={() => onNavigate("filters")} 
        className={getButtonClass("filters")}
      >
        <SlidersHorizontal size={20} />
        <span className="text-[10px] font-medium">Filters</span>
      </button>

      <button 
        onClick={() => onNavigate("insights")} 
        className={getButtonClass("insights")}
      >
        <PieChart size={20} />
        <span className="text-[10px] font-medium">Insights</span>
      </button>

      {/* <button 
        onClick={() => onNavigate("profile")} 
        className={getButtonClass("profile")}
      >
        <User size={20} />
        <span className="text-[10px] font-medium">Profile</span>
      </button> */}
    </div>
  );
};

export default Navbar;