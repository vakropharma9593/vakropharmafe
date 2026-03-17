import AdminNavbar from "@/components/AdminNavbar";
import Loader from "@/components/Loader";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import styles from "../../styles/customer.module.css";
import { Context } from "@/store/context";
import ACTIONS from "@/store/actions";
import { isLastRowEmpty, Product } from "@/lib/utils";

type Customer = {
  id?: string;
  name: string;
  phone: string;
  address?: string;
  type: "Individual" | "Retail" | "Doctor" | "Whole_Sale";
  _id?: string;
};

const Customers = () => {
  const { state, dispatch } = useContext(Context);
  const stateInventory = state.inventory;
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
  const [totalAmountPaid, setTotalAmountPaid] = useState<number>(0);
  const [orderFormData, setOrderFormData] = useState({
    customerPhone: "",
    customerId: "",
    customerName: "",
    date: "",
    status: "Payment_Pending",
    paymentType: "UPI",
  });
  
    const [products, setProducts] = useState<Product[]>([
      { productName: "", sellingPrice: 0, batch: "", quantity: 1, discountPercentage: 0 },
    ]);
    const [batches, setBatches] = useState<{batch: string, mrp: number}[]>([]);

  useEffect(() => {
    getCustomers();
  }, []);

  useEffect(() => {
    if (!showOrderModal) {
      setOrderFormData({
        customerPhone: "",
        customerId: "",
        customerName: "",
        date: "",
        status: "Payment_Pending",
        paymentType: "UPI",
      })
      setProducts([
        { productName: "", sellingPrice: 0, batch: "", quantity: 1, discountPercentage: 0 },
      ])
    }
  },[showOrderModal])

  const getCustomers = async () => {
    setLoader(true);
    try {
      const res = await fetch("/api/customer");
      const data = await res.json();
      setCustomers(data.data || []);
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

  const handleOrderChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setOrderFormData((prev) => ({ ...prev, [name]: value }));
  };

  const calculateTotal = (products: Product[]) => {
    return products.reduce(
      (total, product) => total + product.sellingPrice * product.quantity,
      0
    );
  };

  const handleProductChange = <K extends keyof Product>(
        index: number,
        field: K,
        value: Product[K],
        p?: Product
    ) => {
    const updated = [...products];

    updated[index] = {
        ...updated[index],
        [field]: value,
    };

    setProducts(updated);

    const total = calculateTotal(updated);

    setTotalAmountPaid(total);
    // update batches based on product
    if (field === "productName") {
      const allbatches = stateInventory?.filter((item: { batch: string, itemName: string }) => item?.itemName === value).map((inventory: { batch: string, mrp: number }) => { return {batch: inventory.batch, mrp: inventory.mrp}});
      setBatches(allbatches);
    }
    if (field === "discountPercentage" && p) {
      const mrp = batches?.filter((b: {batch: string, mrp: number}) => b.batch === p.batch)[0].mrp;
      const sellingPrice = mrp*(1 - parseFloat(value as string)/ 100);
      updated[index] = {
          ...updated[index],
          sellingPrice: Number(sellingPrice.toFixed(2)),
      };
    }
  };

  const addProduct = () => {
    setProducts([
      ...products,
      { productName: "", sellingPrice: 0, batch: "", quantity: 1, discountPercentage: 0 },
    ]);
  };

  const getInventory = async () => {
    try {
      const res = await fetch("/api/inventory");
      const data = await res.json();
      dispatch({ type: ACTIONS.SET_INVENTORY, payload: data.data || [] });
    } catch (error) {
      toast.error("Failed to get inventory");
    }
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoader(true);
    if (orderFormData?.customerId !== "" && orderFormData?.customerName !== "" && orderFormData?.paymentType !== "" && orderFormData?.status && products?.length > 0 && !isLastRowEmpty(products)) {
      try {
        await fetch("/api/order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...orderFormData, products }),
        });

        setShowOrderModal(false);
        getInventory();

        toast.success("Order created successfully");
      } catch {
        toast.error("Failed to create order");
      } finally {
        setLoader(false);
      }
    } else {
      toast.error("Please fill all fields.");
      setLoader(false);
    }
  };

  const removeProduct = (index: number) => {
    const updated = products.filter((_, i) => i !== index);
    setProducts(updated);

    const total = calculateTotal(updated);
    setTotalAmountPaid(total);
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
        <div className={styles.modalOverlay}>
          <div className={`${styles.modal}`}>
            <div className={styles.modalHeader}>
              <h2>Create Order</h2>
              <button onClick={() => setShowOrderModal(false)}>✕</button>
            </div>

            <form className={styles.form} onSubmit={handleOrderSubmit}>
              <h4>Customer Phone : {orderFormData?.customerPhone}</h4>

              {orderFormData?.customerName && <h4>Customer Name :: {orderFormData?.customerName}</h4>}

              <input type="date" name="date" onChange={handleOrderChange} />

              <select name="status" onChange={handleOrderChange}>
                <option>Payment_Pending</option>
                <option>Payment_Done</option>
                <option>Preparing</option>
                <option>Dispatched</option>
                <option>Delivered</option>
              </select>

              <select name="paymentType" onChange={handleOrderChange}>
                <option>UPI</option>
                <option>Cash</option>
                <option>Bank Transfer</option>
              </select>

              <h4>Products</h4>

              <div className={styles.productHeader}>
                <div>Product</div>
                <div>Batch</div>
                <div>MRP</div>
                <div>Discount %</div>
                <div>Selling</div>
                <div>Qty</div>
                <div></div>
              </div>

              {products.map((p, index) => (
                <div key={index} className={styles.productRow}>
                  {/* PRODUCT */}
                  <select
                    value={p.productName}
                    onChange={(e) =>
                      handleProductChange(index, "productName", e.target.value)
                    }
                  >
                    <option value="">Select</option>
                    <option value="Facewash">Facewash</option>
                    <option value="Face_Serum">Face Serum</option>
                    <option value="Face_Moisturizer">Face Moisturizer</option>
                    <option value="Sunscreen">Sunscreen</option>
                  </select>

                  {/* BATCH */}
                  <select
                    value={p.batch}
                    onChange={(e) =>
                      handleProductChange(index, "batch", e.target.value)
                    }
                  >
                    <option value="">Batch</option>
                    {batches.map((b) => (
                      <option key={b.batch}>{b.batch}</option>
                    ))}
                  </select>

                  {/* MRP */}
                  <div className={styles.infoBox}>
                    <span>MRP</span>
                    ₹{
                      batches?.filter((b) => b.batch === p.batch)[0]?.mrp || 0
                    }
                  </div>

                  {/* DISCOUNT */}
                  <input
                    type="number"
                    className={styles.smallInput}
                    placeholder="%"
                    onChange={(e) =>
                      handleProductChange(
                        index,
                        "discountPercentage",
                        Number(e.target.value),
                        p
                      )
                    }
                  />

                  {/* SELLING PRICE */}
                  <div className={styles.infoBox}>
                    <span>Selling</span>
                    ₹{p.sellingPrice}
                  </div>

                  {/* QTY */}
                  <input
                    type="number"
                    className={styles.smallInput}
                    placeholder="Qty"
                    onChange={(e) =>
                      handleProductChange(
                        index,
                        "quantity",
                        Number(e.target.value)
                      )
                    }
                  />
                  {!(index === 0 && products?.length === 1) && <button
                    type="button"
                    className={styles.deleteBtn}
                    onClick={() => removeProduct(index)}
                  >
                    ✕
                  </button>}
                </div>
              ))}

              <button type="button" disabled={isLastRowEmpty(products)} onClick={addProduct}>
                + Add Product
              </button>

              <div className={styles.total}>
                Total: ₹{totalAmountPaid}
              </div>

              <button>Create Order</button>
            </form>
          </div>
        </div>
      )}

      {loader && <Loader />}
    </div>
  );
};

export default Customers;