import { useEffect, useState } from "react";
import styles from "../styles/orderModal.module.css";
import { OrderStatusType, PaymentModeType, PaymentStatusType } from "@/lib/utils";
import { toast } from "react-toastify";
import Loader from "./Loader";

type Order = {
    customerPhone: string;
    customerName: string;
    date: string;
    paymentDate?: string;
    status: string;
    paymentStatus: string;
    deliveryService?: string;
    deliveryTrackNumber?: string;
    paymentType?: string;
    creditId?: string;
    selectedProductId?: string;
    _id?: string;
}

interface OrderModalInterface {
    setShowStatusModal: (value: boolean) => void;
    selectedOrder: Order;
    source: string;
    callAfterSave: () => void;
}

const OrderUpdateModal:React.FC<OrderModalInterface> = ({ setShowStatusModal, selectedOrder, source, callAfterSave }) => {
    const [statusUpdate, setStatusUpdate] = useState("");
    const [paymentStatusUpdate, setPaymentStatusUpdate] = useState("");
    const [paymentModeForUpdate, setPaymentModeForUpdate] = useState("Cash");
    const [paymentDate, setPaymentDate] = useState("");
    const [deliveryInfo, setDeliveryInfo] = useState({ deliveryService: "", deliveryTrackNumber: "" });
    const [loader, setLoader] = useState(false);

    useEffect(() => {
        const updateStatus = () => {
            debugger;
            setStatusUpdate(selectedOrder.status);
            setPaymentStatusUpdate(selectedOrder.paymentStatus);
        }
        if (selectedOrder) {
            updateStatus();
        }
    },[selectedOrder])

    const isStatusAllowed = (item: string) => {
        switch (selectedOrder?.status) {
            case OrderStatusType.PREPARING:
                if (item === OrderStatusType.PREPARING || item === OrderStatusType.DISPATCHED || item === OrderStatusType.DELIVERED) return true;
                break;
            case OrderStatusType.DISPATCHED:
                if (item === OrderStatusType.DISPATCHED || item === OrderStatusType.DELIVERED) return true;
                break;
            default:
                break;
        }
        return false;
    }

    const isPaymentStatusAllowed = (item: string) => {
        switch (selectedOrder?.paymentStatus) {
            case PaymentStatusType.PAYMENT_PENDING:
                if (item === PaymentStatusType.PAYMENT_PENDING || item === PaymentStatusType.PAYMENT_DONE) return true;
                break;
            default:
                break;
        }
        return false;
    }

    const updateOrderStatus = async () => {
        if (!selectedOrder || statusUpdate === "") return;
        try {
            setLoader(true);

            let dataToSend: { status?: string, deliveryService?: string, deliveryTrackNumber?: string, paymentType?: string, paymentDate?: string, paymentStatus?: string } = {
            }

            if (selectedOrder.status !== statusUpdate && statusUpdate === OrderStatusType.DISPATCHED) {
                dataToSend = {
                    ...dataToSend,
                    status: statusUpdate,
                    deliveryService: deliveryInfo.deliveryService,
                    deliveryTrackNumber: deliveryInfo.deliveryTrackNumber,
                }
            }

            if (selectedOrder.status !== statusUpdate && statusUpdate === OrderStatusType.DELIVERED) {
                dataToSend = {
                    ...dataToSend,
                    status: statusUpdate,
                }
            }

            if (selectedOrder.paymentStatus === PaymentStatusType.PAYMENT_PENDING && paymentStatusUpdate === PaymentStatusType.PAYMENT_DONE && paymentModeForUpdate && paymentDate) {
                dataToSend = {
                    ...dataToSend,
                    paymentType: paymentModeForUpdate,
                    paymentDate,
                    paymentStatus: paymentStatusUpdate,
                }
            }

            if (Object.keys(dataToSend)?.length === 0 ) {
                toast.error("Please update any field.");
                return;
            }

            let url = "/api/order";
            if (source === "patientOrderPage") {
                url = "/api/patientorder";
            }

            const res = await fetch(`${url}/${selectedOrder._id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dataToSend),
            });

            const data = await res.json();
            if(data.success){
                toast.success("Order status updated");
                callAfterSave();
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

    return (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>Update Status</h2>
              <button onClick={() => setShowStatusModal(false)}>✕</button>
            </div>

            <div className={styles.form}>
              <p>{selectedOrder.customerName}</p>
              {selectedOrder?.status !== OrderStatusType.DELIVERED && <div className={styles.formGroup}>
                <label>Order Status</label>
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
              </div>}
              {selectedOrder?.status === OrderStatusType.PREPARING && statusUpdate === OrderStatusType.DISPATCHED &&
                <div className={styles.formGroup}>
                    <label>Delivery Service</label>
                    <input className={styles.dateField} type="text" name="deliveryService" onChange={(e) => {
                      setDeliveryInfo({ ...deliveryInfo, deliveryService: e.target.value });
                    }} />
                </div>
              }

              {selectedOrder?.status === OrderStatusType.PREPARING && statusUpdate === OrderStatusType.DISPATCHED &&
                <div className={styles.formGroup}>
                    <label>Delivery Track No.</label>
                    <input className={styles.dateField} type="text" name="deliveryTrackNumber" onChange={(e) => {
                      setDeliveryInfo({ ...deliveryInfo, deliveryTrackNumber: e.target.value });
                    }} />
                </div>
              }

              {selectedOrder?.paymentStatus !== PaymentStatusType.PAYMENT_DONE && <div className={styles.formGroup}>
                <label>Payment Status</label>
                <select
                  value={paymentStatusUpdate}
                  onChange={(e) => setPaymentStatusUpdate(e.target.value)}
                >
                  {Object.values(PaymentStatusType)?.map((item: string) => {
                    if (!isPaymentStatusAllowed(item)) return null;
                    return (
                      <option key={item} value={item} >{item}</option>
                    )
                  })}
                </select>
              </div>}

              {selectedOrder.paymentStatus !== PaymentStatusType.PAYMENT_DONE && paymentStatusUpdate === PaymentStatusType.PAYMENT_DONE &&
                <div className={styles.formGroup}>
                  <label>Payment Mode</label>
                  <select name="paymentType" onChange={(e) => setPaymentModeForUpdate(e.target.value)}>
                    {Object.values(PaymentModeType)?.map((item: string) => {
                        return (
                              <option key={item}>{item}</option>
                        )
                    })}
                  </select>
                </div>
              }
              {selectedOrder.paymentStatus !== PaymentStatusType.PAYMENT_DONE && paymentStatusUpdate === PaymentStatusType.PAYMENT_DONE &&
                <div className={styles.formGroup}>
                    <label>Payment Date</label>
                    <input className={styles.dateField} type="date" name="paymentDate" onChange={(e) => setPaymentDate(e.target.value)} />
                </div>
              }


              <button onClick={updateOrderStatus} disabled={statusUpdate === ""} style={{ cursor: statusUpdate === "" ? "not-allowed": "pointer" }}>
                Update Status
              </button>
            </div>
          </div>
          {loader && <Loader />}
        </div>
    )
}

export default OrderUpdateModal;