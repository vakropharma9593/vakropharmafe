import { Home, Mail, LogOut, Package, Users, ShoppingCart } from "lucide-react";
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
            <button className={`admin-nav-link ${location.pathname === "/admin" ? "active" : ""}`} onClick={() => router.replace("/admin")}>
              <Home size={18} /> Home
            </button>
            <button className={`admin-nav-link ${location.pathname === "/admin/order" ? "active" : ""}`} onClick={() => router.replace("/admin/order")}>
              <ShoppingCart size={18} /> Order
            </button>
            <button className={`admin-nav-link ${location.pathname === "/admin/inventory" ? "active" : ""}`} onClick={() => router.push("/admin/inventory")}>
              <Package size={18} /> Inventory
            </button>
            <button className={`admin-nav-link ${location.pathname === "/admin/customer" ? "active" : ""}`} onClick={() => router.push("/admin/customer")}>
              <Users size={18} /> Customer
            </button>
            <button className={`admin-nav-link ${location.pathname === "/admin/contactus" ? "active" : ""}`} onClick={() => router.push("/admin/contactus")}>
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
