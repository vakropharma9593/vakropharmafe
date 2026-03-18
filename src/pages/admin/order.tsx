import AdminNavbar from "@/components/AdminNavbar";
import Loader from "@/components/Loader";
import { dateToShow, formatStatus, Product } from "@/lib/utils";
import { Context } from "@/store/context";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import styles from "../../styles/order.module.css";
import OrderModal from "@/components/OrderModal";

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
  const { state } = useContext(Context);
  const stateInventory = state.inventory;

  const [orders, setOrders] = useState<Order[]>([]);
  const [loader, setLoader] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusUpdate, setStatusUpdate] = useState("");
  const [showStatusModal, setShowStatusModal] = useState(false);

  const [showViewModal, setShowViewModal] = useState(false);

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

  const updateOrderStatus = async () => {
    if (!selectedOrder) return;

    try {
      setLoader(true);

      await fetch(`/api/order/${selectedOrder.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: statusUpdate }),
      });

      setOrders((prev) =>
        prev.map((o) =>
          o.id === selectedOrder.id ? { ...o, status: statusUpdate } : o
        )
      );

      toast.success("Order status updated");
      setShowStatusModal(false);
    } catch {
      toast.error("Failed to update status");
    } finally {
      setLoader(false);
    }
  };

  const STATUS_COLORS: Record<string, string> = {
    Payment_Pending: styles.pending,
    Payment_Done: styles.paid,
    Preparing: styles.preparing,
    Dispatched: styles.dispatched,
    Delivered: styles.delivered,
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
        // <div className={styles.modalOverlay}>
        //   <div className={`${styles.modal}`}>
        //     <div className={styles.modalHeader}>
        //       <h2>Create Order</h2>
        //       <button onClick={() => setShowModal(false)}>✕</button>
        //     </div>

        //     <form className={styles.form} onSubmit={handleSubmit}>
        //       <input
        //         placeholder="Customer Phone"
        //         value={formData.customerPhone}
        //         maxLength={10}
        //         onChange={(e) => {
        //           const value = e.target.value.replace(/\D/g, "");
        //           setFormData({
        //             ...formData,
        //             customerPhone: value,
        //           })
        //           if (value?.length === 10) {
        //             getCustomer(value);
        //           }
        //         }}
        //         onBlur={() => validatePhone(formData.customerPhone)}
        //       />
        //       {errors.customerPhone && (
        //         <p className={styles.error}>{errors.customerPhone}</p>
        //       )}

        //       {formData?.customerName && <h4>Customer Details :: {formData?.customerName}</h4>}

        //       <input type="date" name="date" onChange={handleChange} />

        //       <select name="status" onChange={handleChange}>
        //         <option>Payment_Pending</option>
        //         <option>Payment_Done</option>
        //         <option>Preparing</option>
        //         <option>Dispatched</option>
        //         <option>Delivered</option>
        //       </select>

        //       <select name="paymentType" onChange={handleChange}>
        //         <option>UPI</option>
        //         <option>Cash</option>
        //         <option>Bank Transfer</option>
        //       </select>

        //       <h4>Products</h4>

        //       <div className={styles.productHeader}>
        //         <div>Product</div>
        //         <div>Batch</div>
        //         <div>MRP</div>
        //         <div>Discount %</div>
        //         <div>Selling</div>
        //         <div>Qty</div>
        //         <div></div>
        //       </div>

        //       {products.map((p, index) => (
        //         <div key={index} className={styles.productRow}>
        //           {/* PRODUCT */}
        //           <select
        //             value={p.productName}
        //             onChange={(e) =>
        //               handleProductChange(index, "productName", e.target.value)
        //             }
        //           >
        //             <option value="">Select</option>
        //             <option value="Facewash">Facewash</option>
        //             <option value="Face_Serum">Face Serum</option>
        //             <option value="Face_Moisturizer">Face Moisturizer</option>
        //             <option value="Sunscreen">Sunscreen</option>
        //           </select>

        //           {/* BATCH */}
        //           <select
        //             value={p.batch}
        //             onChange={(e) =>
        //               handleProductChange(index, "batch", e.target.value)
        //             }
        //           >
        //             <option value="">Batch</option>
        //             {batches.map((b) => (
        //               <option key={b.batch}>{b.batch}</option>
        //             ))}
        //           </select>

        //           {/* MRP */}
        //           <div className={styles.infoBox}>
        //             <span>MRP</span>
        //             ₹{
        //               batches?.filter((b) => b.batch === p.batch)[0]?.mrp || 0
        //             }
        //           </div>

        //           {/* DISCOUNT */}
        //           <input
        //             type="number"
        //             className={styles.smallInput}
        //             placeholder="%"
        //             onChange={(e) =>
        //               handleProductChange(
        //                 index,
        //                 "discountPercentage",
        //                 Number(e.target.value),
        //                 p
        //               )
        //             }
        //           />

        //           {/* SELLING PRICE */}
        //           <div className={styles.infoBox}>
        //             <span>Selling</span>
        //             ₹{p.sellingPrice}
        //           </div>

        //           {/* QTY */}
        //           <input
        //             type="number"
        //             className={styles.smallInput}
        //             placeholder="Qty"
        //             onChange={(e) =>
        //               handleProductChange(
        //                 index,
        //                 "quantity",
        //                 Number(e.target.value)
        //               )
        //             }
        //           />
        //           {!(index === 0 && products?.length === 1) && <button
        //             type="button"
        //             className={styles.deleteBtn}
        //             onClick={() => removeProduct(index)}
        //           >
        //             ✕
        //           </button>}
        //         </div>
        //       ))}

        //       <button type="button" disabled={isLastRowEmpty(products)} onClick={addProduct}>
        //         + Add Product
        //       </button>

        //       <div className={styles.total}>
        //         Total: ₹{totalAmountPaid}
        //       </div>

        //       <button>Create Order</button>
        //     </form>
        //   </div>
        // </div>
        <OrderModal setShowOrderModal={setShowModal} source="orderPage" callAfterSave={getOrders} allowedProducts={[{ name: "Facewash", value: "Facewash" }, { name: "Face Serum", value : "Face_Serum" }, { name: "Face Moisturizer", value: "Face_Moisturizer" }, { name: "Sunscreen", value: "Sunscreen" }]} />
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
                <option value="Payment_Pending">Payment Pending</option>
                <option value="Payment_Done">Payment Done</option>
                <option value="Preparing">Preparing</option>
                <option value="Dispatched">Dispatched</option>
                <option value="Delivered">Delivered</option>
              </select>

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
                  <div>Selling</div>
                  <div>Base Price</div>
                  <div>Qty</div>
                  <div>Total</div>
                </div>

                {selectedOrder.products.map((p, i) => {
                  const allbatches = stateInventory?.filter((item: { batch: string, itemName: string }) => item?.itemName === p.productName);
                  const selecteBatch = allbatches?.filter((b) => b.batch === p.batch)[0];
                  const mrp = selecteBatch?.mrp || 0;
                  const gst = selecteBatch?.gstPercentage;
                  const basePrice = p.sellingPrice/(1 + gst/100);

                  return (
                    <div key={i} className={styles.detailsRow}>
                      <div>{p.productName}</div>
                      <div>{p.batch}</div>
                      <div>₹{mrp}</div>
                      <div>{Number(((mrp - p.sellingPrice)/mrp)*100).toFixed(2)}%</div>
                      <div>₹{p.sellingPrice}</div>
                      <div>₹{Number(basePrice.toFixed(2))}</div>
                      <div>{p.quantity}</div>
                      <div>₹{p.sellingPrice * p.quantity}</div>
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

export default Orders;