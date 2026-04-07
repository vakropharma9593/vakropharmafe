import AdminNavbar from "@/components/AdminNavbar";
import Loader from "@/components/Loader";
import { ProductType } from "@/lib/utils";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import styles from "../../styles/inventory.module.css";
import { useStore } from "@/store";

const Product = () => {
  const products = useStore((state) => state.adminData.products);
  const setProducts = useStore((state) => state.setProducts);
  const [loader, setLoader] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [allProducts, setAllProducts] = useState<ProductType[]>([]);

  const [formData, setFormData] = useState<ProductType>({
    name: "",
    mrp: 0,
    gstPercentage: 0,
    costPrice: 0,
    gstPercentageOnCostPrice: 0,
    isActive: false,
  });

  useEffect(() => {
    getProducts();
  },[])

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
          setProducts(data.data || []);
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
    if (formData?.name !== "" && formData?.mrp > 0 && formData?.costPrice > 0 && formData?.gstPercentage > 0 && formData?.gstPercentageOnCostPrice > 0) {
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

  const handleUpdateProductStatus = async (id: string, status: boolean) => {
    setLoader(true);
    try {
      const res = await fetch(`/api/product/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isActive: !status }),
        });

        const data = await res.json();
        if (data.success) {
          setShowModal(false);
          toast.success(`Status updated successfully`);
          getProducts();
        } else {
          toast.error(data.message);
        }
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setLoader(false);
    }
  }

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
                  <th>GST% Paid</th>
                  <th>MRP</th>
                  <th>GST %</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {allProducts?.map((item: ProductType, i: number) => (
                  <tr key={item?._id} className={!item.isActive ? styles.inActive : "" }>
                    <td>{i + 1}</td>
                    <td>{item.name}</td>
                    <td>₹{item.costPrice}</td>
                    <td>{item?.gstPercentageOnCostPrice}%</td>
                    <td>₹{item.mrp}</td>
                    <td>{item.gstPercentage}%</td>
                    <td>{item.isActive ? "Active" :  "Inactive"} </td>
                    <td>
                      <button
                        className={styles.updateBtn}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpdateProductStatus(item?._id || "", item?.isActive);
                        }}
                        style={{ cursor: "pointer"}}
                      >
                        {item.isActive ? "Mark Inactive" : "Mark Active"}
                      </button>
                    </td>
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
              <div className={styles.formGroup}>
                <label>Product Name</label>
                <input
                  name="name"
                  placeholder="Enter product name"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Cost Price (₹)</label>
                <input
                  type="number"
                  name="costPrice"
                  placeholder="Enter cost price"
                  step="0.01"
                  onChange={handleChange}
                />
              </div>

              <div className={styles.formGroup}>
                <label>GST % Paid (on Cost Price)</label>
                <input
                  type="number"
                  name="gstPercentageOnCostPrice"
                  placeholder="Enter GST paid"
                  step="0.01"
                  onChange={handleChange}
                />
              </div>

              <div className={styles.formGroup}>
                <label>MRP (₹)</label>
                <input
                  type="number"
                  name="mrp"
                  placeholder="Enter MRP"
                  step="0.01"
                  onChange={handleChange}
                />
              </div>

              <div className={styles.formGroup}>
                <label>GST % (Selling)</label>
                <input
                  type="number"
                  name="gstPercentage"
                  placeholder="Enter GST %"
                  step="0.01"
                  onChange={handleChange}
                />
              </div>

              <div className={styles.radioGroup}>
                <p>Is Active</p>
                <div className={styles.radioOptions}>
                  <label>
                    <input
                      type="radio"
                      name="isActive"
                      value="true"
                      checked={formData.isActive === true}
                      onChange={() =>
                          setFormData({ ...formData, isActive: true })
                      }
                    />
                      Yes
                  </label>

                  <label>
                    <input
                      type="radio"
                      name="isActive"
                      value="false"
                      checked={formData.isActive === false}
                      onChange={() =>
                          setFormData({ ...formData, isActive: false })
                      }
                    />
                      No
                  </label>
                </div>
              </div>

              <button type="submit" className={styles.submitBtn}>
                Submit Product
              </button>
            </form>
          </div>
        </div>
      )}

      {loader && <Loader />}
    </div>
  );
};

export default Product;