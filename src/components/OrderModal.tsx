import { useContext, useEffect, useState } from "react";
import styles from "../styles/orderModal.module.css";
import { isLastRowEmpty, Product } from "@/lib/utils";
import { Context } from "@/store/context";
import { toast } from "react-toastify";
import ACTIONS from "@/store/actions";
import Loader from "./Loader";

type Order = {
    customerPhone: string,
    customerId: string,
    customerName: string,
    date: string, 
    status: string, 
    paymentType: string,
}

interface OrderModalInterface {
    setShowOrderModal: (value: boolean) => void;
    orderData?: Order;
    source: string;
    allowedProducts: { name: string, value: string }[];
    callAfterSave?: () => void;
}

const OrderModal:React.FC<OrderModalInterface> = ({ setShowOrderModal, orderData, source, allowedProducts, callAfterSave }) => {
    const { state, dispatch } = useContext(Context);
    const stateInventory = state.inventory;

    const [orderFormData, setOrderFormData] = useState<Order>({
        customerPhone: "",
        customerId: "",
        customerName: "",
        date: "",
        status: "Payment_Pending",
        paymentType: "UPI",
    });
    const [loader, setLoader] = useState(false);
    const [totalAmountPaid, setTotalAmountPaid] = useState<number>(0);

    const [products, setProducts] = useState<Product[]>([
          { productName: "", sellingPrice: 0, batch: "", quantity: 1, discountPercentage: 0 },
    ]);
    const [errors, setErrors] = useState({ customerPhone: "" });

    useEffect(() => {
        if (orderData) {
            setOrderFormData(orderData);
        }
    },[orderData])

    const getInventory = async () => {
        try {
            const res = await fetch("/api/inventory");
            const data = await res.json();
            dispatch({ type: ACTIONS.SET_INVENTORY, payload: data.data || [] });
            setShowOrderModal(false);
        } catch (error) {
         toast.error("Failed to get inventory");
        }
    };


    const handleOrderSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoader(true);
        if (orderFormData?.customerId !== "" && orderFormData?.customerName !== "" && orderFormData?.paymentType !== "" && orderFormData?.status && products?.length > 0 && !isLastRowEmpty(products)) {
          try {
            await fetch("/api/order", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ...orderFormData, products, orderType: source === "creditInventory" ? "CREDIT" : "" }),
            });
    
            getInventory();
            callAfterSave && callAfterSave();
    
            toast.success("Order created successfully");
          } catch {
            toast.error("Failed to create order");
          } finally {
            setLoader(false);
          }
        } else {
          toast.error("Please fill all fields.");
          setLoader(false);
        }
      };

    const handleOrderChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setOrderFormData((prev) => ({ ...prev, [name]: value }));
    };

    const calculateTotal = (products: Product[]) => {
        return products.reduce(
        (total, product) => total + product.sellingPrice * product.quantity,
        0
        );
    };

    const addProduct = () => {
        setProducts([
            ...products,
            { productName: "", sellingPrice: 0, batch: "", quantity: 1, discountPercentage: 0 },
        ]);
    };

    const handleProductChange = <K extends keyof Product>(
        index: number,
        field: K,
        value: Product[K],
        p?: Product,
        batches?: { batch: string, mrp: number }[],
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
        if (field === "discountPercentage" && p && batches) {
            const mrp = batches?.filter((b: {batch: string, mrp: number}) => b.batch === p.batch)[0].mrp;
            const sellingPrice = mrp*(1 - parseFloat(value as string)/ 100);
            updated[index] = {
                ...updated[index],
                sellingPrice: Number(sellingPrice.toFixed(2)),
            };
        }
    };

    const removeProduct = (index: number) => {
        const updated = products.filter((_, i) => i !== index);
        setProducts(updated);

        const total = calculateTotal(updated);
        setTotalAmountPaid(total);
    };

    const getCustomer = async (phone: string) => {
        setLoader(true);
        try {
        const res = await fetch(`/api/customer/${phone}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        const data = await res.json();
        setOrderFormData({ ...orderFormData, customerPhone: phone, customerName: data.data.name, customerId: data.data?._id})

        toast.success("Customer fetched successfully");
        } catch {
        toast.error("Failed to fetch customer details.");
        } finally {
        setLoader(false);
        }
    }

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      setErrors({ customerPhone: "Phone must be 10 digits" });
      return false;
    }
    setErrors({ customerPhone: "" });
    return true;
  };

    return (
        <div className={styles.modalOverlay}>
          <div className={`${styles.modal}`}>
            <div className={styles.modalHeader}>
              <h2>Create Order</h2>
              <button onClick={() => setShowOrderModal(false)}>✕</button>
            </div>

            <form className={styles.form} onSubmit={handleOrderSubmit}>
              {source === "orderPage" ? 
                <>
                    <input
                        placeholder="Customer Phone"
                        value={orderFormData.customerPhone}
                        maxLength={10}
                        onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "");
                            setOrderFormData({
                                ...orderFormData,
                                customerPhone: value,
                            })
                            if (value?.length === 10) {
                                getCustomer(value);
                            }
                        }}
                        onBlur={() => validatePhone(orderFormData.customerPhone)}
                    />
                    {errors.customerPhone && (
                        <p className={styles.error}>{errors.customerPhone}</p>
                    )}

                    {orderFormData?.customerName && <h4>Customer Details :: {orderFormData?.customerName}</h4>}
                </>
              :
                <>
                    <h4>Customer Phone : {orderFormData?.customerPhone}</h4>

                    {orderFormData?.customerName && <h4>Customer Name :: {orderFormData?.customerName}</h4>}
                </>
              }

              <input type="date" name="date" onChange={handleOrderChange} />

              <select name="status" onChange={handleOrderChange}>
                <option>Payment_Pending</option>
                <option>Payment_Done</option>
                <option>Preparing</option>
                <option>Dispatched</option>
                <option>Delivered</option>
              </select>

              <select name="paymentType" onChange={handleOrderChange}>
                <option>UPI</option>
                <option>Cash</option>
                <option>Bank Transfer</option>
              </select>

              <h4>Products</h4>

              <div className={styles.productHeader}>
                <div>Product</div>
                <div>Batch</div>
                <div>MRP</div>
                <div>Discount %</div>
                <div>Selling</div>
                <div>Qty</div>
                <div></div>
              </div>

              {products.map((p, index) => {
                const allbatches = stateInventory?.filter((item: { batch: string, itemName: string }) => item?.itemName === p.productName);
                const allbatchesObject = allbatches.map((inventory: { batch: string, mrp: number }) => { return {batch: inventory.batch, mrp: inventory.mrp}});
                // const selecteBatch = allbatches?.filter((b) => b.batch === p.batch)[0];

                return (
                    <div key={index} className={styles.productRow}>
                    {/* PRODUCT */}
                    <select
                        value={p.productName}
                        onChange={(e) =>
                        handleProductChange(index, "productName", e.target.value)
                        }
                    >
                        <option value="">Select</option>
                        {allowedProducts?.map((eachProduct: {name: string, value: string })=> {
                            return (
                                <option key={eachProduct?.value} value={eachProduct?.value}>{eachProduct?.name}</option>
                            );
                        })}
                    </select>

                    {/* BATCH */}
                    <select
                        value={p.batch}
                        onChange={(e) =>
                        handleProductChange(index, "batch", e.target.value)
                        }
                    >
                        <option value="">Batch</option>
                        {allbatchesObject.map((b) => (
                            <option key={b.batch}>{b.batch}</option>
                        ))}
                    </select>

                    {/* MRP */}
                    <div className={styles.infoBox}>
                        <span>MRP</span>
                        ₹{
                            allbatchesObject?.filter((b) => b.batch === p.batch)[0]?.mrp || 0
                        }
                    </div>

                    {/* DISCOUNT */}
                    <input
                        type="number"
                        className={styles.smallInput}
                        placeholder="%"
                        onChange={(e) =>
                        handleProductChange(
                            index,
                            "discountPercentage",
                            Number(e.target.value),
                            p,
                            allbatchesObject
                        )
                        }
                    />

                    {/* SELLING PRICE */}
                    <div className={styles.infoBox}>
                        <span>Selling</span>
                        ₹{p.sellingPrice}
                    </div>

                    {/* QTY */}
                    <input
                        type="number"
                        className={styles.smallInput}
                        placeholder="Qty"
                        onChange={(e) =>
                        handleProductChange(
                            index,
                            "quantity",
                            Number(e.target.value)
                        )
                        }
                    />
                    {!(index === 0 && products?.length === 1) && <button
                        type="button"
                        className={styles.deleteBtn}
                        onClick={() => removeProduct(index)}
                    >
                        ✕
                    </button>}
                    </div>
                )
              })}

              <button type="button" disabled={isLastRowEmpty(products)} onClick={addProduct}>
                + Add Product
              </button>

              <div className={styles.total}>
                Total: ₹{Number(totalAmountPaid.toFixed(2))}
              </div>

              <button>Create Order</button>
            </form>
          </div>
          {loader && <Loader />}
        </div>
    );
};

export default OrderModal;