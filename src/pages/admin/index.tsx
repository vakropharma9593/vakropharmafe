"use client";

import styles from "../../styles/admin.module.css";
import { useEffect, useState } from "react";
import { toast, Bounce } from "react-toastify";
import { useRouter } from "next/router";
import Loader from "@/components/Loader";
import { useStore } from "@/store";
import AdminLayout from "@/components/AdminLayout"; // 👈 add this

const Admin = () => {
  const [loader, setLoader] = useState(true);
  const router = useRouter();
  const setInventory = useStore((state) => state.setInventory);
  const setProducts = useStore((state) => state.setProducts);

  useEffect(() => {
    const getInventory = async () => {
      try {
        setLoader(true);
        const res = await fetch("/api/inventory");
        const data = await res.json();
        if (data.success) {
          setInventory(data.data || []);
        } else {
          toast.error("Failed to fetch inventory");
        }
      } catch (error) {
        toast.error(`Inventory error: ${error}`, {
          type: "error",
          transition: Bounce,
        });
      }
    };

    const getProducts = async () => {
      setLoader(true);
      try {
        const res = await fetch("/api/product");
        const data = await res.json();
        if (data.success) {
          setProducts(data.data || []);
        } else {
          toast.error("Failed to fetch products");
        }
      } catch {
        toast.error("Failed to fetch products");
      } finally {
        setLoader(false);
      }
    };

    getInventory();
    getProducts();
  }, []);

  useEffect(() => {
    if (!loader) {
      router.push("/admin/order")
    }
  },[loader])

  return (
    <AdminLayout>
      <div className={styles.container}>
        <h1 className={styles.title}>Business Insights</h1>
        <div
          className={styles.insightButon}
          onClick={() => router.push("/admin/insight")}
        >
          Go to Insights
        </div>
      </div>
      {loader && <Loader />}
    </AdminLayout>
  );
};

export default Admin;