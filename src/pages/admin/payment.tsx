import AdminNavbar from "@/components/AdminNavbar";
import Loader from "@/components/Loader";
import { dateToShow, Product } from "@/lib/utils";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import styles from "../../styles/order.module.css";

type PaymentType = {
  _id?: string;
  date: string;
  totalAmount: number;
  paymentType: string;
  customerNumber: number;
  products: Product[];
};

const Payments = () => {

  const [payments, setPayments] = useState<PaymentType[]>([]);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    getPayments();
  }, []);

  const getPayments = async () => {
    try {
      setLoader(true);
      const res = await fetch("/api/payment");
      const data = await res.json();
      if(data.success) {
        setPayments(data.data || []);
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Failed to fetch payments");
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className={styles.container}>
      <AdminNavbar />

      <div className={styles.content}>
        <div className={styles.header}>
          <h1>
            Payments <span>{payments.length}</span>
          </h1>
        </div>

        <div className={styles.tableWrapper}>
          {payments.length > 0 ? (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Total Amount Paid</th>
                  <th>Payment Mode</th>
                  <th>Products</th>
                </tr>
              </thead>

              <tbody>
                {payments.map((payment, index) => (
                  <tr key={payment._id || index}>
                    <td>{index + 1}</td>
                    <td>{payment.customerNumber}</td>
                    <td>{dateToShow(payment.date)}</td>
                    <td>₹{Number(payment.totalAmount.toFixed(2))}</td>
                    <td>{payment.paymentType}</td>        
                    <td>
                      {payment.products.map((p, i) => (
                        <div key={i} className={styles.productItem}>
                          <div>{p.productName} × {p.quantity}</div>
                          <div>Total Price: {p.totalPrice}*{p.quantity} :: {p.totalPrice*p.quantity}</div>
                        </div>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className={styles.empty}>No payments yet</p>
          )}
        </div>
      </div>

      {loader && <Loader />}
    </div>
  );
};

export default Payments;