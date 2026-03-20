import AdminNavbar from "@/components/AdminNavbar";
import Loader from "@/components/Loader";
import { booleanToYesNo, dateToShow, PaymentType, PurposeType } from "@/lib/utils";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import styles from "../../styles/inventory.module.css";

export type ExpenseType = {
    voucher: string,
    paidTo: string,
    purpose: PurposeType,
    amountPaid: number,
    paidBy: string,
    paymentDate: string,
    paymentMode: PaymentType,
    authorizedByDirector: boolean,
    isSettled: boolean,
    settlementDate: string,
    _id?: string,
    expenseCategory?: string,
}

const Expense = () => {
  const [expenses, setExpenses] = useState<ExpenseType[]>([]);
  const [loader, setLoader] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<ExpenseType | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);

  const [formData, setFormData] = useState<ExpenseType>({
    voucher: "",
    paidTo: "",
    purpose: PurposeType.PRODUCT,
    amountPaid: 0,
    paidBy: "",
    paymentDate: "",
    paymentMode: PaymentType.CASH,
    authorizedByDirector: false,
    isSettled: false,
    settlementDate: "",
  });

    useEffect(() => {
        getExpenses()
    },[])

    const updateOrderStatus = async () => {
        if (!selectedExpense) return;

        try {
            setLoader(true);

            const res = await fetch(`/api/expense/${selectedExpense._id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isSettled: formData?.isSettled, settlementDate: formData?.isSettled ? formData?.settlementDate : ""}),
            });

            const data = await res.json();
            if (data.success) {
                setFormData({
                    voucher: "",
                    paidTo: "",
                    purpose: PurposeType.PRODUCT,
                    amountPaid: 0,
                    paidBy: "",
                    paymentDate: "",
                    paymentMode: PaymentType.CASH,
                    authorizedByDirector: false,
                    isSettled: false,
                    settlementDate: "",
                });

                toast.success("Order status updated");
                setShowStatusModal(false);
                getExpenses();
            } else {
                toast.error(data.message);
            }
        } catch {
            toast.error("Failed to update status");
        } finally {
            setLoader(false);
        }
    };

    const getExpenses = async () => {
        try {
            setLoader(true);
            const res = await fetch("/api/expense");
            const data = await res.json();
            if (data.success) {
                setExpenses(data.data || []);
            } else {
                toast.error(data.message);
            }
        } catch {
            toast.error("Failed to fetch orders");
        } finally {
            setLoader(false);
        }
    };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoader(true);
    if (formData?.voucher !== "" && formData?.paidTo !== "" && formData?.purpose && formData?.amountPaid > 0 && formData?.paidBy !== "" && formData?.paymentDate !== "" && formData?.paymentMode) {
      try {
        const finalDataToSend = { ...formData, settlementDate: formData?.isSettled ? formData?.settlementDate : "" }
        const res = await fetch("/api/expense", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(finalDataToSend),
        });

        const data = await res.json();
        if (data.success) {

            setFormData({
                voucher: "",
                paidTo: "",
                purpose: PurposeType.PRODUCT,
                amountPaid: 0,
                paidBy: "",
                paymentDate: "",
                paymentMode: PaymentType.CASH,
                authorizedByDirector: false,
                isSettled: false,
                settlementDate: "",
            });

            setShowModal(false);
            toast.success("Expense added successfully");
            getExpenses();
        } else {
            toast.error(data.message);
        }
      } catch {
        toast.error("Failed to add expense");
      } finally {
        setLoader(false);
      }
    } else {
      toast.error("Please fill all fields.");
      setLoader(false);
    }
  };

  return (
    <div className={styles.container}>
      <AdminNavbar />

      <div className={styles.content}>
        {/* Header */}
        <div className={styles.header}>
          <h1>
            Expenses
            <span>{expenses.length}</span>
          </h1>

          <button onClick={() => setShowModal(true)}>
            + Add Expense
          </button>
        </div>

        {/* Table */}
        <div className={styles.tableWrapper}>
          {expenses.length > 0 ? (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Voucher</th>
                  <th>Paid To</th>
                  <th>Purpose</th>
                  <th>Expense Category</th>
                  <th>Paid By</th>
                  <th>Amount Paid</th>
                  <th>Payment Date</th>
                  <th>PaymentMode</th>
                  <th>Authorized By Director</th>
                  <th>Is Settled</th>
                  <th>Settlement Date</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {expenses.map((item: ExpenseType, i: number) => (
                  <tr key={item._id} >
                    <td>{i + 1}</td>
                    <td>{item.voucher}</td>
                    <td>{item.paidTo}</td>
                    <td>{item.purpose}</td>
                    <td>{item.expenseCategory}</td>
                    <td>{item.paidBy}</td>
                    <td>₹{Number(item.amountPaid).toFixed(2)}</td>
                    <td>{dateToShow(item.paymentDate)}</td>
                    <td>{item.paymentMode}</td>
                    <td>{booleanToYesNo(item.authorizedByDirector)}</td>
                    <td>{booleanToYesNo(item.isSettled)}</td>
                    <td>{item?.settlementDate !== "" ? dateToShow(item.settlementDate) : ""}</td>
                    <td>
                      <button
                        className={styles.updateBtn}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedExpense(item);
                          setFormData(item);
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
            <p className={styles.empty}>No expenses yet</p>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>Add Expenses</h2>
              <button onClick={() => setShowModal(false)}>✕</button>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              <input name="voucher" placeholder="Voucher" onChange={handleChange} required />
              <input name="paidTo" placeholder="Paid To" onChange={handleChange} required />
              <select name="purpose" onChange={handleChange}>
                <option value="">Select Purpose</option>
                {Object.values(PurposeType)?.map((purpose: string) => {
                    return (
                        <option key={purpose} value={purpose}>{purpose}</option>
                    );
                })};
              </select>
              <input name="paidBy" placeholder="Paid By" onChange={handleChange} required />
              <input type="number" name="amountPaid" placeholder="Amount Paid" step="0.01" onChange={handleChange} />
              <label>Payment Date</label>
              <input type="date" name="paymentDate" onChange={handleChange} />
              <select name="paymentMode" onChange={handleChange}>
                <option value="">Select Mode</option>
                {Object.values(PaymentType)?.map((payment: string) => {
                    return (
                        <option key={payment} value={payment}>{payment}</option>
                    );
                })};
              </select>
              {/* Authorized By Director */}
                <div className={styles.radioGroup}>
                    <p>Authorized By Director</p>
                    <div className={styles.radioOptions}>
                        <label>
                        <input
                            type="radio"
                            name="authorizedByDirector"
                            value="true"
                            checked={formData.authorizedByDirector === true}
                            onChange={() =>
                                setFormData({ ...formData, authorizedByDirector: true })
                            }
                        />
                        Yes
                        </label>

                        <label>
                        <input
                            type="radio"
                            name="authorizedByDirector"
                            value="false"
                            checked={formData.authorizedByDirector === false}
                            onChange={() =>
                                setFormData({ ...formData, authorizedByDirector: false })
                            }
                        />
                        No
                        </label>
                    </div>
                </div>

                {/* Is Settled */}
                <div className={styles.radioGroup}>
                    <p>Is Settled</p>
                    <div className={styles.radioOptions}>
                        <label>
                        <input
                            type="radio"
                            name="isSettled"
                            value="true"
                            checked={formData.isSettled === true}
                            onChange={() =>
                                setFormData({ ...formData, isSettled: true })
                            }
                        />
                        Yes
                        </label>

                        <label>
                        <input
                            type="radio"
                            name="isSettled"
                            value="false"
                            checked={formData.isSettled === false}
                            onChange={() =>
                                setFormData({ ...formData, isSettled: false })
                            }
                        />
                        No
                        </label>
                    </div>
                </div>
              {formData?.isSettled && <label>Settlement Date</label>}
              {formData?.isSettled && <input type="date" name="settlementDate" onChange={handleChange} />}

              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      )}

      {/* STATUS MODAL */}
      {showStatusModal && selectedExpense && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>Update Status</h2>
              <button onClick={() => setShowStatusModal(false)}>✕</button>
            </div>

            <div className={styles.form}>
              <p>{selectedExpense.voucher}</p>

              <div className={styles.radioGroup}>
                    <p>Is Settled</p>
                    <div className={styles.radioOptions}>
                        <label>
                        <input
                            type="radio"
                            name="isSettled"
                            value="true"
                            checked={formData.isSettled === true}
                            onChange={() =>
                                setFormData({ ...formData, isSettled: true })
                            }
                        />
                        Yes
                        </label>

                        <label>
                        <input
                            type="radio"
                            name="isSettled"
                            value="false"
                            checked={formData.isSettled === false}
                            onChange={() =>
                                setFormData({ ...formData, isSettled: false })
                            }
                        />
                        No
                        </label>
                    </div>
                </div>
              {formData?.isSettled && <label>Settlement Date</label>}
              {formData?.isSettled && <input type="date" name="settlementDate" onChange={handleChange} />}

              <button onClick={updateOrderStatus}>
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}

      {loader && <Loader />}
    </div>
  );
};

export default Expense;