import AdminNavbar from "@/components/AdminNavbar";
import styles from "../styles/adminLayout.module.css";
import { useState } from "react";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
    const [open, setOpen] = useState(false);

    return (
    <div className={`${styles.layout} ${!open ? styles.sidebarClosed : ""}`}>
        <AdminNavbar open={open} setOpen={setOpen} />
        <main className={styles.mainContent}>{children}</main>
    </div>
    );
};

export default AdminLayout;