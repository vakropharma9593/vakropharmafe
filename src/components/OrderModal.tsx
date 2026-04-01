import { useContext, useEffect, useState } from "react";
import styles from "../styles/orderModal.module.css";
import { isLastRowEmpty, OrderStatusType, PaymentModeType, Product, ProductType } from "@/lib/utils";
import { Context } from "@/store/context";
import { toast } from "react-toastify";
import ACTIONS from "@/store/actions";
import Loader from "./Loader";
import { InventoryItem } from "@/store/reducers/adminReducer";

type Order = {
    customerPhone: string,
    customerId: string,
    customerName: string,
    date: string, 
    status: string, 
    paymentType?: string,
    creditId?: string,
    selectedProductId?: string,
}

interface OrderModalInterface {
    setShowOrderModal: (value: boolean) => void;
    orderData?: Order;
    source: string;
    callAfterSave?: () => void;
}

const OrderModal:React.FC<OrderModalInterface> = ({ setShowOrderModal, orderData, source, callAfterSave }) => {
    const { state, dispatch } = useContext(Context);
    const stateInventory = state.adminData.inventory;
    const stateProducts = state.adminData.products;

    const [orderFormData, setOrderFormData] = useState<Order>({
        customerPhone: "",
        customerId: "",
        customerName: "",
        date: "",
        status: "",
        paymentType: "",
        selectedProductId: "",
        creditId: ""
    });
    const [loader, setLoader] = useState(false);
    const [totalInfo, setTotalInfo] = useState<{totalAmountReceived: number, totalCostPrice: number, totalGstPayable: number, profit: number }>({
        totalAmountReceived: 0,
        totalCostPrice: 0,
        totalGstPayable: 0,
        profit: 0,
    });

    const [products, setProducts] = useState<Product[]>([
          { productId: "", productName: "", totalPrice: 0, accountTotalPrice: 0, batch: "", quantity: 0, discountPercentage: 0, batchId: "" },
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
            if(data.success) {
                dispatch({ type: ACTIONS.SET_INVENTORY, payload: data.data || [] });
                setShowOrderModal(false);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
         toast.error("Failed to get inventory");
        }
    };


    const handleOrderSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoader(true);
        if (orderFormData?.customerId !== "" && orderFormData?.date !== "" && orderFormData?.paymentType !== "" && orderFormData?.status && products?.length > 0 && !isLastRowEmpty(products)) {
          try {
            const dataToSend = { ...orderFormData, products, orderType: source === "creditInventory" ? "CREDIT" : "" }
            if (orderFormData.status === OrderStatusType.PAYMENT_PENDING) {
                delete dataToSend.paymentType;
            }
            let url = "/api/order";
            if (source === "patientOrderPage") {
                url = "/api/patientorder";
            }
            const res = await fetch(url, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(dataToSend),
            });

            const data = await res.json();
            if (data.success) {
    
                getInventory();
                callAfterSave && callAfterSave();
        
                toast.success("Order created successfully");
            } else {
                toast.error(data.message);
            }
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
        const returnedValue = products.reduce(
        (final, product) => {
            const selectedProduct = stateProducts?.find((item: ProductType) => item?._id === product.productId);
            const gstAmount = (product?.totalPrice*(selectedProduct?.gstPercentage || 0))/(100+(selectedProduct?.gstPercentage || 0));
            const amountReceived = Number((final.totalAmountReceived + product.totalPrice * product.quantity).toFixed(2));
            const costPrice = Number((final.totalCostPrice + (selectedProduct?.costPrice || 0) * product.quantity).toFixed(2));
            const gstPayable = Number((final.totalGstPayable + (gstAmount*product.quantity)).toFixed(2));
            const currentFinal = {
                totalAmountReceived: amountReceived,
                totalCostPrice: costPrice,
                totalGstPayable: gstPayable,
                profit: Number((amountReceived - costPrice - gstPayable).toFixed(2)),
            };
            return currentFinal;
        },{ totalAmountReceived: 0, totalCostPrice: 0, totalGstPayable: 0, profit: 0 });
        return returnedValue;
    };

    const addProduct = () => {
        setProducts([
            ...products,
            { productId:  "", productName: "", totalPrice: 0, batch: "", quantity: 0, discountPercentage: 0, batchId: "" },
        ]);
    };

    const handleProductChange = <K extends keyof Product>(
        index: number,
        field: K,
        value: Product[K],
        p?: Product,
        allBatchesOfProduct?: InventoryItem[],
    ) => {
        const updated = [...products];

        updated[index] = {
            ...updated[index],
            [field]: value,
        };

        if (field === "productId") {
            const productName = stateProducts.find((item: ProductType) => item?._id === value)?.name || "";
            updated[index] = {
                ...updated[index],
                productName: productName,
            };
        }

        if (field === "batchId") {
            const batchName = allBatchesOfProduct?.find((item: InventoryItem) => item?._id === value)?.batch || "";
            updated[index] = {
                ...updated[index],
                batch: batchName,
            };
        }

        setProducts(updated);
        if (updated[index]?.quantity > 0) {
            const currentTotalInfo = calculateTotal(updated);
            setTotalInfo(currentTotalInfo);
        }
        // update batches based on product
        if (field === "discountPercentage" && p) {
            const mrp = stateProducts?.filter((b: ProductType) => b._id === p.productId)[0].mrp;
            const totalPrice = mrp*(1 - parseFloat(value as string)/ 100);
            updated[index] = {
                ...updated[index],
                totalPrice: Number(totalPrice.toFixed(2)),
            };
        }
    };

    const removeProduct = (index: number) => {
        const updated = products.filter((_, i) => i !== index);
        setProducts(updated);

        const currentTotalInfo = calculateTotal(updated);
        setTotalInfo(currentTotalInfo);
    };

    const getCustomer = async (phone: string) => {
        setLoader(true);
        try {
        const res = await fetch(`/api/customer/${phone}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        const data = await res.json();
        if(data.success) {
            setOrderFormData({ ...orderFormData, customerPhone: phone, customerName: data.data.name, customerId: data.data?._id})

            toast.success("Customer fetched successfully");
        } else {
            toast.error(data.message);
        }
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
              {source === "orderPage" || source === "patientOrderPage" ? 
                <div className={styles.formGroup}>
                    <label>Customer Name</label>
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
                </div>
              :
                <>
                    <h4>Customer Phone : {orderFormData?.customerPhone}</h4>

                    {orderFormData?.customerName && <h4>Customer Name :: {orderFormData?.customerName}</h4>}
                </>
              }
              <div className={styles.formGroup}>
                <label>Order Date</label>
                <input className={styles.dateField} type="date" name="date" onChange={handleOrderChange} />
              </div>
              <div className={styles.formGroup}>
                <label>Order Status</label>
                <select name="status" onChange={handleOrderChange}>
                    <option value="">Select Status</option>
                    {Object.values(OrderStatusType)?.map((item: string) => {
                        return (
                            <option key={item} >{item}</option>
                        )
                    })}
                </select>
              </div>

              {(orderFormData.status === OrderStatusType.PAYMENT_DONE || orderFormData.status === OrderStatusType.PREPARING || orderFormData.status === OrderStatusType.DISPATCHED || orderFormData.status === OrderStatusType.DELIVERED) && 
                <div className={styles.formGroup}>
                    <label>Payment Mode</label>
                    <select name="paymentType" onChange={handleOrderChange}>
                        <option value="">Payment Mode</option>
                        {Object.values(PaymentModeType)?.map((item: string) => {
                            return (
                                <option key={item}>{item}</option>
                            )
                        })}
                    </select>
                </div>
              }

              <h4>Products</h4>

              {products.map((p, index) => {
                const allBatchesOfProduct = stateInventory?.filter((item: InventoryItem) => item?.productId === p.productId);
                let productList = stateProducts;
                if (orderFormData?.selectedProductId && orderFormData?.selectedProductId !== "") {
                    productList = stateProducts?.filter((item: ProductType) => item?._id === orderFormData?.selectedProductId);
                }
                return (
                    <div key={index} className={styles.eachProduct}>
                        <div className={styles.productRowOne} >
                            {/* PRODUCT */}
                            <div className={styles.formGroup}>
                                <label>Product Name</label>
                                <select value={p.productId} onChange={(e) => handleProductChange(index, "productId", e.target.value)}>
                                    <option value="">Select Product</option>
                                    {productList?.map((item: ProductType) => {
                                        return (
                                        <option key={item?._id} value={item?._id}>{item?.name}</option>
                                        )
                                    })}
                                </select>
                            </div>

                            {/* BATCH */}
                            <div className={styles.formGroup}>
                                <label>Batch Name</label>
                                <select
                                    value={p.batchId}
                                    className={styles.productRowOneBatch}
                                    onChange={(e) => handleProductChange(index, "batchId", e.target.value, undefined, allBatchesOfProduct)}
                                >
                                    <option value="">Batch</option>
                                    {allBatchesOfProduct.map((b) => (
                                        <option key={b._id} value={b._id}>{b.batch}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className={styles.productRow}>
                            {/* MRP */}
                            <div className={styles.infoBox}>
                                <span>MRP</span>
                                ₹{
                                    stateProducts?.filter((b) => b._id === p.productId)[0]?.mrp || 0
                                }
                            </div>

                            {/* DISCOUNT */}
                            <div className={styles.formGroup}>
                                <label>Discount (%)</label>
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
                                    )
                                    }
                                />
                            </div>

                            {/* Total PRICE */}
                            <div className={styles.infoBox}>
                                <span>Total ₹</span>
                                ₹{p.totalPrice}
                            </div>

                            {source === "patientOrderPage" && 
                                <div className={styles.formGroup}>
                                    <label>Account Price ₹</label>
                                    <input
                                        type="number"
                                        className={styles.smallInput}
                                        placeholder="₹"
                                        onChange={(e) =>
                                        handleProductChange(
                                            index,
                                            "accountTotalPrice",
                                            Number(e.target.value),
                                            p,
                                        )
                                        }
                                    />
                                </div>
                            }

                            {/* QTY */}
                            <div className={styles.formGroup}>
                                <label>Quantity</label>
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
                            </div>
                            {!(index === 0 && products?.length === 1) && <button
                                type="button"
                                className={styles.deleteBtn}
                                onClick={() => removeProduct(index)}
                            >
                                ✕
                            </button>}
                        </div>
                    </div>
                )
              })}

              {orderFormData?.selectedProductId && orderFormData?.selectedProductId !== "" ? null : <button type="button" disabled={isLastRowEmpty(products)} onClick={addProduct}>
                + Add Product
              </button>}

              <div className={styles.totalInfo}>
                <div className={styles.totalInfoEach} >
                    <div>
                        Total Amount Received:
                    </div> 
                    <div>
                        ₹{totalInfo.totalAmountReceived}
                    </div>
                </div>
                <div className={styles.totalInfoEach}>
                    <div>
                        Total Cost Price:
                    </div> 
                    <div>
                        ₹{totalInfo.totalCostPrice}
                    </div>
                </div>
                <div className={styles.totalInfoEach}>
                    <div>
                        Total Payable Gst:
                    </div> 
                    <div>
                        ₹{totalInfo.totalGstPayable}
                    </div>
                </div>
                <div className={styles.profitInfo} >
                    <div className={styles.totalInfoEach}>
                        <div>
                            Profit: 
                        </div>
                        <div className={totalInfo.profit > 0 ? styles.positiveProfit : styles.negativeProfit} >
                            ₹{totalInfo.profit}
                        </div>
                    </div>
                    <span className={styles.infoText}>
                        (Total Amount Received - Total Cost Price - Total Payable Gst)
                    </span>
                </div>
              </div>

              <button>Create Order</button>
            </form>
          </div>
          {loader && <Loader />}
        </div>
    );
};

export default OrderModal;