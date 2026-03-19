import AdminNavbar from "@/components/AdminNavbar";
import Loader from "@/components/Loader";
import { useEffect, useState } from "react";
import { toast, Bounce } from "react-toastify";
import styles from "../../styles/contactus.module.css";

const ContactSubmissions = () => {
  const [contactUs, setContactUs] = useState([]);
  const [loader, setLoader] = useState<boolean>(false);

  useEffect(() => {
    const getContacts = async () => {
      setLoader(true);
      try {
        const res = await fetch("/api/contactus");
        const data = await res.json();
        if(data.success) {
          setContactUs(data.data || []);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast(`Failed to get contacts details. Please try again. ${error}`, {
          position: "top-right",
          autoClose: 5000,
          type: "error",
          theme: "light",
          transition: Bounce,
        });
      } finally {
        setLoader(false);
      }
    };

    getContacts();
  }, []);

  return (
    <div className={styles.container}>
      <AdminNavbar />

      <div className={styles.content}>
        {/* HEADER */}
        <div className={styles.header}>
          <h1>
            Contact Submissions
            <span>{contactUs.length}</span>
          </h1>
          <p>All contact form submissions from users</p>
        </div>

        {/* TABLE */}
        <div className={styles.tableWrapper}>
          {contactUs.length > 0 ? (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Message</th>
                </tr>
              </thead>

              <tbody>
                {contactUs.map(
                  (
                    submission: {
                      id: string;
                      name: string;
                      email: string;
                      phone: string;
                      message: string;
                    },
                    index
                  ) => (
                    <tr key={submission?.id}>
                      <td>{index + 1}</td>
                      <td>{submission?.name}</td>
                      <td>{submission?.email}</td>
                      <td>{submission?.phone}</td>

                      <td className={styles.messageCell}>
                        <span className={styles.messageText}>
                          {submission?.message}
                        </span>
                        <div className={styles.tooltip}>
                          {submission?.message}
                        </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          ) : (
            <div className={styles.empty}>
              <p>No submissions yet</p>
            </div>
          )}
        </div>
      </div>

      {loader && <Loader />}
    </div>
  );
};

export default ContactSubmissions;