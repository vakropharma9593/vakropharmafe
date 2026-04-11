import { useEffect, useState } from "react";
import styles from "../styles/orderModal.module.css";
import { OrderStatusType, PaymentModeType } from "@/lib/utils";
import { toast } from "react-toastify";
import Loader from "./Loader";

type Order = {
    customerPhone: string;
    customerName: string;
    date: string;
    paymentDate?: string;
    status: string;
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
    const [paymentModeForUpdate, setPaymentModeForUpdate] = useState("Cash");
    const [paymentDate, setPaymentDate] = useState("");
    const [deliveryInfo, setDeliveryInfo] = useState({ deliveryService: "", deliveryTrackNumber: "" });
    const [loader, setLoader] = useState(false);

    useEffect(() => {
        const updateStatus = () => {
            switch (selectedOrder.status) {
                case OrderStatusType.PAYMENT_PENDING:
                    setStatusUpdate(OrderStatusType.PAYMENT_DONE);
                    break;
                case OrderStatusType.PAYMENT_DONE:
                    setStatusUpdate(OrderStatusType.PREPARING);
                    break;
                case OrderStatusType.PREPARING:
                    setStatusUpdate(OrderStatusType.DISPATCHED);
                    break;
                case OrderStatusType.DISPATCHED:
                    setStatusUpdate(OrderStatusType.DELIVERED);
                    break;
                default:
                    break;
            }
        }
        if (selectedOrder) {
            updateStatus();
        }
    },[selectedOrder])

    const isStatusAllowed = (item: string) => {
        switch (selectedOrder?.status) {
            case OrderStatusType.PAYMENT_PENDING:
                return true;
                break;
            case OrderStatusType.PAYMENT_DONE:
                if (item === OrderStatusType.PREPARING || item === OrderStatusType.DISPATCHED || item === OrderStatusType.DELIVERED) return true;
                break;
            case OrderStatusType.PREPARING:
                if (item === OrderStatusType.DISPATCHED || item === OrderStatusType.DELIVERED) return true;
                break;
            case OrderStatusType.DISPATCHED:
                if (item === OrderStatusType.DELIVERED) return true;
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

            let dataToSend: { status: string, deliveryService?: string, deliveryTrackNumber?: string, paymentType?: string, paymentDate?: string } = {
                status: statusUpdate
            }

            if (statusUpdate === OrderStatusType.PAYMENT_DONE && paymentModeForUpdate && paymentDate) {
                dataToSend = {
                    ...dataToSend,
                    paymentType: paymentModeForUpdate,
                    paymentDate,
                }
            }

            if (statusUpdate === OrderStatusType.DISPATCHED) {
                dataToSend = {
                    ...dataToSend,
                    deliveryService: deliveryInfo.deliveryService,
                    deliveryTrackNumber: deliveryInfo.deliveryTrackNumber,
                }
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
              <div className={styles.formGroup}>
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
              </div>
              {selectedOrder?.status !== OrderStatusType.DISPATCHED && statusUpdate === OrderStatusType.DISPATCHED &&
                <div className={styles.formGroup}>
                    <label>Delivery Service</label>
                    <input className={styles.dateField} type="text" name="deliveryService" onChange={(e) => {
                      setDeliveryInfo({ ...deliveryInfo, deliveryService: e.target.value });
                    }} />
                </div>
              }

              {selectedOrder?.status !== OrderStatusType.DISPATCHED && statusUpdate === OrderStatusType.DISPATCHED &&
                <div className={styles.formGroup}>
                    <label>Delivery Track No.</label>
                    <input className={styles.dateField} type="text" name="deliveryTrackNumber" onChange={(e) => {
                      setDeliveryInfo({ ...deliveryInfo, deliveryTrackNumber: e.target.value });
                    }} />
                </div>
              }

              {statusUpdate === OrderStatusType.PAYMENT_DONE &&
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
              {statusUpdate === OrderStatusType.PAYMENT_DONE &&
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