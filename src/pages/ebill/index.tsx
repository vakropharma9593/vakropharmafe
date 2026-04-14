"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./invoice.module.css";
import Image from "next/image";
import vakroLogo from "../../../public/assets/darkGreenLogo.svg";
import Link from "next/link";
import { CustomerType, dateToShow, PaymentStatusType } from "@/lib/utils";

type Item = {
  name: string;
  qty: number;
  mrp: number;
  price: number;
  gst: number;
};

type Product = {
    productName: string;
    quantity: number;
    freeQuantity: number;
    totalPrice: number;
    sellingPrice: number;
    mrp: number;
    totalGstPayable: number;
}

type Order = {
  _id: string;
  customerName: string;
  customerPhone: string;
  customerType: CustomerType;
  customerGst?: string;
  paymentStatus: string;
  date: string;
  products: Product[];
  totalAmountPaid: number;
};

const Invoice = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("o");
  const token = searchParams.get("t");

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<Order | null>(null);

  // 🔥 Fetch Order (WITH TOKEN)
  useEffect(() => {
    if (!orderId || !token) {
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/order/${orderId}?t=${token}`
        );
        const data = await res.json();

        if (data.success) {
          setOrder(data.data);
        } else {
          setOrder(null);
        }
      } catch (err) {
        console.error(err);
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, token]);

  // 🔥 Transform API → UI
  const items: Item[] =
    order?.products?.map((p: Product) => ({
      name: p.productName,
      qty: p.quantity,
      mrp: p.mrp,
      price: p.sellingPrice,
      gst: Math.round(p.sellingPrice * 0.05), // better: send from backend
    })) || [];

  const subtotal = items.reduce((acc, i) => acc + i.price, 0);
  const gstTotal = items.reduce((acc, i) => acc + i.gst, 0);
  const grandTotal = subtotal + gstTotal;

  // 🔥 WhatsApp Share (secure link)
  const shareOnWhatsApp = () => {
    const link = `${window.location.origin}/ebill?o=${orderId}&t=${token}`;

    const message = `🧾 *Vakro Invoice*
        Order ID: ${orderId}
        Amount Paid: ₹${grandTotal}

        View Bill: ${link}

        Thank you ❤️`;

    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  // 🔥 Download PDF (secure)
  const downloadInvoice = () => {
    window.open(
      `/api/invoice?orderId=${orderId}&t=${token}`,
      "_blank"
    );
  };

  // 🔥 STATES
  if (loading) {
    return (
      <div className={styles.wrapper}>
        <p>Loading invoice...</p>
      </div>
    );
  }

  if (!orderId || !token) {
    return (
      <div className={styles.wrapper}>
        <p>Invalid invoice link ❌</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className={styles.wrapper}>
        <p>Invoice not found / Unauthorized ❌</p>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.outerContainer}>
        <div className={styles.zigzagTop}>
          <span>.</span>
        </div>
        <div className={styles.topHeader} >
          <div className={styles.topHeaderContent} >
            <div className={styles.logo} >
              <Image src={vakroLogo} alt="Vakro" width={32} height={32} className={styles.logo}/>
              <h5 className={styles.brand}>Vakro</h5>
            </div>
            <div>
              <div className={styles.location} >
                <svg 
                  fill="none" 
                  viewBox="0 0 18 18" 
                  width={22}
                  height={22}
                  xmlns="http://www.w3.org/2000/svg"
                >
                    <path 
                      d="M9 1.6875C6.20508 1.6875 3.9375 3.84574 3.9375 6.50391C3.9375 9.5625 7.3125 14.4095 8.55176 16.0836C8.6032 16.1543 8.67062 16.2118 8.74852 16.2515C8.82642 16.2911 8.91259 16.3118 9 16.3118C9.08741 16.3118 9.17358 16.2911 9.25148 16.2515C9.32938 16.2118 9.3968 16.1543 9.44824 16.0836C10.6875 14.4102 14.0625 9.56496 14.0625 6.50391C14.0625 3.84574 11.7949 1.6875 9 1.6875Z" 
                      stroke="#202020" 
                      stroke-linecap="round" 
                      stroke-linejoin="round" 
                      stroke-width="0.7"
                    >
                    </path>
                    <path 
                      d="M9 8.4375C9.93198 8.4375 10.6875 7.68198 10.6875 6.75C10.6875 5.81802 9.93198 5.0625 9 5.0625C8.06802 5.0625 7.3125 5.81802 7.3125 6.75C7.3125 7.68198 8.06802 8.4375 9 8.4375Z" 
                      stroke="#202020" 
                      stroke-linecap="round" 
                      stroke-linejoin="round" 
                      stroke-width="0.7"
                    >
                    </path>
                  </svg>
                  <p>Piragi, Bijnor, UP</p>
              </div>
              <Link href={`/`}>
                <button className={styles.viewButton}>
                  View Store
                </button>
              </Link>
            </div>
          </div>
          <div className={styles.bottomBillLine}></div>
        </div>
        <div className={styles.card}>
          <div className={styles.billContent} >
            <div className={styles.info}>
              <div className={styles.row}>
                <p>GSTIN</p>
                <span>29AASCM6768L1ZA</span>
              </div>
              <div className={styles.row}>
                <p>Name</p>
                <span>Vakro Pharma</span>
              </div>
            </div>
            <div className={styles.dottedLine} />
            <div className={styles.info}>
              <div className={styles.row}>
                <p>Customer Name</p>
                <span>{order.customerName}</span>
              </div>
              {order.customerGst && <div className={styles.row}>
                <p>Customer GST</p>
                <span>
                  {order.customerGst
                    ? "*".repeat(order.customerGst.length - 4) +
                      order.customerGst.slice(-4)
                    : ""}
                </span>
              </div>}
              <div className={styles.row}>
                <p>Customer Number</p>
                <span>
                  {order.customerPhone
                    ? "*".repeat(order.customerPhone.length - 4) +
                      order.customerPhone.slice(-4)
                    : ""}
                </span>
              </div>
            </div>
            <div className={styles.dottedLine} />
            <div className={styles.download}>
              <span className={styles.bold}>
                Hi {order.customerName || "User"}, here’s your bill
              </span>
              <button
                className={styles.downloadButton}
                onClick={downloadInvoice}
              >
                ⬇ Download
              </button>
            </div>
            <div className={styles.dottedLine} />
            <div className={styles.summary}>
              <div className={styles.row}>
                <span className={styles.bold}>₹ {order.totalAmountPaid}</span>
                <span>
                  {dateToShow(order.date)}
                </span>
              </div>

              <div className={styles.subRow}>
                {/* <span>Order ID: {order._id}</span> */}
                <span>{order.products?.reduce((total, item ) => { return total + item?.quantity + (item?.freeQuantity || 0)}, 0)} items</span>
              </div>
              {order.paymentStatus === PaymentStatusType.PAYMENT_PENDING ? <div className={styles.pending}>Payment Pending</div> : <div className={styles.stamp}>PAID</div>}
            </div>
            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ scaleY: 0, originY: 0 }}
                  animate={{ scaleY: 1 }}
                  exit={{ scaleY: 0 }}
                  transition={{ duration: 0.6 }}
                  className={styles.expand}
                >
                  <motion.div
                    initial={{ y: -40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className={styles.expandContent}
                  >
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th className={`${order.customerType === CustomerType.WHOLE_SALE ? styles.wholeSale : ""}`} >Item</th>
                          <th>Qty</th>
                          {order.customerType === CustomerType.WHOLE_SALE && <th>Free</th>}
                          <th>MRP</th>
                          <th>Amt</th>
                          {order.customerGst && <th>GST</th>}
                        </tr>
                      </thead>

                      <tbody>
                        {order.products.map((p: { 
                          productName: string, 
                          mrp: number, 
                          quantity: number, 
                          freeQuantity: number,
                          sellingPrice: number, 
                          totalPrice: number,
                          totalGstPayable: number
                        }, i: number) => (
                          <tr key={i}>
                            <td className={`${order.customerType === CustomerType.WHOLE_SALE ? styles.wholeSale : ""}`} >{p.productName}</td>
                            <td>{p.quantity}</td>
                            {order.customerType === CustomerType.WHOLE_SALE && <td>{p.freeQuantity}</td>}
                            <td>₹{p.mrp}</td>
                            <td>₹{order.customerGst ? p.sellingPrice : p.totalPrice}</td>
                            {order.customerGst && <td>₹{Number((p.totalPrice - p.sellingPrice).toFixed(2))}</td>}
                          </tr>
                        ))}

                        <tr className={styles.medium}>
                          <td colSpan={order.customerType === CustomerType.WHOLE_SALE ? 4 : 3}>Subtotal</td>
                          <td>₹{Number((order.products.reduce((total, p) => {
                            total = order.customerGst ? total + p.quantity*p.sellingPrice : total + p.quantity*p.totalPrice
                            return total;
                          }, 0)).toFixed(2))}</td>
                          {order.customerGst && <td>₹{Number((order.products.reduce((total, p) => {
                            total = total + p.quantity*(p.totalPrice - p.sellingPrice)
                            return total;
                          }, 0)).toFixed(2))}</td>}
                        </tr>

                        <tr className={styles.total}>
                          <td colSpan={order.customerType === CustomerType.WHOLE_SALE ? 4 : 3}>Grand Total</td>
                          <td colSpan={2}>₹{order.totalAmountPaid}</td>
                        </tr>
                      </tbody>
                    </table>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className={styles.center}>
            <button
              onClick={() => setOpen(!open)}
              className={styles.toggleBtn}
            >
              {open ? "Hide Info" : "See Full Info"}
            </button>
          </div>       
          <svg 
            fill="none" 
            viewBox="0 0 424 13" 
            xmlns="http://www.w3.org/2000/svg"
            className={styles.billContentBottom}
          >
            <path 
              clip-rule="evenodd" 
              d="M0 2C0 0.895431 0.895435 0 2 0H422C423.105 0 424 0.89543 424 2V5.09224C424 6.70783 422.135 7.70663 420.624 7.13647C419.011 6.52813 417.289 6.19922 415.5 6.19922C410.766 6.19922 406.498 8.50312 403.489 12.1936C403.085 12.6894 402.49 13 401.85 13H388.15C387.51 13 386.915 12.6894 386.511 12.1936C383.502 8.50312 379.234 6.19922 374.5 6.19922C369.766 6.19922 365.498 8.50312 362.489 12.1936C362.085 12.6894 361.49 13 360.85 13H348.15C347.51 13 346.915 12.6894 346.511 12.1936C343.502 8.50312 339.234 6.19922 334.5 6.19922C329.766 6.19922 325.498 8.50312 322.489 12.1936C322.085 12.6894 321.49 13 320.85 13H306.15C305.51 13 304.915 12.6894 304.511 12.1936C301.502 8.50312 297.234 6.19922 292.5 6.19922C287.766 6.19922 283.498 8.50312 280.489 12.1936C280.085 12.6894 279.49 13 278.85 13H265.15C264.51 13 263.915 12.6894 263.511 12.1936C260.502 8.50312 256.234 6.19922 251.5 6.19922C246.766 6.19922 242.498 8.50312 239.489 12.1936C239.085 12.6894 238.49 13 237.85 13H224.15C223.51 13 222.915 12.6894 222.511 12.1936C219.502 8.50312 215.234 6.19922 210.5 6.19922C205.766 6.19922 201.498 8.50312 198.489 12.1936C198.085 12.6894 197.49 13 196.85 13H183.15C182.51 13 181.915 12.6894 181.511 12.1936C178.502 8.50312 174.234 6.19922 169.5 6.19922C164.766 6.19922 160.498 8.50312 157.489 12.1936C157.085 12.6894 156.49 13 155.85 13H142.15C141.51 13 140.915 12.6894 140.511 12.1936C137.502 8.50312 133.234 6.19922 128.5 6.19922C123.766 6.19922 119.498 8.50312 116.489 12.1936C116.085 12.6894 115.49 13 114.85 13H101.15C100.51 13 99.9149 12.6894 99.5108 12.1936C96.5019 8.50312 92.2337 6.19922 87.5 6.19922C82.7663 6.19922 78.4981 8.50312 75.4892 12.1936C75.0851 12.6894 74.4896 13 73.85 13H59.15C58.5104 13 57.9149 12.6894 57.5108 12.1936C54.5019 8.50312 50.2337 6.19922 45.5 6.19922C40.7663 6.19922 36.4981 8.50312 33.4892 12.1936C33.0851 12.6894 32.4896 13 31.85 13H19.15C18.5104 13 17.9149 12.6894 17.5108 12.1936C14.5019 8.50312 10.2337 6.19922 5.5 6.19922C4.59826 6.19922 3.71342 6.28282 2.85096 6.44368C1.45387 6.70426 0 5.72807 0 4.30689V2Z" 
              fill="#F4EFE7" 
              fill-rule="evenodd"
            >
            </path>
          </svg>
        </div>
      </div>
      <div className={styles.reviewFloating}>
        <div className={styles.reviewContent}>
          <div className={styles.reviewText}>
            <p className={styles.reviewTitle}>Enjoyed your order?</p>
            <p className={styles.reviewSub}>Help us improve with your feedback</p>
          </div>

          <Link href="/review">
            <button className={styles.reviewBtn}>
              ⭐ Review
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Invoice;