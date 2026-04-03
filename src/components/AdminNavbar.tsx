import { useContext, useState } from "react";
import { useRouter } from "next/router";
import styles from "../styles/adminNavbar.module.css";

import { Context } from "@/store/context";
import ACTIONS from "@/store/actions";
import Image from "next/image";
import vakroLogo from "../../public/assets/goldenLogo.svg";

const AdminNavbar = () => {
  const router = useRouter();
  const { dispatch } = useContext(Context);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch({
      type: ACTIONS.SET_AUTH,
      payload: { username: "", isLoggedIn: false },
    });
    router.push("/");
  };

  const navItems = [
    { label: "Products", path: "/admin/product" },
    { label: "Inventory", path: "/admin/inventory" },
    { label: "Customers", path: "/admin/customer" },
    { label: "Orders", path: "/admin/order" },
    { label: "Expenses", path: "/admin/expense" },
    { label: "Payments", path: "/admin/payment" },
    { label: "Credit Inventory", path: "/admin/creditInventory" },
    { label: "Patient Order", path: "/admin/patientOrder" },
    { label: "Reviews", path: "/admin/review" },
    { label: "Contact Forms", path: "/admin/contactus" },
    { label: "QR", path: "/admin/qrCode" },
  ];

  return (
    <>
      <nav className={styles.navbar}>
        {/* LEFT */}
        <div className={styles.logo} onClick={() => router.push("/admin")}>
          <Image
            src={vakroLogo}
            alt="Vakro"
            width={80}
            height={80}
            style={{ transform: "scale(1.5)" }}
          />
        </div>

        {/* DESKTOP LINKS */}
        <div className={styles.links}>
          {navItems.map((item) => (
            <button
              key={item.path}
              className={router.pathname === item.path ? styles.active : ""}
              onClick={() => router.push(item.path)}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* RIGHT */}
        <div className={styles.actions}>
          <button className={styles.logout} onClick={handleLogout}>
            Logout
          </button>

          {/* HAMBURGER */}
          <div
            className={styles.hamburger}
            onClick={() => setMenuOpen(true)}
          >
            ☰
          </div>
        </div>
      </nav>

      {/* MOBILE DRAWER */}
      <div
        className={`${styles.drawer} ${menuOpen ? styles.open : ""}`}
      >
        <div className={styles.drawerHeader}>
          <span>Menu</span>
          <button onClick={() => setMenuOpen(false)}>✕</button>
        </div>

        <div className={styles.drawerLinks}>
          {navItems.map((item) => (
            <button
              key={item.path}
              className={router.pathname === item.path ? styles.active : ""}
              onClick={() => {
                router.push(item.path);
                setMenuOpen(false);
              }}
            >
              {item.label}
            </button>
          ))}

          <button className={styles.logout} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* BACKDROP */}
      {menuOpen && (
        <div
          className={styles.backdrop}
          onClick={() => setMenuOpen(false)}
        />
      )}
    </>
  );
};

export default AdminNavbar;