import AdminNavbar from "@/components/AdminNavbar";
import Loader from "@/components/Loader";
import { dateToShow, formatStatus, OrderStatusType, PaymentStatusType, Product, ProductType } from "@/lib/utils";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import styles from "../../styles/order.module.css";
import OrderModal from "@/components/OrderModal";
import OrderUpdateModal from "@/components/OrderUpdateModal";
import { useStore } from "@/store";
import SearchBar from "@/components/SearchBar";
import Pagination from "@/components/Pagination";

type Order = {
  _id?: string;
  customerName: string;
  customerPhone: string;
  date: string;
  paymentDate?: string;
  orderType: string;
  status: string;
  paymentStatus: string;
  deliveryService?: string;
  deliveryTrackNumber?: string;
  products: Product[];
  totalAmountPaid: number;
  paymentType: string;
};

const Orders = () => {
  const stateProducts = useStore((state) => state.adminData.products);

  const [orders, setOrders] = useState<Order[]>([]);
  const [loader, setLoader] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);

  const [showViewModal, setShowViewModal] = useState(false);

  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    getOrders(page, debouncedSearch);
  }, [page, debouncedSearch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const getInvoiceLink = async () => {
    if (!selectedOrder?._id) return "";

    const res = await fetch(
      `/api/miscellaneous?id=${selectedOrder._id}`
    );
    const data = await res.json();

    return data?.data?.link || "";
  };

  const handleCopyLink = async () => {
    const link = await getInvoiceLink();
    if (!link) return;

    await navigator.clipboard.writeText(link);
    toast.success("Invoice link copied ✅");
  };

  const handleWhatsAppShare = async () => {
    const link = await getInvoiceLink();
    if (!link) return;

    const message = `🧾 *Vakro Invoice*
      Order ID: ${selectedOrder?._id}
      Amount: ₹${selectedOrder?.totalAmountPaid}

      View Bill: ${link}

      Thank you ❤️`;

    const url = `https://wa.me/${selectedOrder?.customerPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  const getOrders = async (pageNumber = 1, searchText = "") => {
    try {
      showStatusModal && setShowStatusModal(false);
      showModal && setShowModal(false);

      setLoader(true);

      const res = await fetch(
        `/api/order?page=${pageNumber}&limit=${limit}&search=${searchText}`
      );

      const data = await res.json();

      if (data.success) {
        setOrders(data.data || []);
        setTotalPages(data.pagination?.totalPages || 1);
        setPage(data.pagination?.page || 1);
        setTotalOrders(data.pagination?.total || 0);
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
    [PaymentStatusType.PAYMENT_PENDING]: styles.pending,
    [PaymentStatusType.PAYMENT_DONE]: styles.paid,
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
            Orders <span>{orders.length} out of {totalOrders}</span>
          </h1>

          <button style={{ cursor: "pointer", backgroundColor: "#C9A25E", color: "#173F36"}} onClick={() => setShowModal(true)}>
            + Add New Order
          </button>
        </div>

        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search by customer name or phone..."
        />

        <div className={styles.tableWrapper}>
          {orders.length > 0 ? (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Customer</th>
                  <th>Type</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Payment Date</th>
                  <th>Total</th>
                  <th>Products</th>
                  <th>Payment</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order, index) => (
                  <tr 
                    key={order._id || index} 
                    onClick={() => {
                      setSelectedOrder(order);
                      setShowViewModal(true);
                    }}
                  >
                    <td>{index + 1}</td>
                    <td>{order.customerName}
                      <br/>
                      {order.customerPhone}
                    </td>
                    <td>{order.orderType}</td>
                    <td>{dateToShow(order.date)}</td>

                    <td className={styles.secondStatus}>
                      <span className={`${styles.badge} ${STATUS_COLORS[order.status]}`}>
                        {formatStatus(order.status)}
                      </span>
                      <span className={`${styles.badge} ${STATUS_COLORS[order.paymentStatus]} ${styles.secondStatus}`}>
                        {formatStatus(order.paymentStatus)}
                      </span>
                    </td>

                    <td>{order?.paymentDate ? dateToShow(order?.paymentDate): "-" }</td>

                    <td>₹{order.totalAmountPaid}</td>

                    <td>
                      {order.products.map((p, i) => (
                        <div key={i} className={styles.productItem}>
                          {p.productName} × {p.freeQuantity && p.freeQuantity > 0 ? "(" + p.quantity + "+" + p.freeQuantity + ")" : p.quantity }
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
                          setShowStatusModal(true);
                        }}
                        disabled={order.status === OrderStatusType.DELIVERED && order.paymentStatus === PaymentStatusType.PAYMENT_DONE}
                        style={{ cursor: order.status === OrderStatusType.DELIVERED && order.paymentStatus === PaymentStatusType.PAYMENT_DONE ? "not-allowed" : "pointer"}}
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

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={(p) => setPage(p)}
        />
      </div>

      {/* MODAL */}
      {showModal && (
        <OrderModal setShowOrderModal={setShowModal} source="orderPage" callAfterSave={getOrders} />
      )}

      {/* STATUS MODAL */}
      {showStatusModal && selectedOrder && (
        <OrderUpdateModal source="orderPage" callAfterSave={getOrders} selectedOrder={selectedOrder} setShowStatusModal={setShowStatusModal}  />
      )}

      {showViewModal && selectedOrder && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.modal} ${styles.large}`}>
            <div className={styles.modalHeader}>
              <h2>Order Details</h2>
              <button onClick={() => setShowViewModal(false)}>✕</button>
            </div>

            <div className={styles.actionButtons}>
              <button
                className={styles.copyBtn}
                onClick={handleCopyLink}
              >
                Copy Bill Link
              </button>

              <button
                className={styles.whatsappBtn}
                onClick={handleWhatsAppShare}
              >
                Share on WhatsApp
              </button>
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
                  <span>Payment Status</span>
                  <p>{formatStatus(selectedOrder.paymentStatus)}</p>
                </div>

                {selectedOrder.deliveryService && <div>
                  <span>Delivery Service</span>
                  <p>{selectedOrder.deliveryService}</p>
                </div>}

                {selectedOrder.deliveryTrackNumber && <div>
                  <span>Delivery Track Number</span>
                  <p>{selectedOrder.deliveryTrackNumber}</p>
                </div>}

                <div>
                  <span>Payment</span>
                  <p>{selectedOrder.paymentType}</p>
                </div>
              </div>

              {/* PRODUCTS */}
              <h4 style={{ marginTop: "12px", marginBottom: "4px" }}>Products</h4>

              <div className={styles.tableWrapper}>
                {selectedOrder?.products?.length > 0 ? 
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Batch</th>
                        <th>MRP</th>
                        <th>Discount %</th>
                        <th>Total Price</th>
                        <th>Selling Price</th>
                        <th>Qty</th>
                        <th>Total Paid ₹</th>
                        <th>Total GST</th>
                        <th>Total CP</th>
                        <th>Profit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.products.map((p, i) => {
                          const productInfo = stateProducts?.find((item: ProductType) => item?._id === p.productId);
                          const mrp = productInfo?.mrp || 0;
                          const gst = productInfo?.gstPercentage || 0;
                          const sellingPrice = p.totalPrice/(1 + gst/100);
                          return (
                            <tr key={i}>
                              <td>{p.productName}</td>
                              <td>{p.batch}</td>
                              <td>₹{mrp}</td>
                              <td>{p.discountPercentage}%</td>
                              <td>₹{p.totalPrice}</td>
                              <td>₹{Number(sellingPrice.toFixed(2))}</td>
                              <td>{p.freeQuantity && p.freeQuantity > 0 ? p.quantity + " + " + p.freeQuantity : p.quantity}</td>
                              <td>₹{p.totalPrice * p.quantity}</td>
                              <td>₹{p.totalGstPayable} </td>
                              <td>₹{p.totalCostPrice}</td>
                              <td>₹{p.totalProfit}</td>
                            </tr>
                          )
                      })}
                      <tr>
                        <td>Total</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>{selectedOrder.products?.reduce((total, item ) => { return total + (item?.freeQuantity || 0)}, 0) > 0 ? selectedOrder.products?.reduce((total, item ) => { return total + item?.quantity}, 0) + " + " + selectedOrder.products?.reduce((total, item ) => { return total + (item?.freeQuantity || 0)}, 0) : selectedOrder.products?.reduce((total, item ) => { return total + (item?.quantity || 0)}, 0)}</td>
                        <td>₹{Number((selectedOrder.products?.reduce((total, item ) => { return total + item.totalPrice * item.quantity}, 0)).toFixed(2))}</td>
                        <td>₹{Number((selectedOrder.products?.reduce((total, item ) => { return total + (item?.totalGstPayable || 0)}, 0)).toFixed(2))} </td>
                        <td>₹{Number((selectedOrder.products?.reduce((total, item ) => { return total + (item?.totalCostPrice || 0)}, 0)).toFixed(2))} </td>
                        <td>₹{Number((selectedOrder.products?.reduce((total, item ) => { return total + (item?.totalProfit || 0)}, 0)).toFixed(2))}</td>
                      </tr>
                    </tbody>
                  </table>
                : 
                  (
                    <p className={styles.empty}>No orders yet</p>
                  )
                }

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