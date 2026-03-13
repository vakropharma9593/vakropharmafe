import AdminNavbar from "@/components/AdminNavbar";
import Loader from "@/components/Loader";
import { dateToShow, formatStatus } from "@/lib/utils";
import ACTIONS from "@/store/actions";
import { Context } from "@/store/context";
import { useContext, useEffect, useState } from "react";
import { toast, Bounce } from "react-toastify";

type Product = {
  productName: string;
  sellingPrice: number;
  batch: string;
  quantity: number;
};

type Order = {
  id?: string;
  customerName: string;
  date: string;
  status: string;
  products: Product[];
  totalAmountPaid: number;
  paymentType: string;
};

const Orders = () => {

    const { state, dispatch } = useContext(Context);

    const stateInventory = state.inventory;

  const [orders, setOrders] = useState<Order[]>([]);
  const [loader, setLoader] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [totalAmountPaid, setTotalAmountPaid] = useState<number>(0);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusUpdate, setStatusUpdate] = useState("");
  const [showStatusModal, setShowStatusModal] = useState(false);

  const [errors, setErrors] = useState({
                                customerPhone: "",
                              });

  const [formData, setFormData] = useState({
    customerPhone: "",
    date: "",
    status: "Payment_Pending",
    paymentType: "UPI",
  });

  const [products, setProducts] = useState<Product[]>([
    { productName: "", sellingPrice: 0, batch: "", quantity: 1 },
  ]);

  const [batches, setBatches] = useState<string[]>([]);

  useEffect(() => {
    getOrders();
  }, []);

  const getOrders = async () => {
    try {
      setLoader(true);

      const res = await fetch("/api/order");
      const data = await res.json();

      setOrders(data.data || []);
    } catch {
      toast.error("Failed to fetch orders");
    } finally {
      setLoader(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProductChange = <K extends keyof Product>(
        index: number,
        field: K,
        value: Product[K]
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
    const allbatches = stateInventory?.filter((item: { batch: string, itemName: string }) => item?.itemName === value).map((inventory: { batch: string }) => inventory.batch);
    setBatches(allbatches);
  };

  const addProduct = () => {
    setProducts([
      ...products,
      { productName: "", sellingPrice: 0, batch: "", quantity: 1 },
    ]);
  };

  const calculateTotal = (products: Product[]) => {
    return products.reduce((total, product) => {
        return total + product.sellingPrice * product.quantity;
    }, 0);
  };

    const getInventory = async () => {
        try {
            const res = await fetch("/api/inventory");

            const data = await res.json();
            dispatch({ type: ACTIONS.SET_INVENTORY, payload: data.data || [] })
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
        }
    };
        

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoader(true);

      const res = await fetch("/api/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          products,
        }),
      });

      const data = await res.json();

      const allData = [...orders, data.data];
      debugger;

      setOrders(allData);

      setShowModal(false);
      getInventory();

      toast.success("Order created successfully");
    } catch {
      toast.error("Failed to create order");
    } finally {
      setLoader(false);
    }
  };

  const updateOrderStatus = async () => {
    if (!selectedOrder) return;

    try {
        setLoader(true);

        await fetch(`/api/order/${selectedOrder.id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            status: statusUpdate,
        }),
        });

        const updatedOrders = orders.map((o) =>
        o.id === selectedOrder.id ? { ...o, status: statusUpdate } : o
        );

        setOrders(updatedOrders);

        toast.success("Order status updated");

        setShowStatusModal(false);
    } catch {
        toast.error("Failed to update status");
    } finally {
        setLoader(false);
    }
  };

  const STATUS_COLORS: Record<string, string> = {
    Payment_Pending: "status-pending",
    Payment_Done: "status-paid",
    Preparing: "status-preparing",
    Dispatched: "status-dispatched",
    Delivered: "status-delivered",
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[0-9]{10}$/;

    if (!phoneRegex.test(phone)) {
      setErrors((prev) => ({
        ...prev,
        customerPhone: "Phone number must be exactly 10 digits",
      }));
      return false;
    } else {
        setErrors({ customerPhone: "" });
    }

    setErrors((prev) => ({ ...prev, phone: "" }));
    return true;
  };

  return (
    <div className="submissions-page">

      <AdminNavbar />

      <div className="submissions-content">

        <div className="submissions-header">
          <h1>
            Orders
            <span className="submissions-count">{orders.length}</span>
          </h1>

          <button
            className="vakro-add-btn"
            onClick={() => setShowModal(true)}
          >
            + Add New Order
          </button>
        </div>

        <div className="submissions-table-wrapper">

          {orders.length > 0 ? (
            <table className="submissions-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Total Paid</th>
                  <th>Products</th>
                  <th>Payment Type</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order, index) => (
                  <tr key={order.id || index} onClick={() => {
                        setSelectedOrder(order);
                        setStatusUpdate(order.status);
                        setShowStatusModal(true);
                    }}
                  >
                    <td>{index + 1}</td>
                    <td>{order.customerName}</td>
                    <td>{dateToShow(order.date)}</td>
                    <td>
                        <span className={`status-badge ${STATUS_COLORS[order.status]}`}>
                            {formatStatus(order.status)}
                        </span>
                    </td>
                    <td>₹{order.totalAmountPaid}</td>

                    <td>
                      {order.products.map((p, i) => (
                        <div key={i}>
                          {p.productName} ({p.quantity})
                        </div>
                      ))}
                    </td>
                    <td>{order.paymentType}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="submissions-empty">
              No orders yet
            </div>
          )}
        </div>
      </div>

      {/* Modal */}

      {showModal && (
        <div className="vakro-modal-overlay">

          <div className="vakro-modal large">

            <div className="vakro-modal-header">
              <h2>Create Order</h2>

              <button
                className="vakro-close"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>

            <form className="vakro-form" onSubmit={handleSubmit}>

              <input
                type="tel"
                className="input input-lg"
                placeholder="Customer Phone"
                value={formData.customerPhone}
                maxLength={10}
                onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    setFormData({ ...formData, customerPhone: value });
                }}
                onBlur={() => validatePhone(formData.customerPhone)}
                required
              />
              {errors.customerPhone && (
                <p style={{ color: "red", fontSize: "12px" }}>{errors.customerPhone}</p>
              )}

              <input
                type="date"
                name="date"
                required
                onChange={handleChange}
              />

              <select
                name="status"
                onChange={handleChange}
              >
                <option>Payment_Pending</option>
                <option>Payment_Done</option>
                <option>Preparing</option>
                <option>Dispatched</option>
                <option>Delivered</option>
              </select>

              <select
                name="paymentType"
                onChange={handleChange}
              >
                <option>UPI</option>
                <option>Cash</option>
                <option>Bank Transfer</option>
              </select>

              <h4>Products</h4>

              {products.map((p, index) => (
                <div key={index} className="product-row">

                    <select
                        value={p.productName}
                            onChange={(e) =>
                            handleProductChange(index, "productName", e.target.value)
                        }
                    >
                        <option value="">Select Product</option>
                        <option value="Facewash">Facewash</option>
                        <option value="Face_Serum">Face Serum</option>
                        <option value="Face_Moisturizer">Face Moisturizer</option>
                        <option value="Sunscreen">Sunscreen</option>
                    </select>

                  

                    <select
                        value={p.batch}
                        onChange={(e) =>
                        handleProductChange(index, "batch", e.target.value)
                        }
                    >
                        <option value="">Select Batch</option>
                        {batches?.map((batch: string) => {
                            return (
                                <option key={batch} value={batch}>{batch}</option>
                            )
                        }) }
                    </select>

                  <input
                    type="number"
                    placeholder="Price"
                    onChange={(e) =>
                      handleProductChange(
                        index,
                        "sellingPrice",
                        Number(e.target.value)
                      )
                    }
                  />

                  <input
                    type="number"
                    placeholder="Qty"
                    onChange={(e) =>
                      handleProductChange(
                        index,
                        "quantity",
                        Number(e.target.value)
                      )
                    }
                  />

                </div>
              ))}

              <button
                type="button"
                className="vakro-add-product"
                onClick={addProduct}
              >
                + Add Product
              </button>

              <div className="order-total">
                Total Amount: ₹{totalAmountPaid}
              </div>

              <button className="vakro-submit-btn">
                Create Order
              </button>

            </form>

          </div>

        </div>
      )}

      {loader && <Loader />}

      {showStatusModal && selectedOrder && (
        <div className="vakro-modal-overlay">
            <div className="vakro-modal">

            <div className="vakro-modal-header">
                <h2>Update Order Status</h2>

                <button
                className="vakro-close"
                onClick={() => setShowStatusModal(false)}
                >
                ✕
                </button>
            </div>

            <div className="vakro-form">

                <p><strong>Customer:</strong> {selectedOrder.customerName}</p>
                <p><strong>Date:</strong> {selectedOrder.date}</p>

                <select
                value={statusUpdate}
                onChange={(e) => setStatusUpdate(e.target.value)}
                >
                <option value="Payment_Pending">Payment Pending</option>
                <option value="Payment_Done">Payment Done</option>
                <option value="Preparing">Preparing</option>
                <option value="Dispatched">Dispatched</option>
                <option value="Delivered">Delivered</option>
                </select>

                <button
                className="vakro-submit-btn"
                onClick={updateOrderStatus}
                >
                Update Status
                </button>

            </div>

            </div>
        </div>
      )}

    </div>
  );
};

export default Orders;