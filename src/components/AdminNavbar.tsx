import { useContext } from "react";
import { useRouter } from "next/router";
import styles from "../styles/adminNavbar.module.css";

import { Context } from "@/store/context";
import ACTIONS from "@/store/actions";
import Image from "next/image";
import vakroLogo from "../../public/assets/goldenLogo.svg";

const AdminNavbar = () => {
  const router = useRouter();
  const { dispatch } = useContext(Context);

  const handleLogout = () => {
    dispatch({
      type: ACTIONS.SET_AUTH,
      payload: { username: "", isLoggedIn: false },
    });
    router.push("/");
  };

  return (
    <nav className={styles.navbar}>
      {/* LEFT */}
      <div className={styles.logo} onClick={() => router.push("/admin")}>
        <Image src={vakroLogo} alt="Vakro" width={80} height={80} style={{ transform: "scale(1.5)", transformOrigin: "center" }} />
      </div>

      {/* CENTER LINKS */}
      <div className={styles.links}>
        <button
          className={router.pathname === "/admin" ? styles.active : ""}
          onClick={() => router.push("/admin")}
        >
          Dashboard
        </button>

        <button
          className={router.pathname === "/admin/inventory" ? styles.active : ""}
          onClick={() => router.push("/admin/inventory")}
        >
          Inventory
        </button>

        <button
          className={router.pathname === "/admin/customer" ? styles.active : ""}
          onClick={() => router.push("/admin/customer")}
        >
          Customers
        </button>

        <button
          className={router.pathname === "/admin/order" ? styles.active : ""}
          onClick={() => router.push("/admin/order")}
        >
          Orders
        </button>

        <button
          className={router.pathname === "/admin/creditInventory" ? styles.active : ""}
          onClick={() => router.push("/admin/creditInventory")}
        >
          Credit Inventory
        </button>

        <button
          className={router.pathname === "/admin/expense" ? styles.active : ""}
          onClick={() => router.push("/admin/expense")}
        >
          Expenses
        </button>

        <button
          className={router.pathname === "/admin/payment" ? styles.active : ""}
          onClick={() => router.push("/admin/payment")}
        >
          Payments
        </button>

        <button
          className={router.pathname === "/admin/contactus" ? styles.active : ""}
          onClick={() => router.push("/admin/contactus")}
        >
          Contact Forms
        </button>
      </div>

      {/* RIGHT */}
      <div className={styles.actions}>
        <button className={styles.logout} onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default AdminNavbar;