import AdminNavbar from "@/components/AdminNavbar";
import Loader from "@/components/Loader";
import { dateToShow, ProductType } from "@/lib/utils";
import ACTIONS from "@/store/actions";
import { Context } from "@/store/context";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import styles from "../../styles/inventory.module.css";
import { InventoryItem } from "@/store/reducers/adminReducer";

const Inventory = () => {
  const { state, dispatch } = useContext(Context);
  const inventory = state?.adminData?.inventory;
  const products = state?.adminData?.products;

  const [loader, setLoader] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState<InventoryItem>({
    batch: "",
    productId: "",
    totalCount: 0,
    receivedDate: "",
    mfgDate: "",
    expiryDate: ""
  });

  useEffect(() => {
    getInventory();
  },[]);

  const getInventory = async () => {
    setLoader(true);
    try {
      const res = await fetch("/api/inventory", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if(data?.success) {
        dispatch({
          type: ACTIONS.SET_INVENTORY,
          payload: data.data,
        });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to get inventory");
    } finally {
      setLoader(false);
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: name === "totalCount" ? parseInt(value) : value };
    setFormData(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoader(true);
    if (formData?.batch !== "" && formData?.productId !== "" && formData?.totalCount > 0 && formData?.receivedDate !== "" && formData?.mfgDate !== "" && formData?.expiryDate !== "") {
      try {
        const res = await fetch("/api/inventory", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const data = await res.json();
        if (data.success) {
          setShowModal(false);
          toast.success("Inventory added successfully");
          getInventory();
        } else {
          toast.error(data.message);
        }
      } catch {
        toast.error("Failed to add inventory");
      } finally {
        setLoader(false);
      }
    } else {
      toast.error("Please fill all fields.");
      setLoader(false);
    }
  };

  const getExpiryClass = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);

    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    if (diffDays <= 7) return styles.expiryRed;
    if (diffDays <= 30) return styles.expiryYellow;
    if (diffDays <= 0) return styles.expiryExpired;

    return "basic";
  };

  return (
    <div className={styles.container}>
      <AdminNavbar />

      <div className={styles.content}>
        <div className={styles.header}>
          <h1>
            Inventory
            <span>{inventory.length}</span>
          </h1>

          <button onClick={() => setShowModal(true)}>
            + Add Inventory
          </button>
        </div>

        {/* Table */}
        <div className={styles.tableWrapper}>
          {inventory.length > 0 ? (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Batch</th>
                  <th>Product</th>
                  <th>Total</th>
                  <th>Remaining</th>
                  <th>Received On</th>
                  <th>Mfg</th>
                  <th>Expiry</th>
                  <th>Cost Price</th>
                  <th>GST on CP (%)</th>
                  <th>MRP</th>
                  <th>GST %</th>
                </tr>
              </thead>

              <tbody>
                {inventory.map((item: InventoryItem, i: number) => (
                  <tr key={item?._id} className={getExpiryClass(item.expiryDate)}>
                    <td>{i + 1}</td>
                    <td>{item.batch}</td>
                    <td>{item?.productName}</td>
                    <td>{item.totalCount}</td>
                    <td>{item.remainingCount}</td>
                    <td>{dateToShow(item.receivedDate)}</td>
                    <td>{dateToShow(item.mfgDate)}</td>
                    <td>{dateToShow(item.expiryDate)}</td>
                    <td>₹{item.costPrice}</td>
                    <td>{item?.gstPercentageOnCostPrice}%</td>
                    <td>₹{item?.mrp}</td>
                    <td>{item.gstPercentage}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className={styles.empty}>No inventory yet</p>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>Add Inventory</h2>
              <button onClick={() => setShowModal(false)}>✕</button>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label>Batch Name</label>
                <input name="batch" placeholder="Batch" onChange={handleChange} required />
              </div>
              
              <div className={styles.formGroup}>
                <label>Product Name</label>
                <select name="productId" onChange={handleChange}>
                  <option value="">Select Product</option>
                  {products?.map((item: ProductType) => {
                    return (
                      <option key={item?._id} value={item?._id}>{item?.name}</option>
                    )
                  })}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Total Units</label>
                <input type="number" name="totalCount" placeholder="Total Count" onChange={handleChange} />
              </div>

              <div className={styles.formGroup}>
                <label>MFG Date</label>
                <input className={styles.dateField} type="date" name="mfgDate" onChange={handleChange} />
              </div>
              <div className={styles.formGroup}>
                <label>Expiry Date</label>
                <input className={styles.dateField} type="date" name="expiryDate" onChange={handleChange} />
              </div>
              <div className={styles.formGroup}>
                <label>Received Date</label>
                <input type="date" className={styles.dateField} name="receivedDate" onChange={handleChange} />
              </div>

              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      )}

      {loader && <Loader />}
    </div>
  );
};

export default Inventory;