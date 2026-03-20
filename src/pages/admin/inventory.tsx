import AdminNavbar from "@/components/AdminNavbar";
import Loader from "@/components/Loader";
import { dateToShow } from "@/lib/utils";
import ACTIONS from "@/store/actions";
import { Context } from "@/store/context";
import { useContext, useState } from "react";
import { toast } from "react-toastify";
import styles from "../../styles/inventory.module.css";
import { InventoryItem } from "@/store/reducers/adminReducer";

const Inventory = () => {
  const { state, dispatch } = useContext(Context);
  const inventory = state.inventory;

  const [loader, setLoader] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    batch: "",
    itemName: "",
    totalCount: "",
    remainingCount: "",
    receivedDate: "",
    mfgDate: "",
    expiryDate: "",
    mrp: null,
    gstPercentage: null,
    basePrice: 0,
    costPrice: 0,
    gstAmount: 0,
  });

  const calculateValues = (mrp: number, gst: number) => {
    const basePrice = mrp / (1 + gst / 100);
    const gstAmount = mrp - basePrice;
    return {
      basePrice: Number(basePrice.toFixed(2)),
      gstAmount: Number(gstAmount.toFixed(2)),
    };
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    let updated = { ...formData, [name]: name === "costPrice" ? parseFloat(value) : value };

    if (name === "mrp" && updated.gstPercentage) {
      const calc = calculateValues(Number(value), Number(updated.gstPercentage));
      updated = { ...updated, ...calc };
    }

    if (name === "gstPercentage" && updated.mrp) {
      const calc = calculateValues(Number(updated.mrp), Number(value));
      updated = { ...updated, ...calc };
    }

    setFormData(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoader(true);
    if (formData?.batch !== "" && formData?.itemName !== "" && formData?.totalCount !== "" && formData?.remainingCount !== "" && formData?.receivedDate !== "" && formData?.mfgDate !== "" && formData?.expiryDate !== "" && formData?.mrp !== "" && formData?.gstPercentage !== "" && formData?.basePrice > 0) {
      try {
        const res = await fetch("/api/inventory", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const data = await res.json();
        if (data.success) {
          dispatch({
            type: ACTIONS.SET_INVENTORY,
            payload: [...inventory, data.data],
          });

          setShowModal(false);
          toast.success("Inventory added successfully");
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
        {/* Header */}
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
                  <th>Item</th>
                  <th>Total</th>
                  <th>Remaining</th>
                  <th>Received</th>
                  <th>Mfg</th>
                  <th>Expiry</th>
                  <th>MRP</th>
                  <th>Base (without GST)</th>
                  <th>Cost Price</th>
                  <th>GST Amt</th>
                  <th>GST %</th>
                </tr>
              </thead>

              <tbody>
                {inventory.map((item: InventoryItem, i: number) => (
                  <tr key={item.id} className={getExpiryClass(item.expiryDate)}>
                    <td>{i + 1}</td>
                    <td>{item.batch}</td>
                    <td>{item.itemName}</td>
                    <td>{item.totalCount}</td>
                    <td>{item.remainingCount}</td>
                    <td>{dateToShow(item.receivedDate)}</td>
                    <td>{dateToShow(item.mfgDate)}</td>
                    <td>{dateToShow(item.expiryDate)}</td>
                    <td>₹{item.mrp}</td>
                    <td>₹{item.basePrice}</td>
                    <td>₹{item.costPrice}</td>
                    <td>₹{item.gstAmount}</td>
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
              <input name="batch" placeholder="Batch" onChange={handleChange} required />

              <select name="itemName" onChange={handleChange}>
                <option value="">Select Product</option>
                <option value="Facewash">Facewash</option>
                <option value="Face_Serum">Face Serum</option>
                <option value="Face_Moisturizer">Moisturizer</option>
                <option value="Sunscreen">Sunscreen</option>
              </select>

              <input type="number" name="totalCount" placeholder="Total Count" onChange={handleChange} />
              <input type="number" name="remainingCount" placeholder="Remaining Count" onChange={handleChange} />

              <label>MFG</label>
              <input type="date" name="mfgDate" onChange={handleChange} />

              <label>Expiry</label>
              <input type="date" name="expiryDate" onChange={handleChange} />

              <label>Received</label>
              <input type="date" name="receivedDate" onChange={handleChange} />
              <input type="number" name="costPrice" placeholder="Cost Price" step="0.01" onChange={handleChange} />

              <input type="number" name="mrp" placeholder="MRP" step="0.01" onChange={handleChange} />
              <input type="number" name="gstPercentage" placeholder="GST %" step="0.01" onChange={handleChange} />

              <div className={styles.calculation}>
                <p>Base: ₹{formData.basePrice}</p>
                <p>GST: ₹{formData.gstAmount}</p>
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