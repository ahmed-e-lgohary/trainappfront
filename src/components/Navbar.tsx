import NavLink from "./NavLink";
import { Link, useLocation, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { FaBars } from "react-icons/fa";

const navLinks = [
  { text: "Home", href: "/home" },
  { text: "Book Tickets", href: "/book" },
  { text: "My Bookings", href: "/my" },
  { text: "Settings", href: "/settings" },
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    
    if (token) {
      setIsLoggedIn(true);
      if (userStr && userStr !== "undefined") {
        try {
          const user = JSON.parse(userStr);
          setUserName(user.name || "U");
        } catch (e) {
          setUserName("U");
        }
      } else {
        setUserName("U");
      }
    } else {
      setIsLoggedIn(false);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 z-50 w-full flex justify-around items-center py-3 px-6 bg-gradient-to-r from-red-950 via-red-900 to-red-700">
      <div className="text-white text-3xl ">
        <Link to="/home" className="text-red-700 font-bold">ENR<span className="text-white"> TICKETS</span></Link>
      </div>
      <button className="text-white text-3xl sm:hidden hover:text-red-600 transition duration-200" onClick={() => setMenuOpen(!menuOpen)}>
        <FaBars />
      </button>
      <ul className={`absolute sm:static top-[70px] left-0 w-full sm:w-auto sm:bg-none bg-gradient-to-r from-red-950 via-red-900 to-red-700 sm:bg-transparent flex flex-col sm:flex-row items-center gap-6 sm:py-0 ${menuOpen ? "block" : "hidden"} sm:flex `}>
        {navLinks.map((link, index) => (
          <NavLink 
            key={index} 
            text={link.text} 
            href={link.href} 
          />
        ))}

        {!isLoggedIn ? (
          <>
            <NavLink text="Login" href="/login" className="px-5 py-[10px] bg-red-700 text-white rounded-[10px] font-[900] hover:bg-white hover:text-red-700 transition duration-300 " />
            <NavLink text="Sign Up" href="/sign" className="px-4 py-[10px] bg-white text-red-700 rounded-[10px] font-[900] hover:bg-red-700 hover:text-white transition duration-300 " />
          </>
        ) : (
          <div className="flex items-center gap-4">
            <Link to="/settings" title="Profile Settings" className="flex items-center justify-center w-10 h-10 bg-white text-red-700 rounded-full font-bold text-xl uppercase shadow-lg border-2 border-red-500 hover:scale-110 transition duration-300">
              {userName.charAt(0)}
            </Link>
            <button onClick={handleLogout} className="px-4 py-2 bg-red-800 text-white rounded-md font-bold hover:bg-red-600 shadow-md transition duration-300 text-sm">
              Logout
            </button>
          </div>
        )}
      </ul>
    </nav>
  );
}
export default Navbar;