import { Home, Mail, LogOut } from "lucide-react";
import vakroLogo from "../../public/assets/vakroGreenLogo.png";
import { useContext } from "react";
import { Context } from "@/store/context";
import ACTIONS from "@/store/actions";
import Image from "next/image";
import { useRouter } from "next/router";

const AdminNavbar = () => {
    const { dispatch } = useContext(Context);
    const router = useRouter();

  const handleLogout = () => {
    dispatch({ type: ACTIONS.REMOVE_AUTH });
  };

  return (
    <nav className="admin-navbar">
      <div className="admin-navbar-content">
        <div className="admin-navbar-left">
          <div className="admin-navbar-logo">
            <Image src={vakroLogo} alt="Vakro" width={80} height={80} style={{ transform: "scale(1.5)", transformOrigin: "center" }} />
            <span>Vakro Admin</span>
          </div>
          <div className="admin-navbar-links">
            <button className={`admin-nav-link ${location.pathname === "/" ? "active" : ""}`} onClick={() => router.replace("/")}>
              <Home size={18} /> Home
            </button>
            <button className={`admin-nav-link ${location.pathname === "/admin/contact-submissions" ? "active" : ""}`} onClick={() => router.push("/admin/contactus")}>
              <Mail size={18} /> Contact Us
            </button>
          </div>
        </div>
        <button className="admin-logout-btn" onClick={handleLogout}>
          <LogOut size={18} /> Logout
        </button>
      </div>
    </nav>
  );
};

export default AdminNavbar;
