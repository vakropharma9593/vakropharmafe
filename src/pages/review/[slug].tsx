import AddReviewModal from "@/components/AddReviewModal";
import Loader from "@/components/Loader";
import { ProductType } from "@/lib/utils";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const ReviewBySlugPage = () => {
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [productName, setProductName] = useState<string>("");
  const [loader, setLoader] = useState<boolean>(true);

  const router = useRouter();
  const { slug } = router.query;

  useEffect(() => {
    if (slug) {
      getProducts();
    }
  }, [slug]);

  const getProducts = async () => {
    setLoader(true);
    try {
      const res = await fetch("/api/product");
      const data = await res.json();

      if (data.success) {
        const allProducts = data.data;

        // match using slug (BEST PRACTICE)
        const matched = allProducts.find(
          (p: ProductType) => p.slug === slug
        );

        if (matched) {
          setSelectedProductId(matched._id);
          setProductName(matched.name);
        } else {
          toast.error("Product not found");
          router.push("/review");
        }
      } else {
        toast.error("Failed to fetch products");
      }
    } catch {
      toast.error("Failed to fetch products");
    } finally {
      setLoader(false);
    }
  };

  if (loader) return <Loader />;

  return (
    <div>
      <AddReviewModal
        onClose={() => router.push("/")}
        afterSuccessCall={() => router.push("/")}
        source="sharedLink"
        productId={selectedProductId}
        productName={productName}
      />
    </div>
  );
};

export default ReviewBySlugPage;