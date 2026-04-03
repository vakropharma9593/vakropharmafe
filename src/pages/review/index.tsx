import AddReviewModal from "@/components/AddReviewModal";
import Loader from "@/components/Loader";
import { ProductType } from "@/lib/utils";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const ReviewPage = () => {
    const [products, setProducts] = useState<ProductType[]>([]);
    const [loader, setLoader] = useState<boolean>(false);
    const router = useRouter();

    useEffect(() => {
        getProducts();
    },[]);

    const getProducts = async () => {
      setLoader(true);
      try {
        const res = await fetch("api/product");
        const data = await res.json();
        if (data.success) {
          setProducts(data.data);
        } else {
          toast.error("Failed to fetch products");
        }
      } catch {
        toast.error("Failed to fetch products");
      } finally {
        setLoader(false);
      }
    };

    return (
        <div>
            <AddReviewModal onClose={() => router.push("/")} afterSuccessCall={() => router.push("/")} source="sharedLink" products={products} />
            {loader && <Loader />}
        </div>
    );
};

export default ReviewPage;