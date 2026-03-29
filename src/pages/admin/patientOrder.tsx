import AdminNavbar from "@/components/AdminNavbar";
import Loader from "@/components/Loader";
import { dateToShow, formatStatus, OrderStatusType, Product, ProductType } from "@/lib/utils";
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
  totalAccountAmountPaid: number;
  paymentType: string;
};

const PatientOrders = () => {
  const { state } = useContext(Context);
  const stateProducts = state.adminData.products;

  const [orders, setOrders] = useState<Order[]>([]);
  const [loader, setLoader] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

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

  const STATUS_COLORS: Record<string, string> = {
    [OrderStatusType.PAYMENT_PENDING]: styles.pending,
    [OrderStatusType.PAYMENT_DONE]: styles.paid,
    [OrderStatusType.PREPARING]: styles.preparing,
    [OrderStatusType.DISPATCHED]: styles.dispatched,
    [OrderStatusType.DELIVERED]: styles.delivered,
  };

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
                  <th>Total ₹</th>
                  <th>Account ₹</th>
                  <th>Products</th>
                  <th>Payment</th>
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
                    <td>₹{order.totalAccountAmountPaid}</td>

                    <td>
                      {order.products.map((p, i) => (
                        <div key={i} className={styles.productItem}>
                          {p.productName} × {p.quantity}
                        </div>
                      ))}
                    </td>

                    <td>{order.paymentType}</td>
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
                  <div>Account Price</div>
                  <div>Qty</div>
                  <div>Total</div>
                </div>

                {selectedOrder.products.map((p, i) => {
                  const productInfo = stateProducts?.find((item: ProductType) => item?._id === p.productId);
                  const mrp = productInfo?.mrp || 0;
                  // const gst = productInfo?.gstPercentage || 0;
                  // const sellingPrice = p.totalPrice/(1 + gst/100);

                  return (
                    <div key={i} className={styles.detailsRow}>
                      <div>{p.productName}</div>
                      <div>{p.batch}</div>
                      <div>₹{mrp}</div>
                      <div>{Number(((mrp - p.totalPrice)/mrp)*100).toFixed(2)}%</div>
                      <div>₹{p.totalPrice}</div>
                      <div>₹{p.accountTotalPrice}</div>
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