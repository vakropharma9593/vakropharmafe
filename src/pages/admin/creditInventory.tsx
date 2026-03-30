import AdminNavbar from "@/components/AdminNavbar";
import Loader from "@/components/Loader";
import { useContext, useEffect, useState } from "react";
import { toast, Bounce } from "react-toastify";
import styles from "../../styles/inventory.module.css";
import { Context } from "@/store/context";
import OrderModal from "@/components/OrderModal";
import { ProductType } from "@/lib/utils";
import { InventoryItem } from "@/store/reducers/adminReducer";

type CreditInventoryItem = {
  _id?: string;
  batchId: string;
  batch: string;
  productId: string;
  productName: string;
  totalCount: number;
  remainingCount: number;
  customerName: string;
  customerId: string;
  customerPhone: number;
}

const CreditInventory = () => {
  const { state } = useContext(Context);
  const stateInventory = state?.adminData?.inventory;
  const products = state?.adminData?.products;
  const [loader, setLoader] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [creditInventory, setCreditInventory] = useState<CreditInventoryItem[]>([]);
  const [errors, setErrors] = useState({ customerNumber: "" });
  const [batches, setBatches] = useState<{batch: string, _id: string}[]>([]);

  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderFormData, setOrderFormData] = useState({
    customerPhone: "", // to show
    customerId: "",
    customerName: "", // to show
    date: "",
    status: "Payment_Pending",
    paymentType: "UPI",
    selectedProductId: "",
    creditId: "",
  });

  const [formData, setFormData] = useState({
    batchId: "",
    productId: "",
    totalCount: 0,
    customerId: "",
    customerNumber: "",
    customerName: ""
  });

  useEffect(() => {
      getCreditInventory();
    }, []);

    const getCreditInventory = async () => {
      setLoader(true);
      try {
          const res = await fetch("/api/creditInventory");

          const data = await res.json();
          if(data.success){
            const finalData = data.data;
            setCreditInventory(finalData);
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
      } finally {
        setLoader(false);
      }
    };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    const updated = { ...formData, [name]: value };
    setFormData(updated);
    if (name === "productId") {
      const allBatchesOfProduct = stateInventory?.filter((item: InventoryItem) => item?.productId === value)?.map((item: InventoryItem) => {
        return {
          _id: item?._id || "",
          batch: item?.batch
        }
      });
      setBatches(allBatchesOfProduct);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoader(true);
    if (formData?.batchId !== "" && formData?.productId !== "" && formData?.totalCount > 0 && formData?.customerId !== "") {
      try {
        const res = await fetch("/api/creditInventory", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const data = await res.json();
        if(data.success) {
          setShowModal(false);
          toast.success("Credit Inventory added successfully");
          getCreditInventory();
        } else {
          toast.error(data.message);
        }
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
      if (data.success) {
        setFormData({ ...formData, customerNumber: phone, customerName: data.data.name, customerId: data.data?._id})

        toast.success("Customer fetched successfully");
      } else {
        toast.error(data.message);
      }
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
        <div className={styles.header}>
          <h1>
            Credit Inventory
            <span>{creditInventory?.length}</span>
          </h1>

          <button onClick={() => setShowModal(true)}>
            + Add Credit Inventory
          </button>
        </div>

        {/* Table */}
        <div className={styles.tableWrapper}>
          {creditInventory?.length > 0 ? (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Batch</th>
                  <th>Product</th>
                  <th>Total</th>
                  <th>Remaining</th>
                  <th>Customer Name</th>
                  <th>Customer Number</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {creditInventory.map((item: CreditInventoryItem, i: number) => (
                  <tr key={item._id}>
                    <td>{i + 1}</td>
                    <td>{item.batch}</td>
                    <td>{item.productName}</td>
                    <td>{item.totalCount}</td>
                    <td>{item.remainingCount}</td>
                    <td>{item?.customerName}</td>
                    <td>{item?.customerPhone}</td>
                    <td className={styles.actions}>
                      <button onClick={() => {
                        setOrderFormData({ ...orderFormData, customerPhone: JSON.stringify(item?.customerPhone), customerName: item?.customerName, customerId: item?.customerId || "", selectedProductId: item?.productId, creditId: item?._id || "" });
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
              <div className={styles.formGroup}>
                <label>Customer Phone</label>
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
              </div>

              {formData?.customerName && <h4>Customer Details :: {formData?.customerName}</h4>}
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
                <label>Batch Name</label>
                <select
                  name="batchId"
                  value={formData.batchId}
                  onChange={handleChange}
                >
                  <option value="">Batch</option>
                  {batches.map((b) => (
                    <option key={b._id} value={b._id}>{b.batch}</option>
                  ))}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Total Units</label>
                <input type="number" name="totalCount" placeholder="Total Count" onChange={handleChange} />
              </div>

              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      )}

      {showOrderModal && <OrderModal setShowOrderModal={setShowOrderModal} orderData={orderFormData} source="creditInventory" callAfterSave={getCreditInventory} />}

      {loader && <Loader />}
    </div>
  );
};

export default CreditInventory;