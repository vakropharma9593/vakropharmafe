import AdminNavbar from "@/components/AdminNavbar";
import Loader from "@/components/Loader";
import { dateToShow, formatStatus, OrderStatusType, PaymentModeType, Product, ProductType } from "@/lib/utils";
import { Context } from "@/store/context";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import styles from "../../styles/order.module.css";
import OrderModal from "@/components/OrderModal";

type Order = {
  id?: string;
  customerName: string;
  customerPhone: string;
  date: string;
  status: string;
  products: Product[];
  totalAmountPaid: number;
  paymentType: string;
};

const PatientOrders = () => {
  const { state } = useContext(Context);
  const stateProducts = state.adminData.products;

  const [orders, setOrders] = useState<Order[]>([]);
  const [loader, setLoader] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusUpdate, setStatusUpdate] = useState("");
  const [paymentModeForUpdate, setPaymentModeForUpdate] = useState("");
  const [showStatusModal, setShowStatusModal] = useState(false);

  const [showViewModal, setShowViewModal] = useState(false);

  useEffect(() => {
    getOrders();
  }, []);

  const getOrders = async () => {
    try {
      setLoader(true);
      const res = await fetch("/api/patientorder");
      const data = await res.json();
      if(data.success) {
        setOrders(data.data || []);
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Failed to fetch orders");
    } finally {
      setLoader(false);
    }
  };

  const updateOrderStatus = async () => {
    if (!selectedOrder) return;

    try {
      setLoader(true);

      const res = await fetch(`/api/patientorder/${selectedOrder.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: statusUpdate, paymentType: paymentModeForUpdate }),
      });

      const data = await res.json();
      if(data.success){
        setOrders((prev) =>
          prev.map((o) =>
            o.id === selectedOrder.id ? { ...o, status: statusUpdate, paymentType: statusUpdate === "Payment_Done" ? paymentModeForUpdate : o.paymentType } : o
          )
        );
        toast.success("Order status updated");
        setShowStatusModal(false);
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Failed to update status");
    } finally {
      setLoader(false);
    }
  };

  const STATUS_COLORS: Record<string, string> = {
    [OrderStatusType.PAYMENT_PENDING]: styles.pending,
    [OrderStatusType.PAYMENT_DONE]: styles.paid,
    [OrderStatusType.PREPARING]: styles.preparing,
    [OrderStatusType.DISPATCHED]: styles.dispatched,
    [OrderStatusType.DELIVERED]: styles.delivered,
  };

  const isStatusAllowed = (item: string) => {
    switch (selectedOrder?.status) {
      case OrderStatusType.PAYMENT_PENDING:
        return true;
        break;
      case OrderStatusType.PAYMENT_DONE:
        if (item === OrderStatusType.PAYMENT_DONE || item === OrderStatusType.PREPARING || item === OrderStatusType.DISPATCHED || item === OrderStatusType.DELIVERED) return true;
        break;
      case OrderStatusType.PREPARING:
        if (item === OrderStatusType.PREPARING || item === OrderStatusType.DISPATCHED || item === OrderStatusType.DELIVERED) return true;
        break;
      case OrderStatusType.DISPATCHED:
        if (item === OrderStatusType.DISPATCHED || item === OrderStatusType.DELIVERED) return true;
        break;
      case OrderStatusType.DELIVERED:
        if (item === OrderStatusType.DELIVERED) return true;
        break;
      default:
        break;
    }
    return false;
  }

  return (
    <div className={styles.container}>
      <AdminNavbar />

      <div className={styles.content}>
        <div className={styles.header}>
          <h1>
            Orders <span>{orders.length}</span>
          </h1>

          <button style={{ cursor: "pointer", backgroundColor: "#C9A25E", color: "#173F36"}} onClick={() => setShowModal(true)}>
            + Add New Order
          </button>
        </div>

        <div className={styles.tableWrapper}>
          {orders.length > 0 ? (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Customer</th>
                  <th>Phone</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Total</th>
                  <th>Products</th>
                  <th>Payment</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order, index) => (
                  <tr 
                    key={order.id || index} 
                    onClick={() => {
                      setSelectedOrder(order);
                      setShowViewModal(true);
                    }}
                  >
                    <td>{index + 1}</td>
                    <td>{order.customerName}</td>
                    <td>{order.customerPhone}</td>
                    <td>{dateToShow(order.date)}</td>

                    <td>
                      <span className={`${styles.badge} ${STATUS_COLORS[order.status]}`}>
                        {formatStatus(order.status)}
                      </span>
                    </td>

                    <td>₹{order.totalAmountPaid}</td>

                    <td>
                      {order.products.map((p, i) => (
                        <div key={i} className={styles.productItem}>
                          {p.productName} × {p.quantity}
                        </div>
                      ))}
                    </td>

                    <td>{order.paymentType}</td>

                    <td>
                      <button
                        className={styles.updateBtn}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedOrder(order);
                          setStatusUpdate(order.status);
                          setShowStatusModal(true);
                        }}
                        disabled={order.status === "Delivered"}
                        style={{ cursor: order.status === "Delivered" ? "not-allowed" : "pointer"}}
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className={styles.empty}>No orders yet</p>
          )}
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <OrderModal setShowOrderModal={setShowModal} source="patientOrderPage" callAfterSave={getOrders} />
      )}

      {/* STATUS MODAL */}
      {showStatusModal && selectedOrder && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>Update Status</h2>
              <button onClick={() => setShowStatusModal(false)}>✕</button>
            </div>

            <div className={styles.form}>
              <p>{selectedOrder.customerName}</p>

              <select
                value={statusUpdate}
                onChange={(e) => setStatusUpdate(e.target.value)}
              >
                {Object.values(OrderStatusType)?.map((item: string) => {
                  if (!isStatusAllowed(item)) return null;
                  return (
                    <option key={item} value={item} >{item}</option>
                  )
                })}
              </select>

              {statusUpdate === "Payment_Done" && <select name="paymentType" onChange={(e) => setPaymentModeForUpdate(e.target.value)}>
                {Object.values(PaymentModeType)?.map((item: string) => {
                    return (
                          <option key={item}>{item}</option>
                    )
                })}
              </select>}

              <button onClick={updateOrderStatus}>
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}

      {showViewModal && selectedOrder && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.modal} ${styles.large}`}>
            <div className={styles.modalHeader}>
              <h2>Order Details</h2>
              <button onClick={() => setShowViewModal(false)}>✕</button>
            </div>

            <div className={styles.detailsContainer}>
              {/* ORDER INFO */}
              <div className={styles.detailsGrid}>
                <div>
                  <span>Customer</span>
                  <p>{selectedOrder.customerName}</p>
                </div>

                <div>
                  <span>Customer Phone</span>
                  <p>{selectedOrder.customerPhone}</p>
                </div>

                <div>
                  <span>Date</span>
                  <p>{dateToShow(selectedOrder.date)}</p>
                </div>

                <div>
                  <span>Status</span>
                  <p>{formatStatus(selectedOrder.status)}</p>
                </div>

                <div>
                  <span>Payment</span>
                  <p>{selectedOrder.paymentType}</p>
                </div>
              </div>

              {/* PRODUCTS */}
              <h4 style={{ marginTop: "20px" }}>Products</h4>

              <div className={styles.detailsTable}>
                <div className={styles.detailsHeader}>
                  <div>Product</div>
                  <div>Batch</div>
                  <div>MRP</div>
                  <div>Discount %</div>
                  <div>Total Price</div>
                  <div>Selling Price</div>
                  <div>Qty</div>
                  <div>Total</div>
                </div>

                {selectedOrder.products.map((p, i) => {
                  const productInfo = stateProducts?.find((item: ProductType) => item?._id === p.productId);
                  const mrp = productInfo?.mrp || 0;
                  const gst = productInfo?.gstPercentage || 0;
                  const sellingPrice = p.totalPrice/(1 + gst/100);

                  return (
                    <div key={i} className={styles.detailsRow}>
                      <div>{p.productName}</div>
                      <div>{p.batch}</div>
                      <div>₹{mrp}</div>
                      <div>{Number(((mrp - p.totalPrice)/mrp)*100).toFixed(2)}%</div>
                      <div>₹{p.totalPrice}</div>
                      <div>₹{Number(sellingPrice.toFixed(2))}</div>
                      <div>{p.quantity}</div>
                      <div>₹{p.totalPrice * p.quantity}</div>
                    </div>
                  );
                })}
              </div>

              {/* TOTAL */}
              <div className={styles.detailsTotal}>
                Total Amount: ₹{selectedOrder.totalAmountPaid}
              </div>
            </div>
          </div>
        </div>
      )}

      {loader && <Loader />}
    </div>
  );
};

export default PatientOrders;