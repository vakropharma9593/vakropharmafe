import AdminNavbar from "@/components/AdminNavbar";
import Loader from "@/components/Loader";
import { ProductType } from "@/lib/utils";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import styles from "../../styles/inventory.module.css";
import ACTIONS from "@/store/actions";
import { Context } from "@/store/context";

const Product = () => {
  const { dispatch, state } = useContext(Context);
  const { products } = state?.adminData;
  const [loader, setLoader] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [allProducts, setAllProducts] = useState<ProductType[]>([]);

  const [formData, setFormData] = useState<ProductType>({
    name: "",
    mrp: 0,
    gstPercentage: 0,
    costPrice: 0,
  });

  useEffect(() => {
    if (products) {
        setAllProducts(products)
    }
  },[products])

  const getProducts = async () => {
    setLoader(true);
    try {
        const res = await fetch("/api/product", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        if (data.success) {
            dispatch({ type: ACTIONS.SET_PRODUCTS, payload: data.data || [] })
        } else {
            toast.error(data.message);
        }
    } catch (error) {
        toast.error("Failed to get product");
    } finally {
        setLoader(false);
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: name !== "name" ? parseFloat(value) : value };
    setFormData(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoader(true);
    if (formData?.name !== "" && formData?.mrp > 0 && formData?.costPrice > 0 && formData?.gstPercentage > 0) {
      try {
        const res = await fetch("/api/product", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const data = await res.json();
        if (data.success) {
          setShowModal(false);
          toast.success(`${formData.name} added successfully`);
          getProducts();
        } else {
          toast.error(data.message);
        }
      } catch {
        toast.error("Failed to add product");
      } finally {
        setLoader(false);
      }
    } else {
      toast.error("Please fill all fields.");
      setLoader(false);
    }
  };

  return (
    <div className={styles.container}>
      <AdminNavbar />

      <div className={styles.content}>
        <div className={styles.header}>
          <h1>
            Product
            <span>{allProducts?.length}</span>
          </h1>

          <button onClick={() => setShowModal(true)}>
            + Add Product
          </button>
        </div>

        {/* Table */}
        <div className={styles.tableWrapper}>
          {allProducts?.length > 0 ? (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Cost Price</th>
                  <th>MRP</th>
                  <th>GST %</th>
                </tr>
              </thead>

              <tbody>
                {allProducts?.map((item: ProductType, i: number) => (
                  <tr key={item?._id}>
                    <td>{i + 1}</td>
                    <td>{item.name}</td>
                    <td>₹{item.costPrice}</td>
                    <td>₹{item.mrp}</td>
                    <td>{item.gstPercentage}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className={styles.empty}>No product yet</p>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>Add Product</h2>
              <button onClick={() => setShowModal(false)}>✕</button>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              <input name="name" placeholder="Product name" onChange={handleChange} required />
              <input type="number" name="costPrice" placeholder="Cost Price" step="0.01" onChange={handleChange} />

              <input type="number" name="mrp" placeholder="MRP" step="0.01" onChange={handleChange} />
              <input type="number" name="gstPercentage" placeholder="GST %" step="0.01" onChange={handleChange} />

              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      )}

      {loader && <Loader />}
    </div>
  );
};

export default Product;