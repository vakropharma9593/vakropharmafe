import AdminNavbar from "@/components/AdminNavbar";
import Loader from "@/components/Loader";
import { useContext, useEffect, useState } from "react";
import { toast, Bounce } from "react-toastify";
import styles from "../../styles/inventory.module.css";
import { Context } from "@/store/context";
import OrderModal from "@/components/OrderModal";

type CreditInventoryItem = {
  batch: string;
  itemName: string;
  totalCount: number;
  remainingCount: number;
  customerName: string;
  customerId: string;
  customerNumber: number;
  id: string;
}

const CreditInventory = () => {
  const { state } = useContext(Context);
  const stateInventory = state.inventory;
  const [loader, setLoader] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [creditInventory, setCreditInventory] = useState<CreditInventoryItem[]>([]);
  const [errors, setErrors] = useState({ customerNumber: "" });
  const [batches, setBatches] = useState<{batch: string, mrp: number}[]>([]);

  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderFormData, setOrderFormData] = useState({
    customerPhone: "",
    customerId: "",
    customerName: "",
    date: "",
    status: "Payment_Pending",
    paymentType: "UPI",
    selectedProduct: "",
  });

  const [formData, setFormData] = useState({
    batch: "",
    itemName: "",
    totalCount: "",
    remainingCount: "",
    customerNumber: "",
    customerId: "",
    customerName: "",
  });

  useEffect(() => {
      getCreditInventory();
    }, []);

    const getCreditInventory = async () => {
      setLoader(true);
      try {
          const res = await fetch("/api/inventory/credit");

          const data = await res.json();
          const finalData = data.data;
          const finalInventory = finalData?.map((each: { batch: string, itemName: string, totalCount: number, remainingCount: number, customerId: { _id: string, name: string, phone: number }, _id: string }) => {
            return {
              batch: each?.batch,
              itemName: each?.itemName,
              totalCount: each?.totalCount,
              remainingCount: each?.remainingCount,
              customerName: each?.customerId?.name,
              customerId: each?.customerId?._id,
              customerNumber: each?.customerId?.phone,
              id: each?._id,
            }
          });
          setCreditInventory(finalInventory);

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
      } finally {
        setLoader(false);
      }
    };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    const updated = { ...formData, [name]: value };
    setFormData(updated);
    if (name === "itemName") {
      const allbatches = stateInventory?.filter((item: { batch: string, itemName: string }) => item?.itemName === value).map((inventory: { batch: string, mrp: number }) => { return {batch: inventory.batch, mrp: inventory.mrp}});
      setBatches(allbatches);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoader(true);
    if (formData?.batch !== "" && formData?.itemName !== "" && formData?.totalCount !== "" && formData?.remainingCount !== "" && formData?.customerId !== "" && formData?.customerName !== "") {
      try {
        const res = await fetch("/api/inventory/credit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const data = await res.json();
        const finalData = data.data;
        const finalInventory = {
          batch: finalData?.batch,
          itemName: finalData?.itemName,
          totalCount: finalData?.totalCount,
          remainingCount: finalData?.remainingCount,
          customerName: finalData?.customerId?.name,
          customerId: finalData?.customerId?._id,
          customerNumber: finalData?.customerId?.phone,
          id: finalData?._id,
        }
        const finalCreditInventory = [...creditInventory, finalInventory];
        setCreditInventory(finalCreditInventory);

        setShowModal(false);
        toast.success("Credit Inventory added successfully");
      } catch {
        toast.error("Failed to add credit inventory");
      } finally {
        setLoader(false);
      }
    } else {
      toast.error("Please fill all fields.");
      setLoader(false);
    }
  };

   const getCustomer = async (phone: string) => {
    setLoader(true);
    try {
      const res = await fetch(`/api/customer/${phone}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      setFormData({ ...formData, customerNumber: phone, customerName: data.data.name, customerId: data.data?._id})

      toast.success("Customer fetched successfully");
    } catch {
      toast.error("Failed to fetch customer details.");
    } finally {
      setLoader(false);
    }
  }

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      setErrors({ customerNumber: "Phone must be 10 digits" });
      return false;
    }
    setErrors({ customerNumber: "" });
    return true;
  };

  return (
    <div className={styles.container}>
      <AdminNavbar />

      <div className={styles.content}>
        {/* Header */}
        <div className={styles.header}>
          <h1>
            Credit Inventory
            <span>{creditInventory.length}</span>
          </h1>

          <button onClick={() => setShowModal(true)}>
            + Add Credit Inventory
          </button>
        </div>

        {/* Table */}
        <div className={styles.tableWrapper}>
          {creditInventory.length > 0 ? (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Batch</th>
                  <th>Item</th>
                  <th>Total</th>
                  <th>Remaining</th>
                  <th>Customer Name</th>
                  <th>Customer Number</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {creditInventory.map((item: CreditInventoryItem, i: number) => (
                  <tr key={item.id}>
                    <td>{i + 1}</td>
                    <td>{item.batch}</td>
                    <td>{item.itemName}</td>
                    <td>{item.totalCount}</td>
                    <td>{item.remainingCount}</td>
                    <td>{item?.customerName}</td>
                    <td>{item?.customerNumber}</td>
                    <td className={styles.actions}>
                      <button onClick={() => {
                        setOrderFormData({ ...orderFormData, customerPhone: JSON.stringify(item?.customerNumber), customerName: item?.customerName, customerId: item?.customerId || "", selectedProduct: item?.itemName });
                        setShowOrderModal(true);
                      }}>
                        Place Order
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className={styles.empty}>No credit inventory yet</p>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>Add Credit Inventory</h2>
              <button onClick={() => setShowModal(false)}>✕</button>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              <input
                placeholder="Customer Phone"
                value={formData.customerNumber}
                maxLength={10}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  setFormData({
                    ...formData,
                    customerNumber: value,
                    customerId: "",
                    customerName: ""
                  })
                  if (value?.length === 10) {
                    getCustomer(value);
                  }
                }}
                onBlur={() => validatePhone(formData.customerNumber)}
              />
              {errors.customerNumber !== "" && (
                <p className={styles.error}>{errors.customerNumber}</p>
              )}

              {formData?.customerName && <h4>Customer Details :: {formData?.customerName}</h4>}

              {/* <input name="batch" placeholder="Batch" onChange={handleChange} required /> */}

              <select name="itemName" onChange={handleChange}>
                <option value="">Select Product</option>
                <option value="Facewash">Facewash</option>
                <option value="Face_Serum">Face Serum</option>
                <option value="Face_Moisturizer">Moisturizer</option>
                <option value="Sunscreen">Sunscreen</option>
              </select>

              <select
                name="batch"
                value={formData.batch}
                onChange={handleChange}
              >
                <option value="">Batch</option>
                {batches.map((b) => (
                  <option key={b.batch}>{b.batch}</option>
                ))}
              </select>

              <input type="number" name="totalCount" placeholder="Total Count" onChange={handleChange} />
              <input type="number" name="remainingCount" placeholder="Remaining Count" onChange={handleChange} />

              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      )}

      {showOrderModal && <OrderModal setShowOrderModal={setShowOrderModal} orderData={orderFormData} source="creditInventory" callAfterSave={getCreditInventory} allowedProducts={[{ name: orderFormData?.selectedProduct, value: orderFormData?.selectedProduct }]} />}

      {loader && <Loader />}
    </div>
  );
};

export default CreditInventory;