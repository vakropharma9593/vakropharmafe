import AdminNavbar from "@/components/AdminNavbar";
import Loader from "@/components/Loader";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import styles from "../../styles/customer.module.css";
import OrderModal from "@/components/OrderModal";
import Pagination from "@/components/Pagination";
import SearchBar from "@/components/SearchBar";
import { CustomerType, OrderStatusType, PaymentModeType, PaymentStatusType } from "@/lib/utils";

type Customer = {
  name: string;
  phone: string;
  address?: string;
  type: CustomerType;
  gst?: string;
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
    type: CustomerType.INDIVIDUAL,
    gst: "",
  });

  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderFormData, setOrderFormData] = useState<{
    customerPhone: string,
    customerId: string,
    customerName: string,
    date: string,
    status: string,
    paymentStatus: string;
    paymentType: string,
    customerType: CustomerType | null,
  }>({
    customerPhone: "",
    customerId: "",
    customerName: "",
    date: "",
    paymentStatus: PaymentStatusType.PAYMENT_PENDING,
    status: OrderStatusType.PREPARING,
    paymentType: PaymentModeType.UPI,
    customerType: null
  });

  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCustomers, setTotalCustomers] = useState(0);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // reset to page 1 when searching
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    getCustomers(page, debouncedSearch);
  }, [page, debouncedSearch]);

  const getCustomers = async (pageNumber = 1, searchText = "") => {
    setLoader(true);
    try {
      const res = await fetch(
        `/api/customer?page=${pageNumber}&limit=${limit}&search=${searchText}`
      );
      const data = await res.json();

      if (data.success) {
        setCustomers(data.data || []);
        setTotalPages(data.pagination?.totalPages || 1);
        setPage(data.pagination?.page || 1);
        setTotalCustomers(data.pagination?.total || 0);
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
        let dataToSave: {
          phone?: string,
          name?: string,
          address?: string,
          type?: string,
          gst?: string,
        } = {}
        if (isEdit) {
          dataToSave = {
            address: formData.address,
          }
          if (formData.gst && formData.gst !== "") {
            dataToSave = {
              gst: formData.gst,
            }
          }
        } else {
          dataToSave = {
            phone: formData.phone,
            name: formData.name,
            address: formData.address,
            type: formData.type
          }
        }
        const res = await fetch(isEdit ? `/api/customer/${formData?._id}` :"/api/customer", {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataToSave),
        });

        const data = await res.json();
        if (data.success){
          getCustomers(1);
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
            Customers <span>{customers.length} out of {totalCustomers}</span>
          </h1>

          <button
            onClick={() => {
              setShowModal(true);
              setIsEdit(false);
              setFormData({
                name: "",
                phone: "",
                address: "",
                type: CustomerType.INDIVIDUAL,
              });
            }}
          >
            + Add Customer
          </button>
        </div>

        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search by name or phone..."
        />

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
                  <th>GST</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {customers.map((item, index) => (
                  <tr key={item?._id || index}>
                    <td>{index + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.phone}</td>
                    <td>{item.address}</td>
                    <td>{item.type}</td>
                    <td>{item?.gst}</td>

                    <td className={styles.actions}>
                      <button onClick={() => handleEdit(item)}>Edit</button>
                      <button onClick={() => {
                        setOrderFormData({ ...orderFormData, customerPhone: item?.phone, customerName: item?.name, customerId: item?._id || "", customerType: item?.type });
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

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={(p) => setPage(p)}
        />
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
              {isEdit ? 
                <h4>Customer Name: {formData.name} </h4>
              :
                <div className={styles.formGroup}>
                  <label>Customer Name</label>
                  <input
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={() => validateName(formData.name)}
                  />
                  {errors.name && <p className={styles.error}>{errors.name}</p>}
                </div>
              }
              {isEdit ? 
                <h4>Customer Phone: {formData.phone} </h4>
              :
                <div className={styles.formGroup}>
                  <label>Phone Number</label>
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
                </div>
              }
              <div className={styles.formGroup}>
                <label>Address</label>
                <input
                  name="address"
                  placeholder="Address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
              {!isEdit && 
                <div className={styles.formGroup}>
                  <label>Customer Type</label>
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
                </div>
              }
              <div className={styles.formGroup}>
                <label>GST Number</label>
                <input
                  name="gst"
                  placeholder="GST Number"
                  value={formData.gst}
                  onChange={handleChange}
                />
              </div>

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