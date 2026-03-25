import AdminNavbar from "@/components/AdminNavbar";
import Loader from "@/components/Loader";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import styles from "../../styles/customer.module.css";
import OrderModal from "@/components/OrderModal";

type Customer = {
  id?: string;
  name: string;
  phone: string;
  address?: string;
  type: "Individual" | "Retail" | "Doctor" | "Whole_Sale";
  _id?: string;
};

const Customers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loader, setLoader] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [errors, setErrors] = useState({ phone: "", name: "" });

  const [formData, setFormData] = useState<Customer>({
    name: "",
    phone: "",
    address: "",
    type: "Individual",
    _id: "",
  });

  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderFormData, setOrderFormData] = useState({
    customerPhone: "",
    customerId: "",
    customerName: "",
    date: "",
    status: "Payment_Pending",
    paymentType: "UPI",
  });

  useEffect(() => {
    getCustomers();
  }, []);

  const getCustomers = async () => {
    setLoader(true);
    try {
      const res = await fetch("/api/customer");
      const data = await res.json();
      if (data.success) {
        setCustomers(data.data || []);
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Failed to load customers");
    } finally {
      setLoader(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoader(true);
    if (formData?.phone !== "" && formData?.name !== "" && formData?.address !== "" && formData?.type) {
      try {
        const res = await fetch(isEdit ? `/api/customer/${formData?._id}` :"/api/customer", {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const data = await res.json();
        if (data.success){
          if (isEdit) {
            setCustomers((prev) =>
              prev.map((c) => (c._id === formData._id ? data.data : c))
            );
          } else {
            setCustomers((prev) => [...prev, data.data]);
          }

          setShowModal(false);
          setIsEdit(false);

          toast.success(`Customer ${isEdit ? "updated" : "added"} successfully`);
        } else {
          toast.error(data.message);
        }
      } catch {
        toast.error("Failed to save customer");
      } finally {
        setLoader(false);
      }
    } else {
      toast.error("Please fill all fields.");
      setLoader(false);
    }
  };

  const handleEdit = (customer: Customer) => {
    setFormData(customer);
    setIsEdit(true);
    setShowModal(true);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      setErrors((prev) => ({
        ...prev,
        phone: "Phone must be 10 digits",
      }));
      return false;
    }
    setErrors((prev) => ({ ...prev, phone: "" }));
    return true;
  };

  const validateName = (name: string) => {
    if (!name) {
      setErrors((prev) => ({ ...prev, name: "Name required" }));
    } else {
      setErrors((prev) => ({ ...prev, name: "" }));
    }
  };

  return (
    <div className={styles.container}>
      <AdminNavbar />

      <div className={styles.content}>
        {/* HEADER */}
        <div className={styles.header}>
          <h1>
            Customers <span>{customers.length}</span>
          </h1>

          <button
            onClick={() => {
              setShowModal(true);
              setIsEdit(false);
              setFormData({
                name: "",
                phone: "",
                address: "",
                type: "Individual",
              });
            }}
          >
            + Add Customer
          </button>
        </div>

        {/* TABLE */}
        <div className={styles.tableWrapper}>
          {customers.length > 0 ? (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>Type</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {customers.map((item, index) => (
                  <tr key={item.id || index}>
                    <td>{index + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.phone}</td>
                    <td>{item.address}</td>
                    <td>{item.type}</td>

                    <td className={styles.actions}>
                      <button onClick={() => handleEdit(item)}>Edit</button>
                      <button onClick={() => {
                        setOrderFormData({ ...orderFormData, customerPhone: item?.phone, customerName: item?.name, customerId: item?._id || "" });
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
            <p className={styles.empty}>No customers yet</p>
          )}
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>{isEdit ? "Edit Customer" : "Add Customer"}</h2>
              <button onClick={() => setShowModal(false)}>✕</button>
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>
              <input
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                onBlur={() => validateName(formData.name)}
              />
              {errors.name && <p className={styles.error}>{errors.name}</p>}

              <input
                placeholder="Phone"
                value={formData.phone}
                maxLength={10}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    phone: e.target.value.replace(/\D/g, ""),
                  })
                }
                onBlur={() => validatePhone(formData.phone)}
              />
              {errors.phone && <p className={styles.error}>{errors.phone}</p>}

              <input
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
              />

              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
              >
                <option value="Individual">Individual</option>
                <option value="Whole_Sale">Whole Sale</option>
                <option value="Retail">Retail</option>
                <option value="Doctor">Doctor</option>
              </select>

              <button type="submit">
                {isEdit ? "Update Customer" : "Add Customer"}
              </button>
            </form>
          </div>
        </div>
      )}

      {showOrderModal && (
        <OrderModal setShowOrderModal={setShowOrderModal} orderData={orderFormData} source="customerPage" />
      )}

      {loader && <Loader />}
    </div>
  );
};

export default Customers;