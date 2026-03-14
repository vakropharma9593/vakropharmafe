import AdminNavbar from "@/components/AdminNavbar";
import Loader from "@/components/Loader";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

type Customer = {
  id?: string;
  name: string;
  phone: string;
  address?: string;
  type: "Individual" | "Retail" | "Doctor" | "Whole_Sale";
};

const Customers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loader, setLoader] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [errors, setErrors] = useState({
                                phone: "",
                                name: "",
                              });

  const [formData, setFormData] = useState<Customer>({
    name: "",
    phone: "",
    address: "",
    type: "Individual",
  });

  useEffect(() => {
    getCustomers();
  }, []);

  const getCustomers = async () => {
    setLoader(true);

    try {
      const res = await fetch("/api/customer");
      const data = await res.json();

      setCustomers(data.data || []);
    } catch (error) {
      toast.error("Failed to load customers");
    } finally {
      setLoader(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoader(true);

    try {
      const res = await fetch("/api/customer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      setCustomers((prev) => [...prev, data.data]);

      setShowModal(false);

      toast.success("Customer added successfully");
    } catch (error) {
      toast.error("Failed to add customer");
    } finally {
      setLoader(false);
    }
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[0-9]{10}$/;

    if (!phoneRegex.test(phone)) {
      setErrors((prev) => ({
        ...prev,
        phone: "Phone number must be exactly 10 digits",
      }));
      return false;
    }

    setErrors((prev) => ({ ...prev, phone: "" }));
    return true;
  };

  const validateName = (name: string) => {
    if (name === "") {
        setErrors((prev) => ({
        ...prev,
        name: "Name can't be empty",
      }));
    }
  }

  return (
    <div className="submissions-page">
      <AdminNavbar />

      <div className="submissions-content">
        <div className="submissions-header">
          <h1>
            Customers
            <span className="submissions-count">{customers.length}</span>
          </h1>

          <button
            className="vakro-add-btn"
            onClick={() => setShowModal(true)}
          >
            + Add Customer
          </button>

          {/* <p>Manage all customers here.</p> */}
        </div>

        <div className="submissions-table-wrapper">
          {customers.length > 0 ? (
            <table className="submissions-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>Type</th>
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
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="submissions-empty">
              <p>No customers yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="vakro-modal-overlay">
          <div className="vakro-modal">
            <div className="vakro-modal-header">
              <h2>Add Customer</h2>

              <button
                className="vakro-close"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>

            <form className="vakro-form" onSubmit={handleSubmit}>
              <input
                name="name"
                placeholder="Customer Name"
                required
                onChange={handleChange}
                onBlur={() => validateName(formData.name)}
              />
              {errors.name && (
                <p style={{ color: "red", fontSize: "12px" }}>{errors.name}</p>
              )}

              <input
                type="tel"
                className="input input-lg"
                placeholder="Phone"
                value={formData.phone}
                maxLength={10}
                onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    setFormData({ ...formData, phone: value });
                }}
                onBlur={() => validatePhone(formData.phone)}
                required
              />
              {errors.phone && (
                <p style={{ color: "red", fontSize: "12px" }}>{errors.phone}</p>
              )}

              <input
                name="address"
                placeholder="Address"
                onChange={handleChange}
              />

              <select name="type" onChange={handleChange}>
                <option value="Individual">Individual</option>
                <option value="Whole_Sale">Whole Sale</option>
                <option value="Retail">Retail</option>
                <option value="Doctor">Doctor</option>
              </select>

              <button className="vakro-submit-btn">
                Add Customer
              </button>
            </form>
          </div>
        </div>
      )}

      {loader && <Loader />}
    </div>
  );
};

export default Customers;