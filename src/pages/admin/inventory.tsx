import AdminNavbar from "@/components/AdminNavbar";
import Loader from "@/components/Loader";
import { dateToShow, getExpiryClass } from "@/lib/utils";
import ACTIONS from "@/store/actions";
import { Context } from "@/store/context";
import { useContext, useState } from "react";
import { toast } from "react-toastify";

const Inventory = () => {
    const { state, dispatch } = useContext(Context);
    const inventory = state.inventory;
    const [loader, setLoader] = useState<boolean>(false);
    const [showModal, setShowModal] = useState(false);

    const [formData, setFormData] = useState({
        batch: "",
        itemName: "",
        totalCount: "",
        remainingCount: "",
        receivedDate: "",
        mfgDate: "",
        expiryDate: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        setLoader(true);
        e.preventDefault();

        try {

            const res = await fetch("/api/inventory", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
            });

            const data = await res.json();

            const allData = [...inventory, data.data]

            dispatch({ type: ACTIONS.SET_INVENTORY, payload: allData });

            setShowModal(false);

            toast.success("Inventory added successfully");
        } catch (err) {
            toast.error("Failed to add inventory");
        } finally {
            setLoader(false);
        }
    };

  return (
    <div className="submissions-page">
      <AdminNavbar />
      <div className="submissions-content">
        <div className="submissions-header">
          <h1>
            Inventory List
            <span className="submissions-count">{inventory.length}</span>
          </h1>
          <button className="vakro-add-btn" onClick={() => setShowModal(true)}>
            + Add New Inventory
          </button>
          {/* <p>Add and manage all your inventory.</p> */}
        </div>
        <div className="submissions-table-wrapper">
          {inventory.length > 0 ? (
            <table className="submissions-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Batch No.</th>
                  <th>Item</th>
                  <th>Total Count</th>
                  <th>Remaining Count</th>
                  <th>Received Date</th>
                  <th>Mfg Date</th>
                  <th>Expiry Date</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((item: { id: string, batch: string, itemName: string, totalCount: number, remainingCount: number,  receivedDate: string, mfgDate: string, expiryDate: string }, index) => (
                  <tr key={item?.id} className={getExpiryClass(item?.expiryDate)}>
                    <td>{index + 1}</td>
                    <td>{item?.batch}</td>
                    <td>{item?.itemName}</td>
                    <td>{item?.totalCount}</td>
                    <td>{item?.remainingCount}</td>
                    <td>{dateToShow(item?.receivedDate)}</td>
                    <td>{dateToShow(item?.mfgDate)}</td>
                    <td>{dateToShow(item?.expiryDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="submissions-empty">
              <p>No inventory yet.</p>
            </div>
          )}
        </div>
      </div>
      {loader && <Loader />}
      {showModal && (
        <div className="vakro-modal-overlay">
            <div className="vakro-modal">

            <div className="vakro-modal-header">
                <h2>Add New Inventory</h2>
                <button
                className="vakro-close"
                onClick={() => setShowModal(false)}
                >
                ✕
                </button>
            </div>

            <form className="vakro-form" onSubmit={handleSubmit}>

                <input
                name="batch"
                placeholder="Batch Number"
                onChange={handleChange}
                required
                />

                <select
                    name="itemName"
                    onChange={handleChange}
                >
                    <option value="">Select Product</option>
                    <option value="Facewash">Facewash</option>
                    <option value="Face_Serum">Face Serum</option>
                    <option value="Face_Moisturizer">Face Moisturizer</option>
                    <option value="Sunscreen">Sunscreen</option>
                </select>

                <input
                name="totalCount"
                type="number"
                placeholder="Total Count"
                onChange={handleChange}
                required
                />

                <input
                name="remainingCount"
                type="number"
                placeholder="Remaining Count"
                onChange={handleChange}
                required
                />

                <label>Received Date</label>
                <input
                name="receivedDate"
                type="date"
                onChange={handleChange}
                required
                />

                <label>Mfg Date</label>
                <input
                name="mfgDate"
                type="date"
                onChange={handleChange}
                required
                />

                <label>Expiry Date</label>
                <input
                name="expiryDate"
                type="date"
                onChange={handleChange}
                required
                />

                <button className="vakro-submit-btn">
                Submit Inventory
                </button>

            </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
