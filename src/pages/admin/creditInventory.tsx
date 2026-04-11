import AdminNavbar from "@/components/AdminNavbar";
import Loader from "@/components/Loader";
import { useEffect, useState } from "react";
import { toast, Bounce } from "react-toastify";
import styles from "../../styles/inventory.module.css";
import OrderModal from "@/components/OrderModal";
import { dateToShow, isLastRowEmpty, Product, ProductType } from "@/lib/utils";
import { useStore } from "@/store";
import { InventoryItem } from "@/store/adminStore";
import SearchBar from "@/components/SearchBar";
import Pagination from "@/components/Pagination";

type CreditInventoryItem = {
  _id?: string;
  products: {
    productId: string;
    productName: string;
    batchId: string;
    batch: string;
    totalUnit: number;
    remainingUnit: number;
  }[];
  customerName: string;
  customerId: string;
  customerPhone: number;
  dateOfInventory: string;
}

const CreditInventory = () => {
  const stateInventory = useStore((store) => store.adminData.inventory);
  const stateProducts = useStore((store) => store.adminData.products);
  const [loader, setLoader] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [creditInventory, setCreditInventory] = useState<CreditInventoryItem[]>([]);
  const [errors, setErrors] = useState({ customerNumber: "" });

  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderFormData, setOrderFormData] = useState<{
    customerPhone: string;
    customerId: string;
    customerName: string;
    date: string;
    status: string;
    paymentType: string;
    selectedProductId: string[];
    creditId: string;
  }>({
    customerPhone: "", // to show
    customerId: "",
    customerName: "", // to show
    date: "",
    status: "Payment_Pending",
    paymentType: "UPI",
    selectedProductId: [],
    creditId: "",
  });

  const [formData, setFormData] = useState({
    customerId: "",
    customerNumber: "",
    customerName: "",
    dateOfInventory: "",
  });

  const [products, setProducts] = useState<Product[]>([
        { productId: "", productName: "", totalPrice: 0, accountTotalPrice: 0, batch: "", quantity: 0, discountPercentage: 0, batchId: "" },
  ]);
  
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    getCreditInventory(page, debouncedSearch);
  }, [page, debouncedSearch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

    const getCreditInventory = async (pageNumber = 1, searchText = "") => {
      setLoader(true);
      try {
          const res = await fetch(`/api/creditInventory?page=${pageNumber}&limit=${limit}&search=${searchText}`);

          const data = await res.json();
          if(data.success){
            setCreditInventory(data.data || []);
            setTotalPages(data.pagination?.totalPages || 1);
            setPage(data.pagination?.page || 1);
            setTotalOrders(data.pagination?.total || 0);
          } else {
            toast.error(data.message);
          }

      } catch (error) {
          toast(`Failed to get inventory details. Please try again. ${error}`, {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              type: "error",
              theme: "light",
              transition: Bounce,
          });
      } finally {
        setLoader(false);
      }
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoader(true);
    if (formData?.customerId !== "" && products?.length > 0 && formData?.dateOfInventory !== "") {
      const dataToSend = {
        customerId: formData.customerId,
        dateOfInventory: formData.dateOfInventory,
        products: products?.map((item: Product) => {
          return {
            productId: item?.productId,
            batchId: item?.batchId,
            totalUnit: item?.quantity,
          }
        })
      }
      try {
        const res = await fetch("/api/creditInventory", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataToSend),
        });

        const data = await res.json();
        if(data.success) {
          setShowModal(false);
          toast.success("Credit Inventory added successfully");
          getCreditInventory();
        } else {
          toast.error(data.message);
        }
      } catch {
        toast.error("Failed to add credit inventory");
      } finally {
        setLoader(false);
      }
    } else {
      toast.error("Please fill all fields.");
      setLoader(false);
    }
  };

   const getCustomer = async (phone: string) => {
    setLoader(true);
    try {
      const res = await fetch(`/api/customer/${phone}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (data.success) {
        setFormData({ ...formData, customerNumber: phone, customerName: data.data.name, customerId: data.data?._id})

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
      setErrors({ customerNumber: "Phone must be 10 digits" });
      return false;
    }
    setErrors({ customerNumber: "" });
    return true;
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
  };

  const removeProduct = (index: number) => {
    const updated = products.filter((_, i) => i !== index);
    setProducts(updated);
  };

  return (
    <div className={styles.container}>
      <AdminNavbar />

      <div className={styles.content}>
        <div className={styles.header}>
          <h1>
            Credit Inventory
            <span>{creditInventory?.length} out of {totalOrders}</span>
          </h1>

          <button onClick={() => setShowModal(true)}>
            + Add Credit Inventory
          </button>
        </div>

        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search by customer name or phone..."
        />

        {/* Table */}
        <div className={styles.tableWrapper}>
          {creditInventory?.length > 0 ? (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Customer Name</th>
                  <th>Customer Number</th>
                  <th>Date of Inventory</th>
                  <th>Products</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {creditInventory.map((item: CreditInventoryItem, i: number) => (
                  <tr key={item._id}>
                    <td>{i + 1}</td>
                    <td>{item?.customerName}</td>
                    <td>{item?.customerPhone}</td>
                    <td>{dateToShow(item?.dateOfInventory)}</td>
                    <td>
                      {item.products.map((p, i) => (
                        <div key={i} className={styles.productItem}>
                          {p.productName} × {p.remainingUnit + "/" + p.totalUnit}
                        </div>
                      ))}
                    </td>
                    <td className={styles.actions}>
                      <button onClick={() => {
                        const currentProductsName: string[] = [];
                        item?.products?.forEach((e: {productId: string }) => {
                          currentProductsName.push(e.productId);
                        })
                        setOrderFormData({ ...orderFormData, date: item?.dateOfInventory, customerPhone: JSON.stringify(item?.customerPhone), customerName: item?.customerName, selectedProductId: currentProductsName, customerId: item?.customerId || "", creditId: item?._id || "" });
                        setShowOrderModal(true);
                      }}>
                        Place Order
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className={styles.empty}>No credit inventory yet</p>
          )}
        </div>
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={(p) => setPage(p)}
        />
      </div>

      {/* Modal */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>Add Credit Inventory</h2>
              <button onClick={() => setShowModal(false)}>✕</button>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label>Customer Phone</label>
                <input
                  placeholder="Customer Phone"
                  value={formData.customerNumber}
                  maxLength={10}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    setFormData({
                      ...formData,
                      customerNumber: value,
                      customerId: "",
                      customerName: ""
                    })
                    if (value?.length === 10) {
                      getCustomer(value);
                    }
                  }}
                  onBlur={() => validatePhone(formData.customerNumber)}
                />
                {errors.customerNumber !== "" && (
                  <p className={styles.error}>{errors.customerNumber}</p>
                )}
              </div>

              {formData?.customerName && <h4>Customer Details :: {formData?.customerName}</h4>}

              <div className={styles.formGroup}>
                <label>Date of Inventory Given</label>
                <input className={styles.dateField} type="date" name="dateOfInventory" onChange={(e) => setFormData({ ...formData, dateOfInventory: e.target.value})} />
              </div>

              <h4>Products</h4>

              {products.map((p, index) => {
                const allBatchesOfProduct = stateInventory?.filter((item: InventoryItem) => item?.productId === p.productId);
                return (
                    <div key={index} className={styles.eachProduct}>
                        <div className={styles.productRowOne} >
                            {/* PRODUCT */}
                            <div className={styles.formGroup}>
                                <label>Product Name</label>
                                <select value={p.productId} onChange={(e) => handleProductChange(index, "productId", e.target.value)}>
                                    <option value="">Select Product</option>
                                    {stateProducts?.map((item: ProductType) => {
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

              <button type="button" disabled={isLastRowEmpty(products)} onClick={addProduct}>
                + Add Product
              </button>

              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      )}

      {showOrderModal && <OrderModal setShowOrderModal={setShowOrderModal} orderData={orderFormData} source="creditInventory" callAfterSave={getCreditInventory} />}

      {loader && <Loader />}
    </div>
  );
};

export default CreditInventory;