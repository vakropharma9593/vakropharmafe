"use-client";

import { Mail, Home, ShoppingCart, Package } from "lucide-react";
import { useRouter } from "next/router";
import AdminNavbar from "@/components/AdminNavbar";
import { useContext, useEffect } from "react";
import { toast, Bounce } from "react-toastify";
import { Context } from "@/store/context";
import ACTIONS from "@/store/actions";

const Admin = () => {
    const router = useRouter();
    const { dispatch } = useContext(Context);

    useEffect(() => {
        const getInventory = async () => {
            try {
                const res = await fetch("/api/inventory");

                const data = await res.json();
                if(data.success) {
                    dispatch({ type: ACTIONS.SET_INVENTORY, payload: data.data || [] })
                } else {
                    toast.error(data.message);
                }
            } catch (error) {
                toast(`Failed to get inventory details. Please try again. ${error}`, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    type: "error",
                    theme: "light",
                    transition: Bounce,
                });
            }
        };
        getInventory();
    }, []);

  return (
    <div className="admin-page">
      <AdminNavbar />
      <div className="admin-content">
        <div className="admin-welcome">
          <h1>Welcome to Admin Dashboard</h1>
          <p>Manage your website content and view submissions.</p>
        </div>
        <div className="admin-cards">
            <div className="admin-card" onClick={() => router.push("/admin/order")}>
                <div className="admin-card-icon primary">
                <ShoppingCart size={24} />
                </div>
                <h3>All Order</h3>
                <p>View all orders and add new order.</p>
            </div>
            <div className="admin-card" onClick={() => router.push("/admin/inventory")}>
                <div className="admin-card-icon primary">
                <Package size={24} />
                </div>
                <h3>All Inventory</h3>
                <p>View all inventory and add new inventory.</p>
            </div>
            <div className="admin-card" onClick={() => router.push("/admin/contactus")}>
                <div className="admin-card-icon primary">
                <Mail size={24} />
                </div>
                <h3>Contact Submissions</h3>
                <p>View all contact form submissions from users.</p>
            </div>
            <div className="admin-card" onClick={() => router.push("/")}>
                <div className="admin-card-icon secondary">
                <Home size={24} />
                </div>
                <h3>View Website</h3>
                <p>Go to the main website homepage.</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
