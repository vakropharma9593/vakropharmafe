import { useRouter } from "next/router";
import styles from "../styles/adminNavbar.module.css";
import Image from "next/image";
import vakroLogo from "../../public/assets/goldenLogo.svg";
import { useStore } from "@/store";

type Props = {
  open: boolean;
  setOpen: (val: boolean) => void;
};

const AdminNavbar = ({ open, setOpen }: Props) => {
  const router = useRouter();
  const setAuth = useStore((state) => state.setAuth);

  const handleLogout = () => {
    setAuth({ username: "", isLoggedIn: false });
    router.push("/");
  };

  const navItems = [
    { label: "Orders", path: "/admin/order" },
    { label: "Products", path: "/admin/product" },
    { label: "Inventory", path: "/admin/inventory" },
    { label: "Customers", path: "/admin/customer" },
    { label: "Expenses", path: "/admin/expense" },
    { label: "Payments", path: "/admin/payment" },
    { label: "Credit Inventory", path: "/admin/creditInventory" },
    { label: "Patient Order", path: "/admin/patientOrder" },
    { label: "Reviews", path: "/admin/review" },
    { label: "Insights", path: "/admin/insight" },
    { label: "Contact Forms", path: "/admin/contactus" },
    { label: "QR", path: "/admin/qrCode" },
  ];

  return (
    <>
      {/* MOBILE TOP BAR */}
      <div className={styles.mobileTop}>
        <div className={styles.mobileHeader}>
          {/* <Image src={vakroLogo} alt="Vakro" width={60} height={60} /> */}
          <div className={styles.hamburger} onClick={() => setOpen(!open)}>
            ☰
          </div>
        </div>
      </div>

      {/* SIDEBAR */}
      <aside className={`${styles.sidebar} ${open ? styles.open : styles.closed}`}>

        {/* LOGO */}
        <div className={styles.logo} onClick={() => router.push("/admin")}>
          <Image src={vakroLogo} alt="Vakro" width={40} height={40} />
        </div>

        {/* NAV ITEMS */}
        <div className={styles.navItems}>
          {navItems.map((item) => (
            <button
              key={item.path}
              className={
                router.pathname === item.path ? styles.active : ""
              }
              onClick={() => {
                router.push(item.path);
                setOpen(false);
              }}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* LOGOUT */}
        <div className={styles.bottom}>
          <button className={styles.logout} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>

      <div
        className={`${styles.desktopToggle} ${open ? styles.shifted : ""}`}
        onClick={() => setOpen(!open)}
      >
        {open ? "←" : "→"}
      </div>

      {/* BACKDROP */}
      {open && (
        <div
          className={styles.backdrop}
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
};

export default AdminNavbar;