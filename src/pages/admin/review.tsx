import AdminNavbar from "@/components/AdminNavbar";
import Loader from "@/components/Loader";
import { booleanToYesNo, Review } from "@/lib/utils";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import styles from "../../styles/order.module.css";
import Pagination from "@/components/Pagination";


const Reviews = () => {

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loader, setLoader] = useState(false);

  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);

  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [totalReviews, setTotalReviews] = useState(0);

  useEffect(() => {
    getAllReviews(page);
  }, [page]);

  const getAllReviews = async (pageNumber = 1) => {
    setLoader(true);
    try {
      const res = await fetch(`/api/review?page=${pageNumber}&limit=${limit}`);
      const data = await res.json();
      if(data.success) {
        setReviews(data.data || []);
        setTotalPages(data.pagination?.totalPages || 1);
        setPage(data.pagination?.page || 1);
        setTotalReviews(data.pagination?.total || 0);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to fetch reviews.");
    } finally {
      setLoader(false);
    }
  }

  const updateReview = async () => {
    if (!selectedReview) return;

    try {
      setLoader(true);

      const res = await fetch(`/api/review/${selectedReview._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isVerifiedUser: selectedReview.isVerifiedUser }),
      });

      const data = await res.json();
      if(data.success){
        toast.success("Review verification updated");
        getAllReviews()
        setShowStatusModal(false);
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Failed to update verification");
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
            Reviews <span>{reviews.length} out of {totalReviews}</span>
          </h1>
        </div>

        <div className={styles.tableWrapper}>
          {reviews.length > 0 ? (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Reviewer</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Product Name</th>
                  <th>Skin Type</th>
                  <th>Concerns</th>
                  <th>Rating</th>
                  <th>Review</th>
                  <th>IsVerified</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((review, index) => (
                  <tr 
                    key={review?._id || index}
                  >
                    <td>{index + 1}</td>
                    <td>{review.reviewerName}</td>
                    <td>{review?.phone || "-"}</td>
                    <td>{review?.email || "-"}</td>
                    <td>{review?.productId?.name}</td>
                    <td>{review?.skinType}</td>
                    <td>{review?.skinConcern}</td>
                    <td>{review?.rating}</td>
                    <td style={{ wordBreak: "break-all" }} >{review?.review}</td>
                    <td>{booleanToYesNo(review?.isVerifiedUser || false)}</td>
                    <td>
                      <button
                        className={styles.updateBtn}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedReview(review);
                          setShowStatusModal(true);
                        }}
                        disabled={review.isVerifiedUser === true}
                        style={{ cursor: review.isVerifiedUser === true ? "not-allowed" : "pointer"}}
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className={styles.empty}>No reviews yet</p>
          )}
        </div>
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={(p) => setPage(p)}
        />
      </div>

      {/* STATUS MODAL */}
      {showStatusModal && selectedReview && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>Update IsVerified</h2>
              <button onClick={() => setShowStatusModal(false)}>✕</button>
            </div>

            <div className={styles.form}>
                <p>{selectedReview.reviewerName}</p>
                <div className={styles.radioGroup}>
                    <p>Is Verified ?</p>
                    <div className={styles.radioOptions}>
                        <label>
                        <input
                            type="radio"
                            name="isVerified"
                            value="true"
                            checked={selectedReview?.isVerifiedUser === true}
                            onChange={() =>
                                setSelectedReview({ ...selectedReview, isVerifiedUser: true })
                            }
                        />
                            Yes
                        </label>
    
                        <label>
                        <input
                            type="radio"
                            name="isSettled"
                            value="false"
                            checked={selectedReview?.isVerifiedUser === false}
                            onChange={() =>
                                setSelectedReview({ ...selectedReview, isVerifiedUser: false })
                            }
                        />
                            No
                        </label>
                    </div>
                </div>
                <button onClick={updateReview}>
                    Update
                </button>
            </div>
          </div>
        </div>
      )}

      {loader && <Loader />}
    </div>
  );
};

export default Reviews;